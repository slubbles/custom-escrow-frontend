import { PublicKey } from '@solana/web3.js';
import { PDA_SEEDS } from './types';

// Program IDs for both contracts
export const MULTI_PRESALE_PROGRAM_ID = new PublicKey('3n4Jusc6GmZXTJapNbDpr4DYKFSsZUhz2XKuJVL6Kmy5');
export const ESCROW_PROGRAM_ID = new PublicKey('HVpfkkSxd5aiCALZ8CETUxrWBfUwWCtJSxxtUsZhFrt4');

// Legacy alias for backward compatibility
export const PROGRAM_ID = ESCROW_PROGRAM_ID;

export const PLATFORM_FEE_RECIPIENT = new PublicKey('9yWMwzQb47KGTPKBhCkPYDUcprDBTDQgXvTsc1VTZyPE');

/**
 * Generate PDA for platform account (Multi-Presale Program)
 * Seeds: ["platform"]
 */
export function getPlatformPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("platform")],
    MULTI_PRESALE_PROGRAM_ID
  );
}

/**
 * Generate PDA for platform treasury (Multi-Presale Program)
 * Seeds: ["platform_treasury"]
 */
export function getPlatformTreasuryPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("platform_treasury")],
    MULTI_PRESALE_PROGRAM_ID
  );
}

/**
 * Generate PDA for project account (Multi-Presale Program)
 * Seeds: ["project", project_id]
 */
export function getMultiPresaleProjectPDA(projectId: number): [PublicKey, number] {
  const projectIdBuffer = Buffer.alloc(8);
  projectIdBuffer.writeBigUInt64LE(BigInt(projectId), 0);
  
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("project"),
      projectIdBuffer
    ],
    MULTI_PRESALE_PROGRAM_ID
  );
}

/**
 * Generate PDA for sale round (Multi-Presale Program)
 * Seeds: ["sale_round", project_id, round_number]
 */
export function getSaleRoundPDA(projectId: number, roundNumber: number): [PublicKey, number] {
  const projectIdBuffer = Buffer.alloc(8);
  projectIdBuffer.writeBigUInt64LE(BigInt(projectId), 0);
  
  const roundNumberBuffer = Buffer.alloc(8);
  roundNumberBuffer.writeBigUInt64LE(BigInt(roundNumber), 0);
  
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("sale_round"),
      projectIdBuffer,
      roundNumberBuffer
    ],
    MULTI_PRESALE_PROGRAM_ID
  );
}

/**
 * Generate PDA for project vault (Multi-Presale Program)
 * Seeds: ["project_vault", project_id]
 */
export function getProjectVaultPDA(projectId: number): [PublicKey, number] {
  const projectIdBuffer = Buffer.alloc(8);
  projectIdBuffer.writeBigUInt64LE(BigInt(projectId), 0);
  
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("project_vault"),
      projectIdBuffer
    ],
    MULTI_PRESALE_PROGRAM_ID
  );
}

/**
 * Generate PDA for round buyer account (Multi-Presale Program)
 * Seeds: ["round_buyer", project_id, round_number, buyer]
 */
export function getRoundBuyerPDA(projectId: number, roundNumber: number, buyer: PublicKey): [PublicKey, number] {
  const projectIdBuffer = Buffer.alloc(8);
  projectIdBuffer.writeBigUInt64LE(BigInt(projectId), 0);
  
  const roundNumberBuffer = Buffer.alloc(8);
  roundNumberBuffer.writeBigUInt64LE(BigInt(roundNumber), 0);
  
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("round_buyer"),
      projectIdBuffer,
      roundNumberBuffer,
      buyer.toBuffer()
    ],
    MULTI_PRESALE_PROGRAM_ID
  );
}

/**
 * Generate PDA for project whitelist (Multi-Presale Program)
 * Seeds: ["project_whitelist", project_id, round_number]
 */
