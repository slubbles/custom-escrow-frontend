# Solana Escrow Frontend Integration Guide

## Overview
This guide provides the complete solution for integrating your Next.js frontend with the deployed Solana escrow smart contract, fixing the IDL compatibility errors.

## Files Created/Updated

### 1. IDL File (`src/lib/escrow-idl.json`)
- ✅ Compatible with Anchor TypeScript client
- ✅ Proper PublicKey field definitions using `pubkey` type
- ✅ Correct instruction names matching your smart contract
- ✅ PDA seed definitions for automatic account derivation

### 2. TypeScript Types (`src/lib/types.ts`)
- ✅ `TokenSale` and `BuyerAccount` interfaces
- ✅ Account wrapper types for Anchor
- ✅ Parameter interfaces for instructions
- ✅ Transaction result types
- ✅ Error handling enums

### 3. PDA Utilities (`src/lib/pdas.ts`)
- ✅ `getTokenSalePDA()` - Generate token sale PDAs
- ✅ `getTokenVaultPDA()` - Generate token vault PDAs  
- ✅ `getBuyerAccountPDA()` - Generate buyer account PDAs
- ✅ Helper functions for bulk PDA generation
- ✅ Program ID and platform fee recipient constants

### 4. Solana Configuration (`src/lib/solana.ts`)
- ✅ Updated to import and export the correct IDL
- ✅ Optimized connection settings
- ✅ Re-exports for easy importing

### 5. React Hooks (`src/hooks/useEscrow.ts`)
- ✅ `useEscrowProgram()` - Initialize Anchor program without IDL errors
- ✅ `useActiveSales()` - Fetch active token sales
- ✅ `useBuyTokens()` - Purchase tokens with automatic buyer account creation
- ✅ `useInitializeProgram()` - Admin initialization
- ✅ Proper error handling and TypeScript compatibility

## Key Fixes Applied

### IDL Compatibility Issues
- **Fixed**: "Cannot use 'in' operator to search for 'option' in publicKey"
- **Solution**: Used proper Anchor IDL format with `pubkey` type instead of `publicKey`
- **Added**: Discriminators for account types
- **Added**: PDA seed definitions in IDL

### TypeScript Issues
- **Fixed**: Account access type errors
- **Solution**: Used type assertions `(program.account as any)` for account access
- **Added**: Proper null checking for program provider
- **Added**: BN conversion for numeric parameters

### Account Management
- **Added**: Automatic buyer account creation before token purchases
- **Added**: Proper PDA derivation using correct seeds
- **Added**: Associated token account handling

## Environment Variables Required

```env
# Required in .env.local
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_PLATFORM_FEE_RECIPIENT=9yWMwzQb47KGTPKBhCkPYDUcprDBTDQgXvTsc1VTZyPE
```

## Usage Examples

### 1. Fetch Active Sales
```typescript
import { useActiveSales } from '@/hooks/useEscrow';

function SalesComponent() {
  const { data: sales, isLoading, error } = useActiveSales();
  
  if (isLoading) return <div>Loading sales...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {sales?.map((sale) => (
        <div key={sale.publicKey.toString()}>
          <h3>Price: {sale.account.pricePerToken.toString()} lamports</h3>
          <p>Available: {sale.account.tokensAvailable.toString()}</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. Buy Tokens
```typescript
import { useBuyTokens } from '@/hooks/useEscrow';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

