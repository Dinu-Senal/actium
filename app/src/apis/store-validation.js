import { Program, web3 } from '@project-serum/anchor';
import { getProvider } from './get-provider';
import { workspace } from '../constants';

const { SystemProgram, Keypair } = web3;

export const storeValidatorRecord = async (
    wallet,
    v_approval, 
    v_comment, 
    vessel_imo_fkey
) => {
    const validatorrecord = Keypair.generate();
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    try {
        /* interact with the program via rpc */
        await program.rpc.storeValidatorRecord(
            v_approval, 
            v_comment, 
            vessel_imo_fkey,
          {
            accounts: {
                validatorrecord: validatorrecord.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            },
            signers: [validatorrecord]
          }
        );
        await program.account.validatorRecord.fetch(validatorrecord.publicKey);
        return true;
    } catch (err) {
        console.log("Transaction error: ", err);
    }
}   
