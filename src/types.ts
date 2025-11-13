// x402 Protocol Types (standalone - no external dependencies)

export interface PaymentPayload {
  x402Version: number;
  scheme: "exact" | "upto" | "deferred";
  network: string;
  payload: Record<string, unknown>;
}

export interface PaymentRequirements {
  scheme: "exact" | "upto" | "deferred";
  network: string;
  maxAmountRequired: string;
  payTo: string;
  resource: string;
  asset?: string;
  nonce?: string;
  validUntil?: number;
}

export interface VerifyRequest {
  x402Version: number;
  paymentPayload: PaymentPayload;
  paymentRequirements: PaymentRequirements;
}

export interface VerifyResponse {
  isValid: boolean;
  payer?: string;
  error?: string;
}

export interface SettleRequest {
  x402Version: number;
  paymentPayload: PaymentPayload;
  paymentRequirements: PaymentRequirements;
}

export interface SettleResponse {
  isValid: boolean;
  payer?: string;
  transactionHash?: string;
  error?: string;
}

export interface HealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  uptime: number;
  version: string;
  network: string;
  blockHeight?: number;
}

export interface SupportedNetwork {
  network: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
}

export interface SupportedAsset {
  symbol: string;
  name: string;
  contractAddress: string;
  decimals: number;
  network: string;
}

export interface SupportedResponse {
  networks: SupportedNetwork[];
  paymentSchemes: string[];
  assets: SupportedAsset[];
  capabilities: string[];
}

// Additional SDK-specific types
export interface KovaConfig {
  facilitatorUrl: string;
  network: 'solana-mainnet' | 'solana-devnet' | 'base-mainnet' | 'base-sepolia' | 'bsc-mainnet' | 'bsc-testnet' | 'bitcoin-mainnet' | 'bitcoin-testnet';
  maxPaymentAmount?: bigint;
}

export interface WalletAdapter {
  publicKey: { toBase58(): string };
  signTransaction<T>(transaction: T): Promise<T>;
}

export interface PaymentHandler {
  extractPayment(headers: Headers | Record<string, string | string[] | undefined>): {
    x402Version: number;
    paymentPayload: PaymentPayload;
    paymentRequirements: PaymentRequirements;
  } | null;
  createPaymentRequirements(config: {
    amount: string;
    resource: string;
    asset?: string;
    description?: string;
  }): Promise<PaymentRequirements>;
  verifyPayment(
    payment: { paymentPayload: PaymentPayload; paymentRequirements: PaymentRequirements },
    requirements: PaymentRequirements
  ): Promise<boolean>;
  settlePayment(
    payment: { paymentPayload: PaymentPayload; paymentRequirements: PaymentRequirements },
    requirements: PaymentRequirements
  ): Promise<SettleResponse>;
  create402Response(requirements: PaymentRequirements): {
    status: number;
    body: {
      error: string;
      x402Version: number;
      paymentRequirements: PaymentRequirements;
    };
  };
}
