import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Actium } from '../target/types/actium';

describe('actium', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.Actium as Program<Actium>;

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
