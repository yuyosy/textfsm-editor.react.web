import { parseRequestDelayAtom } from '@/features/state/storageAtoms';
import {
  Anchor,
  Blockquote,
  Button,
  Divider,
  Flex,
  Group,
  Modal,
  NumberFormatter,
  Progress,
  Slider,
  Stack,
  Text,
} from '@mantine/core';
import { useAtom } from 'jotai';
import { Info, SquareArrowOutUpRight } from 'lucide-react';
import { MutableRefObject, useEffect, useState } from 'react';

type ModalContentProps = {
  close: () => void;
  focusRef: MutableRefObject<HTMLDivElement>;
};

const calculateLocalStorageUsage = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total / (1024 * 1024);
};

export const OptionsModalContent = ({ close, focusRef }: ModalContentProps) => {
  const [storageUsage, setStorageUsage] = useState(0);
  const [parseDelay, setParseDelay] = useAtom(parseRequestDelayAtom);
  const storageLimit = 5;

  useEffect(() => {
    setStorageUsage(calculateLocalStorageUsage());
  }, []);

  const usagePercentage = (storageUsage / storageLimit) * 100;

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title fz={18} fw={700}>
          Options
        </Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <Stack ref={focusRef} gap="md">
          {/* Parse Delay Section */}
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
          <Divider my="lg" />
          {/* Storage Usage Section */}
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
              color={
                usagePercentage > 90 ? 'red' : usagePercentage > 70 ? 'yellow' : 'blue'
              }
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
            <Blockquote color="blue" icon={<Info size={14} />} iconSize={30} py={8}>
              <Text size="xs">
                The data entered into the data editor and template editor is stored in
                SessionStorage and retained until the tab is closed.{' '}
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
        </Stack>
        <Group justify="space-between" mt="lg">
          <Button variant="default" size="xs" onClick={close}>
            Close
          </Button>
        </Group>
      </Modal.Body>
    </Modal.Content>
  );
};
