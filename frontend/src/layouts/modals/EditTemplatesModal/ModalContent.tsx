import { savedTemplateListAtom } from '@/features/state/storageAtoms';
import { Group, Modal, Stack, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { TemplateActions } from './TemplateActions';
import { TemplateTable } from './TemplateTable';
import { ChangesState, ModalContentProps, TemplateInfo } from './types';

export const EditTemplatesModalContent = ({ close, focusRef }: ModalContentProps) => {
  const [savedTemplates, setSavedTemplates] = useAtom(savedTemplateListAtom);
  const [editingTemplates, editingTemplatesHandlers] =
    useListState<TemplateInfo>(savedTemplates);

  const [modifications, setModifications] = useState<ChangesState>({
    orderChanged: false,
    deleteCount: 0,
    renameCount: 0,
  });

  const updateModification = <K extends keyof ChangesState>(
    key: K,
    value: ChangesState[K]
  ) => {
    setModifications(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const resetTemplateList = () => {
    editingTemplatesHandlers.setState(savedTemplates);
    resetModifications();
  };

  const moveTemplateUp = (index: number) => {
    if (index === 0) return;
    editingTemplatesHandlers.swap({ from: index, to: index - 1 });
    updateModification('orderChanged', true);
  };

  const moveTemplateDown = (index: number) => {
    if (index === editingTemplates.length - 1) return;
    editingTemplatesHandlers.swap({ from: index, to: index + 1 });
    updateModification('orderChanged', true);
  };

  const renameTemplate = (index: number, newName: string) => {
    if (editingTemplates[index].label !== newName) {
      editingTemplatesHandlers.setItemProp(index, 'label', newName);
      updateModification('renameCount', modifications.renameCount + 1);
    }
  };

  const deleteTemplate = (index: number) => {
    if (editingTemplates.length === 0) return;
    editingTemplatesHandlers.remove(index);
    updateModification('deleteCount', modifications.deleteCount + 1);
  };

  const saveChanges = () => {
    setSavedTemplates(editingTemplates);
    resetModifications();
  };

  const discardChanges = () => {
    resetTemplateList();
  };

  const getModificationSummary = (): string => {
    if (
      modifications.orderChanged ||
      modifications.deleteCount > 0 ||
      modifications.renameCount > 0
    ) {
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
      return changes.join(' & ') + '.';
    }
    return 'No changes.';
  };

  const resetModifications = () => {
    updateModification('orderChanged', false);
    updateModification('deleteCount', 0);
    updateModification('renameCount', 0);
  };

  const handleModalClose = () => {
    editingTemplatesHandlers.setState([]);
    resetModifications();
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
        <Stack ref={focusRef} p={8}>
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
          />
        </Stack>
        <Group justify="end" my="sm" px={8}>
          <Text size="sm" c="dimmed">
            {getModificationSummary()}
          </Text>
        </Group>
        <TemplateActions
          handleModalClose={handleModalClose}
          discardChanges={discardChanges}
          saveChanges={saveChanges}
          modifications={modifications}
        />
      </Modal.Body>
    </Modal.Content>
  );
};
