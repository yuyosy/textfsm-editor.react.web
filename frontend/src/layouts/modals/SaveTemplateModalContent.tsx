import { MutableRefObject, useEffect, useState } from 'react';

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
import { useDebouncedValue } from '@mantine/hooks';
import { useAtom, useAtomValue } from 'jotai';
import { Replace, SquarePlus } from 'lucide-react';

import {
  savedTemplateListAtom,
  templateEditorValueAtom,
} from '@/features/state/storageAtoms';

type ModalContentProps = {
  close: () => void;
  focusRef: MutableRefObject<HTMLDivElement>;
};

export const SaveTemplateModalContent = ({ close, focusRef }: ModalContentProps) => {
  const [savedTemplates, setSavedTemplates] = useAtom(savedTemplateListAtom);
  const currentEditorContent = useAtomValue(templateEditorValueAtom);

  const [templateOptions] = useState<(string | ComboboxItem)[]>(
    savedTemplates.map(template => ({
      value: template.label,
      label: template.label,
    }))
  );
  const [newTemplateName, setNewTemplateName] = useState<string>('');
  const [existingTemplateId, setExistingTemplateId] = useState<string | null>(null);
  const [isDuplicateName, setIsDuplicateName] = useState<boolean>(false);

  const [debouncedTemplateName] = useDebouncedValue(newTemplateName, 200);

  const saveTemplateToStorage = () => {
    const templateName = newTemplateName || existingTemplateId;
    if (!templateName) return;

    const updatedTemplates = [...savedTemplates];
    const existingIndex = updatedTemplates.findIndex(
      template => template.label === templateName
    );

    const templateData = {
      label: templateName,
      value: currentEditorContent,
    };

    if (existingIndex !== -1) {
      updatedTemplates[existingIndex] = templateData;
    } else {
      updatedTemplates.push(templateData);
    }

    setSavedTemplates(updatedTemplates);
    handleModalClose();
  };

  const handleModalClose = () => {
    setNewTemplateName('');
    setExistingTemplateId(null);
    setIsDuplicateName(false);
    close();
  };

  useEffect(() => {
    setIsDuplicateName(
      savedTemplates.some(template => template.label === debouncedTemplateName)
    );
  }, [debouncedTemplateName, savedTemplates]);

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title fz={18} fw={700}>
          Save Template
        </Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
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
              {savedTemplates.length === 0 ? (
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
                    value={newTemplateName}
                    placeholder="Input template name"
                    withErrorStyles={false}
                    onChange={event => setNewTemplateName(event.currentTarget.value)}
                    rightSectionPointerEvents="none"
                    rightSection={isDuplicateName ? <Replace size={20} /> : ''}
                  />
                  <Input.Error my={4}>
                    {isDuplicateName
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
                  data={templateOptions}
                  value={existingTemplateId}
                  onChange={setExistingTemplateId}
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
          <Button variant="default" size="xs" onClick={handleModalClose}>
            Close
          </Button>
          <Button
            size="xs"
            color="cyan"
            onClick={saveTemplateToStorage}
            disabled={!(newTemplateName || existingTemplateId)}
          >
            Save Template
          </Button>
        </Group>
      </Modal.Body>
    </Modal.Content>
  );
};
