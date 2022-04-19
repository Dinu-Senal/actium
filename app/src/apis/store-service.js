import { Program, web3 } from '@project-serum/anchor';
import { getProvider } from './get-provider';
import { workspace } from '../constants';

const { SystemProgram, Keypair } = web3;

export const storeService = async (
    wallet,
    part_description, 
    date_purchased, 
    warranty_code,
    vessel_part_public_key_fkey
) => {
    const serviceproviderrecord = Keypair.generate();
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    try {
        /* interact with the program via rpc */
        await program.rpc.storeServiceProviderRecord(
            part_description, 
            date_purchased,
            warranty_code,
            vessel_part_public_key_fkey,
          {
            accounts: {
                serviceproviderrecord: serviceproviderrecord.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            },
            signers: [serviceproviderrecord]
          }
        );
        await program.account.serviceProviderRecord.fetch(serviceproviderrecord.publicKey);
        return true;
    } catch (err) {
        console.log("Transaction error: ", err);
    }
}   
