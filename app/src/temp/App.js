import './App.css';
import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  Program, Provider, web3
} from '@project-serum/anchor';
import idl from './idl.json';
import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css');

const wallets = [
  getPhantomWallet()
]

const network = "http://127.0.0.1:8899";
const { SystemProgram, Keypair } = web3;

const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

function App() {
  const [vesselData, setVesselData] = useState('');
  const [ blockchainData, setBlockchainData ] = useState('')
  const wallet = useWallet()
  
  useEffect(() => {
    if(vesselData !== '') {
      storeVessel()
    }
  }, [vesselData])

  const getProvider = async () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }

  const storeVessel = async () => {
    const vessel = Keypair.generate();
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    const allVessels = await program.account.vessel.all();
    console.log(allVessels)
    try {
      /* interact with the program via rpc */
      await program.rpc.storeVessel(
        vesselData.vessel_name, 
        vesselData.imo_number,
        vesselData.vessel_description,
        vesselData.ship_company,
        {
          accounts: {
            vessel: vessel.publicKey,
            author: program.provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [vessel]
        }
      );
      const account = await program.account.vessel.fetch(vessel.publicKey);
      console.log('account: ', account);
      setBlockchainData(account);
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const vesselData = {
      "vessel_name": event.target.elements.vessel_name.value,
      "imo_number": event.target.elements.imo_number.value,
      "vessel_description": event.target.elements.vessel_description.value,
      "ship_company": event.target.elements.ship_company.value
    }
    setVesselData(vesselData)
  }

  if(!wallet.connected) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop:'100px' }}>
        <WalletMultiButton />
      </div>
    )
  } else {
    return (
      <div className='App'>
        <div className='text-uppercase my-5' style={{ fontSize: '30px' }}>actium</div>
       
        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#storeVesselModal">
          Store New Vessel
        </button>

        <div className="modal fade" id="storeVesselModal" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Store Vessel</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">

                    <label>
                      Vessel Name
                      <input className="form-control" type="text" name="vessel_name"
                        placeholder='Enter Vessel Name'
                      />
                    </label>
                    <label>
                      IMO Number
                      <input className="form-control" type="text" name="imo_number"
                        placeholder='Enter IMO Number'
                      />
                    </label>
                    <label>
                      Vessel Description
                      <input className="form-control" type="text" name="vessel_description"
                        placeholder='Enter Vessel Description'
                      />
                    </label>
                    <label>
                      Ship Company
                      <input className="form-control" type="text" name="ship_company"
                        placeholder='Enter Ship Company'
                      />
                    </label>

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                  <button className='btn btn-primary' type='submit'>Create Vessel</button>
                </div>
              </div>
            </form>
          </div>
        </div> 
      </div> 
    )
  }
}

const Actium = () => (
  <ConnectionProvider endpoint={network}>
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)

export default Actium;