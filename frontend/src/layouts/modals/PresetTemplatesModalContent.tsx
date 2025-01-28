import { MutableRefObject } from 'react';

import { Button, Group, Modal, Stack, Text } from '@mantine/core';

type ModalContentProps = {
  close: () => void;
  focusRef: MutableRefObject<HTMLDivElement>;
};
export const PresetTemplatesModalContent = ({ close, focusRef }: ModalContentProps) => {
  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title fz={18} fw={700}>
          Preset Templates
        </Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <Stack ref={focusRef}>
          <Text>Experimental feature.</Text>
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