export function getProjectWhitelistPDA(projectId: number, roundNumber: number): [PublicKey, number] {
  const projectIdBuffer = Buffer.alloc(8);
  projectIdBuffer.writeBigUInt64LE(BigInt(projectId), 0);
  
  const roundNumberBuffer = Buffer.alloc(8);
  roundNumberBuffer.writeBigUInt64LE(BigInt(roundNumber), 0);
  
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("project_whitelist"),
      projectIdBuffer,
      roundNumberBuffer
    ],
    MULTI_PRESALE_PROGRAM_ID
  );
}

// Legacy escrow PDAs (for backward compatibility)
/**
 * Legacy Generate PDA for project account (Escrow Program)
 * Seeds: ["project", creator, slug]
 */
export function getProjectPDA(creator: PublicKey, slug: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(PDA_SEEDS.PROJECT),
      creator.toBuffer(),
      Buffer.from(slug)
    ],
    ESCROW_PROGRAM_ID
  );
}

/**
 * Legacy Generate PDA for token sale account (Escrow Program)
 * Seeds: ["token_sale", project, tier]
 */
export function getTokenSalePDA(project: PublicKey, tier: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(PDA_SEEDS.TOKEN_SALE),
      project.toBuffer(),
      Buffer.from(tier)
    ],
    ESCROW_PROGRAM_ID
  );
}

/**
 * Legacy Generate PDA for token vault account (Escrow Program)
 * Seeds: ["token_vault", token_sale]
 */
export function getTokenVaultPDA(tokenSalePDA: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(PDA_SEEDS.TOKEN_VAULT),
      tokenSalePDA.toBuffer()
    ],
    ESCROW_PROGRAM_ID
  );
}

/**
 * Legacy Generate PDA for buyer account (Escrow Program)
 * Seeds: ["buyer", buyer, project]  
 */
export function getBuyerAccountPDA(buyer: PublicKey, project: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(PDA_SEEDS.BUYER),
      buyer.toBuffer(),
      project.toBuffer()
    ],
    ESCROW_PROGRAM_ID
  );
}

/**
 * Legacy Generate PDA for referral account (Escrow Program)
 * Seeds: ["referral", referrer, project]
 */
export function getReferralAccountPDA(referrer: PublicKey, project: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(PDA_SEEDS.REFERRAL),
      referrer.toBuffer(), 
      project.toBuffer()
    ],
    ESCROW_PROGRAM_ID
  );
}

/**
 * Utility to get all PDAs for a multi-presale project
 */
export function getMultiPresaleProjectPDAs(projectId: number) {
  const [projectPDA, projectBump] = getMultiPresaleProjectPDA(projectId);
  const [projectVaultPDA, projectVaultBump] = getProjectVaultPDA(projectId);
  
  return {
    project: projectPDA,
    projectBump,
    projectVault: projectVaultPDA,
    projectVaultBump,
  };
}

/**
 * Utility to get all PDAs for a sale round
 */
export function getSaleRoundPDAs(projectId: number, roundNumber: number) {
  const [saleRoundPDA, saleRoundBump] = getSaleRoundPDA(projectId, roundNumber);
  const [whitelistPDA, whitelistBump] = getProjectWhitelistPDA(projectId, roundNumber);
  
  return {
    saleRound: saleRoundPDA,
    saleRoundBump,
    whitelist: whitelistPDA,
    whitelistBump,
  };
}

/**
 * Legacy utility to get all PDAs for a token sale
 */
export function getTokenSalePDAs(project: PublicKey, tier: string) {
  const [tokenSalePDA, tokenSaleBump] = getTokenSalePDA(project, tier);
  const [tokenVaultPDA, tokenVaultBump] = getTokenVaultPDA(tokenSalePDA);
  
  return {
    tokenSale: tokenSalePDA,
    tokenSaleBump,
    tokenVault: tokenVaultPDA,
    tokenVaultBump,
  };
}

/**
 * Legacy utility to get buyer-specific PDAs
 */
export function getBuyerPDAs(buyer: PublicKey, tokenSalePDA: PublicKey) {
  const [buyerAccountPDA, buyerAccountBump] = getBuyerAccountPDA(buyer, tokenSalePDA);
  
  return {
    buyerAccount: buyerAccountPDA,
    buyerAccountBump,
  };
}