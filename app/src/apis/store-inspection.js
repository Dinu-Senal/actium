import { Program, web3 } from '@project-serum/anchor';
import { getProvider } from './get-provider';
import { workspace } from '../constants';

const { SystemProgram, Keypair } = web3;

export const storeInspection = async (
    wallet,
    inspector_name, 
    inspected, 
    i_comment,
    maintenance_batch,
    vessel_part_public_key_fkey
) => {
    const inspection = Keypair.generate();
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    try {
        /* interact with the program via rpc */
        await program.rpc.storeInspectorRecord(
            inspector_name, 
            inspected, 
            i_comment,
            maintenance_batch,
            vessel_part_public_key_fkey,
          {
            accounts: {
              inspectorrecord: inspection.publicKey,
              author: program.provider.wallet.publicKey,
              systemProgram: SystemProgram.programId,
            },
            signers: [inspection]
          }
        );
        await program.account.inspectorRecord.fetch(inspection.publicKey);
        return true;
    } catch (err) {
        console.log("Transaction error: ", err);
    }
}   
