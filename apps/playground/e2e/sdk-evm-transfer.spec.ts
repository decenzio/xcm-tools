import path from 'path';
import { fileURLToPath } from 'url';

import { BrowserContext, chromium, expect, Page, test } from '@playwright/test';

import { MetamaskExtensionPage } from './pom';
import { TEST_MNEMONIC, TEST_SS58_ADDRESS } from './utils/testData';
import { acknowledgeTransferWarningIfOpened } from './utils/transferWarningModal';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const metamaskExtensionPath = path.join(
  __dirname,
  'extensions',
  'metamask-ext',
);

const metamaskAccount = {
  mnemonic: TEST_MNEMONIC,
  password: '1234qwerty',
  ethAddress: '0xbbb10bb8048630bc30c8f33c5c96ac9577990c16',
};

const baseUiTest = test.extend({
  context: async ({}, use) => {
    const launchOptions = {
      devtools: false,
      headless: false,
      args: [
        `--disable-extensions-except=${metamaskExtensionPath}`,
        `--load-extension=${metamaskExtensionPath}`,
      ],
    };
    const context = await chromium.launchPersistentContext('', launchOptions);
    await use(context);
  },
});

const setupMetamaskExtension = async (context: BrowserContext) => {
  const appPage = await context.newPage();
  await appPage.goto('/');
  await appPage.waitForTimeout(2000);
  // Close Metamask welcome page
  context.pages()[2].close();
  const extensionPage = new MetamaskExtensionPage(await context.newPage());
  await extensionPage.connectAccountByExtension(
    metamaskAccount.mnemonic,
    metamaskAccount.password,
  );

  await appPage.bringToFront();

  await appPage.goto('/xcm-sdk/evm-transfer');

  await appPage.getByTestId('btn-connect-eth-wallet').click();
  await appPage.getByRole('button', { name: 'Metamask' }).click();

  await extensionPage.page.bringToFront();
  await extensionPage.reload();
  await extensionPage.connectToTheSite();
  await appPage.waitForTimeout(2000);
  await appPage.bringToFront();
  await appPage.getByTestId('btn-select-eth-account').click();

  return { appPage };
};

const ensureEthAccountSelected = async (appPage: Page) => {
  const connectWalletButton = appPage.getByTestId('btn-connect-eth-wallet');
  await expect(connectWalletButton).toBeVisible();

  const connectButtonText = (await connectWalletButton.innerText()).trim();
  if (/^Connected:/.test(connectButtonText)) {
    return;
  }

  await connectWalletButton.click();
  await appPage.getByRole('button', { name: 'Metamask' }).click();
  await appPage.getByTestId('btn-select-eth-account').first().click();
};

const performTransfer = async (appPage: Page) => {
  await appPage.getByTestId('input-address').fill(TEST_SS58_ADDRESS);

  await appPage.getByTestId('select-currency').click();
  await appPage.getByRole('option').first().click();

  await appPage.getByTestId('submit').click();
  await acknowledgeTransferWarningIfOpened(appPage);
  const errorLocator = appPage.getByTestId('error');
  await expect(errorLocator).toBeVisible({ timeout: 15_000 });

  const errorRegex = new RegExp(
    '(' +
      'ErrorToken .* not supported' +
      '|' +
      'Failed to validate send: ERC20 token balance insufficient for transfer.' +
      '|' +
      'Insufficient ETH balance to pay fees.' +
      '|' +
      'Beneficiary does not hold existential deposit on destination.' +
      '|' +
      'The amount transferred is greater than the users token balance.' +
      '|' +
      'The Snowbridge gateway contract needs to approved as a spender for this token and amount.' +
    ')',
  );

  await expect(errorLocator).toContainText(errorRegex);
  await expect(appPage.getByTestId('output')).not.toBeVisible();
};

baseUiTest.describe('XCM SDK - ETH Bridge', () => {
  let appPage: Page;

  baseUiTest.beforeAll(async ({ context }) => {
    ({ appPage } = await setupMetamaskExtension(context));
  });

  baseUiTest.beforeEach(async () => {
    await appPage.goto('/xcm-sdk/evm-transfer');
    await ensureEthAccountSelected(appPage);

    const pjsApiSelector = appPage.getByTestId('label-pjs-api').first();
    await expect(pjsApiSelector).toBeVisible({ timeout: 10_000 });
    await pjsApiSelector.click();

    const viemSwitch = appPage.getByTestId('switch-api');
    await expect(viemSwitch).toBeVisible();
    if (await viemSwitch.isChecked()) {
      await viemSwitch.uncheck();
    }
  });

  baseUiTest('Should transfer from Ethereum to Polkadot - PJS', async () => {
    await performTransfer(appPage);
  });
});
