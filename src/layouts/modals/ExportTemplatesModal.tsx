import { Button, Group, Modal, Stack } from '@mantine/core';

type Props = {
  opened: boolean;
  close: () => void;
};

export const ExportTemplatesModal = ({ opened, close }: Props) => {
  const tempFunc = () => {
    console.log('---');
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Export Templates">
        <Stack>...</Stack>
        <Group position="apart" mt="lg">
          <Button variant="default" size="xs" onClick={close}>
            Close
          </Button>
          <Button size="xs" color="cyan" onClick={tempFunc}>
            Done
          </Button>
        </Group>
      </Modal>
    </>
  );
};