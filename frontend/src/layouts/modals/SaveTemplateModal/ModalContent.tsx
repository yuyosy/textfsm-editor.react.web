import { Button, Group, Modal, Stack, Tabs, Text, Tooltip } from '@mantine/core';
import { useAtom, useAtomValue } from 'jotai';
import { Replace, SquarePlus } from 'lucide-react';

import {
  savedTemplateListAtom,
  templateEditorValueAtom,
} from '@/features/state/storageAtoms';
import { useSaveTemplate } from './hooks/useSaveTemplate';
import { OverwriteTemplate } from './OverwriteTemplate';
import { SaveAsNewTemplate } from './SaveAsNewTemplate';
import { ModalContentProps } from './types';

export const SaveTemplateModalContent = ({ close, focusRef }: ModalContentProps) => {
  const [savedTemplates, setSavedTemplates] = useAtom(savedTemplateListAtom);
  const currentEditorContent = useAtomValue(templateEditorValueAtom);

  const {
    newTemplateName,
    setNewTemplateName,
    existingTemplateName,
    isDuplicateName,
    setExistingTemplateName,
    saveTemplateToStorage,
  } = useSaveTemplate(savedTemplates, setSavedTemplates, currentEditorContent);

  const handleSaveTemplate = () => {
    saveTemplateToStorage();
    close();
  };

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
              <SaveAsNewTemplate
                isDuplicateName={isDuplicateName}
                newTemplateName={newTemplateName}
                setNewTemplateName={setNewTemplateName}
              />
            </Tabs.Panel>
            <Tabs.Panel value="overwrite" pt={8}>
              <OverwriteTemplate
                savedTemplates={savedTemplates}
                setExistingTemplateName={setExistingTemplateName}
              />
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
            onClick={handleSaveTemplate}
            disabled={!(newTemplateName || existingTemplateName)}
          >
            Save Template
          </Button>
        </Group>
      </Modal.Body>
    </Modal.Content>
  );
};
