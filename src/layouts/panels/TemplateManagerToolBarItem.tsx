import { useStableCallback } from '@/hooks/useStableCallback';
import { Button, Group, List, Menu, Modal, Select, SelectItem, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import {
  IconBookmarks,
  IconEdit,
  IconFileExport,
  IconFileImport,
  IconListDetails,
  IconPlus,
} from '@tabler/icons-react';
import { useState } from 'react';

type Props = {
  valueRef: React.MutableRefObject<string>;
  setTemplateValue: (value: string) => void;
};

export const TemplateManagerToolBarItem = ({ valueRef, setTemplateValue }: Props) => {
  // Local Storage
  const [templateList, setTemplateList] = useLocalStorage<{ [key: string]: string }>({
    key: 'editor-template-list',
    defaultValue: {},
  });

  // Element State
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState<boolean>(false);
  const [showLoadTemplateModal, setShowLoadTemplateModal] = useState<boolean>(false);
  const [templateSelectItems, setTemplateSelectItems] = useState<(string | SelectItem)[]>([]);
  const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Functions
  const openSaveTemplateModal = useStableCallback(() => {
    setShowSaveTemplateModal(true);
    setSelectedTemplateName(null);
    setTemplateSelectItems(
      Object.keys(templateList).map((key) => {
        return { value: key, label: key };
      })
    );
  });

  const closeSaveTemplateModal = useStableCallback(() => {
    setShowSaveTemplateModal(false);
  });

  const saveTemplate = useStableCallback(() => {
    const newTemplate = {
      [selectedTemplateName === null ? '' : selectedTemplateName]: valueRef.current,
    };
    setTemplateList({ ...templateList, ...newTemplate });
    closeSaveTemplateModal();
  });
  const openLoadTemplateModal = useStableCallback(() => {
    setShowLoadTemplateModal(true);
    setSelectedTemplate(null);
    setTemplateSelectItems(
      Object.keys(templateList).map((key) => {
        return { value: key, label: key };
      })
    );
  });

  const closeLoadTemplateModal = useStableCallback(() => {
    setShowLoadTemplateModal(false);
  });

  const loadTemplate = useStableCallback(() => {
    setTemplateValue(templateList[selectedTemplate === null ? '' : selectedTemplate]);
    closeLoadTemplateModal();
  });

  return (
    <>
      <Modal opened={showSaveTemplateModal} onClose={closeSaveTemplateModal} title="Save Template">
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
          <Button variant="default" size="xs" onClick={closeSaveTemplateModal}>
            Close
          </Button>
          <Button size="xs" color="cyan" onClick={saveTemplate} disabled={!selectedTemplateName}>
            Save Template
          </Button>
        </Group>
      </Modal>
      <Modal opened={showLoadTemplateModal} onClose={closeLoadTemplateModal} title="Load Template">
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
          <Button variant="default" size="xs" onClick={closeLoadTemplateModal}>
            Close
          </Button>
          <Button size="xs" color="cyan" onClick={loadTemplate} disabled={!selectedTemplate}>
            Load Template
          </Button>
        </Group>
      </Modal>
      {/* Save Template */}
      <Menu
        position="bottom-start"
        trigger="hover"
        openDelay={100}
        closeDelay={400}
        withArrow
        shadow="md"
        width={400}
      >
        <Menu.Target>
          <Button
            variant="filled"
            size="xs"
            leftIcon={<IconListDetails size={18} strokeWidth={1.5} />}
          >
            Templates
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item icon={<IconPlus size={14} />} onClick={openSaveTemplateModal}>
            Save Template
          </Menu.Item>
          <Menu.Item icon={<IconBookmarks size={14} />} onClick={openLoadTemplateModal}>
            Load Template
          </Menu.Item>
          <Menu.Item icon={<IconEdit size={14} />}>Edit Templates</Menu.Item>
          <Menu.Divider />
          <Menu.Item icon={<IconFileImport size={14} />}>Import Templates</Menu.Item>
          <Menu.Item icon={<IconFileExport size={14} />}>Export Templates</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
