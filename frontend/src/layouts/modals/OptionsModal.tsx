import { Button, Group, Modal, Stack } from '@mantine/core';
import { useFocusWithin } from '@mantine/hooks';

type Props = {
  opened: boolean;
  close: () => void;
};

export const OptionsModal = ({ opened, close }: Props) => {
  const { ref: focusRef, focused } = useFocusWithin();
  return (
    <>
      <Modal
        title="Options"
        opened={opened}
        onClose={close}
        closeOnEscape={!focused}
        size="lg"
      >
        <Stack ref={focusRef}></Stack>
        <Group justify="space-between" mt="lg">
          <Button variant="default" size="xs" onClick={close}>
            Close
          </Button>
        </Group>
      </Modal>
    </>
  );
};
