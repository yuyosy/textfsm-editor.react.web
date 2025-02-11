import { Button, Stack, TextInput } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';

interface OverwriteTemplateProps {
  savedTemplates: any[];
  setExistingTemplateName: (id: string | null) => void;
}

export const OverwriteTemplate = ({
  savedTemplates,
  setExistingTemplateName,
}: OverwriteTemplateProps) => {
  const [search, setSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const filteredTemplates = savedTemplates.filter(template =>
    template.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectTemplate = (label: string) => {
    setSelectedTemplate(label);
    setExistingTemplateName(label);
  };

  return (
    <Stack>
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
  );
};
