import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import * as assert from 'assert';
import * as bs58 from 'bs58';
import { Actium } from '../target/types/actium';

describe('actium', () => {

  // configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.Actium as Program<Actium>;

  /* USER TESTS */

  it('can store a new user', async () => {
    // 'storeUser' instruction execution
    const user = anchor.web3.Keypair.generate();
    await program.rpc.storeUser(
      'Dinu Senal Sendanayake',
      'Company Admin',
      '800900',
      '990230420V',
      '+94 71 6264322',
      {
        accounts: {
          user: user.publicKey,
          author: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        },
        signers: [user]
      }
    );
    // fetching user details of the created user
    const userAccount = await program.account.user.fetch(user.publicKey);

    // making sure user account have valid data
    assert.equal(userAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
    assert.equal(userAccount.fullName, 'Dinu Senal Sendanayake');
    assert.equal(userAccount.designation, 'Company Admin');
    assert.equal(userAccount.licenseNumber, '800900');
    assert.equal(userAccount.nicNumber, '990230420V');
    assert.equal(userAccount.contact, '+94 71 6264322');
    assert.ok(userAccount.timestamp);
  });

  it('can store a new user without contact', async () => {
    // 'storeUser' instruction execution
    const user = anchor.web3.Keypair.generate();
    await program.rpc.storeUser(
      'Sachin Umayangana',
      'Ship Superintendant',
      '739124',
      '800340750V',
      '',
      {
        accounts: {
          user: user.publicKey,
          author: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        },
        signers: [user]
      }
    );
    // fetching user details of the created user
    const userAccount = await program.account.user.fetch(user.publicKey);

    // making sure userAccount has valid data
    assert.equal(userAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
    assert.equal(userAccount.fullName, 'Sachin Umayangana');
    assert.equal(userAccount.designation, 'Ship Superintendant');
    assert.equal(userAccount.licenseNumber, '739124');
    assert.equal(userAccount.nicNumber, '800340750V');
    assert.equal(userAccount.contact, '');
    assert.ok(userAccount.timestamp);
  });

  it('can store a new user from a different user', async () => {
    // generating a new user and airdroping SOL
    const newUser = anchor.web3.Keypair.generate();
    const signature = await program.provider.connection.requestAirdrop(newUser.publicKey, 1000000000);
    await program.provider.connection.confirmTransaction(signature);

    // 'storeUser' instruction execution for the new user
    const user = anchor.web3.Keypair.generate();
    await program.rpc.storeUser(
      'Manul Thisuraka',
      'Internal Inspector',
      '430201',
      '834322012V',
      '+74 21 0023341',
      {
        accounts: {
          user: user.publicKey,
          author: newUser.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        },
        signers: [newUser, user]
      }
    );
    // fetching user details of the created user
    const userAccount = await program.account.user.fetch(user.publicKey);

    // making sure userAccount has valid data
    assert.equal(userAccount.author.toBase58(), newUser.publicKey.toBase58());
    assert.equal(userAccount.fullName, 'Manul Thisuraka');
    assert.equal(userAccount.designation, 'Internal Inspector');
    assert.equal(userAccount.licenseNumber, '430201');
    assert.equal(userAccount.nicNumber, '834322012V');
    assert.equal(userAccount.contact, '+74 21 0023341');
    assert.ok(userAccount.timestamp);
  });

  it('cannot provide user name with greater than 50 characters', async () => {
    // 'storeUser' instruction execution
    const user = anchor.web3.Keypair.generate();
    const userNameWith51Chars = 'u'.repeat(51);

    try {
      await program.rpc.storeUser(
        userNameWith51Chars,
        'Service Provider',
        '723054',
        '012340120V',
        '+44 02 434012330',
        {
          accounts: {
            user: user.publicKey,
            author: program.provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId
          },
          signers: [user]
        }
      );
    } catch (error) {
      assert.equal(error.msg, 'Only maximum of 50 characters can be provided for the user name');
      return;
    }
    assert.fail('Ought to have a failure becuase entered user name have 51 chars');
  });

  it('can get all the users', async () => {
    const userAccounts = await program.account.user.all();
    assert.equal(userAccounts.length, 3);
  });

  it('can retrieve user account by author', async () => {
    const authorPublicKey = program.provider.wallet.publicKey;
    const userAccounts = await program.account.user.all([
      {
        memcmp: {
          offset: 8, // discriminator
          bytes: authorPublicKey.toBase58()
        }
      }
    ]);

    assert.equal(userAccounts.length, 2);
    assert.ok(userAccounts.every(userAccount => {
      return userAccount.account.author.toBase58() === authorPublicKey.toBase58()
    }));
  });

  it('can retrieve users by name', async () => {
    const userAccounts = await program.account.user.all([
      {
        memcmp: {
          offset: 8 + // discriminator.
              32 + // author.
              8 + // timestamp.
              4, // string prefix.
          bytes: bs58.encode(Buffer.from('Dinu Senal Sendanayake'))
        }
      }
    ]);
    
    assert.equal(userAccounts.length, 1);
    assert.ok(userAccounts.every(userAccount => {
      return userAccount.account.fullName === 'Dinu Senal Sendanayake'
    }));
  });

  /* VESSEL TESTS */

  it('can store a new vessel', async () => {
    // 'storeVessel' instruction execution
    const vessel = anchor.web3.Keypair.generate();
    await program.rpc.storeVessel(
      'vessel #001', 
      '001001001',
      'Elk, a tanker vessel that belongs to maersk shipping company',
      'DNV',
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
    assert.equal(vesselAccount.imoNumber, '001001001');
    assert.equal(vesselAccount.vesselDescription, 'Elk, a tanker vessel that belongs to maersk shipping company');
    assert.equal(vesselAccount.shipCompany, 'DNV');
    assert.ok(vesselAccount.timestamp);
  });

  it('can store a new vessel without a name', async () => {
    // 'storeVessel' instruction execution
    const vessel = anchor.web3.Keypair.generate();
    await program.rpc.storeVessel(
      '', 
      '002002002',
      'Echante',
      'MORIS',
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
    assert.equal(vesselAccount.imoNumber, '002002002');
    assert.equal(vesselAccount.vesselDescription, 'Echante');
    assert.equal(vesselAccount.shipCompany, 'MORIS');
    assert.ok(vesselAccount.timestamp);
  });

  it('can store a new vessel without a imo number', async () => {
    // 'storeVessel' instruction execution
    const vessel = anchor.web3.Keypair.generate();
    await program.rpc.storeVessel(
      'vessel #003', 
      '',
      'Jo Jo',
      'Maeserk', 
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
    assert.equal(vesselAccount.imoNumber, '');
    assert.equal(vesselAccount.vesselDescription, 'Jo Jo');
    assert.equal(vesselAccount.shipCompany, 'Maeserk');
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
      '003003003',
      'Odysseus, bulk career that belongs to danver shipping company',
      'Maeserk',
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
    assert.equal(vesselAccount.imoNumber, '003003003');
    assert.equal(vesselAccount.vesselDescription, 'Odysseus, bulk career that belongs to danver shipping company');
    assert.equal(vesselAccount.shipCompany, 'Maeserk');
  });
  
  it('cannot provide vessel name with greater than 50 characters', async () => {
    try {
      const vessel = anchor.web3.Keypair.generate();
      const vesselNameWith51Chars = 'v'.repeat(51);
      await program.rpc.storeVessel(
        vesselNameWith51Chars,
        '004004004',
        'Babylon, vessel career that belongs to DNV shipping company',
        'Sea Line',
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
        '005005005',
        vesselDescWith121Chars,
        'UIO',
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

  it('can retrieve vessel account by author', async () => {
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
    }));
  });

  it('can retrieve vessels by name', async () => {
    const vesselAccounts = await program.account.vessel.all([
        {
            memcmp: {
                offset: 8 + // discriminator.
                    32 + // author public key.
                    8 + // timestamp.
                    4, // string prefix.
                bytes: bs58.encode(Buffer.from('vessel #003')),
            }
        }
    ]);

    assert.equal(vesselAccounts.length, 1);
    assert.ok(vesselAccounts.every(vesselAccount => {
        return vesselAccount.account.vesselName === 'vessel #003'
    }))
  });

  /* COMPANY ADMIN RECORD TESTS */
  
  it('can store a new company admin record', async () => {
    // 'storeCompanyAdminRecord' instruction execution
    const companyAdminRecord = anchor.web3.Keypair.generate();
    await program.rpc.storeCompanyAdminRecord(
      'propler',
      '3848',
      '990',
      {
        accounts: {
          companyadminrecord: companyAdminRecord.publicKey,
          author: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        },
        signers: [companyAdminRecord]
      }
    );
    // fetching account details of the created company admin record
    const companyAdminRecordAccount = await program.account.companyAdminRecord.fetch(companyAdminRecord.publicKey);

    // making sure company admin record account has valid data
    assert.equal(companyAdminRecordAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
    assert.equal(companyAdminRecordAccount.vesselPart, 'propler');
    assert.equal(companyAdminRecordAccount.vesselPartSerialKey, '3848');
    assert.equal(companyAdminRecordAccount.vesselImoFkey, '990');
    assert.ok(companyAdminRecordAccount.timestamp);
  });

  it('can store a new company admin record from a different author', async () => {
    // generating a new user and airdropping SOL
    const newUser = anchor.web3.Keypair.generate();
    const signature = await program.provider.connection.requestAirdrop(newUser.publicKey, 1000000000);
    await program.provider.connection.confirmTransaction(signature);

    // 'storeCompanyAdminRecord' instruction execution
    const companyAdminRecord = anchor.web3.Keypair.generate();
    await program.rpc.storeCompanyAdminRecord(
      'engine',
      '1123',
      '4903',
     {
       accounts: {
         companyadminrecord: companyAdminRecord.publicKey,
         author: newUser.publicKey,
         systemProgram: anchor.web3.SystemProgram.programId
       },
       signers: [newUser, companyAdminRecord]
     }
    );
    // fetching account details of the created company admin record
    const companyAdminRecordAccount = await program.account.companyAdminRecord.fetch(companyAdminRecord.publicKey);

    // making sure company admin record account has valid data
    assert.equal(companyAdminRecordAccount.author.toBase58(), newUser.publicKey.toBase58());
    assert.equal(companyAdminRecordAccount.vesselPart, 'engine');
    assert.equal(companyAdminRecordAccount.vesselPartSerialKey, '1123');
    assert.equal(companyAdminRecordAccount.vesselImoFkey, '4903');
    assert.ok(companyAdminRecordAccount.timestamp);
  });

  it('can get all the company admin records', async () => {
    const companyAdminRecordAccounts = await program.account.companyAdminRecord.all();
    assert.equal(companyAdminRecordAccounts.length, 2);
  });

  it('can retrieve company admin records by author', async () => {
    const authorPublicKey = await program.provider.wallet.publicKey;
    const companyAdminRecordAccounts = await program.account.companyAdminRecord.all([
      {
        memcmp: {
          offset: 8, // discriminator
          bytes: authorPublicKey.toBase58()
        }
      }
    ]);
    assert.equal(companyAdminRecordAccounts.length, 1);
    assert.ok(companyAdminRecordAccounts.every(companyAdminRecordAccount => {
      return companyAdminRecordAccount.account.author.toBase58() === authorPublicKey.toBase58()
    }));
  });

  /* VALIDATOR RECORD TESTS */

  it('can store a new validator record', async () => {
    // 'storeValidatorRecord' instruction execution
    const validatorRecord = anchor.web3.Keypair.generate();
    await program.rpc.storeValidatorRecord(
      'ship superintendent',
      'yes',
      'maintained the vessel propler correctly',
      {
        accounts : {
          validatorrecord: validatorRecord.publicKey,
          author: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        },
        signers: [validatorRecord]
      }
    );
   // fetching account details of the created validator record
   const validatorRecordAccount = await program.account.validatorRecord.fetch(validatorRecord.publicKey);

   // making sure company admin record account has valid data
   assert.equal(validatorRecordAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
   assert.equal(validatorRecordAccount.validatorDesignation, 'ship superintendent');
   assert.equal(validatorRecordAccount.validated, 'yes');
   assert.equal(validatorRecordAccount.vComment, 'maintained the vessel propler correctly');
   assert.ok(validatorRecordAccount.timestamp);
  });

  /* SERVICE PROVIDER RECORD TESTS */

  it('can store a new service provider record', async () => {
    // 'storeServiceProviderRecord' instruction execution
    const serviceProviderRecord = anchor.web3.Keypair.generate();
    await program.rpc.storeServiceProviderRecord(
      'HKS',
      '#432 123',
      'Durable',
      '10/10/2022',
      '309123',
      {
        accounts : {
          serviceproviderrecord: serviceProviderRecord.publicKey,
          author: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        },
        signers: [serviceProviderRecord]
      }
    );
   // fetching account details of the created validator record
   const serviceProviderRecordAccount = await program.account.serviceProviderRecord.fetch(serviceProviderRecord.publicKey);

   // making sure company admin record account has valid data
   assert.equal(serviceProviderRecordAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
   assert.equal(serviceProviderRecordAccount.providerName, 'HKS');
   assert.equal(serviceProviderRecordAccount.partId, '#432 123');
   assert.equal(serviceProviderRecordAccount.partDescription, 'Durable');
   assert.equal(serviceProviderRecordAccount.datePurchased, '10/10/2022');
   assert.equal(serviceProviderRecordAccount.warrantyCode, '309123');
   assert.ok(serviceProviderRecordAccount.timestamp);
  });

  /* INSPECTOR RECORD TESTS */  

  it('can store a new inspector record', async () => {
    // 'storeInspectorRecord' instruction execution
    const inspectorRecord = anchor.web3.Keypair.generate();
    await program.rpc.storeInspectorRecord(
      'Manul',
      'yes',
      'have to do more repairs',
      'Batch 1',
      '990',
      {
        accounts : {
          inspectorrecord: inspectorRecord.publicKey,
          author: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        },
        signers: [inspectorRecord]
      }
    );
    // fetching account details of the created inspector record
    const inspectorRecordAccount = await program.account.inspectorRecord.fetch(inspectorRecord.publicKey);

    // making sure inspector record account has valid data
    assert.equal(inspectorRecordAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
    assert.equal(inspectorRecordAccount.inspectorName, 'Manul');
    assert.equal(inspectorRecordAccount.inspected, 'yes');
    assert.equal(inspectorRecordAccount.iComment, 'have to do more repairs');
    assert.equal(inspectorRecordAccount.maintenanceBatch, 'Batch 1');
    assert.equal(inspectorRecordAccount.vesselPartPublicKeyFkey, '990');
    assert.ok(inspectorRecordAccount.timestamp);
  });

  /* DELIVERY SERVICE RECORD TESTS */

  it('can store a new delivery service record', async () => {
    // 'storeDeliveryServiceRecord' instruction execution
    const deliveryServiceRecord = anchor.web3.Keypair.generate();
    await program.rpc.storeDeliveryServiceRecord(
      'New Line',
      'Colombo Port',
      '12/12/2022',
      'UOA12',
      {
        accounts : {
          deliveryservicerecord: deliveryServiceRecord.publicKey,
          author: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        },
        signers: [deliveryServiceRecord]
      }
    );
    // fetching account details of the created delivery service record
    const deliveryServiceRecordAccount = await program.account.deliveryServiceRecord.fetch(deliveryServiceRecord.publicKey);

    // making sure delivery service record account has valid data
    assert.equal(deliveryServiceRecordAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
    assert.equal(deliveryServiceRecordAccount.serviceName, 'New Line');
    assert.equal(deliveryServiceRecordAccount.deliveredAddress, 'Colombo Port');
    assert.equal(deliveryServiceRecordAccount.deliveredDate, '12/12/2022');
    assert.equal(deliveryServiceRecordAccount.warehouse, 'UOA12');
    assert.ok(deliveryServiceRecordAccount.timestamp);
  });

});
