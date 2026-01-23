// src/features/wallet/types.ts

export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface WalletState {
  status: WalletStatus;
  address: string | null;
  error: string | null;
}

export interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
}
