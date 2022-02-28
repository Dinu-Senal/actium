import './App.css'
import { useState } from 'react'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import {
  Program, Provider, web3
} from '@project-serum/anchor'
import idl from './idl.json'
import { getPhantomWallet } from '@solana/wallet-adapter-wallets'
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
require('@solana/wallet-adapter-react-ui/styles.css')

const wallets = [
  getPhantomWallet()
]

/* create an account */
const vessel = web3.Keypair.generate();
const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

function App() {
  const [value, setValue] = useState(null);
  const wallet = useWallet();

  async function getProvider() { 
    // set to local network
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }

  async function createCounter() {     
    const provider = await getProvider()
    const program = new Program(idl, programID, provider);
    try {
      await program.rpc.storeVessel(
        'vessel #001', 
        '001001001',
        'Elk, a tanker vessel that belongs to maersk shipping company',
        'DNV',
        {
          accounts: {
            vessel: vessel.publicKey,
            author: program.provider.wallet.publicKey,
            systemProgram:  web3.SystemProgram.programId,
          },
          signers: [vessel]
        }
      );
      const account = await program.account.vessel.fetch(vessel.publicKey);
      console.log('account: ', account);

    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  return (
    <>
      <button onClick={createCounter}>Create counter</button>
      <div>{value}</div>
    </>
  );
}

const AppWithProvider = () => (
  <ConnectionProvider endpoint="http://127.0.0.1:8899">
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
);

export default AppWithProvider;
