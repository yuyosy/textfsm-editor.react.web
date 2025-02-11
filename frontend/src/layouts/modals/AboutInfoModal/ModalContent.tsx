import { Button, Group, Modal, Stack } from '@mantine/core';
import { AboutSection } from './AboutSection';
import { ReferencesSection } from './ReferencesSection';
import { RelatedLinksSection } from './RelatedLinksSection';
import { ModalContentProps } from './types';

export const AboutInfoModalContent = ({ close, focusRef }: ModalContentProps) => {
  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title fz={18} fw={700}>
          About
        </Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <Stack ref={focusRef} p={8} gap="md">
          <AboutSection />
          <RelatedLinksSection />
          <ReferencesSection />
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