function BuyTokensComponent({ tokenSalePDA, tokenMint }) {
  const buyTokens = useBuyTokens();
  
  const handlePurchase = async () => {
    try {
      const result = await buyTokens.mutateAsync({
        tokenSalePDA,
        tokenMint,
        paymentMint: new PublicKey('So11111111111111111111111111111111111111112'), // SOL
        tokenAmount: new BN(1000000000), // 1 token (assuming 9 decimals)
      });
      
      console.log('Purchase successful:', result.signature);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };
  
  return (
    <button 
      onClick={handlePurchase}
      disabled={buyTokens.isPending}
    >
      {buyTokens.isPending ? 'Purchasing...' : 'Buy Tokens'}
    </button>
  );
}
```

### 3. Program Initialization
```typescript
import { useEscrowProgram } from '@/hooks/useEscrow';

function ProgramStatus() {
  const program = useEscrowProgram();
  
  return (
    <div>
      {program ? (
        <p>✅ Program connected: {program.programId.toString()}</p>
      ) : (
        <p>❌ Connect your wallet to initialize</p>
      )}
    </div>
  );
}
```

## Smart Contract Integration

### Account Structure Mapping
```rust
// Smart Contract → TypeScript
pub struct TokenSale {
    pub seller: Pubkey,              // → seller: PublicKey
    pub token_mint: Pubkey,          // → tokenMint: PublicKey  
    pub payment_mint: Pubkey,        // → paymentMint: PublicKey
    pub price_per_token: u64,        // → pricePerToken: BN
    pub total_tokens: u64,           // → totalTokens: BN
    pub tokens_available: u64,       // → tokensAvailable: BN
    pub sale_start_time: i64,        // → saleStartTime: BN
    pub sale_end_time: i64,          // → saleEndTime: BN
    pub max_tokens_per_buyer: u64,   // → maxTokensPerBuyer: BN
    pub platform_fee_bps: u16,       // → platformFeeBps: number
    pub platform_fee_recipient: Pubkey, // → platformFeeRecipient: PublicKey
    pub is_active: bool,             // → isActive: boolean
    pub is_paused: bool,             // → isPaused: boolean
    pub bump: u8,                    // → bump: number
}
```

### PDA Seeds Mapping
```typescript
// Token Sale PDA: ["token_sale", seller, token_mint]
const [tokenSalePDA] = getTokenSalePDA(seller, tokenMint);

// Token Vault PDA: ["token_vault", token_sale] 
const [tokenVaultPDA] = getTokenVaultPDA(tokenSalePDA);

// Buyer Account PDA: ["buyer", buyer, token_sale]
const [buyerAccountPDA] = getBuyerAccountPDA(buyer, tokenSalePDA);
```

## Testing Instructions

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Connect Wallet**
   - Install Phantom or Solflare wallet
   - Switch to Devnet
   - Get Devnet SOL from faucet
   - Connect to the application

3. **Test Program Connection**
   - Check browser console for "Escrow program initialized successfully"
   - Verify no IDL compatibility errors

4. **Test Sales Fetching**
   - Navigate to marketplace page
   - Check if sales load without errors
   - Verify data displays correctly

5. **Test Token Purchase**
   - Try purchasing tokens from an active sale
   - Verify buyer account creation
   - Check transaction success

## Troubleshooting

### Common Issues

1. **"Cannot use 'in' operator" Error**
   - ✅ Fixed: IDL now uses proper `pubkey` type

2. **"Property 'tokenSale' does not exist" Error**
   - ✅ Fixed: Using type assertions for account access

3. **Provider undefined errors**
   - ✅ Fixed: Added null checks for program provider

4. **BN conversion errors**
   - ✅ Fixed: Proper BN conversion for numeric parameters

### Debug Steps

1. Check browser console for program initialization logs
2. Verify environment variables are set correctly
3. Ensure wallet is connected and on correct network
4. Check Solana Explorer for transaction details
5. Verify account PDAs are generated correctly

## Next Steps

1. **Test the Integration**: Connect your wallet and test the hooks
2. **Add Error Boundaries**: Wrap components with React error boundaries
3. **Add Loading States**: Implement proper loading UIs
4. **Add Validation**: Add input validation for token amounts
5. **Add Monitoring**: Integrate error tracking (Sentry, etc.)

The integration is now complete and should resolve all IDL compatibility issues while providing a robust foundation for your token sale frontend.