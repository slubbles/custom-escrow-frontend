# Smart Contract Requirements for Multi-Project Token Presale Platform

## Overview
This document outlines the comprehensive requirements for a Solana smart contract that supports a multi-project token presale platform. The contract must enable organizations to launch multiple token projects with tiered sales, vesting schedules, and advanced participant management.

## Current State Analysis
- **Existing Contract**: Basic single-project token sale escrow at `HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4`
- **Current Capabilities**: Simple buyer/seller escrow, basic token distribution
- **Gap**: Lacks multi-project architecture, tiered sales, vesting, and advanced features

---

## Core Data Structures Required

### 1. Platform Account
```rust
pub struct PlatformAccount {
    pub authority: Pubkey,           // Platform admin authority
    pub treasury: Pubkey,            // Platform fee collection wallet
    pub platform_fee: u16,          // Basis points (e.g., 250 = 2.5%)
    pub total_projects: u64,         // Counter for project IDs
    pub is_paused: bool,             // Emergency pause flag
    pub min_project_duration: i64,   // Minimum sale duration in seconds
    pub max_project_duration: i64,   // Maximum sale duration in seconds
}
```

### 2. Project Account
```rust
pub struct ProjectAccount {
    pub id: u64,                     // Unique project identifier
    pub creator: Pubkey,             // Project creator/owner
    pub name: String,                // Project name (max 50 chars)
    pub description: String,         // Project description (max 500 chars)
    pub logo_url: String,            // IPFS or web URL for logo
    pub website: String,             // Project website
    pub twitter: String,             // Twitter handle
    pub discord: String,             // Discord invite link
    pub telegram: String,            // Telegram channel
    pub category: ProjectCategory,   // DeFi, Gaming, NFT, etc.
    pub tags: Vec<String>,           // Searchable tags
    pub token_mint: Pubkey,          // Token being sold
    pub token_name: String,          // Token name
    pub token_symbol: String,        // Token symbol
    pub token_decimals: u8,          // Token decimal places
    pub status: ProjectStatus,       // Draft, Active, Paused, Completed, Failed
    pub created_at: i64,             // Unix timestamp
    pub updated_at: i64,             // Last update timestamp
    pub approval_status: ApprovalStatus, // Pending, Approved, Rejected
    pub approved_by: Option<Pubkey>, // Admin who approved
    pub approved_at: Option<i64>,    // Approval timestamp
}
```

### 3. Sale Configuration
```rust
pub struct SaleConfiguration {
    pub project_id: u64,            // Associated project
    pub sale_type: SaleType,         // Seed, Private, Public
    pub token_price: u64,            // Price per token (in lamports)
    pub total_tokens: u64,           // Total tokens for this sale tier
    pub min_purchase: u64,           // Minimum purchase amount
    pub max_purchase: u64,           // Maximum purchase amount
    pub start_time: i64,             // Sale start timestamp
    pub end_time: i64,               // Sale end timestamp
    pub is_whitelist_only: bool,     // Requires whitelist approval
    pub requires_kyc: bool,          // Requires KYC verification
    pub referral_enabled: bool,      // Enable referral rewards
    pub referral_rate: u16,          // Referral reward rate (basis points)
}
```

### 4. Vesting Schedule
```rust
pub struct VestingSchedule {
    pub project_id: u64,            // Associated project
    pub sale_type: SaleType,         // Which sale tier this applies to
    pub cliff_duration: i64,         // Cliff period in seconds
    pub vesting_duration: i64,       // Total vesting period in seconds
    pub initial_unlock: u16,         // Initial unlock percentage (basis points)
    pub vesting_type: VestingType,   // Linear, Custom, Milestone
    pub milestones: Vec<VestingMilestone>, // For milestone-based vesting
}

pub struct VestingMilestone {
    pub timestamp: i64,              // When this milestone unlocks
    pub percentage: u16,             // Percentage to unlock (basis points)
    pub description: String,         // Milestone description
}
```

### 5. Participant Account
```rust
pub struct ParticipantAccount {
    pub wallet: Pubkey,              // Participant's wallet
    pub project_id: u64,             // Associated project
    pub sale_type: SaleType,         // Which sale tier they participated in
    pub total_contributed: u64,      // Total SOL/USDC contributed
    pub tokens_allocated: u64,       // Total tokens allocated
    pub tokens_claimed: u64,         // Tokens already claimed
    pub last_claim_time: i64,        // Last vesting claim timestamp
    pub referrer: Option<Pubkey>,    // Who referred this participant
    pub referral_rewards: u64,       // Referral rewards earned
    pub kyc_verified: bool,          // KYC verification status
    pub kyc_provider: Option<String>, // KYC provider identifier
    pub joined_at: i64,              // When they first participated
}
```

### 6. Whitelist Entry
```rust
pub struct WhitelistEntry {
    pub project_id: u64,            // Associated project
    pub sale_type: SaleType,         // Which sale tier
    pub wallet: Pubkey,              // Whitelisted wallet
    pub max_allocation: u64,         // Maximum allocation for this wallet
    pub added_by: Pubkey,            // Admin who added them
    pub added_at: i64,               // When they were whitelisted
}
```

---

## Required Instructions (Functions)

### Platform Management
1. **initialize_platform** - Initialize the platform with admin authority
2. **update_platform_config** - Update platform settings (fees, limits)
3. **pause_platform** - Emergency pause all operations
4. **unpause_platform** - Resume platform operations

