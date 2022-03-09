import { Program } from '@project-serum/anchor';
import { getProvider } from './get-provider';
import { Vessel } from '../model/Vessel';
import { workspace } from '../constants';


export const getVessels = async (wallet) => {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    const vessels = await program.account.vessel.all();
    return vessels.map(vessel => new Vessel(vessel.publicKey, vessel.account));
}