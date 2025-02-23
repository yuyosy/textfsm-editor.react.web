import { StatusBadge } from '@/components/StatusBadge';
import { historyAutoSaveItemsAtom } from '@/features/state/storageAtoms';
import { HistoryAutoSaveItem } from '@/types';
import { Button, Code, Group, HoverCard } from '@mantine/core';
import { useAtomValue } from 'jotai';
import { DataTable } from 'mantine-datatable';

interface HistoryDataTableProps {
  onSelect: (record: HistoryAutoSaveItem) => void;
}

export const HistoryDataTable = ({ onSelect }: HistoryDataTableProps) => {
  const records = useAtomValue(historyAutoSaveItemsAtom);

  return (
    <DataTable
      minHeight={150}
      height={300}
      withTableBorder
      striped
      noRecordsText="No history."
      idAccessor="timestamp"
      borderRadius="sm"
      records={records}
      scrollAreaProps={{ offsetScrollbars: true, type: 'always' }}
      columns={[
        { accessor: 'timestamp', title: 'Timestamp' },
        {
          accessor: 'status',
          title: 'Status',
          render: record => <StatusBadge variant={record.status} />,
        },
        {
          accessor: 'data',
          title: 'Data',
          render: record => (
            <Group gap={6}>
              <HoverCard width={280} shadow="md" arrowSize={14} withArrow>
                <HoverCard.Target>
                  <Button variant="default" size="compact-xs">
                    Data
                  </Button>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Code block fz={12} mah={220}>
                    {record.data}
                  </Code>
                </HoverCard.Dropdown>
              </HoverCard>
              <HoverCard width={280} shadow="md" arrowSize={14} withArrow>
                <HoverCard.Target>
                  <Button variant="default" size="compact-xs">
                    Template
                  </Button>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Code block fz={12} mah={220}>
                    {record.template}
                  </Code>
                </HoverCard.Dropdown>
              </HoverCard>
              <HoverCard width={280} shadow="md" arrowSize={14} withArrow>
                <HoverCard.Target>
                  <Button variant="default" size="compact-xs">
                    Result
                  </Button>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Code block fz={12} mah={220}>
                    {record.result}
                  </Code>
                </HoverCard.Dropdown>
              </HoverCard>
            </Group>
          ),
        },
        {
          accessor: 'action',
          title: 'Action',
          render: record => (
            <Button
              variant="default"
              size="xs"
              onClick={() => {
                onSelect(record);
              }}
            >
              Select
            </Button>
          ),
        },
      ]}
    />
  );
};
