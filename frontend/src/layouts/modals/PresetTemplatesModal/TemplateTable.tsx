import { Badge, Button, Group, Stack, Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { SearchedTemplateInfo } from './types';

interface TemplateTableProps {
  templates: SearchedTemplateInfo[];
  loading: boolean;
  onSelectTemplate: (template: string) => void;
}

export const TemplateTable = ({
  templates,
  loading,
  onSelectTemplate,
}: TemplateTableProps) => {
  return (
    <DataTable
      height={300}
      minHeight={300}
      withTableBorder
      noRecordsText="Select a platform to view templates"
      borderRadius="sm"
      striped
      highlightOnHover
      idAccessor={item => item.template + item.platform + item.command_raw}
      fetching={loading}
      records={templates}
      scrollAreaProps={{ type: 'always', offsetScrollbars: 'y' }}
      columns={[
        {
          accessor: 'template',
          title: 'Template',
          render: record => (
            <Stack gap={0}>
              <Text>{record.template}</Text>
              <Text size="xs" c="dimmed" p={4}>
                {record.command_raw}
              </Text>
              <Group gap={8}>
                <Badge
                  variant="default"
                  color="blue"
                  radius="sm"
                  size="xs"
                  tt="capitalize"
                >
                  {record.platform}
                </Badge>
                <Badge
                  variant="dot"
                  color={record.matchType === 'regex' ? 'green' : 'blue'}
                  radius="sm"
                  size="xs"
                  tt="capitalize"
                >
                  {record.matchType === 'regex' ? 'Regex Match' : 'Fuzzy Match'}
                </Badge>
              </Group>
            </Stack>
          ),
        },
        {
          accessor: 'actions',
          title: 'Select',
          render: record => (
            <Button
              variant="default"
              size="xs"
              onClick={() => onSelectTemplate(record.template)}
            >
              Select
            </Button>
          ),
        },
      ]}
    />
  );
};
