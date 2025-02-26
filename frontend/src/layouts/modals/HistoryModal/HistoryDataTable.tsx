import { useState } from 'react';

import { Button, Code, Group, Popover } from '@mantine/core';
import { useAtomValue } from 'jotai';
import { DataTable } from 'mantine-datatable';

import { StatusBadge } from '@/components/StatusBadge';
import { historyAutoSaveItemsAtom } from '@/features/state/storageAtoms';
import { HistoryAutoSaveItem } from '@/types';

interface HistoryDataTableProps {
  onSelect: (record: HistoryAutoSaveItem) => void;
}
const pageSizes = [10, 25, 50, 100];
export const HistoryDataTable = ({ onSelect }: HistoryDataTableProps) => {
  const records = useAtomValue(historyAutoSaveItemsAtom);
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [page, setPage] = useState(1);
  const [visibleRecords, setVisibleRecords] = useState(records.slice(0, pageSize));

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setVisibleRecords(records.slice((newPage - 1) * pageSize, newPage * pageSize));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
    setVisibleRecords(records.slice(0, newPageSize));
  };

  return (
    <DataTable
      minHeight={150}
      height={320}
      withTableBorder
      striped
      noRecordsText="No history."
      idAccessor="timestamp"
      borderRadius="sm"
      records={visibleRecords}
      scrollAreaProps={{ offsetScrollbars: true, type: 'always' }}
      totalRecords={records.length}
      page={page}
      recordsPerPage={pageSize}
      recordsPerPageOptions={pageSizes}
      onPageChange={handlePageChange}
      onRecordsPerPageChange={handlePageSizeChange}
      paginationSize="xs"
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
              <Popover width={280} shadow="md" arrowSize={14} withArrow>
                <Popover.Target>
                  <Button variant="default" size="compact-xs">
                    Data
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <Code block fz={12} mah={220}>
                    {record.data}
                  </Code>
                </Popover.Dropdown>
              </Popover>
              <Popover width={280} shadow="md" arrowSize={14} withArrow>
                <Popover.Target>
                  <Button variant="default" size="compact-xs">
                    Template
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <Code block fz={12} mah={220}>
                    {record.template}
                  </Code>
                </Popover.Dropdown>
              </Popover>
              <Popover width={280} shadow="md" arrowSize={14} withArrow>
                <Popover.Target>
                  <Button variant="default" size="compact-xs">
                    Result
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <Code block fz={12} mah={220}>
                    {record.result}
                  </Code>
                </Popover.Dropdown>
              </Popover>
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
