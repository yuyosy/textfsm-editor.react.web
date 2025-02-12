import { Button, Group, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';
import { TemplateInfo } from '../types';
import { useSaveNewTemplate } from './hooks/useSaveNewTemplate';

interface SaveAsNewTemplateProps {
  close: () => void;
  savedTemplates: TemplateInfo[];
  setSavedTemplates: (templates: TemplateInfo[]) => void;
  currentEditorContent: string;
}

export const SaveAsNewTemplate = ({
  close,
  savedTemplates,
  setSavedTemplates,
  currentEditorContent,
}: SaveAsNewTemplateProps) => {
  const [newTemplateName, setTemplateName] = useState('');
  const { setNewTemplateName, saveTemplateToStorage, isDuplicateName } =
    useSaveNewTemplate(savedTemplates, setSavedTemplates, currentEditorContent);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateName(e.currentTarget.value);
    setNewTemplateName(e.currentTarget.value);
  };

  const handleSaveTemplate = () => {
    saveTemplateToStorage();
    close();
  };

  return (
    <Stack>
      <Stack p={8} gap={2}>
        <TextInput
          label="New Template Name"
          placeholder="Enter new template name..."
          value={newTemplateName}
          onChange={handleInputChange}
          error={isDuplicateName ? 'Template name already exists' : null}
        />
      </Stack>
      <Group justify="space-between" mt="lg">
        <Button variant="default" size="xs" onClick={close}>
          Close
        </Button>
        <Button
          size="xs"
          color="cyan"
          onClick={handleSaveTemplate}
          disabled={!newTemplateName || isDuplicateName}
        >
          Save Template
        </Button>
      </Group>
    </Stack>
  );
};
