import React from 'react';

import { Checkbox, NumberInput, Stack, Text } from '@mantine/core';
import { useAtom } from 'jotai';

import {
  historyAutoSaveCountAtom,
  historyAutoSaveEnabledAtom,
} from '@/features/state/storageAtoms';

export const HistoryAutoSaveSection: React.FC = () => {
  const [enabled, setEnabled] = useAtom(historyAutoSaveEnabledAtom);
  const [saveCount, setSaveCount] = useAtom(historyAutoSaveCountAtom);

  return (
    <Stack gap="xs">
      <Text size="sm" fw={500}>
        History Auto Save Options
      </Text>
      <Text size="xs">
        Configure the settings to temporarily save the template, data, and results during
        editor editing.
      </Text>{' '}
      <Text size="xs" c="dimmed">
        Histories are saved in Localstorage. The saved history will be automatically
        deleted after the specified number of histories.
      </Text>
      <Checkbox
        label="Enable auto save"
        checked={enabled}
        onChange={event => setEnabled(event.currentTarget.checked)}
      />
      <NumberInput
        label="Number of histories to auto save"
        min={1}
        max={300}
        value={saveCount}
        onChange={value =>
          setSaveCount(typeof value === 'string' ? parseInt(value, 10) || 0 : value || 0)
        }
        disabled={!enabled}
        allowDecimal={false}
        allowNegative={false}
      />
    </Stack>
  );
};
