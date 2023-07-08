import { Button, Group, List, Modal, Select, SelectItem, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useState } from 'react';

type Props = {
  opened: boolean;
  close: () => void;
  valueRef: React.MutableRefObject<string>;
};

export const SaveTemplateModal = ({ opened, close, valueRef }: Props) => {
  // Local Storage
  const [templateList, setTemplateList] = useLocalStorage<{ [key: string]: string }>({
    key: 'editor-template-list',
    defaultValue: {},
  });

  // States
  const [templateSelectItems, setTemplateSelectItems] = useState<(string | SelectItem)[]>([]);
  const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null);

  // Functions
  const setSelectItems = () => {
    setSelectedTemplateName(null);
    setTemplateSelectItems(
      Object.keys(templateList).map((key) => {
        return { value: key, label: key };
      })
    );
  };

  const saveTemplate = () => {
    const newTemplate = {
      [selectedTemplateName === null ? '' : selectedTemplateName]: valueRef.current,
    };
    setTemplateList({ ...templateList, ...newTemplate });
    close();
  };

  // Hook
  useEffect(() => {
    setSelectItems();
  }, [opened]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Save Template">
        <Stack>
          <List size="xs">
            <List.Item>
              To create a new template, enter a template name and select "Create" from the drop-down
              menu.
            </List.Item>
            <List.Item>
              To overwrite an existing template, select one from the drop-down menu.
            </List.Item>
          </List>
          <Select
            label="Template Name"
            placeholder="Input template name or select one."
            data={templateSelectItems}
            value={selectedTemplateName}
            onChange={setSelectedTemplateName}
            getCreateLabel={(query) => `[+] Create "${query}"`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setTemplateSelectItems((current) => [...current, item]);
              return item;
            }}
            creatable
            searchable
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
