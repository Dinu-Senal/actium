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
        vessel_part: String,
        vessel_part_serial_key: String,
        vessel_imo_fkey: String,
    ) -> ProgramResult {
        let companyadminrecord: &mut Account<CompanyAdminRecord> = &mut ctx.accounts.companyadminrecord;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        if vessel_part.chars().count() > 50 {
            return Err(ErrorConfig::CompanyAdminVesselPartTooLong.into())
        }
        if vessel_part_serial_key.chars().count() > 30 {
            return Err(ErrorConfig::CompanyAdminVesselPartKeyTooLong.into())
        }
        if vessel_imo_fkey.chars().count() > 20 {
            return Err(ErrorConfig::CompanyAdminVesselIMOTooLong.into())
        }

        companyadminrecord.author = *author.key;
        companyadminrecord.timestamp = clock.unix_timestamp;
        companyadminrecord.vessel_part = vessel_part;
        companyadminrecord.vessel_part_serial_key = vessel_part_serial_key;
        companyadminrecord.vessel_imo_fkey = vessel_imo_fkey;
        Ok(())
    }
    // validator record
    pub fn store_validator_record(
        ctx: Context<StoreValidatorRecord>,
        v_approval: String,
        v_comment: String,
        v_designation: String,
        vessel_imo_fkey: String
    ) -> ProgramResult {
        let validatorrecord: &mut Account<ValidatorRecord> = &mut ctx.accounts.validatorrecord;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();
        
        if v_approval.chars().count() > 3 {
            return Err(ErrorConfig::ValidatorStatusTooLong.into())
        }
        if v_comment.chars().count() > 300 {
            return Err(ErrorConfig::ValidatorCommentTooLong.into())
        }
        if v_designation.chars().count() > 20 {
            return Err(ErrorConfig::ValidatorDesignationTooLong.into())
        }
        if vessel_imo_fkey.chars().count() > 20 {
            return Err(ErrorConfig::ValidatorIMONumberTooLong.into())
        }

        validatorrecord.author = *author.key;
        validatorrecord.timestamp = clock.unix_timestamp;
        validatorrecord.v_approval = v_approval;
        validatorrecord.v_comment = v_comment;
        validatorrecord.v_designation = v_designation;
        validatorrecord.vessel_imo_fkey = vessel_imo_fkey;
        Ok(())
    }
    // service provider record
    pub fn store_service_provider_record(
        ctx: Context<StoreServiceProviderRecord>,
        part_description: String,
        date_purchased: String,
        warranty_code: String,
        vessel_part_public_key_fkey: String,
    ) -> ProgramResult {
        let serviceproviderrecord: &mut Account<ServiceProviderRecord> = &mut ctx.accounts.serviceproviderrecord;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        if part_description.chars().count() > 200 {
            return Err(ErrorConfig::PartDescriptionTooLong.into())
        }
        if date_purchased.chars().count() > 10 {
            return Err(ErrorConfig::PurchasedDateTooLong.into())
        }
        if warranty_code.chars().count() > 20 {
            return Err(ErrorConfig::WarrantyCodeTooLong.into())
        }
        if vessel_part_public_key_fkey.chars().count() > 32 {
            return Err(ErrorConfig::PartForeignKeyTooLong.into())
        }

        serviceproviderrecord.author = *author.key;
        serviceproviderrecord.timestamp = clock.unix_timestamp;
        serviceproviderrecord.part_description = part_description;
        serviceproviderrecord.date_purchased = date_purchased;
        serviceproviderrecord.warranty_code = warranty_code;
        serviceproviderrecord.vessel_part_public_key_fkey = vessel_part_public_key_fkey;
        Ok(())
    }
    // inspector record
    pub fn store_inspector_record(
        ctx: Context<StoreInspectorRecord>,
        i_comment: String,
        maintenance_batch: String,
        vessel_part_public_key_fkey: String,
    ) -> ProgramResult {
        let inspectorrecord: &mut Account<InspectorRecord> = &mut ctx.accounts.inspectorrecord;
        let author: &Signer = &mut ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        if i_comment.chars().count() > 300 {
            return Err(ErrorConfig::InspectorCommentTooLong.into())
        }
        if maintenance_batch.chars().count() > 50 {
            return Err(ErrorConfig::InspectorMaintenanceBatchTooLong.into())
        }
        if vessel_part_public_key_fkey.chars().count() > 32 {
            return Err(ErrorConfig::InspectorVesselPartPublicKeyTooLong.into())
        }

        inspectorrecord.author = *author.key;
        inspectorrecord.timestamp = clock.unix_timestamp;
        inspectorrecord.i_comment = i_comment;
        inspectorrecord.maintenance_batch = maintenance_batch;
        inspectorrecord.vessel_part_public_key_fkey = vessel_part_public_key_fkey;
        Ok(())
    }
    // delivery service record
    pub fn store_delivery_service_record(
        ctx: Context<StoreDeliveryServiceRecord>,
        delivered_address: String,
        delivered_date: String,
        warehouse: String,
        vessel_part_public_key_fkey: String
    ) -> ProgramResult {
        let deliveryservicerecord: &mut Account<DeliveryServiceRecord> = &mut ctx.accounts.deliveryservicerecord;
        let author: &Signer = &mut ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        if delivered_address.chars().count() > 120 {
            return Err(ErrorConfig::DeliveredAddressTooLong.into())
        }
        if delivered_date.chars().count() > 10 {
            return Err(ErrorConfig::DeliveredDateTooLong.into())
        }
        if warehouse.chars().count() > 50 {
            return Err(ErrorConfig::WarehouseNameTooLong.into())
        }
        if vessel_part_public_key_fkey.chars().count() > 32 {
            return Err(ErrorConfig::DeliveryVesselPartKeyTooLong.into())
        }

        deliveryservicerecord.author = *author.key;
        deliveryservicerecord.timestamp = clock.unix_timestamp;
        deliveryservicerecord.delivered_address = delivered_address;
        deliveryservicerecord.delivered_date = delivered_date;
        deliveryservicerecord.warehouse = warehouse;
        deliveryservicerecord.vessel_part_public_key_fkey = vessel_part_public_key_fkey;
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

// validator record
#[derive(Accounts)]
pub struct StoreValidatorRecord<'info> {
    #[account(init, payer = author, space = ValidatorRecord::LEN)]
    pub validatorrecord: Account<'info, ValidatorRecord>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>
}

