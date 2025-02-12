import { TransferList } from '@/components/TransferList';
import { Divider, List, Stack } from '@mantine/core';

interface ImportSelectionSectionProps {
  availableTemplates: string[];
  initialRightData: string[];
  handleTransferChange: (leftData: string[], rightData: string[]) => void;
}

export const ImportSelectionSection = ({
  availableTemplates,
  initialRightData,
  handleTransferChange,
}: ImportSelectionSectionProps) => {
  return (
    <Stack p={8}>
      <Divider my="sm" />
      <List size="xs">
        <List.Item>
          Templates with the same name as those already saved cannot be imported and will
          be excluded from the list.
        </List.Item>
      </List>
      <TransferList
        initialLeftData={availableTemplates}
        initialRightData={initialRightData}
        leftSearchPlaceholder="Search unselected templates..."
        rightSearchPlaceholder="Search selected templates..."
        onChange={handleTransferChange}
      />
    </Stack>
  );
};