### Project Management
5. **create_project** - Create a new project (draft status)
6. **update_project** - Update project metadata
7. **submit_for_approval** - Submit project for admin review
8. **approve_project** - Admin approval of project
9. **reject_project** - Admin rejection with reason
10. **pause_project** - Pause a specific project
11. **finalize_project** - Mark project as completed

### Sale Configuration
12. **configure_sale_tier** - Set up Seed/Private/Public sale parameters
13. **update_sale_config** - Modify sale configuration
14. **add_vesting_schedule** - Configure token vesting
15. **update_vesting_schedule** - Modify vesting parameters

### Participant Management
16. **add_to_whitelist** - Add wallets to sale whitelist
17. **remove_from_whitelist** - Remove wallets from whitelist
18. **batch_whitelist** - Add multiple wallets efficiently
19. **verify_kyc** - Mark participant as KYC verified
20. **participate_in_sale** - Purchase tokens in active sale

### Token Operations
21. **claim_vested_tokens** - Claim available vested tokens
22. **calculate_claimable** - View-only function to check claimable amount
23. **emergency_withdraw** - Admin emergency token withdrawal
24. **refund_participants** - Refund failed/cancelled projects

### Referral System
25. **set_referrer** - Set referrer for participant
26. **claim_referral_rewards** - Claim earned referral rewards
27. **calculate_referral_rewards** - View referral earnings

---

## Enums and Types

```rust
#[derive(Clone, Copy, PartialEq)]
pub enum ProjectCategory {
    DeFi,
    Gaming,
    NFT,
    Infrastructure,
    Social,
    Metaverse,
    AI,
    Other,
}

#[derive(Clone, Copy, PartialEq)]
pub enum ProjectStatus {
    Draft,        // Being created
    Submitted,    // Awaiting approval
    Active,       // Approved and running
    Paused,       // Temporarily stopped
    Completed,    // Successfully finished
    Failed,       // Did not meet goals
    Cancelled,    // Cancelled by creator
}

#[derive(Clone, Copy, PartialEq)]
pub enum ApprovalStatus {
    Pending,
    Approved,
    Rejected,
}

#[derive(Clone, Copy, PartialEq)]
pub enum SaleType {
    Seed,     // Early investors, small allocation
    Private,  // Whitelisted participants
    Public,   // Open to everyone
}

#[derive(Clone, Copy, PartialEq)]
pub enum VestingType {
    Linear,     // Continuous linear unlock
    Milestone,  // Unlock at specific milestones
    Custom,     // Custom schedule
}
```

---

## Security Requirements

### Access Controls
- **Platform Admin**: Can approve projects, pause platform, update configs
- **Project Creator**: Can update their project, configure sales, manage whitelist
- **Participants**: Can participate in sales, claim tokens, view status

### Validation Rules
- Minimum/maximum sale durations enforced
- Token price must be greater than zero
- Sale end time must be after start time
- Vesting schedules must be logical (cliff ≤ total duration)
- Whitelist only enforced for Seed/Private sales
- Purchase limits respected per sale tier

### Emergency Features
- Platform-wide pause capability
- Individual project pause
- Emergency token withdrawal for failed projects
- Refund mechanisms for cancelled sales

---

## Integration Requirements

### Frontend Integration
- All functions must return detailed error messages
- View-only functions for displaying data without transactions
- Event emissions for all state changes
- Batch operations for efficiency

### Token Standards
- Support for SPL tokens (fungible tokens)
- Automatic token account creation if needed
- Proper token transfer validation
- Decimal handling for different token types

### Fee Structure
- Platform fees collected on successful sales
- Gas optimization for batch operations
- Minimal storage costs through efficient data structures

---

## Testing Requirements

### Unit Tests
- All instruction functions
- PDA derivation correctness
- Access control validation
- Mathematical calculations (vesting, fees, allocations)

### Integration Tests
- Complete sale lifecycle (create → participate → vest → claim)
- Multi-project scenarios
- Whitelist management flows
- Referral system validation
- Emergency scenarios

### Performance Tests
- Large whitelist handling (1000+ participants)
- Batch operations efficiency
- Storage optimization validation

---

## Migration Strategy

### Phase 1: Core Foundation
- Platform and project management
- Basic sale functionality
- Simple participant tracking

### Phase 2: Advanced Features
- Tiered sales (Seed/Private/Public)
- Whitelist management
- Basic vesting (linear only)

### Phase 3: Enhanced Capabilities
- Complex vesting schedules
- Referral system
- Advanced analytics
- Governance integration

---

## Success Metrics

### Functional Requirements
- Support 100+ concurrent projects
- Handle 10,000+ participants per project
- Process transactions under 2 seconds
- Maintain <1% failed transaction rate

### Economic Requirements
- Platform fee collection accuracy: 100%
- Vesting calculation precision: No rounding errors
- Refund capability: 100% for failed projects

---

## Notes for Developer

1. **PDA Seeds**: Use consistent naming for Program Derived Addresses
2. **Error Handling**: Implement comprehensive error types with descriptive messages
3. **Events**: Emit events for all state changes for frontend integration
4. **Documentation**: Include detailed comments for complex calculations
5. **Upgradeability**: Consider upgrade patterns for future enhancements
6. **Testing**: Implement comprehensive test coverage (>90%)

This contract will serve as the foundation for a robust, scalable multi-project token presale platform that can compete with industry leaders while providing unique features like advanced vesting and referral systems.