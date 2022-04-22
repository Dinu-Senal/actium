import { Program, web3 } from '@project-serum/anchor';
import { getProvider } from './get-provider';
import { workspace } from '../constants';

const { SystemProgram, Keypair } = web3;

export const storeDelivery = async (
    wallet,
    delivered_address, 
    delivered_date, 
    warehouse,
    vessel_part_public_key_fkey
) => {
    const deliveryservicerecord = Keypair.generate();
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    try {
        /* interact with the program via rpc */
        await program.rpc.storeDeliveryServiceRecord(
            delivered_address, 
            delivered_date,
            warehouse,
            vessel_part_public_key_fkey,
          {
            accounts: {
                deliveryservicerecord: deliveryservicerecord.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            },
            signers: [deliveryservicerecord]
          }
        );
        await program.account.deliveryServiceRecord.fetch(deliveryservicerecord.publicKey);
        return true;
    } catch (err) {
        console.log("Transaction error: ", err);
    }
}   
