import type { ComboboxItem } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { isRelayChain } from '@paraspell/sdk';
import type { FC } from 'react';
import { useEffect } from 'react';

import type {
  TCurrencyType,
  TCustomCurrencySymbolSpecifier,
} from '../../types';
import type { FormValues } from '../XcmTransfer/XcmTransferForm';
import { CurrencySelectionBase } from './CurrencySelection';

type Props = {
  form: UseFormReturnType<FormValues>;
  currencyOptions: ComboboxItem[];
  index: number;
  title?: string;
};

export const TransferCurrencySelect: FC<Props> = ({
  form,
  currencyOptions,
  index,
  title,
}) => {
  const { from, to, currencies } = form.values;
  const entry = currencies[index];
  const entryPath = `currencies.${index}`;

  const isRelayToPara = isRelayChain(from);
  const isParaToRelay = isRelayChain(to);
  const isNotParaToPara = isRelayToPara || isParaToRelay;

  useEffect(() => {
    if (isNotParaToPara) {
      form.setFieldValue(`${entryPath}.isCustomCurrency`, false);
    }
  }, [isNotParaToPara]);

  return (
    <CurrencySelectionBase
      title={title}
      size={currencies.length > 1 ? 'xs' : 'sm'}
      currencyOptions={currencyOptions}
      selectedCurrencyOptionId={entry.currencyOptionId}
      isCustomCurrency={entry.isCustomCurrency}
      customCurrencyType={entry.customCurrencyType}
      customCurrency={entry.customCurrency}
      customCurrencySymbolSpecifier={entry.customCurrencySymbolSpecifier}
      disableSelect={isRelayToPara}
      showCustomControls={!isNotParaToPara}
      allowOverrideLocation={currencies.length === 1}
      selectKey={`${from}${to}`}
      onCurrencyOptionChange={(value) =>
        form.setFieldValue(`${entryPath}.currencyOptionId`, value)
      }
      onCustomToggleChange={(checked) =>
        form.setFieldValue(`${entryPath}.isCustomCurrency`, checked)
      }
      onCustomTypeChange={(value: TCurrencyType) =>
        form.setFieldValue(`${entryPath}.customCurrencyType`, value)
      }
      onCustomCurrencyChange={(value) =>
        form.setFieldValue(`${entryPath}.customCurrency`, value)
      }
      onCustomSymbolSpecifierChange={(value: TCustomCurrencySymbolSpecifier) =>
        form.setFieldValue(`${entryPath}.customCurrencySymbolSpecifier`, value)
      }
    />
  );
};