// service provider record
#[derive(Accounts)]
pub struct StoreServiceProviderRecord<'info> {
    #[account(init, payer = author, space = ServiceProviderRecord::LEN)]
    pub serviceproviderrecord: Account<'info, ServiceProviderRecord>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>
}

// inspector record
#[derive(Accounts)]
pub struct StoreInspectorRecord<'info> {
    #[account(init, payer = author, space = InspectorRecord::LEN)]
    pub inspectorrecord: Account<'info, InspectorRecord>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>
}

// delivery service record
#[derive(Accounts)]
pub struct StoreDeliveryServiceRecord<'info> {
    #[account(init, payer = author, space = DeliveryServiceRecord::LEN)]
    pub deliveryservicerecord: Account<'info, DeliveryServiceRecord>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info >
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
    pub vessel_part: String,
    pub vessel_part_serial_key: String,
    pub vessel_imo_fkey: String
}

// structure of validator record account
#[account]
pub struct ValidatorRecord {
    pub author: Pubkey,
    pub timestamp: i64,
    pub v_approval: String,
    pub v_comment: String,
    pub v_designation: String,
    pub vessel_imo_fkey: String
}

// structure of service provider record account
#[account]
pub struct ServiceProviderRecord {
    pub author: Pubkey,
    pub timestamp: i64,
    pub part_description: String,
    pub date_purchased: String,
    pub warranty_code: String,
    pub vessel_part_public_key_fkey: String
}

