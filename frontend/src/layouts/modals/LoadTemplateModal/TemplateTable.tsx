import { useState } from 'react';

import { Button, Flex, Group, Text, TextInput } from '@mantine/core';
import { useAtomValue } from 'jotai';
import { DataTable } from 'mantine-datatable';

import { TagBadge } from '@/components/TagBadege';
import { templateTagsAtom } from '@/features/state/storageAtoms';

import { TemplateInfo } from '../types';

type TemplateTableProps = {
  templates: TemplateInfo[];
  onSelect: (templateId: string) => void;
};

export const TemplateTable = ({ templates, onSelect }: TemplateTableProps) => {
  const [search, setSearch] = useState('');
  const tags = useAtomValue(templateTagsAtom);

  const handleSelectTemplate = (templateId: string) => {
    onSelect(templateId);
  };

  const filteredTemplates = templates.filter(template =>
    template.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <TextInput
        placeholder="Search templates..."
        value={search}
        onChange={e => setSearch(e.currentTarget.value)}
      />
      <DataTable
        height={300}
        minHeight={300}
        withTableBorder
        noRecordsText="No templates found."
        borderRadius="sm"
        striped
        idAccessor="label"
        scrollAreaProps={{ type: 'always', offsetScrollbars: 'y' }}
        records={filteredTemplates}
        columns={[
          {
            accessor: 'label',
            title: 'Template Name',
            render: record => (
              <Flex direction="column" gap={4}>
                <Text>{record.label}</Text>
                {record.tags ? (
                  <Group gap={4}>
                    {record.tags.map(tagName => {
                      const tag = tags[tags.findIndex(tag => tag.name === tagName)];
                      return tag ? (
                        <TagBadge key={tagName} size="sm" {...tag} />
                      ) : (
                        <TagBadge
                          key={tagName}
                          size="sm"
                          variant="default"
                          style={tag ? {} : { border: 'dashed 1px #666' }}
                        >
                          {tagName}
                        </TagBadge>
                      );
                    })}
                  </Group>
                ) : (
                  ''
                )}
              </Flex>
            ),
          },
          {
            accessor: 'action',
            title: 'Action',
            width: 90,
            render: record => (
              <Button
                variant="default"
                size="xs"
                onClick={() => handleSelectTemplate(record.label)}
              >
                Select
              </Button>
            ),
          },
        ]}
      />
    </>
  );
};
