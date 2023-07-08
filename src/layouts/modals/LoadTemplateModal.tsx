import { Button, Group, Modal, Select, SelectItem, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useState } from 'react';

type Props = {
  opened: boolean;
  close: () => void;
  setTemplateValueFunc: (value: string) => void;
};

export const LoadTemplateModal = ({ opened, close, setTemplateValueFunc }: Props) => {
  // Local Storage
  const [templateList] = useLocalStorage<{ [key: string]: string }>({
    key: 'editor-template-list',
    defaultValue: {},
  });

  // States
  const [templateSelectItems, setTemplateSelectItems] = useState<(string | SelectItem)[]>([]);
  const [, setSelectedTemplateName] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Functions
  const setSelectItems = () => {
    setSelectedTemplateName(null);
    setTemplateSelectItems(
      Object.keys(templateList).map((key) => {
        return { value: key, label: key };
      })
    );
  };
  const loadTemplate = () => {
    setTemplateValueFunc(templateList[selectedTemplate === null ? '' : selectedTemplate]);
    close();
  };

  // Hook
  useEffect(() => {
    setSelectItems();
  }, [opened]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Load Template">
        <Stack>
          <Select
            label="Template"
            placeholder="Pick one"
            data={templateSelectItems}
            value={selectedTemplate}
            onChange={setSelectedTemplate}
            searchable
            withinPortal
          />
        </Stack>
        <Group position="apart" mt="lg">
          <Button variant="default" size="xs" onClick={close}>
            Close
          </Button>
          <Button size="xs" color="cyan" onClick={loadTemplate} disabled={!selectedTemplate}>
            Load Template
          </Button>
        </Group>
      </Modal>
    </>
  );
};
