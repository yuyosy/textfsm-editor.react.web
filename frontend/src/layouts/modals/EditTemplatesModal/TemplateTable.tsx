import { TagBadgeMultiSelect } from '@/components/TagBadgeMultiSelect';
import { templateTagsAtom } from '@/features/state/storageAtoms';
import {
  ActionIcon,
  CloseButton,
  Flex,
  Group,
  Popover,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAtom } from 'jotai';
import { ArrowDown, ArrowDownUp, ArrowUp, Tags, Trash } from 'lucide-react';
import { DataTable } from 'mantine-datatable';
import { useRef } from 'react';
import { TemplateInfo } from '../types';

type TemplateTableProps = {
  editingTemplates: TemplateInfo[];
  moveTemplateUp: (index: number) => void;
  moveTemplateDown: (index: number) => void;
  renameTemplate: (index: number, newName: string) => void;
  deleteTemplate: (index: number) => void;
  updateTemplateTags: (index: number, tags: string[]) => void;
};

const TagEditorPopover = ({
  record,
  index,
  updateTemplateTags,
}: {
  record: TemplateInfo;
  index: number;
  updateTemplateTags: (index: number, tags: string[]) => void;
}) => {
  const [tags] = useAtom(templateTagsAtom);
  const [opened, handlers] = useDisclosure(false);

  const handleTagChange = (index: number, selectedTags: string[]) => {
    updateTemplateTags(index, selectedTags);
  };

  return (
    <Popover
      opened={opened}
      width={400}
      position="bottom"
      withArrow
      shadow="md"
      arrowSize={16}
      offset={12}
      onChange={handlers.toggle}
    >
      <Popover.Target>
        <Group>
          <ActionIcon onClick={handlers.toggle} variant="light" color="green" size="sm">
            <Tags size={16} />
          </ActionIcon>
        </Group>
      </Popover.Target>
      <Popover.Dropdown p={12} pt={8}>
        <Group justify="space-between">
          <Text>Edit tags</Text>
          <CloseButton onClick={handlers.close} />
        </Group>
        <TagBadgeMultiSelect
          label={`Selected: ${record.tags ? record.tags.length : 0}`}
          selectItems={tags}
          onChange={selectedTags => handleTagChange(index, selectedTags)}
          defaultValue={record.tags}
          withinPortal={false}
          clearable
        />
      </Popover.Dropdown>
    </Popover>
  );
};

export const TemplateTable = ({
  editingTemplates,
  moveTemplateUp,
  moveTemplateDown,
  renameTemplate,
  deleteTemplate,
  updateTemplateTags,
}: TemplateTableProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <DataTable
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
            <TextInput
              defaultValue={item.label}
              ref={inputRef}
              onBlur={event => {
                const value = event.currentTarget.value;
                console.log(value, item.label);
                if (value !== item.label) {
                  renameTemplate(index, value);
                }
              }}
              onKeyDown={event => {
                const value = event.currentTarget.value;
                if (event.key === 'Enter') {
                  if (value !== item.label) {
                    event.currentTarget.blur();
                  }
                } else if (event.key === 'Escape') {
                  event.currentTarget.value = item.label;
                  event.currentTarget.blur();
                }
              }}
            />
          ),
        },
        {
          accessor: 'tags',
          width: 80,
          render: record => {
            const len = record.tags?.length || 0;
            return <Text>{len === 1 ? `1 tag` : `${len} tags`}</Text>;
          },
        },
        {
          accessor: 'actions',
          width: 80,
          textAlign: 'center',
          render: (record, index) => (
            <Group gap={4} justify="space-around">
              <TagEditorPopover
                record={record}
                index={index}
                updateTemplateTags={updateTemplateTags}
              />
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
      height={360}
      scrollAreaProps={{ offsetScrollbars: true, type: 'always' }}
      withColumnBorders
    />
  );
};
