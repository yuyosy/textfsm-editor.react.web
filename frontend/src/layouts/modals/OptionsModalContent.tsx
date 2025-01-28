import { MutableRefObject, useEffect, useState } from 'react';

import {
  Button,
  Group,
  Modal,
  NumberFormatter,
  Progress,
  Stack,
  Text,
} from '@mantine/core';

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
        <Stack ref={focusRef}>
          <Text size="sm" fw={500}>
            LocalStorage Usage
          </Text>
          <Progress
            value={usagePercentage}
            size="xl"
            color={
              usagePercentage > 90 ? 'red' : usagePercentage > 70 ? 'yellow' : 'blue'
            }
          />
          <Text c="dimmed" size="xs" px={2}>
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
