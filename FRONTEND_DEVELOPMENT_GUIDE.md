# Frontend Development Guide for Custom Escrow Platform

**Complete Technical Specification for Building the Web Interface**

*This document provides comprehensive context, specifications, and technical requirements for developing a frontend application for the Custom Escrow smart contract platform.*

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Smart Contract Architecture](#smart-contract-architecture)
3. [Technical Requirements](#technical-requirements)
4. [User Stories & Features](#user-stories--features)
5. [API Integration Guide](#api-integration-guide)
6. [UI/UX Specifications](#uiux-specifications)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Security Considerations](#security-considerations)
9. [Testing Strategy](#testing-strategy)
10. [Deployment Architecture](#deployment-architecture)

---

## Project Overview

### What We're Building
A **decentralized token sale platform** that provides a user-friendly web interface for the Custom Escrow smart contract. Users can create secure token sales, purchase tokens, and manage their transactions through an intuitive web application.

### Current Smart Contract Status
- **Deployed on Solana Devnet**: `HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4`
- **Program Size**: 318,472 bytes (production-ready)
- **Status**: Fully functional and tested
- **Network**: Solana Devnet (mainnet ready)

### Business Model
- **Platform Fees**: 0-100% configurable basis points
- **Target Users**: Token creators, DeFi projects, early-stage companies
- **Revenue Model**: Transaction fees from token sales

---

## Smart Contract Architecture

### Core Instructions (6 total)

#### 1. `initialize_sale`
**Purpose**: Create a new token sale with security parameters
**Parameters**:
- `price_per_token: u64` - Price in payment token lamports (1 USDC = 1,000,000 lamports)
- `total_tokens: u64` - Number of tokens to sell (with decimals)
- `sale_start_time: i64` - Unix timestamp when sale begins
- `sale_end_time: i64` - Unix timestamp when sale ends
- `max_tokens_per_buyer: u64` - Maximum tokens per individual buyer (0 = no limit)
- `platform_fee_bps: u16` - Platform fee in basis points (100 = 1%, max 10000 = 100%)
- `platform_fee_recipient: Pubkey` - Where platform fees are sent

**Validation**:
- Price must be > 0
- Total tokens must be > 0
- End time must be after start time
- End time must be in the future
- Platform fee must be ≤ 10000 basis points

#### 2. `create_buyer_account`
**Purpose**: Create tracking account for first-time buyers
**Parameters**: None (uses buyer's public key and token sale PDA)
**Usage**: Must be called before a buyer's first purchase

#### 3. `buy_tokens`
**Purpose**: Purchase tokens from an active sale
**Parameters**:
- `token_amount: u64` - Number of tokens to purchase

**Validation**:
- Sale must be active and not paused
- Current time must be within sale window
- Sufficient tokens must be available
- Buyer must not exceed purchase limit
- Buyer must have sufficient payment tokens

#### 4. `cancel_sale`
**Purpose**: Cancel sale and return unsold tokens to seller
**Parameters**: None
**Restrictions**: Only seller can call this

#### 5. `toggle_pause`
**Purpose**: Emergency pause/unpause functionality
**Parameters**: None
**Restrictions**: Only seller can call this

#### 6. `update_sale_params`
**Purpose**: Modify sale parameters before sale starts
**Parameters**:
- `new_price_per_token: Option<u64>`
- `new_sale_start_time: Option<i64>`
- `new_sale_end_time: Option<i64>`
- `new_max_tokens_per_buyer: Option<u64>`

**Restrictions**: Only seller can call, only before sale starts

### Account Structures

#### TokenSale Account (181 bytes)
```rust
pub struct TokenSale {
    pub seller: Pubkey,              // Sale creator (32 bytes)
    pub token_mint: Pubkey,          // Token being sold (32 bytes)
    pub payment_mint: Pubkey,        // Payment token (USDC/SOL) (32 bytes)
    pub price_per_token: u64,        // Price in payment token lamports (8 bytes)
    pub total_tokens: u64,           // Original token amount (8 bytes)
    pub tokens_available: u64,       // Tokens remaining (8 bytes)
    pub sale_start_time: i64,        // Unix timestamp start (8 bytes)
    pub sale_end_time: i64,          // Unix timestamp end (8 bytes)
    pub max_tokens_per_buyer: u64,   // Purchase limit per buyer (8 bytes)
    pub platform_fee_bps: u16,       // Platform fee basis points (2 bytes)
    pub platform_fee_recipient: Pubkey, // Fee destination (32 bytes)
    pub is_active: bool,             // Sale status (1 byte)
    pub is_paused: bool,             // Emergency pause (1 byte)
    pub bump: u8,                    // PDA bump seed (1 byte)
}
```

#### BuyerAccount Account (73 bytes)
```rust
pub struct BuyerAccount {
    pub buyer: Pubkey,              // Buyer's public key (32 bytes)
    pub token_sale: Pubkey,         // Associated sale (32 bytes)
    pub tokens_purchased: u64,      // Total purchased (8 bytes)
    pub bump: u8,                   // PDA bump seed (1 byte)
}
```

### Program Derived Addresses (PDAs)

#### Token Sale PDA
```typescript
const [tokenSalePDA, saleBump] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("token_sale"), 
    seller.toBuffer(), 
    tokenMint.toBuffer()
  ],
  program.programId
);
```

#### Token Vault PDA
```typescript
const [tokenVaultPDA, vaultBump] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("token_vault"), 
    tokenSalePDA.toBuffer()
  ],
  program.programId
);
```

#### Buyer Account PDA
```typescript
const [buyerAccountPDA, buyerBump] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("buyer"), 
    buyer.toBuffer(), 
    tokenSalePDA.toBuffer()
  ],
  program.programId
);
```

### Error Codes
```rust
pub enum ErrorCode {
    SaleNotActive,           // Sale is not active
    InsufficientTokens,      // Not enough tokens available
    MathOverflow,            // Arithmetic overflow
    InvalidPrice,            // Price must be > 0
    InvalidTokenAmount,      // Token amount must be > 0
    InvalidStartTime,        // Invalid start time
    InvalidEndTime,          // End time must be after start
    SaleEndTimeInPast,       // End time in the past
    SaleNotStarted,          // Sale hasn't started yet
    SaleEnded,               // Sale has ended
    SalePaused,              // Sale is paused
    ExceedsPurchaseLimit,    // Exceeds buyer limit
    InvalidPlatformFee,      // Fee > 100%
    SaleAlreadyStarted,      // Cannot modify after start
}
```

---

## Technical Requirements

### Recommended Tech Stack

#### Frontend Framework
- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Query/TanStack Query** for state management

#### Solana Integration
- **@solana/web3.js** - Core Solana functionality
- **@coral-xyz/anchor** - Anchor framework integration
- **@solana/wallet-adapter-react** - Wallet connection
- **@solana/spl-token** - Token operations

#### Wallet Support
- **Phantom** (primary)
- **Solflare**
- **Backpack**
- **WalletConnect** (for mobile)

#### Additional Libraries
- **Date handling**: date-fns or dayjs
- **Form management**: React Hook Form + Zod validation
- **Charts**: Recharts or Chart.js
- **Notifications**: React Hot Toast
- **Icons**: Heroicons or Lucide React

### Environment Configuration
```typescript
// Environment variables needed
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_PROGRAM_ID=HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PLATFORM_FEE_RECIPIENT=9yWMwzQb47KGTPKBhCkPYDUcprDBTDQgXvTsc1VTZyPE
```

---

## User Stories & Features

### Seller User Stories

#### As a token creator, I want to:
1. **Create a token sale**
   - Connect my wallet
   - Specify token details (mint address, amount)
   - Set pricing (price per token in USDC)
   - Configure time window (start/end dates)
   - Set purchase limits per buyer
   - Preview and confirm sale creation

2. **Manage my active sales**
   - View sale dashboard with real-time metrics
   - See total raised, tokens sold, remaining tokens
   - Monitor buyer activity and purchase history
   - Pause/unpause sales in emergencies
   - Update sale parameters before launch
   - Cancel sales and retrieve unsold tokens

3. **Track performance**
   - View detailed analytics and charts
   - Export buyer lists and transaction data
   - Monitor platform fees and net revenue
   - Get notifications for important events

### Buyer User Stories

#### As a token buyer, I want to:
1. **Discover token sales**
   - Browse active token sales
   - Filter by price, category, time remaining
   - Search for specific tokens or projects
   - View detailed sale information

2. **Purchase tokens**
   - Connect my wallet seamlessly
   - See clear pricing and total cost
   - Understand purchase limits and restrictions
   - Complete purchases with one-click
   - Receive transaction confirmations

3. **Track my purchases**
   - View purchase history across all sales
   - Monitor token balances
   - Track investment performance
   - Receive purchase receipts and confirmations

### Platform Admin User Stories

#### As a platform administrator, I want to:
1. **Monitor platform activity**
   - View total volume and transaction counts
   - Track platform fee revenue
   - Monitor active sales and user activity
   - Identify trending tokens and popular sales

2. **Manage the platform**
   - Configure platform fee rates
   - Moderate sales and user content
   - Handle support requests and disputes
   - Manage featured sales and promotions

---

## API Integration Guide

### Core Integration Patterns

#### 1. Program Initialization
```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

// Initialize connection and program
const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL);
const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID);

// Load IDL and create program instance
const idl = await Program.fetchIdl(programId, provider);
const program = new Program(idl, programId, provider);
```

#### 2. Sale Creation Flow
```typescript
async function createTokenSale({
  seller,
  tokenMint,
  paymentMint,
  pricePerToken,
  totalTokens,
  saleStartTime,
  saleEndTime,
  maxTokensPerBuyer,
  platformFeeBps,
  platformFeeRecipient
}) {
  // Calculate PDAs
  const [tokenSalePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("token_sale"), seller.toBuffer(), tokenMint.toBuffer()],
    program.programId
  );
  
  const [tokenVaultPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("token_vault"), tokenSalePDA.toBuffer()],
    program.programId
  );

  // Execute transaction
  const tx = await program.methods
    .initializeSale(
      new anchor.BN(pricePerToken),
      new anchor.BN(totalTokens),
      new anchor.BN(saleStartTime),
      new anchor.BN(saleEndTime),
      new anchor.BN(maxTokensPerBuyer),
      platformFeeBps,
      platformFeeRecipient
    )
    .accounts({
      seller: seller,
      tokenSale: tokenSalePDA,
      tokenMint: tokenMint,
      paymentMint: paymentMint,
      sellerTokenAccount: sellerTokenAccount,
      tokenVault: tokenVaultPDA,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .signers([sellerKeypair])
    .rpc();
    
  return { signature: tx, tokenSalePDA };
}
```

#### 3. Token Purchase Flow
```typescript
async function buyTokens({
  buyer,
  tokenSalePDA,
  tokenAmount,
  buyerPaymentAccount,
  buyerTokenAccount
}) {
  // Get sale data
  const saleData = await program.account.tokenSale.fetch(tokenSalePDA);
  
  // Calculate buyer account PDA
  const [buyerAccountPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("buyer"), buyer.toBuffer(), tokenSalePDA.toBuffer()],
    program.programId
  );
  
  // Check if buyer account exists, create if needed
  try {
    await program.account.buyerAccount.fetch(buyerAccountPDA);
  } catch {
    await program.methods
      .createBuyerAccount()
      .accounts({
        buyer: buyer,
        tokenSale: tokenSalePDA,
        buyerAccount: buyerAccountPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }
  
  // Execute purchase
  const tx = await program.methods
    .buyTokens(new anchor.BN(tokenAmount))
    .accounts({
      buyer: buyer,
      tokenSale: tokenSalePDA,
      buyerAccount: buyerAccountPDA,
      buyerPaymentAccount: buyerPaymentAccount,
      sellerPaymentAccount: saleData.sellerPaymentAccount,
      platformFeeAccount: platformFeeAccount,
      buyerTokenAccount: buyerTokenAccount,
      tokenVault: tokenVaultPDA,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();
    
  return { signature: tx };
}
```

#### 4. Data Fetching Patterns
```typescript
// Fetch all active sales
async function fetchActiveSales() {
  const sales = await program.account.tokenSale.all([
    {
      memcmp: {
        offset: 177, // is_active field offset
        bytes: anchor.utils.bytes.bs58.encode([1]) // true
      }
    }
  ]);
  
  return sales.map(sale => ({
    publicKey: sale.publicKey,
    ...sale.account
  }));
}

// Fetch buyer's purchase history
async function fetchBuyerHistory(buyerPublicKey) {
  const buyerAccounts = await program.account.buyerAccount.all([
    {
      memcmp: {
        offset: 8, // buyer field offset
        bytes: buyerPublicKey.toBase58()
      }
    }
  ]);
  
  return buyerAccounts;
}

// Fetch sale details with real-time updates
async function subscribeTo SaleUpdates(tokenSalePDA, callback) {
  const subscriptionId = connection.onAccountChange(
    tokenSalePDA,
    (accountInfo) => {
      const saleData = program.account.tokenSale.coder.accounts.decode(
        "tokenSale",
        accountInfo.data
      );
      callback(saleData);
    }
  );
  
  return subscriptionId;
}
```

### Token Operations

#### Get Token Metadata
```typescript
import { Metaplex } from "@metaplex-foundation/js";

async function getTokenMetadata(mintAddress) {
  const metaplex = Metaplex.make(connection);
  const nft = await metaplex.nfts().findByMint({ mintAddress });
  
  return {
    name: nft.name,
    symbol: nft.symbol,
    description: nft.json?.description,
    image: nft.json?.image,
    decimals: nft.mint.decimals
  };
}
```

#### Calculate Pricing
```typescript
function calculatePurchaseCost(tokenAmount, pricePerToken, platformFeeBps) {
  const grossPayment = tokenAmount * pricePerToken;
  const platformFee = Math.floor(grossPayment * platformFeeBps / 10000);
  const sellerPayment = grossPayment - platformFee;
  
  return {
    grossPayment,
    platformFee,
    sellerPayment,
    total: grossPayment
  };
}
```

---

## UI/UX Specifications

### Design Principles
1. **Simplicity First** - Complex blockchain operations made simple
2. **Trust Through Transparency** - Clear pricing, fees, and terms
3. **Speed Optimization** - Fast loading and responsive interactions
4. **Mobile-First** - Works seamlessly on all devices
5. **Accessibility** - WCAG 2.1 AA compliance

### Key Pages & Components

#### 1. Landing Page
**Purpose**: Introduction and overview of the platform
**Components**:
- Hero section with value proposition
- Featured active sales
- Platform statistics (total volume, active sales)
- Getting started guide
- FAQ section

#### 2. Sales Marketplace
**Purpose**: Browse and discover token sales
**Components**:
- Search and filter controls
- Sale cards with key information
- Pagination or infinite scroll
- Sort options (price, time remaining, popularity)
- Category filters

**Sale Card Information**:
- Token name and symbol
- Token logo/image
- Price per token
- Total tokens available
- Time remaining
- Progress bar (sold/total)
- Quick buy button

#### 3. Sale Detail Page
**Purpose**: Detailed view of individual token sale
**Components**:
- Token information panel
- Sale statistics and charts
- Purchase interface
- Sale timeline
- Terms and conditions
- Recent transactions
- Seller information

**Purchase Interface**:
- Token amount input
- Price calculation display
- Platform fee breakdown
- Total cost summary
- Buy button with wallet connection
- Purchase limit information

#### 4. Create Sale Page
**Purpose**: Token creators set up new sales
**Components**:
- Multi-step form wizard
- Token selection/validation
- Pricing configuration
- Time window selection
- Purchase limit settings
- Preview and confirmation
- Transaction submission

**Form Steps**:
1. Token Information (mint address, verification)
2. Sale Configuration (price, amounts, limits)
3. Timing (start/end dates with timezone)
4. Review and Terms
5. Transaction Confirmation

#### 5. Dashboard (Seller)
**Purpose**: Manage active and past sales
**Components**:
- Sales overview cards
- Revenue analytics chart
- Active sales table
- Recent transactions
- Quick actions (pause, cancel, edit)
- Performance metrics

#### 6. Portfolio (Buyer)
**Purpose**: Track purchases and token holdings
**Components**:
- Purchase history table
- Token balance overview
- Investment performance
- Transaction receipts
- Favorite sales tracking

### Component Specifications

#### Wallet Connection Component
```typescript
interface WalletConnectionProps {
  onConnect?: (wallet: PublicKey) => void;
  onDisconnect?: () => void;
}

// Features:
// - Multi-wallet support (Phantom, Solflare, etc.)
// - Connection status indicator
// - Balance display
// - Disconnect functionality
// - Error handling for connection failures
```

#### Token Input Component
```typescript
interface TokenInputProps {
  tokenMint: PublicKey;
  maxAmount?: number;
  value: number;
  onChange: (amount: number) => void;
  disabled?: boolean;
}

// Features:
// - Decimal handling based on token decimals
// - Max button to use full balance
// - Real-time USD value conversion
// - Input validation and formatting
// - Visual feedback for invalid amounts
```

#### Transaction Status Component
```typescript
interface TransactionStatusProps {
  signature: string;
  status: 'pending' | 'confirmed' | 'failed';
  onRetry?: () => void;
}

// Features:
// - Real-time transaction tracking
// - Solana Explorer links
// - Retry mechanism for failed transactions
// - User-friendly status messages
// - Automatic status updates
```

### Responsive Design Breakpoints
```css
/* Mobile First Approach */
.container {
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 768px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

/* Large Desktop */
@media (min-width: 1440px) {
  .container {
    max-width: 1440px;
  }
}
```

---

## Implementation Roadmap

### Phase 1: MVP Foundation (Weeks 1-2)
**Goal**: Basic functional platform with core features

#### Week 1: Project Setup & Core Infrastructure
- [ ] Next.js project initialization with TypeScript
- [ ] Solana wallet adapter integration
- [ ] Basic routing and layout structure
- [ ] Environment configuration
- [ ] Smart contract integration setup
- [ ] Basic UI component library

#### Week 2: Core Features Implementation
- [ ] Wallet connection functionality
- [ ] Sale browsing interface
- [ ] Token purchase flow
- [ ] Basic sale creation form
- [ ] Transaction handling and confirmation

**Deliverables**:
- Functional web app with wallet connection
- Users can browse and purchase from existing sales
- Basic sale creation capability
- Responsive design foundation

### Phase 2: Enhanced UX (Weeks 3-4)
**Goal**: Improved user experience and additional features

#### Week 3: User Interface Enhancement
- [ ] Professional design implementation
- [ ] Advanced sale filtering and search
- [ ] Improved transaction feedback
- [ ] Mobile optimization
- [ ] Loading states and error handling

#### Week 4: User Management & Analytics
- [ ] User dashboards (buyer/seller)
- [ ] Purchase history tracking
- [ ] Basic analytics and charts
- [ ] Email notifications (optional)
- [ ] Advanced form validation

**Deliverables**:
- Polished user interface
- Complete user dashboards
- Mobile-optimized experience
- Basic analytics functionality

### Phase 3: Advanced Features (Weeks 5-6)
**Goal**: Platform optimization and advanced functionality

#### Week 5: Advanced Sale Management
- [ ] Sale templates and presets
- [ ] Bulk operations
- [ ] Advanced analytics dashboard
- [ ] Export functionality
- [ ] Social sharing features

#### Week 6: Platform Features & Optimization
- [ ] Search functionality with filters
- [ ] Platform administration tools
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] Security audit and testing

**Deliverables**:
- Feature-complete platform
- Administrative capabilities
- Optimized performance
- Production-ready application

### Phase 4: Production Launch (Week 7+)
**Goal**: Launch preparation and post-launch optimization

#### Pre-Launch Checklist
- [ ] Security audit completion
- [ ] Performance testing
- [ ] Cross-browser compatibility
- [ ] Mobile testing
- [ ] User acceptance testing
- [ ] Documentation completion

#### Launch Activities
- [ ] Mainnet deployment preparation
- [ ] Monitoring and logging setup
- [ ] Error tracking implementation
- [ ] Analytics integration
- [ ] User feedback collection

**Deliverables**:
- Production-ready application
- Monitoring and support systems
- User onboarding materials
- Marketing website

---

## Security Considerations

### Frontend Security Best Practices

#### 1. Wallet Security
- **Never store private keys** in frontend code
- **Use wallet adapters** for all signing operations
- **Validate all user inputs** before sending to smart contract
- **Implement connection timeouts** to prevent hanging connections
- **Clear sensitive data** from memory after use

#### 2. Transaction Security
```typescript
// Always validate transaction data before signing
function validateTransactionData(data) {
  // Check for reasonable amounts
  if (data.amount <= 0 || data.amount > MAX_REASONABLE_AMOUNT) {
    throw new Error("Invalid transaction amount");
  }
  
  // Verify recipient addresses
  if (!PublicKey.isOnCurve(data.recipient)) {
    throw new Error("Invalid recipient address");
  }
  
  // Check for suspicious pricing
  if (data.pricePerToken > MAX_REASONABLE_PRICE) {
    throw new Error("Price appears unreasonably high");
  }
}
```

#### 3. Input Validation
```typescript
// Comprehensive form validation
const saleCreationSchema = z.object({
  tokenMint: z.string().refine(val => {
    try {
      new PublicKey(val);
      return true;
    } catch {
      return false;
    }
  }, "Invalid token mint address"),
  
  pricePerToken: z.number()
    .positive("Price must be positive")
    .max(1000000, "Price appears unreasonably high"),
    
  totalTokens: z.number()
    .positive("Token amount must be positive")
    .max(1e12, "Token amount too large"),
    
  saleStartTime: z.date()
    .min(new Date(), "Start time must be in the future"),
    
  saleEndTime: z.date()
    .min(z.date(), "End time must be after start time")
});
```

#### 4. Network Security
- **Use HTTPS** for all connections
- **Validate RPC responses** for unexpected data
- **Implement rate limiting** on API calls
- **Monitor for suspicious activity** patterns
- **Use Content Security Policy** headers

#### 5. Smart Contract Interaction Safety
```typescript
// Safe transaction execution with retries and validation
async function safeExecuteTransaction(
  instruction: TransactionInstruction,
  signers: Keypair[]
) {
  try {
    // Pre-validate instruction data
    validateInstructionData(instruction);
    
    // Simulate transaction first
    const simulation = await connection.simulateTransaction(
      new Transaction().add(instruction)
    );
    
    if (simulation.value.err) {
      throw new Error(`Simulation failed: ${simulation.value.err}`);
    }
    
    // Execute with confirmation
    const signature = await sendAndConfirmTransaction(
      connection,
      new Transaction().add(instruction),
      signers,
      {
        commitment: 'confirmed',
        maxRetries: 3
      }
    );
    
    return signature;
    
  } catch (error) {
    // Log error for monitoring
    console.error('Transaction execution failed:', error);
    throw error;
  }
}
```

### Common Security Pitfalls to Avoid

1. **Displaying unvalidated user data** (XSS attacks)
2. **Trusting client-side calculations** (always verify on-chain)
3. **Inadequate error handling** (leaking sensitive information)
4. **Missing transaction confirmations** (false success states)
5. **Insufficient input sanitization** (malformed data attacks)

---

## Testing Strategy

### Test Categories

#### 1. Unit Tests
**Focus**: Individual components and functions
```typescript
// Example: Token amount calculation tests
describe('TokenAmountCalculator', () => {
  it('should calculate correct purchase cost', () => {
    const result = calculatePurchaseCost(100, 1000000, 500); // 100 tokens, 1 USDC each, 5% fee
    expect(result.grossPayment).toBe(100000000);
    expect(result.platformFee).toBe(5000000);
    expect(result.sellerPayment).toBe(95000000);
  });
  
  it('should handle zero platform fee', () => {
    const result = calculatePurchaseCost(100, 1000000, 0);
    expect(result.platformFee).toBe(0);
    expect(result.sellerPayment).toBe(100000000);
  });
});
```

#### 2. Integration Tests
**Focus**: Component interactions and data flow
```typescript
// Example: Sale creation flow test
describe('Sale Creation Flow', () => {
  it('should create sale successfully with valid data', async () => {
    const mockWallet = createMockWallet();
    const saleData = createMockSaleData();
    
    render(<CreateSaleForm wallet={mockWallet} />);
    
    // Fill form
    await fillSaleForm(saleData);
    
    // Submit
    await clickSubmitButton();
    
    // Verify transaction creation
    expect(mockCreateSale).toHaveBeenCalledWith(saleData);
    expect(screen.getByText('Sale created successfully')).toBeInTheDocument();
  });
});
```

#### 3. End-to-End Tests
**Focus**: Complete user workflows
```typescript
// Example: Complete purchase flow
describe('Token Purchase E2E', () => {
  it('should complete purchase from discovery to confirmation', async () => {
    // Navigate to marketplace
    await page.goto('/marketplace');
    
    // Find and click on a sale
    await page.click('[data-testid="sale-card-1"]');
    
    // Connect wallet
    await page.click('[data-testid="connect-wallet"]');
    await selectWallet('Phantom');
    
    // Enter purchase amount
    await page.fill('[data-testid="token-amount"]', '10');
    
    // Confirm purchase
    await page.click('[data-testid="buy-tokens"]');
    
    // Wait for transaction confirmation
    await page.waitForSelector('[data-testid="success-message"]');
    
    // Verify purchase in history
    await page.goto('/portfolio');
    expect(page.locator('[data-testid="purchase-history"]')).toContainText('10 tokens');
  });
});
```

#### 4. Smart Contract Integration Tests
**Focus**: Blockchain interaction accuracy
```typescript
// Example: Smart contract interaction test
describe('Smart Contract Integration', () => {
  it('should interact correctly with deployed contract', async () => {
    const connection = new Connection('http://localhost:8899');
    const program = await loadProgram(connection);
    
    // Test fetching sales
    const sales = await fetchActiveSales(program);
    expect(sales).toBeInstanceOf(Array);
    
    // Test PDA generation
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("token_sale"), seller.toBuffer(), mint.toBuffer()],
      program.programId
    );
    expect(PublicKey.isOnCurve(pda)).toBe(false);
  });
});
```

### Test Data Management
```typescript
// Mock data factories for consistent testing
export const createMockSale = (overrides = {}) => ({
  seller: new PublicKey("11111111111111111111111111111112"),
  tokenMint: new PublicKey("11111111111111111111111111111113"),
  paymentMint: new PublicKey("11111111111111111111111111111114"),
  pricePerToken: 1000000,
  totalTokens: 1000000000,
  tokensAvailable: 1000000000,
  saleStartTime: Date.now() / 1000,
  saleEndTime: (Date.now() / 1000) + 3600,
  maxTokensPerBuyer: 100000000,
  platformFeeBps: 500,
  isActive: true,
  isPaused: false,
  ...overrides
});

export const createMockWallet = () => ({
  publicKey: new PublicKey("11111111111111111111111111111115"),
  signTransaction: jest.fn(),
  signAllTransactions: jest.fn(),
  connected: true
});
```

---

## Deployment Architecture

### Recommended Deployment Strategy

#### 1. Development Environment
- **Local Development**: Next.js dev server with Solana localnet
- **Staging**: Vercel preview deployments with Solana devnet
- **Production**: Vercel production with Solana mainnet

#### 2. Environment Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SOLANA_NETWORK: process.env.NODE_ENV === 'production' ? 'mainnet' : 'devnet',
    PROGRAM_ID: process.env.NODE_ENV === 'production' 
      ? 'MAINNET_PROGRAM_ID_HERE' 
      : 'HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4'
  },
  images: {
    domains: ['arweave.net', 'ipfs.io'], // For token metadata images
  },
  async rewrites() {
    return [
      {
        source: '/api/rpc/:path*',
        destination: 'https://api.mainnet-beta.solana.com/:path*', // Proxy RPC calls
      },
    ];
  },
};

module.exports = nextConfig;
```

#### 3. Performance Optimization
```typescript
// Implement service worker for caching
// public/sw.js
const CACHE_NAME = 'escrow-platform-v1';
const urlsToCache = [
  '/',
  '/marketplace',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Implement connection pooling for RPC calls
class ConnectionPool {
  private connections: Connection[] = [];
  
  getConnection(): Connection {
    // Round-robin or least-used connection
    return this.connections[Math.floor(Math.random() * this.connections.length)];
  }
}
```

#### 4. Monitoring and Analytics
```typescript
// Error tracking setup
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 0.1,
});

// Custom analytics for blockchain interactions
export function trackTransaction(eventName: string, properties: any) {
  // Analytics service integration
  analytics.track(eventName, {
    ...properties,
    timestamp: Date.now(),
    network: process.env.NEXT_PUBLIC_SOLANA_NETWORK
  });
}
```

### CI/CD Pipeline Configuration
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run E2E tests
        run: npm run test:e2e

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Additional Resources

### Smart Contract Resources
- **Contract Source**: `/programs/escrow/src/lib.rs`
- **Test Files**: `/tests/` directory
- **IDL File**: `/target/idl/escrow.json`
- **Deployed Address**: `HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4`

### Documentation References
- **Solana Web3.js**: https://solana-labs.github.io/solana-web3.js/
- **Anchor Framework**: https://book.anchor-lang.com/
- **Solana Wallet Adapter**: https://github.com/solana-labs/wallet-adapter
- **SPL Token Program**: https://spl.solana.com/token

### Development Tools
- **Solana Explorer**: https://explorer.solana.com/?cluster=devnet
- **Solana CLI**: https://docs.solana.com/cli
- **Anchor CLI**: https://book.anchor-lang.com/getting_started/installation.html

### Design Resources
- **Solana Design System**: https://github.com/solana-labs/solana-design-system
- **Web3 UI Patterns**: https://web3patterns.com/
- **Crypto Icons**: https://cryptoicons.org/

---

## Getting Started Checklist

### Prerequisites Setup
- [ ] Node.js 18+ installed
- [ ] Git repository created
- [ ] Package manager chosen (npm/yarn/pnpm)
- [ ] Code editor configured (VS Code recommended)
- [ ] Solana wallet installed (Phantom/Solflare)

### Project Initialization
- [ ] Next.js project created with TypeScript
- [ ] Solana dependencies installed
- [ ] Environment variables configured
- [ ] Basic project structure established
- [ ] Git repository initialized

### Development Environment
- [ ] Local development server running
- [ ] Wallet connection tested
- [ ] Smart contract integration verified
- [ ] Test suite configured
- [ ] Linting and formatting setup

### First Features
- [ ] Basic wallet connection component
- [ ] Sale browsing interface
- [ ] Token purchase functionality
- [ ] Transaction confirmation flow
- [ ] Error handling implementation

---

This comprehensive guide provides all the technical context, specifications, and implementation details needed to build a production-ready frontend for the Custom Escrow smart contract platform. The document serves as both a reference and a roadmap for the development process.

For questions or clarifications about any aspect of this specification, refer to the smart contract source code and test files in this repository.