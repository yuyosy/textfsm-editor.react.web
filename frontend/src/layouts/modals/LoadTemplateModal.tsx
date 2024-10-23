import { Button, ComboboxItem, Group, Modal, Select, Stack, Text } from '@mantine/core';
import { useFocusWithin, useLocalStorage } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { TemplateInfo } from './types';

interface LoadTemplateModalProps {
  opened: boolean;
  close: () => void;
}

export const LoadTemplateModal = ({ opened, close }: LoadTemplateModalProps) => {
  // Local Storage
  const [templateList] = useLocalStorage<TemplateInfo[]>({
    key: 'editor-template-list',
    defaultValue: [],
  });

  // States
  const { ref: focusRef, focused } = useFocusWithin();
  const [templateSelectItems, setTemplateSelectItems] = useState<
    (string | ComboboxItem)[]
  >([]);
  const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null);

  // Functions
  const setSelectItems = () => {
    setSelectedTemplateName(null);
    setTemplateSelectItems(
      templateList.map(item => {
        return { value: item.label, label: item.label };
      })
    );
  };
  const loadTemplate = () => {
    // ------- TODO
    // const filtered = templateList.filter(item => item.label === selectedTemplateName);
    // if (filtered.length > 0 && editorRef.current) {
    //   editorRef.current.setValue(filtered[0].value);
    // }
    close();
  };

  // Hook
  useEffect(() => {
    setSelectItems();
  }, [opened]);

  return (
    <>
      <Modal
        title="Load Template"
        opened={opened}
        onClose={close}
        closeOnEscape={!focused}
        size="lg"
      >
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
      </Modal>
    </>
  );
};
