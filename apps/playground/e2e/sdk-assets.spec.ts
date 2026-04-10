import { expect, Page, test } from '@playwright/test';

import {
  enableApiMode,
  selectSdkChain,
  selectSdkCurrency,
  selectSdkDestination,
  selectSdkFunction,
} from './utils/sdkForm';
import { TEST_SS58_ADDRESS } from './utils/testData';

type TAssetsQuery =
  | 'ASSETS_OBJECT'
  | 'ASSET_LOCATION'
  | 'ASSET_RESERVE_CHAIN'
  | 'ASSET_INFO'
  | 'RELAYCHAIN_SYMBOL'
  | 'NATIVE_ASSETS'
  | 'OTHER_ASSETS'
  | 'SUPPORTED_ASSETS'
  | 'FEE_ASSETS'
  | 'ALL_SYMBOLS'
  | 'PARA_ID'
  | 'CONVERT_SS58'
  | 'ASSET_BALANCE'
  | 'EXISTENTIAL_DEPOSIT'
  | 'HAS_DRY_RUN_SUPPORT'
  | 'ETHEREUM_BRIDGE_STATUS'
  | 'PARA_ETH_FEES'
  | 'SUPPORTED_DESTINATIONS';

const queriesToTest: TAssetsQuery[] = [
  'ASSETS_OBJECT',
  'ASSET_LOCATION',
  'ASSET_RESERVE_CHAIN',
  'ASSET_INFO',
  'RELAYCHAIN_SYMBOL',
  'NATIVE_ASSETS',
  'OTHER_ASSETS',
  'SUPPORTED_ASSETS',
  'FEE_ASSETS',
  'ALL_SYMBOLS',
  'PARA_ID',
  'CONVERT_SS58',
  'ASSET_BALANCE',
  'EXISTENTIAL_DEPOSIT',
  'HAS_DRY_RUN_SUPPORT',
  'ETHEREUM_BRIDGE_STATUS',
  'PARA_ETH_FEES',
  'SUPPORTED_DESTINATIONS',
];

const performAssetsQueryTest = async (
  page: Page,
  funcName: TAssetsQuery,
  useApi: boolean,
) => {
  const requiresChain = !['ETHEREUM_BRIDGE_STATUS', 'PARA_ETH_FEES'].includes(
    funcName,
  );
  const requiresDestination =
    funcName === 'SUPPORTED_ASSETS' || funcName === 'ASSET_INFO';
  const requiresCurrency = [
    'ASSET_LOCATION',
    'ASSET_RESERVE_CHAIN',
    'ASSET_INFO',
    'ASSET_BALANCE',
    'EXISTENTIAL_DEPOSIT',
    'SUPPORTED_DESTINATIONS',
  ].includes(funcName);
  const requiresAddress = funcName === 'ASSET_BALANCE' || funcName === 'CONVERT_SS58';

  await selectSdkFunction(page, funcName);

  if (requiresChain) {
    await selectSdkChain(page, 'Acala');
  }

  if (requiresDestination) {
    await selectSdkDestination(page, 'Hydration');
  }

  if (requiresCurrency) {
    await selectSdkCurrency(page, 'ACA - Native');
  }

  if (requiresAddress) {
    await page.getByTestId('address-input').fill(TEST_SS58_ADDRESS);
  }

  await enableApiMode(page, useApi);

  await page.getByTestId('submit').click();

  await expect(page.getByTestId('error')).not.toBeVisible();
  await expect(page.getByTestId('output')).toBeVisible();
};

test.describe.configure({ mode: 'parallel' });

test.describe('XCM SDK - Assets', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/xcm-sdk/assets');
  });

  queriesToTest.forEach((funcName) => {
    [false, true].forEach((useApi) => {
      const apiLabel = useApi ? ' - API' : '';
      test(`Should succeed for ${funcName}${apiLabel}`, async ({ page }) => {
        await performAssetsQueryTest(page, funcName, useApi);
      });
    });
  });
});
