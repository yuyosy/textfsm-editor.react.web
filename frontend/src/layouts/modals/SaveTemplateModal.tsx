import {
  Button,
  ComboboxItem,
  Group,
  Modal,
  Select,
  Stack,
  Tabs,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { readSessionStorageValue, useLocalStorage } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { TemplateInfo } from './types';

type Props = {
  opened: boolean;
  close: () => void;
};

export const SaveTemplateModal = ({ opened, close }: Props) => {
  // Local Storage
  const [templateList, setTemplateList] = useLocalStorage<TemplateInfo[]>({
    key: 'editor-template-list',
    defaultValue: [],
  });
  const templateEditorValue: string = readSessionStorageValue({
    key: 'template-editor-value',
  });

  // States
  const [templateSelectItems, setTemplateSelectItems] = useState<
    (string | ComboboxItem)[]
  >([]);
  const [inputTemplateName, setInputTemplateName] = useState<string>('');
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

  const saveTemplate = () => {
    const templateName = inputTemplateName || selectedTemplateName;
    const findIndex = templateList.findIndex(item => item.label === templateName);
    if (!templateName) {
      return;
    }
    if (findIndex != -1) {
      templateList[findIndex] = {
        label: templateName,
        value: templateEditorValue,
      };
    } else {
      templateList.push({
        label: templateName,
        value: templateEditorValue,
      });
    }
    setTemplateList(templateList);
  };

  const onClose = () => {
    setInputTemplateName('');
    setSelectedTemplateName(null);
    close();
  };

  // Hook
  useEffect(() => {
    if (opened) {
      setSelectItems();
    }
  }, [opened]);

  return (
    <>
      <Modal opened={opened} onClose={onClose} title="Save Template" size="lg">
        <Stack p={8} gap={2}>
          <Text size="sm" c="dimmed">
            Template data is stored in LocalStorage. This data persists even after
            closing the tab, but it will be deleted if you clear the browser's cache.
          </Text>
          <Tabs defaultValue="new" pt={8}>
            <Tabs.List>
              <Tabs.Tab value="new">Save as New</Tabs.Tab>
              {templateList.length === 0 ? (
                <Tooltip
                  label="There are no saved templates"
                  position="bottom"
                  withArrow
                >
                  <Tabs.Tab value="overwrite" disabled>
                    Overwrite Existing
                  </Tabs.Tab>
                </Tooltip>
              ) : (
                <Tabs.Tab
                  value="overwrite"
                  disabled={templateList.length === 0 ? true : false}
                >
                  Overwrite Existing
                </Tabs.Tab>
              )}
            </Tabs.List>
            <Tabs.Panel value="new" pt={8}>
              <Stack>
                <TextInput
                  label="Template Name"
                  placeholder="Input template name"
                  value={inputTemplateName}
                  onChange={event => setInputTemplateName(event.currentTarget.value)}
                  withAsterisk
                />
              </Stack>
            </Tabs.Panel>
            <Tabs.Panel value="overwrite" pt={8}>
              <Stack>
                <Select
                  label="Template Name"
                  placeholder="Select one"
                  data={templateSelectItems}
                  value={selectedTemplateName}
                  onChange={setSelectedTemplateName}
                  withAsterisk
                  searchable
                  clearable
                />
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Stack>
        <Group justify="space-between" mt="lg">
          <Button variant="default" size="xs" onClick={close}>
            Close
          </Button>
          <Button
            size="xs"
            color="cyan"
            onClick={saveTemplate}
            disabled={!(inputTemplateName || selectedTemplateName)}
          >
            Save Template
          </Button>
        </Group>
      </Modal>
    </>
  );
};
