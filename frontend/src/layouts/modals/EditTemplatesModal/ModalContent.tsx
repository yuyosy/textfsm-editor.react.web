import { Group, Modal, Stack, Text } from '@mantine/core';
import { useAtom } from 'jotai';

import { savedTemplateListAtom } from '@/features/state/storageAtoms';
import { TemplateActions } from './TemplateActions';
import { TemplateTable } from './TemplateTable';
import { useTemplateModifications } from './hooks/useTemplateModifications';
import { ChangesState, ModalContentProps } from './types';

const getModificationSummary = (
  modifications: ChangesState,
  hasModifications: boolean
): string => {
  if (hasModifications) {
    const changes = [];
    if (modifications.orderChanged) {
      changes.push('Change order');
    }
    if (modifications.deleteCount > 0) {
      changes.push(
        `Delete ${modifications.deleteCount} item${modifications.deleteCount === 1 ? '' : 's'}`
      );
    }
    if (modifications.renameCount > 0) {
      changes.push(
        `Rename ${modifications.renameCount} item${modifications.renameCount === 1 ? '' : 's'}`
      );
    }
    if (modifications.tagUpdateCount > 0) {
      changes.push(
        `Update tags for ${modifications.tagUpdateCount} item${modifications.tagUpdateCount === 1 ? '' : 's'}`
      );
    }
    return changes.join(' & ') + '.';
  }
  return 'No changes.';
};

export const EditTemplatesModalContent = ({ close, focusRef }: ModalContentProps) => {
  const [savedTemplates, setSavedTemplates] = useAtom(savedTemplateListAtom);
  const {
    editingTemplates,
    modifications,
    hasModifications,
    moveTemplateUp,
    moveTemplateDown,
    renameTemplate,
    deleteTemplate,
    updateTemplateTags,
    discardChanges,
    saveChanges,
  } = useTemplateModifications(savedTemplates, setSavedTemplates);

  const handleModalClose = () => {
    discardChanges();
    close();
  };

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title fz={18} fw={700}>
          Edit Templates
        </Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <Stack ref={focusRef} p={8} gap={4}>
          <Text size="sm" c="dimmed">
            To change the order, click the arrow button in the direction you want to
            move.
          </Text>
          <Text size="sm" c="dimmed">
            The changes such as sorting or deleting will not be reflected until the Apply
            button is pressed.
          </Text>
          <TemplateTable
            editingTemplates={editingTemplates}
            moveTemplateUp={moveTemplateUp}
            moveTemplateDown={moveTemplateDown}
            renameTemplate={renameTemplate}
            deleteTemplate={deleteTemplate}
            updateTemplateTags={updateTemplateTags}
          />
        </Stack>
        <Group justify="end" my="sm" px={8}>
          <Text size="sm" c="dimmed">
            {getModificationSummary(modifications, hasModifications)}
          </Text>
        </Group>
        <TemplateActions
          handleModalClose={handleModalClose}
          discardChanges={discardChanges}
          saveChanges={saveChanges}
          hasModifications={hasModifications}
        />
      </Modal.Body>
    </Modal.Content>
  );
};
