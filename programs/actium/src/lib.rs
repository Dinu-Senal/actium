use anchor_lang::prelude::*;

declare_id!("4MzsanEXKmTtjA3t9eLDC7YUfAyf8Wp9m9vTKTvPSSqL");

#[program]
pub mod actium {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
