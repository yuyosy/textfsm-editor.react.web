import { Button, Group, Modal, Stack } from '@mantine/core';

type Props = {
  opened: boolean;
  close: () => void;
};

export const PresetTemplatesModal = ({ opened, close }: Props) => {
  return (
    <>
      <Modal opened={opened} onClose={close} title="PresetTemplates" size="lg">
        <Stack></Stack>
        <Group justify="space-between" mt="lg">
          <Button variant="default" size="xs" onClick={close}>
            Close
          </Button>
        </Group>
      </Modal>
    </>
  );
};
