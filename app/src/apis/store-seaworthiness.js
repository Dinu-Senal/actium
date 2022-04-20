import { Program, web3 } from '@project-serum/anchor';
import { getProvider } from './get-provider';
import { workspace } from '../constants';

const { SystemProgram, Keypair } = web3;

export const storeSeaworthiness = async (
    wallet,
    seaworthiness, 
    vessel_imo_fkey
) => {
    const seaworthinessrecord = Keypair.generate();
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    try {
        /* interact with the program via rpc */
        await program.rpc.storeSeaworthinessRecord(
            seaworthiness, 
            vessel_imo_fkey,
          {
            accounts: {
                seaworthinessrecord: seaworthinessrecord.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            },
            signers: [seaworthinessrecord]
          }
        );
        await program.account.seaworthinessRecord.fetch(seaworthinessrecord.publicKey);
        return true;
    } catch (err) {
        console.log("Transaction error: ", err);
    }
}   
