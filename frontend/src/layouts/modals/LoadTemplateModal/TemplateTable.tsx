import { Button, TextInput } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import { TemplateInfo } from '../types';

type TemplateTableProps = {
  templates: TemplateInfo[];
  onSelect: (templateId: string) => void;
};

export const TemplateTable = ({ templates, onSelect }: TemplateTableProps) => {
  const [search, setSearch] = useState('');

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
    </>
  );
};
