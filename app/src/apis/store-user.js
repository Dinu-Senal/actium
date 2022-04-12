import { Program, web3 } from '@project-serum/anchor';
import { getProvider } from './get-provider';
import { workspace } from '../constants';

const { SystemProgram, Keypair } = web3;

export const storeUser = async (
    wallet,
    full_name, 
    designation, 
    license_number,
    nic_number,
    contact
) => {
    const user = Keypair.generate();
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    try {
        /* interact with the program via rpc */
        await program.rpc.storeUser(
            full_name, 
            designation,
            license_number,
            nic_number,
            contact,
          {
            accounts: {
              user: user.publicKey,
              author: program.provider.wallet.publicKey,
              systemProgram: SystemProgram.programId,
            },
            signers: [user]
          }
        );
        await program.account.user.fetch(user.publicKey);
        return true;
    } catch (err) {
        console.log("Transaction error: ", err);
    }
}   
