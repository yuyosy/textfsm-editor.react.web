import { TagBadge } from '@/components/TagBadege';
import { templateTagsAtom } from '@/features/state/storageAtoms';
import {
  ActionIcon,
  Flex,
  Grid,
  Group,
  MultiSelect,
  MultiSelectProps,
  Popover,
  Text,
  TextInput,
} from '@mantine/core';
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
  const findTag = (name: string) => tags[tags.findIndex(tag => tag.name === name)];

  const handleTagChange = (index: number, selectedTags: string[]) => {
    updateTemplateTags(index, selectedTags);
  };

  const renderMultiSelectOption: MultiSelectProps['renderOption'] = ({ option }) => {
    const tag = findTag(option.value);
    return (
      <Grid align="center">
        <Grid.Col span="content">
          <TagBadge {...tag} />
        </Grid.Col>
        <Grid.Col span="content">
          <Text size="xs" c="dimmed">
            {tag.description}
          </Text>
        </Grid.Col>
      </Grid>
    );
  };

  return (
    <Popover width={400} position="bottom" withArrow shadow="md" arrowSize={16}>
      <Popover.Target>
        <Group>
          <ActionIcon variant="light" color="green" size="sm">
            <Tags size={16} />
          </ActionIcon>
        </Group>
      </Popover.Target>
      <Popover.Dropdown>
        <MultiSelect
          data={tags.map(tag => ({
            value: tag.name,
            label: tag.name,
          }))}
          defaultValue={record.tags ? record.tags.map(tag => tag) : []}
          label={`Tags (${record.tags ? record.tags.length : 0})`}
          placeholder="Select tags for the template"
          onChange={selectedTags => handleTagChange(index, selectedTags)}
          renderOption={renderMultiSelectOption}
          nothingFoundMessage="Nothing found..."
          maxDropdownHeight={200}
          comboboxProps={{ withinPortal: false }}
          searchable
          clearable
          hidePickedOptions
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
