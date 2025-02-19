import { TagBadge } from '@/components/TagBadege';
import { templateTagsAtom } from '@/features/state/storageAtoms';
import { Button, Flex, Group, Stack, Text, TextInput } from '@mantine/core';
import { useAtomValue } from 'jotai';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import { TemplateInfo } from '../types';
import { useOverwriteTemplate } from './hooks/useOverwriteTemplate';

interface OverwriteTemplateProps {
  close: () => void;
  savedTemplates: TemplateInfo[];
  setSavedTemplates: (templates: TemplateInfo[]) => void;
  currentEditorContent: string;
}

export const OverwriteTemplate = ({
  close,
  savedTemplates,
  setSavedTemplates,
  currentEditorContent,
}: OverwriteTemplateProps) => {
  const [search, setSearch] = useState('');
  const tags = useAtomValue(templateTagsAtom);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const { setExistingTemplateName, saveTemplateToStorage } = useOverwriteTemplate(
    savedTemplates,
    setSavedTemplates,
    currentEditorContent
  );

  const filteredTemplates = savedTemplates.filter(template =>
    template.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectTemplate = (label: string) => {
    setSelectedTemplate(label);
    setExistingTemplateName(label);
  };

  const handleSaveTemplate = () => {
    saveTemplateToStorage();
    close();
  };

  return (
    <Stack>
      <Stack p={8} gap={8}>
        <TextInput
          label="Search Templates"
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
          highlightOnHover
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
              width: 80,
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
        <TextInput label="Selected Template" value={selectedTemplate} readOnly />
      </Stack>
      <Group justify="space-between" mt="lg">
        <Button variant="default" size="xs" onClick={close}>
          Close
        </Button>
        <Button
          size="xs"
          color="cyan"
          onClick={handleSaveTemplate}
          disabled={!selectedTemplate}
        >
          Save Template
        </Button>
      </Group>
    </Stack>
  );
};
