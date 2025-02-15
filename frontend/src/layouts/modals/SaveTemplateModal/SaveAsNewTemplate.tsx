import { TagBadge } from '@/components/TagBadege';
import { templateTagsAtom } from '@/features/state/storageAtoms';
import {
  Button,
  Grid,
  Group,
  MultiSelect,
  MultiSelectProps,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useAtom } from 'jotai';
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

  const renderMultiSelectOption: MultiSelectProps['renderOption'] = ({ option }) => {
    const tag = tags[tags.findIndex(tag => tag.name === option.value)];
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
    <Stack>
      <Stack p={8} gap={2}>
        <TextInput
          label="New Template Name"
          placeholder="Enter new template name..."
          onChange={handleInputChange}
          error={isNameDuplicate ? 'Template name already exists' : null}
        />
        <MultiSelect
          data={tags.map(tag => ({ value: tag.name, label: tag.name }))}
          label="Select Tags"
          placeholder="Select tags for the template"
          onChange={handleTagChange}
          renderOption={renderMultiSelectOption}
          nothingFoundMessage="Nothing found..."
          maxDropdownHeight={200}
          searchable
          clearable
          hidePickedOptions
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
