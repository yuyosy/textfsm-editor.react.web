import { parseRequestDelayAtom } from '@/features/state/storageAtoms';
import { Slider, Stack, Text } from '@mantine/core';
import { useAtom } from 'jotai';

export const ParseDelaySection = () => {
  const [parseDelay, setParseDelay] = useAtom(parseRequestDelayAtom);

  return (
    <Stack gap="xs">
      <Text size="sm" fw={500}>
        Parse Request Delay
      </Text>
      <Text size="xs">Delay before sending parse request (500-5000ms)</Text>
      <Slider
        value={parseDelay}
        onChange={setParseDelay}
        min={500}
        max={5000}
        step={500}
        marks={[
          { value: 500, label: '500' },
          { value: 1000, label: '1,000' },
          { value: 2000, label: '2,000' },
          { value: 3000, label: '3,000' },
          { value: 4000, label: '4,000' },
          { value: 5000, label: '5,000ms' },
        ]}
        label={value => `${value}ms`}
        mx={32}
        my={12}
      />
    </Stack>
  );
};
