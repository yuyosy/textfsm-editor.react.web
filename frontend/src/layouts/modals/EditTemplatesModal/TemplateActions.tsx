import { Button, Group } from '@mantine/core';

type TemplateActionsProps = {
  handleModalClose: () => void;
  discardChanges: () => void;
  saveChanges: () => void;
  hasModifications: boolean;
};

export const TemplateActions = ({
  handleModalClose,
  discardChanges,
  saveChanges,
  hasModifications,
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
          disabled={!hasModifications}
        >
          Discard Changes
        </Button>
        <Button
          size="xs"
          color="cyan"
          onClick={saveChanges}
          disabled={!hasModifications}
        >
          Apply
        </Button>
      </Group>
    </Group>
  );
};
