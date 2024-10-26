import { MutableRefObject } from 'react';

import { Button, Group, Modal, Stack } from '@mantine/core';

type ModalContentProps = {
  close: () => void;
  focusRef: MutableRefObject<HTMLDivElement>;
};
export const AboutInfoModalContent = ({ close, focusRef }: ModalContentProps) => {
  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title>About</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <Stack ref={focusRef}></Stack>
        <Group justify="space-between" mt="lg">
          <Button variant="default" size="xs" onClick={close}>
            Close
          </Button>
        </Group>
      </Modal.Body>
    </Modal.Content>
  );
};
