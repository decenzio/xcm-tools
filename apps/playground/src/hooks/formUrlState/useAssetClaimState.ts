import { useContext } from 'react';
import { AssetClaimStateContext } from '../../providers/AssetClainState/AssetClaimStateContext';

export const useAssetClaimState = () => {
  const context = useContext(AssetClaimStateContext);

  if (!context) {
    throw new Error(
      'useAssetClaimState must be used within a AssetClaimStateProvider',
    );
  }

  return context;
};
