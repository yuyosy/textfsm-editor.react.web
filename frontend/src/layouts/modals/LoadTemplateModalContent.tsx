import { MutableRefObject, useState } from 'react';

import { Button, ComboboxItem, Group, Modal, Select, Stack, Text } from '@mantine/core';
import { useAtomValue, useSetAtom } from 'jotai';

import {
  savedTemplateListAtom,
  templateEditorValueAtom,
} from '@/features/state/storageAtoms';

import { addNotificationAtom } from '@/features/state/atoms';

type ModalContentProps = {
  close: () => void;
  focusRef: MutableRefObject<HTMLDivElement>;
};

export const LoadTemplateModalContent = ({ close, focusRef }: ModalContentProps) => {
  const addNotification = useSetAtom(addNotificationAtom);
  const availableTemplates = useAtomValue(savedTemplateListAtom);
  const setEditorContent = useSetAtom(templateEditorValueAtom);

  const [templateOptions] = useState<(string | ComboboxItem)[]>(
    availableTemplates.map(template => ({
      value: template.label,
      label: template.label,
    }))
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const loadSelectedTemplate = () => {
    const selectedTemplate = availableTemplates.find(
      template => template.label === selectedTemplateId
    );
    if (selectedTemplate) {
      setEditorContent(selectedTemplate.value);
    }
    addNotification({
      type: 'success',
      title: 'Template loaded',
      message: `Loaded: ${selectedTemplateId}`,
    });
    close();
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
          <Select
            label="Template"
            placeholder="Select one"
            data={templateOptions}
            value={selectedTemplateId}
            onChange={setSelectedTemplateId}
            nothingFoundMessage="No templates..."
            maxDropdownHeight={200}
            searchable
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
            onClick={loadSelectedTemplate}
            disabled={!selectedTemplateId}
          >
            Load Template
          </Button>
        </Group>
      </Modal.Body>
    </Modal.Content>
  );
};
