import { MutableRefObject } from 'react';

import { Button, Group, Modal, Stack, Text, Title } from '@mantine/core';

type ModalContentProps = {
  close: () => void;
  focusRef: MutableRefObject<HTMLDivElement>;
};
export const PresetTemplatesModalContent = ({ close, focusRef }: ModalContentProps) => {
  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title>
          <Title order={4}>Preset Templates</Title>
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
