import { ActionIcon, Divider, Stack, Text, Tooltip } from '@mantine/core';
import { FileJson } from 'lucide-react';
import { DataTable } from 'mantine-datatable';
import { LoadedJsonData } from './types';

interface TemplateListSectionProps {
  processedJsonData: LoadedJsonData[];
}

export const TemplateListSection = ({ processedJsonData }: TemplateListSectionProps) => {
  return (
    <Stack p={8}>
      <Divider my="xs" />
      <DataTable
        records={processedJsonData}
        columns={[
          {
            accessor: 'label',
            render: item => (
              <Stack gap={0}>
                <Text size="sm">{item.label}</Text>
                {item.label !== item.labelOrigin && (
                  <Text size="xs" c="dimmed">
                    renamed from {item.labelOrigin}
                  </Text>
                )}
              </Stack>
            ),
          },
          {
            accessor: 'sourceFile',
            textAlign: 'center',
            render: item => {
              return (
                <Tooltip label={item.fileName} position="bottom">
                  <ActionIcon variant="default">
                    <FileJson size={16} strokeWidth={1.2} />
                  </ActionIcon>
                </Tooltip>
              );
            },
          },
          {
            accessor: 'state',
            render: item => {
              const status = [];
              if (item.isDuplicate) status.push('Duplicate');
              if (item.isAlreadySaved) status.push('Already Saved');
              if (item.hasFormatError) status.push('Format Error');
              return <Text size="xs">{status.join(', ')}</Text>;
            },
          },
        ]}
        idAccessor={item => item.fileName + item.label}
      />
    </Stack>
  );
};
