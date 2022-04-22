import { Provider } from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';
import { network, opts } from "../constants"

export const getProvider = async (wallet) => {
   const connection = new Connection(network.local, opts.preflightCommitment);
   const provider = new Provider(connection, wallet, opts.preflightCommitment);
   return provider;
}