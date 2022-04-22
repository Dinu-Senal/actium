import { Program } from '@project-serum/anchor';
import { getProvider } from './get-provider';
import { User } from '../model/User';
import { workspace } from '../constants';

export const getUsers = async (wallet) => {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    const users = await program.account.user.all();
    return users.map(user => new User(user.publicKey, user.account));
}