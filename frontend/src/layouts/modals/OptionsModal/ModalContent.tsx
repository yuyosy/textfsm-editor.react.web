import { Button, Divider, Group, Modal, Stack } from '@mantine/core';
import { ParseDelaySection } from './ParseDelaySection';
import { PlatformPrioritySection } from './PlatformPrioritySection';
import { StorageUsageSection } from './StorageUsageSection';
import { ModalContentProps } from './types';

export const OptionsModalContent = ({ close, focusRef }: ModalContentProps) => {
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
          <PlatformPrioritySection />
          <Divider my="lg" />
          <StorageUsageSection />
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
