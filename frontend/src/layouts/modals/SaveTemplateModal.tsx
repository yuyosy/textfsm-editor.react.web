import { Button, Group, List, Modal, Select, SelectItem, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { TemplateInfo } from './types';

type Props = {
  opened: boolean;
  close: () => void;
  valueRef: React.MutableRefObject<string>;
};

export const SaveTemplateModal = ({ opened, close, valueRef }: Props) => {
  // Local Storage
  const [templateList, setTemplateList] = useLocalStorage<TemplateInfo[]>({
    key: 'editor-template-list',
    defaultValue: [],
  });

  // States
  const [templateSelectItems, setTemplateSelectItems] = useState<(string | SelectItem)[]>([]);
  const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null);

  // Functions
  const setSelectItems = () => {
    setSelectedTemplateName(null);
    setTemplateSelectItems(
      templateList.map((item) => {
        return { value: item.label, label: item.label };
      })
    );
  };
  const addSelectItem = (query: string): string | SelectItem | null | undefined => {
    const item = { value: query, label: query };
    setTemplateSelectItems((current) => [...current, item]);
    return item;
  };

  const saveTemplate = () => {
    const findIndex = templateList.findIndex((item) => item.label === selectedTemplateName);
    if (findIndex != -1) {
      templateList[findIndex] = {
        label: selectedTemplateName === null ? '' : selectedTemplateName,
        value: valueRef.current,
      };
    } else {
      templateList.push({
        label: selectedTemplateName === null ? '' : selectedTemplateName,
        value: valueRef.current,
      });
    }
    setTemplateList(templateList);
    close();
  };

  // Hook
  useEffect(() => {
    setSelectItems();
  }, [opened]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Save Template" size="lg">
        <Stack>
          <List size="sm">
            <List.Item>
              To create a new template, enter a template name and select "Create" from the drop-down
              menu.
            </List.Item>
            <List.Item>
              To overwrite an existing template, select one from the drop-down menu.
            </List.Item>
            <List.Item>
              Template data is stored in LocalStorage. When the page cache is deleted, those stored
              data are also deleted.
            </List.Item>
          </List>
          <Select
            label="Template Name"
            placeholder="Input template name or select one."
            data={templateSelectItems}
            value={selectedTemplateName}
            onChange={setSelectedTemplateName}
            getCreateLabel={(query) => `[+] Create "${query}"`}
            onCreate={addSelectItem}
            creatable
            searchable
            clearable
            withinPortal
          />
        </Stack>
        <Group position="apart" mt="lg">
          <Button variant="default" size="xs" onClick={close}>
            Close
          </Button>
          <Button size="xs" color="cyan" onClick={saveTemplate} disabled={!selectedTemplateName}>
            Save Template
          </Button>
        </Group>
      </Modal>
    </>
  );
};
