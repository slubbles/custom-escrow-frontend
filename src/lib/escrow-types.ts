import { IdlAccounts } from '@coral-xyz/anchor';

// Define the program structure without extending Idl
export interface EscrowProgram {
  metadata: {
    name: "escrow";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
}

// Define account types directly
export type TokenSaleAccount = {
  seller: string;
  tokenMint: string;
  paymentMint: string;
  pricePerToken: bigint;
  totalTokensForSale: bigint;
  tokensSold: bigint;
  isActive: boolean;
  bump: number;
};

export type BuyerAccount = {
  buyer: string;
  tokenSale: string;
  tokensPurchased: bigint;
  bump: number;
};