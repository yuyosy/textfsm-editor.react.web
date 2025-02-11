import { EditableText } from '@/components/EditableText';
import { ActionIcon, Flex, Group, Text } from '@mantine/core';
import { ArrowDown, ArrowDownUp, ArrowUp, Trash } from 'lucide-react';
import { DataTable } from 'mantine-datatable';
import { TemplateInfo } from '../types';

type TemplateTableProps = {
  editingTemplates: TemplateInfo[];
  moveTemplateUp: (index: number) => void;
  moveTemplateDown: (index: number) => void;
  renameTemplate: (index: number, newName: string) => void;
  deleteTemplate: (index: number) => void;
};

export const TemplateTable = ({
  editingTemplates,
  moveTemplateUp,
  moveTemplateDown,
  renameTemplate,
  deleteTemplate,
}: TemplateTableProps) => {
  return (
    <DataTable
      withColumnBorders
      records={editingTemplates}
      columns={[
        {
          accessor: 'move',
          width: 80,
          title: (
            <Group>
              <ArrowDownUp size={14} />
              <Text>Sort</Text>
            </Group>
          ),
          render: (_, index) => (
            <Flex justify="center" align="center" gap={4}>
              <ActionIcon
                variant="transparent"
                color="green"
                disabled={index === 0}
                onClick={() => moveTemplateUp(index)}
              >
                <ArrowUp size={18} />
              </ActionIcon>
              <ActionIcon
                variant="transparent"
                color="green"
                disabled={index === editingTemplates.length - 1}
                onClick={() => moveTemplateDown(index)}
              >
                <ArrowDown size={18} />
              </ActionIcon>
            </Flex>
          ),
        },
        {
          accessor: 'label',
          render: (item, index) => (
            <EditableText
              text={item.label}
              setText={value => renameTemplate(index, value)}
            />
          ),
        },
        {
          accessor: 'actions',
          width: 80,
          title: '',
          textAlign: 'center',
          render: (_item, index) => (
            <Group gap={4} justify="space-around">
              <ActionIcon
                variant="light"
                color="red"
                size="sm"
                onClick={() => deleteTemplate(index)}
              >
                <Trash size={16} />
              </ActionIcon>
            </Group>
          ),
        },
      ]}
      idAccessor="label"
      height={300}
    />
  );
};
