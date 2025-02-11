import { Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';

import {
  savedTemplateListAtom,
  templateEditorValueAtom,
} from '@/features/state/storageAtoms';
import { useLoadTemplate } from './hooks/useLoadTemplate';
import { TemplateTable } from './TemplateTable';
import { ModalContentProps } from './types';

export const LoadTemplateModalContent = ({ close, focusRef }: ModalContentProps) => {
  const availableTemplates = useAtomValue(savedTemplateListAtom);
  const setEditorContent = useSetAtom(templateEditorValueAtom);

  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const loadSelectedTemplate = useLoadTemplate(availableTemplates, setEditorContent);

  const handleLoadTemplate = () => {
    if (selectedTemplate) {
      loadSelectedTemplate(selectedTemplate);
      close();
    }
  };

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title fz={18} fw={700}>
          Load Template
        </Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <Stack ref={focusRef}>
          <Text size="sm" c="dimmed">
            Loads the template, note that it will overwrite the values entered in the
            Template area.
          </Text>
          <TemplateTable templates={availableTemplates} onSelect={setSelectedTemplate} />
          <TextInput label="Selected Template" value={selectedTemplate} readOnly />
        </Stack>
        <Group justify="space-between" mt="lg">
          <Button variant="default" size="xs" onClick={close}>
            Close
          </Button>
          <Button
            size="xs"
            color="cyan"
            onClick={() => handleLoadTemplate()}
            disabled={!selectedTemplate}
          >
            Load Template
          </Button>
        </Group>
      </Modal.Body>
    </Modal.Content>
  );
};
