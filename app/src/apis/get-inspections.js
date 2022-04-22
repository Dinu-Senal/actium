import { Program } from '@project-serum/anchor';
import { getProvider } from './get-provider';
import { Inspection } from '../model/Inspection';
import { workspace } from '../constants';

export const getInspection = async (wallet) => {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    const inspections = await program.account.inspectorRecord.all();
    return inspections.map(inspection => new Inspection(inspection.publicKey, inspection.account));
}