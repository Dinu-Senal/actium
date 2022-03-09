import { web3 } from '@project-serum/anchor'
import { Vessel } from '@/models'

export const storeVessel = async ({ wallet, program }, vessel_name, imo_number, vessel_description, ship_company) => {
    const vessel = web3.Keypair.generate()

    await program.value.rpc.storeVessel(vessel_name, imo_number, vessel_description, ship_company, {
        accounts: {
            author: wallet.value.publicKey,
            vessel: vessel.publicKey,
            systemProgram: web3.SystemProgram.programId
        },
        signers: [vessel]
    })

    const vesselAccount = await program.value.account.vessel.fetch(vessel.publicKey)
    return new Vessel(vessel.publicKey, vesselAccount)
}