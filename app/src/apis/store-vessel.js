import { Program, web3 } from '@project-serum/anchor';
import { getProvider } from './get-provider';
import { workspace } from '../constants';

const { SystemProgram, Keypair } = web3;

export const storeVessel = async (
    wallet,
    vessel_name, 
    imo_number, 
    vessel_description,
    ship_company
) => {
    const vessel = Keypair.generate();
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    try {
        /* interact with the program via rpc */
        await program.rpc.storeVessel(
            vessel_name, 
            imo_number,
            vessel_description,
            ship_company,
          {
            accounts: {
              vessel: vessel.publicKey,
              author: program.provider.wallet.publicKey,
              systemProgram: SystemProgram.programId,
            },
            signers: [vessel]
          }
        );
        await program.account.vessel.fetch(vessel.publicKey);
        return true;
    } catch (err) {
        console.log("Transaction error: ", err);
    }
}   
