import { Program } from '@project-serum/anchor';
import { getProvider } from './get-provider';
import { Validating } from '../model/Validating';
import { workspace } from '../constants';

export const getValidation = async (wallet) => {
    const provider = await getProvider(wallet);
    const program = new Program(workspace.programIdl, workspace.programID, provider);
    const validations = await program.account.validatorRecord.all();
    return validations.map(validation => new Validating(validation.publicKey, validation.account));
}