import { Program } from '@project-serum/anchor';
import { getProvider } from './get-provider';
import { VesselPart } from '../model/VesselPart';
import { workspace } from '../constants';

export const getVesselParts = async (wallet) => {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    const vesselParts = await program.account.companyAdminRecord.all();
    return vesselParts.map(vesselPart => new VesselPart(vesselPart.publicKey, vesselPart.account));
}