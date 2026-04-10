import { expect, Page, test } from '@playwright/test';

import {
  enableApiMode,
  selectSdkChain,
  selectSdkCurrency,
  selectSdkDestination,
  selectSdkFunction,
} from './utils/sdkForm';

type AssetCurrencyQueryParams = {
  chain: string;
  destination: string;
  currency: string;
};

type AssetCurrencyQueryOptions = {
  useApi: boolean;
};

const performAssetCurrencyQuery = async (
  page: Page,
  { chain, destination, currency }: AssetCurrencyQueryParams,
  { useApi }: AssetCurrencyQueryOptions,
) => {
  await selectSdkFunction(page, 'ASSET_INFO');
  await selectSdkChain(page, chain);
  await selectSdkDestination(page, destination);
  await selectSdkCurrency(page, currency);
  await enableApiMode(page, useApi);

  await page.getByTestId('submit').click();
  await expect(page.getByTestId('error')).not.toBeVisible();
  await expect(page.getByTestId('output')).toBeVisible();
};

test.describe('XCM SDK - Asset claim', () => {
  const queryCases = [
    {
      chain: 'Acala',
      destination: 'Hydration',
      currency: 'ACA - Native',
    },
    {
      chain: 'Hydration',
      destination: 'Acala',
      currency: 'HDX - Native',
    },
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto('/xcm-sdk/assets');
  });

  queryCases.forEach(({ chain, destination, currency }) => {
    [false, true].forEach((useApi) => {
      const apiLabel = useApi ? ' - API' : '';
      test(`Should succeed for ${chain} asset claim${apiLabel}`, async ({
        page,
      }) => {
        await performAssetCurrencyQuery(
          page,
          { chain, destination, currency },
          { useApi },
        );
      });
    });
  });
});
