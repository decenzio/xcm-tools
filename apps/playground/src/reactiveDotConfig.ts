import { defineConfig } from '@reactive-dot/core';
import { InjectedWalletProvider } from '@reactive-dot/core/wallets.js';
import { LedgerWallet } from '@reactive-dot/wallet-ledger';
import { MimirWalletProvider } from '@reactive-dot/wallet-mimir';

import {
  findNativeAssetInfoOrThrow,
} from '@paraspell/sdk';
import { useQueryStates } from 'nuqs';
import { parseAsSubstrateChain } from './utils/parsers';

type LedgerNetworkInfo = {
  tokenSymbol: string;
  tokenDecimals: number;
};

const FALLBACK: LedgerNetworkInfo = {
  tokenSymbol: 'DOT',
  tokenDecimals: 10,
};

export const resolveLedgerNetworkInfo = (): LedgerNetworkInfo => {
  const [queryState] = useQueryStates({
    from: parseAsSubstrateChain,
}, {shallow: true});

  const fromChain = queryState.from;
  if (!fromChain) return FALLBACK;

  try {
    const native = findNativeAssetInfoOrThrow(fromChain);
    return {
      tokenSymbol: native.symbol,
      tokenDecimals: native.decimals,
    };
  } catch {
    return FALLBACK;
  }
};

export const config = defineConfig({
  chains: {},
  includeEvmAccounts: true,
  wallets: [
    new InjectedWalletProvider(),
    new LedgerWallet({
      unstable_getNetworkInfo: async () => resolveLedgerNetworkInfo(),
    }),
    new MimirWalletProvider(),
  ],
});
