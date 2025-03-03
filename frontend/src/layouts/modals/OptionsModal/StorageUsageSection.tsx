import { useEffect, useState } from 'react';

import {
  Anchor,
  Blockquote,
  Flex,
  NumberFormatter,
  Progress,
  Stack,
  Text,
} from '@mantine/core';
import { Info, SquareArrowOutUpRight } from 'lucide-react';

const calculateLocalStorageUsage = () => {
  let total = 0;
  Object.keys(localStorage).forEach(key => {
    total += localStorage[key].length + key.length;
  });
  return total / (1024 * 1024);
};

export const StorageUsageSection = () => {
  const storageLimit = 5;
  const [storageUsage, setStorageUsage] = useState(0);

  const usagePercentage = (storageUsage / storageLimit) * 100;

  useEffect(() => {
    setStorageUsage(calculateLocalStorageUsage());
  }, []);

  return (
    <Stack gap="xs">
      <Text size="sm" fw={500}>
        LocalStorage Usage
      </Text>
      <Text size="xs">
        Saved templates data and settings data are stored in LocalStorage.
      </Text>
      <Progress
        value={usagePercentage}
        size="xl"
        color={usagePercentage > 90 ? 'red' : usagePercentage > 70 ? 'yellow' : 'blue'}
        mx={32}
      />
      <Text size="xs" px={2} mx={32}>
        <NumberFormatter
          thousandSeparator
          value={storageUsage}
          decimalScale={2}
          fixedDecimalScale
          suffix="MB"
        />
        {' / '}
        <NumberFormatter
          thousandSeparator
          value={storageLimit}
          decimalScale={2}
          fixedDecimalScale
          suffix="MB"
        />{' '}
        <NumberFormatter
          thousandSeparator
          value={usagePercentage}
          decimalScale={1}
          fixedDecimalScale
          prefix=" ("
          suffix="%)"
        />{' '}
        used
      </Text>
      <Blockquote color="blue" icon={<Info size={14} />} iconSize={30} py={8} mx={8}>
        <Text size="xs">
          Data entered in the Data Editor and Template Editor is stored in SessionStorage
          and retained until the tab is closed.
        </Text>
        <Anchor
          href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API"
          target="_blank"
          size="xs"
        >
          <Flex align="center" gap={4}>
            Learn more about SessionStorage and LocalStorage
            <SquareArrowOutUpRight size={12} />
          </Flex>
        </Anchor>
      </Blockquote>
    </Stack>
  );
};
