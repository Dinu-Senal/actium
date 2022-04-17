import { Program, web3 } from '@project-serum/anchor';
import { getProvider } from './get-provider';
import { workspace } from '../constants';

const { SystemProgram, Keypair } = web3;

export const storeVesselPart = async (
    wallet,
    vessel_part, 
    vessel_part_serial_key, 
    vessel_imo_fkey
) => {
    const companyadminrecord = Keypair.generate();
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    try {
        /* interact with the program via rpc */
        await program.rpc.storeCompanyAdminRecord(
            vessel_part, 
            vessel_part_serial_key, 
            vessel_imo_fkey,
          {
            accounts: {
              companyadminrecord: companyadminrecord.publicKey,
              author: program.provider.wallet.publicKey,
              systemProgram: SystemProgram.programId,
            },
            signers: [companyadminrecord]
          }
        );
        await program.account.companyAdminRecord.fetch(companyadminrecord.publicKey);
        return true;
    } catch (err) {
        console.log("Transaction error: ", err);
    }
}   
