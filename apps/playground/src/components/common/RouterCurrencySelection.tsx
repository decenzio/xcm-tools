import type { ComboboxItem } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import type { TChain } from '@paraspell/sdk';
import { isRelayChain } from '@paraspell/sdk';
import type { FC } from 'react';
import { useEffect } from 'react';

import type { TRouterFormValues } from '../XcmRouter/XcmRouterForm';
import type {
  TCustomCurrencySymbolSpecifier} from './CurrencySelection';
import {
  CurrencySelectionBase
} from './CurrencySelection';

type Props = {
  form: UseFormReturnType<TRouterFormValues>;
  currencyOptions: ComboboxItem[];
  path: 'currencyFromOption' | 'currencyToOption';
  title?: string;
};

export const RouterCurrencySelect: FC<Props> = ({
  form,
  currencyOptions,
  path,
  title,
}) => {
  const { from, to } = form.values;
  const entry = form.values[path];

  const fromIsRelay = from ? isRelayChain(from as TChain) : false;
  const toIsRelay = to ? isRelayChain(to) : false;
  const isNotParaToPara = fromIsRelay || toIsRelay;

  useEffect(() => {
    if (!entry.customCurrencyType) return;
    form.setFieldValue(`${path}.customCurrency`, '');
  }, [entry.customCurrencyType]);

  useEffect(() => {
    if (isNotParaToPara) {
      form.setFieldValue(`${path}.isCustomCurrency`, false);
    }
  }, [isNotParaToPara]);

  const nullToEmpty = (value: string | null | undefined) => value ?? '';

  return (
    <CurrencySelectionBase
      title={title}
      size="sm"
      currencyOptions={currencyOptions}
      selectedCurrencyOptionId={entry.currencyOptionId}
      isCustomCurrency={entry.isCustomCurrency}
      customCurrencyType={entry.customCurrencyType}
      customCurrency={entry.customCurrency}
      customCurrencySymbolSpecifier={entry.customCurrencySymbolSpecifier}
      disableSelect={fromIsRelay}
      showCustomControls={!isNotParaToPara}
      allowOverrideLocation={false}
      selectKey={`${from}${to}${path}`}
      onCurrencyOptionChange={(value) =>
        form.setFieldValue(`${path}.currencyOptionId`, nullToEmpty(value))
      }
      onCustomToggleChange={(checked) =>
        form.setFieldValue(`${path}.isCustomCurrency`, checked)
      }
      onCustomTypeChange={(value) =>
        form.setFieldValue(`${path}.customCurrencyType`, value)
      }
      onCustomCurrencyChange={(value) =>
        form.setFieldValue(`${path}.customCurrency`, nullToEmpty(value))
      }
      onCustomSymbolSpecifierChange={(value: TCustomCurrencySymbolSpecifier) =>
        form.setFieldValue(`${path}.customCurrencySymbolSpecifier`, value)
      }
    />
  );
};
