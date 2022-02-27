use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("4MzsanEXKmTtjA3t9eLDC7YUfAyf8Wp9m9vTKTvPSSqL");

#[program]
pub mod actium {
    use super::*;
    // user
    pub fn store_user(
        ctx: Context<StoreUser>,
        user_name: String,
        designation: String, 
        license_number: String,
        nic_number: String,
        contact: String
    ) -> ProgramResult {
        let user: &mut Account<User> = &mut ctx.accounts.user;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        if user_name.chars().count() > 50 {
            return Err(ErrorConfig::UserNameTooLong.into())
        }
        if designation.chars().count() > 20 {
            return Err(ErrorConfig::UserDesignationTooLong.into())
        }
        if license_number.chars().count() > 20 {
            return Err(ErrorConfig::UserLicenseNumberTooLong.into())
        }
        if nic_number.chars().count() > 15 {
            return Err(ErrorConfig::UserNICNumberTooLong.into())
        }
        if contact.chars().count() > 20 {
            return Err(ErrorConfig::UserContactTooLong.into())
        }

        user.author = *author.key;
        user.timestamp = clock.unix_timestamp;
        user.full_name = user_name;
        user.designation = designation;
        user.license_number = license_number;
        user.nic_number = nic_number;
        user.contact = contact;
        Ok(())
    }
    // vessel
    pub fn store_vessel(
        ctx: Context<StoreVessel>, 
        vessel_name: String,
        imo_number: String,
        vessel_description: String,
        ship_company: String
    ) -> ProgramResult {
        let vessel: &mut Account<Vessel> = &mut ctx.accounts.vessel;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        if vessel_name.chars().count() > 50 {
            return Err(ErrorConfig::VesselNameTooLong.into())
        }
        if imo_number.chars().count() > 20 {
            return Err(ErrorConfig::IMONumberTooLong.into())
        }
        if vessel_description.chars().count() > 120 {
            return Err(ErrorConfig::VesselDescTooLong.into())
        }
        if ship_company.chars().count() > 20 {
            return Err(ErrorConfig::ShipCompanyNameTooLong.into())
        }

        vessel.author = *author.key;
        vessel.timestamp = clock.unix_timestamp;
        vessel.vessel_name = vessel_name;
        vessel.imo_number = imo_number;
        vessel.vessel_description = vessel_description;
        vessel.ship_company = ship_company;
        Ok(())
    }
    // company admin record
    pub fn store_company_admin_record(
        ctx: Context<StoreCompanyAdminRecord>,
        approval: String,
        comment: String
    ) -> ProgramResult {
        let companyadminrecord: &mut Account<CompanyAdminRecord> = &mut ctx.accounts.companyadminrecord;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        if approval.chars().count() > 8 {
            return Err(ErrorConfig::CompanyAdminApprovalTooLong.into())
        }
        if comment.chars().count() > 50 {
            return Err(ErrorConfig::CompanyAdminCommentTooLong.into())
        }

        companyadminrecord.author = *author.key;
        companyadminrecord.timestamp = clock.unix_timestamp;
        companyadminrecord.approval = approval;
        companyadminrecord.comment = comment;
        Ok(())
    }
}

/* ACCOUNTS */

// user
#[derive(Accounts)]
pub struct StoreUser<'info> {
    #[account(init, payer = author, space = User::LEN)]
    pub user: Account<'info, User>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>
}

// vessel
#[derive(Accounts)]
pub struct StoreVessel<'info> {
    #[account(init, payer = author, space = Vessel::LEN)]
    pub vessel: Account<'info, Vessel>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>
}

// company admin record
#[derive(Accounts)]
pub struct StoreCompanyAdminRecord<'info> {
    #[account(init, payer = author, space = CompanyAdminRecord::LEN)]
    pub companyadminrecord: Account<'info, CompanyAdminRecord>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>
}

/* STRUCTURE OF ACCOUNTS */

// structure of user
#[account]
pub struct User {
    pub author: Pubkey,
    pub timestamp: i64,
    pub full_name: String,
    pub designation: String,
    pub license_number: String,
    pub nic_number: String,
    pub contact: String
}

// structure of vessel account
#[account]
pub struct Vessel {
    pub author: Pubkey,
    pub timestamp: i64,
    pub vessel_name: String,
    pub imo_number: String,
    pub vessel_description: String,
    pub ship_company: String,
}

