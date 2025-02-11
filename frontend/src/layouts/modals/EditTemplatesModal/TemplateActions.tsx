import { Button, Group } from '@mantine/core';
import { ChangesState } from './types';

type TemplateActionsProps = {
  handleModalClose: () => void;
  discardChanges: () => void;
  saveChanges: () => void;
  modifications: ChangesState;
};

export const TemplateActions = ({
  handleModalClose,
  discardChanges,
  saveChanges,
  modifications,
}: TemplateActionsProps) => {
  return (
    <Group justify="space-between">
      <Button variant="default" size="xs" onClick={handleModalClose}>
        Close
      </Button>
      <Group>
        <Button
          variant="default"
          size="xs"
          onClick={discardChanges}
          disabled={
            !(
              modifications.orderChanged ||
              modifications.deleteCount > 0 ||
              modifications.renameCount > 0
            )
          }
        >
          Discard Changes
        </Button>
        <Button
          size="xs"
          color="cyan"
          onClick={saveChanges}
          disabled={
            !(
              modifications.orderChanged ||
              modifications.deleteCount > 0 ||
              modifications.renameCount > 0
            )
          }
        >
          Apply
        </Button>
      </Group>
    </Group>
  );
};
