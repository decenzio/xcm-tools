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

export type TCustomCurrencyType =
  | 'id'
  | 'symbol'
  | 'location'
  | 'overridenLocation';

export type TCustomCurrencySymbolSpecifier =
  | 'auto'
  | 'native'
  | 'foreign'
  | 'foreignAbstract';

const isCustomCurrencyType = (value: string): value is TCustomCurrencyType =>
  value === 'id' ||
  value === 'symbol' ||
  value === 'location' ||
  value === 'overridenLocation';

const isCustomCurrencySymbolSpecifier = (
  value: string,
): value is TCustomCurrencySymbolSpecifier =>
  value === 'auto' ||
  value === 'native' ||
  value === 'foreign' ||
  value === 'foreignAbstract';

type Props = {
  title?: string;
  size: 'xs' | 'sm';
  currencyOptions: ComboboxItem[];

  selectedCurrencyOptionId: string;
  isCustomCurrency: boolean;
  customCurrencyType?: TCustomCurrencyType;
  customCurrency: string;
  customCurrencySymbolSpecifier?: TCustomCurrencySymbolSpecifier;

  disableSelect: boolean;
  showCustomControls: boolean;
  allowOverrideLocation: boolean;
  selectKey?: string;

  onCurrencyOptionChange: (value: string | null) => void;
  onCustomToggleChange: (checked: boolean) => void;
  onCustomTypeChange: (value: TCustomCurrencyType) => void;
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
  const customTypeOptions: { label: string; value: TCustomCurrencyType }[] = [
    { label: 'Asset ID', value: 'id' },
    { label: 'Symbol', value: 'symbol' },
    { label: 'Location', value: 'location' },
    ...(allowOverrideLocation
      ? [{ label: 'Override location', value: 'overridenLocation' as const }]
      : []),
  ];

  const symbolSpecifierOptions: { label: string; value: TCustomCurrencySymbolSpecifier }[] = [
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
            label="Custom currency"
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
