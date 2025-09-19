import { PublicKey } from '@solana/web3.js';
import { PDA_SEEDS } from './types';

// Program ID for the escrow contract
export const PROGRAM_ID = new PublicKey('HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4');
export const PLATFORM_FEE_RECIPIENT = new PublicKey('9yWMwzQb47KGTPKBhCkPYDUcprDBTDQgXvTsc1VTZyPE');

/**
 * Generate PDA for token sale account
 * Seeds: ["token_sale", seller, token_mint]
 */
export function getTokenSalePDA(seller: PublicKey, tokenMint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(PDA_SEEDS.TOKEN_SALE),
      seller.toBuffer(),
      tokenMint.toBuffer()
    ],
    PROGRAM_ID
  );
}

/**
 * Generate PDA for token vault account  
 * Seeds: ["token_vault", token_sale]
 */
export function getTokenVaultPDA(tokenSalePDA: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(PDA_SEEDS.TOKEN_VAULT),
      tokenSalePDA.toBuffer()
    ],
    PROGRAM_ID
  );
}

/**
 * Generate PDA for buyer account
 * Seeds: ["buyer", buyer, token_sale]  
 */
export function getBuyerAccountPDA(buyer: PublicKey, tokenSalePDA: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(PDA_SEEDS.BUYER),
      buyer.toBuffer(),
      tokenSalePDA.toBuffer()
    ],
    PROGRAM_ID
  );
}

/**
 * Utility to get all PDAs for a token sale
 */
export function getTokenSalePDAs(seller: PublicKey, tokenMint: PublicKey) {
  const [tokenSalePDA, tokenSaleBump] = getTokenSalePDA(seller, tokenMint);
  const [tokenVaultPDA, tokenVaultBump] = getTokenVaultPDA(tokenSalePDA);
  
  return {
    tokenSale: tokenSalePDA,
    tokenSaleBump,
    tokenVault: tokenVaultPDA,
    tokenVaultBump,
  };
}

/**
 * Utility to get buyer-specific PDAs
 */
export function getBuyerPDAs(buyer: PublicKey, tokenSalePDA: PublicKey) {
  const [buyerAccountPDA, buyerAccountBump] = getBuyerAccountPDA(buyer, tokenSalePDA);
  
  return {
    buyerAccount: buyerAccountPDA,
    buyerAccountBump,
  };
}