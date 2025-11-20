import { TSubstrateChain } from '@paraspell/sdk';
import { TPalletsQuery } from '../../types';
import { createContext } from 'react';

type PalletQueryState = {
  func: TPalletsQuery;
  setFunc: (func: TPalletsQuery) => void;
  chain: TSubstrateChain;
  setChain: (chain: TSubstrateChain) => void;
  pallet: string;
  setPallet: (pallet: string) => void;
  useApi: boolean;
  setUseApi: (useApi: boolean) => void;
};

export const PalletQueryStateContext = createContext<PalletQueryState | null>(
  null,
);
