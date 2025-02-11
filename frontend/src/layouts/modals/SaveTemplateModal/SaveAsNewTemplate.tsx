import { Input, Stack, TextInput } from '@mantine/core';
import { Replace } from 'lucide-react';

interface SaveAsNewTemplateProps {
  isDuplicateName: boolean;
  newTemplateName: string;
  setNewTemplateName: (name: string) => void;
}

export const SaveAsNewTemplate = ({
  isDuplicateName,
  newTemplateName,
  setNewTemplateName,
}: SaveAsNewTemplateProps) => {
  return (
    <Stack>
      <Input.Wrapper label="Template Name" withAsterisk>
        <TextInput
          value={newTemplateName}
          placeholder="Input template name"
          withErrorStyles={false}
          onChange={event => setNewTemplateName(event.currentTarget.value)}
          rightSectionPointerEvents="none"
          rightSection={isDuplicateName ? <Replace size={20} /> : ''}
        />
        <Input.Error my={4}>
          {isDuplicateName
            ? 'The template name is already exists. Do you want to replace it? '
            : ''}
        </Input.Error>
      </Input.Wrapper>
    </Stack>
  );
};
