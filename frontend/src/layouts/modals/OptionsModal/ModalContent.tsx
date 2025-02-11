import { Button, Divider, Group, Modal, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ParseDelaySection } from './ParseDelaySection';
import { StorageUsageSection } from './StorageUsageSection';
import { ModalContentProps } from './types';

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
        <Stack ref={focusRef} p={8} gap="md">
          <ParseDelaySection />
          <Divider my="lg" />
          <StorageUsageSection
            storageUsage={storageUsage}
            storageLimit={storageLimit}
            usagePercentage={usagePercentage}
          />
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
