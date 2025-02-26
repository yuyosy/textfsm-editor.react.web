import { Button, Group, Stack, TextInput } from '@mantine/core';
import { useAtom } from 'jotai';

import { TagBadgeMultiSelect } from '@/components/TagBadgeMultiSelect';
import { templateTagsAtom } from '@/features/state/storageAtoms';

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
  const [tags] = useAtom(templateTagsAtom);
  const {
    templateProperties,
    isNameDuplicate,
    setTemplateField,
    saveTemplateToStorage,
  } = useSaveNewTemplate(savedTemplates, setSavedTemplates, currentEditorContent);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateField('label', e.currentTarget.value);
  };

  const handleTagChange = (selectedTags: string[]) => {
    setTemplateField('tags', selectedTags);
  };

  const handleSaveTemplate = () => {
    setTemplateField('value', currentEditorContent);
    saveTemplateToStorage();
    close();
  };

  return (
    <Stack>
      <Stack p={8} gap={2}>
        <TextInput
          label="New Template Name"
          placeholder="Enter new template name..."
          onChange={handleInputChange}
          error={isNameDuplicate ? 'Template name already exists' : null}
        />
        <TagBadgeMultiSelect
          label="Select Tags"
          selectItems={tags}
          onChange={handleTagChange}
          defaultValue={templateProperties.tags}
          clearable
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
          disabled={templateProperties.label === '' || isNameDuplicate}
        >
          Save Template
        </Button>
      </Group>
    </Stack>
  );
};
