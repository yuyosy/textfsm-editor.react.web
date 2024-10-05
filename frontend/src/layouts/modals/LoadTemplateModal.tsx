import { Button, ComboboxItem, Group, List, Modal, Select, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import type { editor } from 'monaco-editor';
import { useEffect, useState } from 'react';
import { TemplateInfo } from './types';

type Props = {
  opened: boolean;
  close: () => void;
  // setTemplateValueFunc: (value: string) => void;
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
};

export const LoadTemplateModal = ({ opened, close, editorRef }: Props) => {
  // Local Storage
  const [templateList] = useLocalStorage<TemplateInfo[]>({
    key: 'editor-template-list',
    defaultValue: [],
  });

  // States
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
    const filtered = templateList.filter(item => item.label === selectedTemplateName);
    if (filtered.length > 0 && editorRef.current) {
      editorRef.current.setValue(filtered[0].value);
    }
    close();
  };

  // Hook
  useEffect(() => {
    setSelectItems();
  }, [opened]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Load Template" size="lg">
        <Stack>
          <List size="sm">
            <List.Item>
              Loads the template, note that it will overwrite the values entered in the
              Template area.
            </List.Item>
          </List>
          <Select
            label="Template"
            placeholder="Pick one"
            data={templateSelectItems}
            value={selectedTemplateName}
            onChange={setSelectedTemplateName}
            nothingFoundMessage="No templates"
            searchable
            clearable
            comboboxProps={{ withinPortal: false }}
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
