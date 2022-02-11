use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("4MzsanEXKmTtjA3t9eLDC7YUfAyf8Wp9m9vTKTvPSSqL");

#[program]
pub mod actium {
    use super::*;
    pub fn store_vessel(
        ctx: Context<StoreVessel>, 
        vessel_name: String, 
        vessel_description: String,
        company_admin_approval: String,
        seaworthiness: String
    ) -> ProgramResult {
        let vessel: &mut Account<Vessel> = &mut ctx.accounts.vessel;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        if vessel_name.chars().count() > 50 {
            return Err(ErrorConfig::VesselNameTooLong.into())
        }

        if vessel_description.chars().count() > 120 {
            return Err(ErrorConfig::VesselDescTooLong.into())
        }

        if company_admin_approval.chars().count() > 10 {
            return Err(ErrorConfig::CAdminApprovalTooLong.into())
        }

        if seaworthiness.chars().count() > 5 {
            return Err(ErrorConfig::SeaworthinessTooLong.into())
        }

        vessel.author = *author.key;
        vessel.timestamp = clock.unix_timestamp;
        vessel.vessel_name = vessel_name;
        vessel.vessel_description = vessel_description;
        vessel.company_admin_approval = company_admin_approval;
        vessel.seaworthiness = seaworthiness;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct StoreVessel<'info> {
    #[account(init, payer = author, space = Vessel::LEN)]
    pub vessel: Account<'info, Vessel>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>
}

// structure of vessel account
#[account]
pub struct Vessel {
    pub author: Pubkey,
    pub timestamp: i64,
    pub vessel_name: String,
    pub vessel_description: String,
    pub company_admin_approval: String,
    pub seaworthiness: String,
}

// configuring constant for sizing the account
const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const PREFIXED_STRING_LENGTH: usize = 4; // stores the size of the string
const MAX_VESSEL_NAME_LENGTH: usize = 50 * 4; // stores maximum 50 chars
const MAX_VESSEL_DESC_LENGTH: usize = 120 * 4; // stores maximum 120 chars
const MAX_CADMIN_APROVAL_LENGTH: usize = 10 * 4; // stores maximum 10 chars
const MAX_SEAWORTHINESS_LENGTH: usize = 5 * 4; // stores maximum 5 chars

// configuring total size of the account
impl Vessel { 
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // author
        + TIMESTAMP_LENGTH // timestamp
        + PREFIXED_STRING_LENGTH + MAX_VESSEL_NAME_LENGTH // vessel name
        + PREFIXED_STRING_LENGTH + MAX_VESSEL_DESC_LENGTH // vessel description
        + PREFIXED_STRING_LENGTH + MAX_CADMIN_APROVAL_LENGTH // company admin approval
        + PREFIXED_STRING_LENGTH + MAX_SEAWORTHINESS_LENGTH; // seaworthiness of the vessel 
}

#[error]
pub enum ErrorConfig {
    #[msg("Only maximum of 50 characters can be provided for the vessel name")]
    VesselNameTooLong,
    #[msg("Only maximum of 120 characters can be provided for the vessel description")]
    VesselDescTooLong,
    #[msg("Only maximum of 10 characters can be provided for the company admin approval")]
    CAdminApprovalTooLong,
    #[msg("Only maximum of 5 characters can be provided for the seaworthiness")]
    SeaworthinessTooLong
}