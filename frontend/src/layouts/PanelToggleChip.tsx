import { Chip } from '@mantine/core';
interface PanelToggleChipProps {
  opened: boolean;
  label: string;
  handlePanelToggle: (checked: boolean) => void;
}

export const PanelToggleChip = ({
  opened: panel,
  label,
  handlePanelToggle,
}: PanelToggleChipProps) => {
  return (
    <Chip variant="outline" size="xs" checked={panel} onChange={handlePanelToggle}>
      {label}
    </Chip>
  );
};
