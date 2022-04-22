import { Program } from '@project-serum/anchor';
import { getProvider } from '../apis/get-provider';
import { workspace } from '../constants';

export const getWallet = async (wallet) => {
    // getting wallet address
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    const walletKey = program.provider.wallet.publicKey
    return walletKey.toBase58();
}
