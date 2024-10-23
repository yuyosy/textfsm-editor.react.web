import {
  Button,
  ComboboxItem,
  Group,
  Input,
  Modal,
  Select,
  Stack,
  Tabs,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import {
  readSessionStorageValue,
  useDebouncedValue,
  useFocusWithin,
  useLocalStorage,
} from '@mantine/hooks';
import { Replace, SquarePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TemplateInfo } from './types';

interface SaveTemplateModalProps {
  opened: boolean;
  close: () => void;
}

export const SaveTemplateModal = ({ opened, close }: SaveTemplateModalProps) => {
  // Local Storage
  const [templateList, setTemplateList] = useLocalStorage<TemplateInfo[]>({
    key: 'editor-template-list',
    defaultValue: [],
  });
  const templateEditorValue: string = readSessionStorageValue({
    key: 'template-editor-value',
  });

  // States
  const { ref: focusRef, focused } = useFocusWithin();
  const [templateSelectItems, setTemplateSelectItems] = useState<
    (string | ComboboxItem)[]
  >([]);
  const [inputTemplateName, setInputTemplateName] = useState<string>('');
  const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null);
  const [isExistingTemplate, setIsExistingTemplate] = useState<boolean>(false);

  const [debounced] = useDebouncedValue(inputTemplateName, 200);

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
    handleClose();
  };

  const handleClose = () => {
    setInputTemplateName('');
    setSelectedTemplateName(null);
    setIsExistingTemplate(false);
    close();
  };

  // Hook
  useEffect(() => {
    if (opened) {
      setSelectItems();
    }
  }, [opened]);

  useEffect(() => {
    if (templateList.some(item => item.label === debounced)) {
      setIsExistingTemplate(true);
    } else {
      setIsExistingTemplate(false);
    }
  }, [debounced]);

  return (
    <>
      <Modal
        title="Save Template"
        opened={opened}
        onClose={handleClose}
        closeOnEscape={!focused}
        size="lg"
      >
        <Stack p={8} gap={2} ref={focusRef}>
          <Text size="sm" c="dimmed">
            Template data is stored in LocalStorage. This data persists even after
            closing the tab, but it will be deleted if you clear the browser's cache.
          </Text>
          <Tabs defaultValue="new" pt={8}>
            <Tabs.List>
              <Tabs.Tab value="new" leftSection={<SquarePlus size={20} />}>
                Save as New
              </Tabs.Tab>
              {templateList.length === 0 ? (
                <Tooltip
                  label="There are no saved templates"
                  position="bottom"
                  withArrow
                >
                  <Tabs.Tab
                    value="overwrite"
                    leftSection={<Replace size={20} />}
                    disabled
                  >
                    Overwrite Existing
                  </Tabs.Tab>
                </Tooltip>
              ) : (
                <Tabs.Tab value="overwrite" leftSection={<Replace size={20} />}>
                  Overwrite Existing
                </Tabs.Tab>
              )}
            </Tabs.List>
            <Tabs.Panel value="new" pt={8}>
              <Stack>
                <Input.Wrapper label="Template Name" withAsterisk>
                  <TextInput
                    value={inputTemplateName}
                    placeholder="Input template name"
                    withErrorStyles={false}
                    onChange={event => setInputTemplateName(event.currentTarget.value)}
                    rightSectionPointerEvents="none"
                    rightSection={isExistingTemplate ? <Replace size={20} /> : ''}
                  />
                  <Input.Error my={4}>
                    {isExistingTemplate
                      ? 'The template name is already exists. Do you want to replace it? '
                      : ''}
                  </Input.Error>
                </Input.Wrapper>
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
                  nothingFoundMessage="No templates..."
                  maxDropdownHeight={200}
                  withAsterisk
                  searchable
                  clearable
                />
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Stack>
        <Group justify="space-between" mt="lg">
          <Button variant="default" size="xs" onClick={handleClose}>
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
