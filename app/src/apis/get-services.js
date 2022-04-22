import { Program } from '@project-serum/anchor';
import { getProvider } from './get-provider';
import { Service } from '../model/Service';
import { workspace } from '../constants';

export const getServices = async (wallet) => {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    const services = await program.account.serviceProviderRecord.all();
    return services.map(service => new Service(service.publicKey, service.account));
}