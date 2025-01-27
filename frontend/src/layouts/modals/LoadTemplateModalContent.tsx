import { MutableRefObject, useState } from 'react';

import {
  Button,
  ComboboxItem,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useAtomValue, useSetAtom } from 'jotai';

import {
  savedTemplateListAtom,
  templateEditorValueAtom,
} from '@/features/state/storageAtoms';

type ModalContentProps = {
  close: () => void;
  focusRef: MutableRefObject<HTMLDivElement>;
};

export const LoadTemplateModalContent = ({ close, focusRef }: ModalContentProps) => {
  const readTemplateList = useAtomValue(savedTemplateListAtom);
  const setTemplateEditorValue = useSetAtom(templateEditorValueAtom);
  // States
  const [templateSelectItems] = useState<(string | ComboboxItem)[]>(
    readTemplateList.map(item => ({ value: item.label, label: item.label }))
  );
  const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null);

  // Functions
  const loadTemplate = () => {
    const filtered = readTemplateList.filter(
      item => item.label === selectedTemplateName
    );
    if (filtered.length > 0) {
      setTemplateEditorValue(filtered[0].value);
    }
    close();
  };

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title>
          <Title order={4}>Load Template</Title>
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
            data={templateSelectItems}
            value={selectedTemplateName}
            onChange={setSelectedTemplateName}
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
            onClick={loadTemplate}
            disabled={!selectedTemplateName}
          >
            Load Template
          </Button>
        </Group>
      </Modal.Body>
    </Modal.Content>
  );
};
