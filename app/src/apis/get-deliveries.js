import { Program } from '@project-serum/anchor';
import { getProvider } from './get-provider';
import { DeliveryService } from '../model/DeliveryService';
import { workspace } from '../constants';

export const getDeliveries = async (wallet) => {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    const deliveries = await program.account.deliveryServiceRecord.all();
    return deliveries.map(delivery => new DeliveryService(delivery.publicKey, delivery.account));
}