// structure of company admin record account
#[account]
pub struct CompanyAdminRecord {
    pub author: Pubkey,
    pub timestamp: i64,
    pub approval: String,
    pub comment: String,
    /* pub vessel_address: Pubkey */
}

/* SIZING OF ACCOUNTS */

// configuring constant for sizing the account
const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const PREFIXED_STRING_LENGTH: usize = 4; // stores the size of the string
// user accounts
const MAX_FULL_NAME_LENGTH: usize = 50 * 4; // stores maximum 50 chars
const MAX_DESIGNATION_LENGTH: usize = 20 * 4; // stores maximum 20 chars
const MAX_LICENSE_NUMBER_LENGTH: usize = 20 * 4; // stores maximum 20 chars
const MAX_NIC_NUMBER_LENGTH: usize = 15 * 4; // stores maximum 15 chars
const MAX_CONTACT_LENGTH: usize = 20 * 4; // stores maximum 20 chars
// vessel constants
const MAX_VESSEL_NAME_LENGTH: usize = 50 * 4; // stores maximum 50 chars
const MAX_IMO_NUMBER_LENGTH: usize = 20 * 4; // stores maximum 20 chars
const MAX_VESSEL_DESC_LENGTH: usize = 120 * 4; // stores maximum 120 chars
const MAX_SHIPCOMPANY_LENGTH: usize = 20 * 4; // stores maximum 20 chars
// company admin record constants
const MAX_APPROVAL_LENGTH: usize = 8 * 4; // stores maximum 8 chars
const MAX_CADMIN_COMMENT_LENGTH: usize = 50 * 4; // stores maximum 50 chars

// configuring total size of the user account
impl User {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // author
        + TIMESTAMP_LENGTH // timestamp
        + PREFIXED_STRING_LENGTH + MAX_FULL_NAME_LENGTH // full name
        + PREFIXED_STRING_LENGTH + MAX_DESIGNATION_LENGTH // designation
        + PREFIXED_STRING_LENGTH + MAX_LICENSE_NUMBER_LENGTH // license number
        + PREFIXED_STRING_LENGTH + MAX_NIC_NUMBER_LENGTH // nic number
        + PREFIXED_STRING_LENGTH + MAX_CONTACT_LENGTH; // contact
}
// configuring total size of the vessel account
impl Vessel { 
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // author
        + TIMESTAMP_LENGTH // timestamp
        + PREFIXED_STRING_LENGTH + MAX_VESSEL_NAME_LENGTH // vessel name
        + PREFIXED_STRING_LENGTH + MAX_IMO_NUMBER_LENGTH // imo number
        + PREFIXED_STRING_LENGTH + MAX_VESSEL_DESC_LENGTH // vessel description
        + PREFIXED_STRING_LENGTH + MAX_SHIPCOMPANY_LENGTH; // ship company
}
// configuring total size of the company admin record account
impl CompanyAdminRecord {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // author
        + TIMESTAMP_LENGTH // timestamp
        + PREFIXED_STRING_LENGTH + MAX_APPROVAL_LENGTH // company admin approval
        + PREFIXED_STRING_LENGTH + MAX_CADMIN_COMMENT_LENGTH; // company admin comment
}

#[error]
pub enum ErrorConfig {
    // user errors
    #[msg("Only maximum of 50 characters can be provided for the user name")]
    UserNameTooLong,
    #[msg("Only maximum of 20 characters can be provided for the user designation")]
    UserDesignationTooLong,
    #[msg("Only maximum of 20 characters can be provided for the user license number")]
    UserLicenseNumberTooLong,
    #[msg("Only maximum of 15 characters can be provided for the user nic number")]
    UserNICNumberTooLong,
    #[msg("Only maximum of 20 characters can be provided for the user contact")]
    UserContactTooLong,
    // vessel errors
    #[msg("Only maximum of 50 characters can be provided for the vessel name")]
    VesselNameTooLong,
    #[msg("Only maximum of 20 characters can be provided for the imo number")]
    IMONumberTooLong,
    #[msg("Only maximum of 120 characters can be provided for the vessel description")]
    VesselDescTooLong,
    #[msg("Only maximum of 20 characters can be provided for the ship company")]
    ShipCompanyNameTooLong,
    // company admin record errors
    #[msg("Only maximum of 8 characters can be provided for the company admin approval")]
    CompanyAdminApprovalTooLong,
    #[msg("Only maximum of 50 characters can be provided for the company admin comment")]
    CompanyAdminCommentTooLong,
}