import { Button, Divider, Group, Stack } from '@mantine/core';

import { TransferList } from '@/components/TransferList';

import { SelectTemplatesSectionProps } from './types';

export const SelectTemplatesSection = ({
  close,
  proceedToNextStep,
  exportTemplates,
}: SelectTemplatesSectionProps) => {
  const {
    selectedTemplateNames,
    initialLeftData,
    initialRightData,
    handleTransferChange,
  } = exportTemplates;

  return (
    <Stack p={8}>
      <Divider my="sm" />
      <TransferList
        initialLeftData={initialLeftData}
        initialRightData={initialRightData}
        leftSearchPlaceholder="Search unselected templates..."
        rightSearchPlaceholder="Search selected templates..."
        onChange={handleTransferChange}
      />
      <Group justify="space-between" mt="lg">
        <Button variant="default" size="xs" onClick={close}>
          Close
        </Button>
        <Button
          size="xs"
          onClick={proceedToNextStep}
          disabled={!selectedTemplateNames.length}
        >
          Next step
        </Button>
      </Group>
    </Stack>
  );
};
