'use client';

import { createContext, ReactNode, useMemo, useCallback } from 'react';
import { http, createConfig, WagmiProvider, useAccount, useConnect, useDisconnect } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { WalletContextType, WalletStatus } from './types';

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export const WalletContext = createContext<WalletContextType | null>(null);

const WalletProviderContent = ({ children }: { children: ReactNode }) => {
  const { address, status: wagmiStatus } = useAccount();
  const { connectors, connect, error: connectError, status: connectStatus } = useConnect();
  const { disconnect } = useDisconnect();

  const status: WalletStatus = useMemo(() => {
    if (connectStatus === 'pending' || wagmiStatus === 'connecting' || wagmiStatus === 'reconnecting') {
      return 'connecting';
    }
    if (connectStatus === 'error' || !!connectError) {
      return 'error';
    }
    if (wagmiStatus === 'connected') {
      return 'connected';
    }
    return 'disconnected';
  }, [wagmiStatus, connectStatus, connectError]);

  const connectWallet = useCallback(async () => {
    const injectedConnector = connectors.find(c => c.id === 'injected');
    if (injectedConnector) {
      await connect({ connector: injectedConnector });
    } else {
      // Handle case where injected connector is not available
      // Maybe open a modal with a link to MetaMask website
      console.error("Injected connector not found, please install MetaMask");
    }
  }, [connect, connectors]);

  const contextValue: WalletContextType = useMemo(
    () => ({
      status,
      address: address || null,
      error: connectError ? connectError.message : null,
      connect: connectWallet,
      disconnect,
    }),
    [status, address, connectError, connectWallet, disconnect]
  );

  return <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletProviderContent>{children}</WalletProviderContent>
      </QueryClientProvider>
    </WagmiProvider>
  );
};