// structure of inspector record account
#[account]
pub struct InspectorRecord {
    pub author: Pubkey,
    pub timestamp: i64,
    pub i_comment: String,
    pub maintenance_batch: String,
    pub vessel_part_public_key_fkey: String
}

// structure of delivery service record account
#[account]
pub struct DeliveryServiceRecord {
    pub author: Pubkey,
    pub timestamp: i64,
    pub delivered_address: String,
    pub delivered_date: String,
    pub warehouse: String,
    pub vessel_part_public_key_fkey: String
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
const MAX_VESSEL_PART_LENGTH: usize = 50 * 4; // stores maximum 50 chars
const MAX_VESSEL_PART_SERIAL_KEY_LENGTH: usize = 30 * 4; // stores maximum 30 chars
const MAX_VESSEL_IMO_FKEY_LENGTH: usize = 20 * 4; // stores maximum 20 chars
// validator record constants
const MAX_VALIDATED_LENGTH: usize = 3 * 4; // stores maximum 3 chars
const MAX_VCOMMENT_LENGTH: usize = 300 * 4; // stores maximum 300 chars
const MAX_V_DESIGNATION_LENGTH: usize = 20 * 4; // stores maximum 20 chars
const MAX_V_VESSEL_IMO_FKEY_LENGTH: usize = 20 * 4; // stores maximum 20 chars
// service provider record constants
const MAX_PART_DESCRIPTION_LENGTH: usize = 200 * 4; // store maximum 200 chars
const MAX_DATE_PURCHASED_LENGTH: usize = 10 * 4; // store maximum 10 chars
const MAX_WARRANTY_CODE_LENGTH: usize = 20 * 4; // store maximum 20 chars
const MAX_S_VESSEL_PART_PUBLIC_KEY_FKEY_LENGTH: usize = 32 * 4; // stores maximum 32 chars
// inspector record constants
const MAX_ICOMMENT_LENGTH: usize = 300 * 4; // stores maximum 300 chars
const MAX_MAINTENANCE_BATCH_LENGTH: usize = 50 * 4; // stores maximum 50 chars
const MAX_VESSEL_PART_PUBLIC_KEY_FKEY_LENGTH: usize = 32 * 4; // stores maximum 32 chars
// delivery service record constants
const MAX_DELIVERED_ADDRESS_LENGTH: usize = 120 * 4; // store maximum 120 chars
const MAX_DELIVERED_DATE_LENGTH: usize = 10 * 4; // store maximum 10 chars
const MAX_WAREHOUSE_LENGTH: usize = 50 * 4; // store maximum 50 chars
const MAX_D_VESSEL_PART_PUBLIC_KEY_FKEY_LENGTH: usize = 32 * 4; // store maximum 32 chars

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
        + PREFIXED_STRING_LENGTH + MAX_VESSEL_PART_LENGTH // vessel part
        + PREFIXED_STRING_LENGTH + MAX_VESSEL_PART_SERIAL_KEY_LENGTH // vessel part serial key
        + PREFIXED_STRING_LENGTH + MAX_VESSEL_IMO_FKEY_LENGTH; // company admin vessel imo
}
// configuring total size of the validator record account
impl ValidatorRecord {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // author
        + TIMESTAMP_LENGTH // timestamp
        + PREFIXED_STRING_LENGTH + MAX_VALIDATED_LENGTH // validated
        + PREFIXED_STRING_LENGTH + MAX_VCOMMENT_LENGTH // validator's comment
        + PREFIXED_STRING_LENGTH + MAX_V_DESIGNATION_LENGTH // validator's designation
        + PREFIXED_STRING_LENGTH + MAX_V_VESSEL_IMO_FKEY_LENGTH; // validator's vessel imo
}
// configuring total size of the service provider record account
impl ServiceProviderRecord {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // author
        + TIMESTAMP_LENGTH // timestamp
        + PREFIXED_STRING_LENGTH + MAX_PART_DESCRIPTION_LENGTH // maintenance part description
        + PREFIXED_STRING_LENGTH + MAX_DATE_PURCHASED_LENGTH // maintenance part purchased date
        + PREFIXED_STRING_LENGTH + MAX_WARRANTY_CODE_LENGTH // maintenance part warranty code
        + PREFIXED_STRING_LENGTH + MAX_S_VESSEL_PART_PUBLIC_KEY_FKEY_LENGTH; // maintenance part id
}
// configuring total size of the inspector record account
impl InspectorRecord {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // author
        + TIMESTAMP_LENGTH // timestamp
        + PREFIXED_STRING_LENGTH + MAX_ICOMMENT_LENGTH // inspector's comment
        + PREFIXED_STRING_LENGTH + MAX_MAINTENANCE_BATCH_LENGTH // maintenance batch
        + PREFIXED_STRING_LENGTH + MAX_VESSEL_PART_PUBLIC_KEY_FKEY_LENGTH; // vessel part public key
}
// configure total size of the delivery service record account
impl DeliveryServiceRecord {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // author
        + TIMESTAMP_LENGTH // timestamp
        + PREFIXED_STRING_LENGTH + MAX_DELIVERED_ADDRESS_LENGTH // delivered address
        + PREFIXED_STRING_LENGTH + MAX_DELIVERED_DATE_LENGTH // delivered date
        + PREFIXED_STRING_LENGTH + MAX_WAREHOUSE_LENGTH // warehouse
        + PREFIXED_STRING_LENGTH + MAX_D_VESSEL_PART_PUBLIC_KEY_FKEY_LENGTH; // vessel part public key
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
    #[msg("Only maximum of 50 characters can be provided for the vessel part")]
    CompanyAdminVesselPartTooLong,
    #[msg("Only maximum of 30 characters can be provided for the vessel part serial key")]
    CompanyAdminVesselPartKeyTooLong,
    #[msg("Only maximum of 20 characters can be provided for the vessel imo number")]
    CompanyAdminVesselIMOTooLong,
    // validator record errors
    #[msg("Only maximum of 3 characters can be provided for the validated status")]
    ValidatorStatusTooLong,
    #[msg("Only maximum of 300 characters can be provided for the validator's comment")]
    ValidatorCommentTooLong,
    #[msg("Only maximum of 20 characters can be provided for the validator's designation")]
    ValidatorDesignationTooLong,
    #[msg("Only maximum of 20 characters can be provided for the validator's vessel imo")]
    ValidatorIMONumberTooLong,
    // service provider record errors
    #[msg("Only maximum of 200 characters can be provided for the part description")]
    PartDescriptionTooLong,
    #[msg("Only maximum of 10 characters can be provided for the purchased data")]
    PurchasedDateTooLong,
    #[msg("Only maximum of 20 characters can be provided for the warranty code")]
    WarrantyCodeTooLong,
    #[msg("Only maximum of 32 characters can be provided for the part id")]
    PartForeignKeyTooLong,
    // inspector record errors
    #[msg("Only maximum of 300 characters can be provided for the inspector's comment")]
    InspectorCommentTooLong,
    #[msg("Only maximum of 50 characters can be provided for the maintenance batch")]
    InspectorMaintenanceBatchTooLong,
    #[msg("Only maximum of 32 characters can be provided for the vessel part public key")]
    InspectorVesselPartPublicKeyTooLong,
    // delivery service record errors
    #[msg("Only maximum of 120 characters can be provided for the delivered address")]
    DeliveredAddressTooLong,
    #[msg("Only maximum of 10 characters can be provided for the delivered date")]
    DeliveredDateTooLong,
    #[msg("Only maximum of 50 characters can be provided for the warehouse")]
    WarehouseNameTooLong,
    #[msg("Only maximum of 32 characters can be provided for the vessel part public key")]
    DeliveryVesselPartKeyTooLong,
}