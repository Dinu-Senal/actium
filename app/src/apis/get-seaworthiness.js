import { Program } from '@project-serum/anchor';
import { getProvider } from './get-provider';
import { Seaworthiness } from '../model/Seaworthiness';
import { workspace } from '../constants';

export const getSeaworthiness = async (wallet) => {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    const seaworthiness = await program.account.seaworthinessRecord.all();
    return seaworthiness.map(seaworthinessData => new Seaworthiness(seaworthinessData.publicKey, seaworthinessData.account));
}