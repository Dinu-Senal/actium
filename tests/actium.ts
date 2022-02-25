import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import * as assert from 'assert';
import * as bs58 from 'bs58';
import { Actium } from '../target/types/actium';

describe('actium', () => {

  // configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.Actium as Program<Actium>;

  it('can store a new vessel', async () => {
    // 'storeVessel' instruction execution
    const vessel = anchor.web3.Keypair.generate();
    await program.rpc.storeVessel(
      'vessel #001', 
      'Elk, a tanker vessel that belongs to maersk shipping company',
      'Approved',
      '90%', 
      {
        accounts: {
          vessel: vessel.publicKey,
          author: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        },
        signers: [vessel]
      }
    );
    // fetching account details of the created vessel
    const vesselAccount = await program.account.vessel.fetch(vessel.publicKey);
    
    // making sure vessel account has valid data
    assert.equal(vesselAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
    assert.equal(vesselAccount.vesselName, 'vessel #001');
    assert.equal(vesselAccount.vesselDescription, 'Elk, a tanker vessel that belongs to maersk shipping company');
    assert.equal(vesselAccount.companyAdminApproval, 'Approved');
    assert.equal(vesselAccount.seaworthiness, '90%');
    assert.ok(vesselAccount.timestamp);
  });

  it('can store a new vessel without a name', async () => {
    // 'storeVessel' instruction execution
    const vessel = anchor.web3.Keypair.generate();
    await program.rpc.storeVessel(
      '', 
      'Echante',
      'Declined',
      '0%', 
      {
        accounts: {
          vessel: vessel.publicKey,
          author: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        },
        signers: [vessel]
      }
    );
    // fetching account details of the created vessel
    const vesselAccount = await program.account.vessel.fetch(vessel.publicKey);
    
    // making sure vessel account has valid data
    assert.equal(vesselAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
    assert.equal(vesselAccount.vesselName, '');
    assert.equal(vesselAccount.vesselDescription, 'Echante');
    assert.equal(vesselAccount.companyAdminApproval, 'Declined');
    assert.equal(vesselAccount.seaworthiness, '0%');
    assert.ok(vesselAccount.timestamp);
  });

  it('can store a new vessel without a description', async () => {
    // 'storeVessel' instruction execution
    const vessel = anchor.web3.Keypair.generate();
    await program.rpc.storeVessel(
      'vessel #003', 
      '',
      'Declined',
      '20%', 
      {
        accounts: {
          vessel: vessel.publicKey,
          author: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        },
        signers: [vessel]
      }
    );
    // fetching account details of the created vessel
    const vesselAccount = await program.account.vessel.fetch(vessel.publicKey);
    
    // making sure vessel account has valid data
    assert.equal(vesselAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
    assert.equal(vesselAccount.vesselName, 'vessel #003');
    assert.equal(vesselAccount.vesselDescription, '');
    assert.equal(vesselAccount.companyAdminApproval, 'Declined');
    assert.equal(vesselAccount.seaworthiness, '20%');
    assert.ok(vesselAccount.timestamp);
  });

  it('can store a new vessel from a different author', async () => {
    // generating a new user and airdropping SOL
    const newUser = anchor.web3.Keypair.generate();
    const signature = await program.provider.connection.requestAirdrop(newUser.publicKey, 1000000000);
    await program.provider.connection.confirmTransaction(signature);

    // 'storeVessel' instruction execution for the new user
    const vessel = anchor.web3.Keypair.generate();
    await program.rpc.storeVessel(
      'vessel #004',
      'Odysseus, bulk career that belongs to danver shipping company',
      'Approved',
      '100%',
      {
        accounts: {
          vessel: vessel.publicKey,
          author: newUser.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        },
        signers: [newUser, vessel]
      }
    );
    // fetching account details of the created vessel
    const vesselAccount = await program.account.vessel.fetch(vessel.publicKey);

    // making sure vessel account has valid data
    assert.equal(vesselAccount.author.toBase58(), newUser.publicKey.toBase58());
    assert.equal(vesselAccount.vesselName, 'vessel #004');
    assert.equal(vesselAccount.vesselDescription, 'Odysseus, bulk career that belongs to danver shipping company');
    assert.equal(vesselAccount.companyAdminApproval, 'Approved');
    assert.equal(vesselAccount.seaworthiness, '100%');
  });
  
  it('cannot provide vessel name with greater than 50 characters', async () => {
    try {
      const vessel = anchor.web3.Keypair.generate();
      const vesselNameWith51Chars = 'v'.repeat(51);
      await program.rpc.storeVessel(
        vesselNameWith51Chars,
        'Babylon, vessel career that belongs to DNV shipping company',
        'Approved',
        '60%',
        {
          accounts: {
            vessel: vessel.publicKey,
            author: program.provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId
          },
          signers: [vessel]
        }
      );
    } catch (error) {
      assert.equal(error.msg, 'Only maximum of 50 characters can be provided for the vessel name');
      return;
    }
    assert.fail('Ought to have a failure becuase entered vessel name have 51 chars');
  });

  it('cannot provide vessel description with greater than 120 characters', async () => {
    try {
      const vessel = anchor.web3.Keypair.generate();
      const vesselDescWith121Chars = 'v'.repeat(121);
      await program.rpc.storeVessel(
        '2Leavs',
        vesselDescWith121Chars,
        'Approved',
        '70%',
        {
          accounts: {
            vessel: vessel.publicKey,
            author: program.provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId
          },
          signers: [vessel]
        }
      );
    } catch (error) {
      assert.equal(error.msg, 'Only maximum of 120 characters can be provided for the vessel description');
      return;
    }
    assert.fail('Ought to have a failure becuase entered vessel description have 121 chars');
  });

  it('can get all the vessels', async () => {
    const vesselAccounts = await program.account.vessel.all();
    assert.equal(vesselAccounts.length, 4);
  })

  it('can retrieve account by author', async () => {
    const authorPublicKey = program.provider.wallet.publicKey
    const vesselAccounts = await program.account.vessel.all([
      {
        memcmp: {
          offset: 8, // discriminator
          bytes: authorPublicKey.toBase58(),
        }
      }
    ]);
    assert.equal(vesselAccounts.length, 3);
    assert.ok(vesselAccounts.every(vesselAccount => {
      return vesselAccount.account.author.toBase58() === authorPublicKey.toBase58()
    }))
  });

  it('can retrieve vessels by name', async () => {
    const vesselAccounts = await program.account.vessel.all([
        {
            memcmp: {
                offset: 8 + // discriminator.
                    32 + // author public key.
                    8 + // timestamp.
                    4, // string prefix
                bytes: bs58.encode(Buffer.from('vessel #003')),
            }
        }
    ]);

    assert.equal(vesselAccounts.length, 1);
    assert.ok(vesselAccounts.every(vesselAccount => {
        return vesselAccount.account.vesselName === 'vessel #003'
    }))
});

});
