import type { ComboboxItem } from '@mantine/core';
import {
  Checkbox,
  Group,
  JsonInput,
  SegmentedControl,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import type { FC } from 'react';

import type {
  TCurrencyType,
  TCustomCurrencySymbolSpecifier,
} from '../../types';
import {
  isCustomCurrencySymbolSpecifier,
  isCustomCurrencyType,
} from '../../utils/parsers';

type Props = {
  title?: string;
  size: 'xs' | 'sm';
  currencyOptions: ComboboxItem[];

  selectedCurrencyOptionId: string;
  isCustomCurrency: boolean;
  customCurrencyType?: TCurrencyType;
  customCurrency: string;
  customCurrencySymbolSpecifier?: TCustomCurrencySymbolSpecifier;

  disableSelect: boolean;
  showCustomControls: boolean;
  allowOverrideLocation: boolean;
  selectKey?: string;

  onCurrencyOptionChange: (value: string | null) => void;
  onCustomToggleChange: (checked: boolean) => void;
  onCustomTypeChange: (value: TCurrencyType) => void;
  onCustomCurrencyChange: (value?: string) => void;
  onCustomSymbolSpecifierChange: (
    value: TCustomCurrencySymbolSpecifier,
  ) => void;
};

export const CurrencySelectionBase: FC<Props> = ({
  title,
  size,
  currencyOptions,
  selectedCurrencyOptionId,
  isCustomCurrency,
  customCurrencyType,
  customCurrency,
  customCurrencySymbolSpecifier,
  disableSelect,
  showCustomControls,
  allowOverrideLocation,
  selectKey,
  onCurrencyOptionChange,
  onCustomToggleChange,
  onCustomTypeChange,
  onCustomCurrencyChange,
  onCustomSymbolSpecifierChange,
}) => {
  const customTypeOptions = [
    { label: 'Asset ID', value: 'id' },
    { label: 'Symbol', value: 'symbol' },
    { label: 'Location', value: 'location' },
    ...(allowOverrideLocation
      ? [{ label: 'Override location', value: 'overridenLocation' }]
      : []),
  ];

  const symbolSpecifierOptions = [
    { label: 'Auto', value: 'auto' },
    { label: 'Native', value: 'native' },
    { label: 'Foreign', value: 'foreign' },
    { label: 'Foreign abstract', value: 'foreignAbstract' },
  ];

  return (
    <Stack gap="xs">
      {isCustomCurrency &&
        (customCurrencyType === 'id' || customCurrencyType === 'symbol') && (
          <TextInput
            size={size}
            label={title ?? 'Custom currency'}
            placeholder={customCurrencyType === 'id' ? 'Asset ID' : 'Symbol'}
            required
            value={customCurrency}
            onChange={(event) =>
              onCustomCurrencyChange(event.currentTarget.value)
            }
          />
        )}

      {isCustomCurrency && customCurrencyType === 'location' && (
        <JsonInput
          size={size}
          placeholder="Input JSON location or interior junctions"
          formatOnBlur
          autosize
          minRows={10}
          value={customCurrency}
          onChange={onCustomCurrencyChange}
        />
      )}

      {isCustomCurrency && customCurrencyType === 'overridenLocation' && (
        <JsonInput
          size={size}
          placeholder="Provide the JSON location to override the default configuration"
          formatOnBlur
          autosize
          minRows={10}
          value={customCurrency}
          onChange={onCustomCurrencyChange}
        />
      )}

      {!isCustomCurrency && (
        <Select
          key={selectKey}
          size={size}
          label={title ?? 'Currency'}
          placeholder="Pick value"
          data={currencyOptions}
          allowDeselect={false}
          disabled={disableSelect}
          searchable
          required
          data-testid="select-currency"
          value={selectedCurrencyOptionId}
          onChange={(value) => onCurrencyOptionChange(value)}
        />
      )}

      {showCustomControls && (
        <Group>
          <Group>
            <Checkbox
              size="xs"
              label="Select custom asset"
              checked={isCustomCurrency}
              onChange={(event) =>
                onCustomToggleChange(event.currentTarget.checked)
              }
            />
          </Group>

          <Stack gap={8}>
            {isCustomCurrency && (
              <SegmentedControl
                size="xs"
                data={customTypeOptions}
                value={customCurrencyType}
                onChange={(value) => {
                  if (isCustomCurrencyType(value)) {
                    onCustomTypeChange(value);
                    onCustomCurrencyChange('');
                  }
                }}
              />
            )}

            {isCustomCurrency && customCurrencyType === 'symbol' && (
              <SegmentedControl
                size="xs"
                w="100%"
                data={symbolSpecifierOptions}
                value={customCurrencySymbolSpecifier}
                onChange={(value) => {
                  if (isCustomCurrencySymbolSpecifier(value)) {
                    onCustomSymbolSpecifierChange(value);
                  }
                }}
              />
            )}
          </Stack>
        </Group>
      )}
    </Stack>
  );
};
