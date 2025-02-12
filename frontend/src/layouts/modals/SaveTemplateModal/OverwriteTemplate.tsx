import { Button, Group, Stack, TextInput } from '@mantine/core';
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
      <Stack p={8} gap={2}>
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
            { accessor: 'label', title: 'Template Name' },
            {
              accessor: 'action',
              title: 'Action',
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
