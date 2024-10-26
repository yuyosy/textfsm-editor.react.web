import { useEffect, useState } from 'react';

import { ActionIcon, Box, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { useFocusWithin, useListState, useLocalStorage } from '@mantine/hooks';
import { ArrowDown, ArrowDownUp, ArrowUp, Trash } from 'lucide-react';
import { DataTable } from 'mantine-datatable';

import { EditableText } from '@/components/EditableText';

import { TemplateInfo } from './types';

interface ChangesState {
  order: boolean;
  deleteCount: number;
  renameCount: number;
}

interface EditTemplatesModalProps {
  opened: boolean;
  close: () => void;
}

export const EditTemplatesModal = ({ opened, close }: EditTemplatesModalProps) => {
  // Local Storage
  const [templateList, setTemplateList] = useLocalStorage<TemplateInfo[]>({
    key: 'editor-template-list',
    defaultValue: [],
  });

  const { ref: focusRef, focused } = useFocusWithin();
  const [edittingList, edittingListHandlers] = useListState<TemplateInfo>([]);

  const [changes, setChanges] = useState<ChangesState>({
    order: false,
    deleteCount: 0,
    renameCount: 0,
  });

  const updateChanges = <K extends keyof ChangesState>(
    key: K,
    value: ChangesState[K]
  ) => {
    setChanges(prevChanges => ({
      ...prevChanges,
      [key]: value,
    }));
  };

  const initializeList = () => {
    edittingListHandlers.setState(JSON.parse(JSON.stringify(templateList)));
    resetState();
  };

  const moveUpArrayIndex = (index: number) => {
    if (index === 0) {
      return;
    }
    edittingListHandlers.swap({ from: index, to: index - 1 });
    updateChanges('order', true);
  };

  const moveDownArrayIndex = (index: number) => {
    if (index === edittingList.length - 1) {
      return;
    }
    edittingListHandlers.swap({ from: index, to: index + 1 });
    updateChanges('order', true);
  };

  const renameTemplate = (index: number, newName: string) => {
    edittingListHandlers.setItemProp(index, 'label', newName);
    updateChanges('renameCount', changes.renameCount + 1);
  };
  const deleteItem = (index: number) => {
    if (edittingList.length === 0) {
      return;
    }
    edittingListHandlers.remove(index);
    updateChanges('deleteCount', changes.deleteCount + 1);
  };

  const applyChanges = () => {
    setTemplateList(edittingList);
    resetState();
  };

  const discardChanges = () => {
    initializeList();
  };

  const changesText = (): string => {
    if (changes.order || changes.deleteCount > 0 || changes.renameCount > 0) {
      const message = [];
      if (changes.order) {
        message.push('Change order');
      }
      if (changes.deleteCount > 0) {
        message.push(
          `Delete ${changes.deleteCount} item${changes.deleteCount == 1 ? '' : 's'}`
        );
      }
      if (changes.renameCount > 0) {
        message.push(
          `Rename ${changes.renameCount} item${changes.renameCount == 1 ? '' : 's'}`
        );
      }
      return message.join(' & ') + '.';
    } else {
      return 'No changes.';
    }
  };

  const resetState = () => {
    updateChanges('order', false);
    updateChanges('deleteCount', 0);
    updateChanges('renameCount', 0);
  };

  const handleClose = () => {
    edittingListHandlers.setState([]);
    resetState();
    close();
  };

  // Hook
  useEffect(() => {
    initializeList();
  }, [opened]);

  return (
    <>
      <Modal
        title="Edit Templates"
        opened={opened}
        onClose={handleClose}
        closeOnEscape={!focused}
        size="lg"
      >
        <Stack ref={focusRef}>
          <Text size="sm" c="dimmed">
            To change the order, click the arrow button in the direction you want to
            move.
          </Text>
          <Text size="sm" c="dimmed">
            The changes such as sorting or deleting will not be reflected until the Apply
            button is pressed.
          </Text>
          <DataTable
            withColumnBorders
            records={edittingList}
            columns={[
              {
                accessor: 'move',
                width: 80,
                title: (
                  <Group>
                    <ArrowDownUp size={14} />
                    <Text>Sort</Text>
                  </Group>
                ),
                render: (_, index) => (
                  <Box display="flex">
                    <ActionIcon
                      variant="transparent"
                      color="green"
                      disabled={index === 0}
                      onClick={() => moveUpArrayIndex(index)}
                    >
                      <ArrowUp size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant="transparent"
                      color="green"
                      disabled={index === edittingList.length - 1}
                      onClick={() => moveDownArrayIndex(index)}
                    >
                      <ArrowDown size={18} />
                    </ActionIcon>
                  </Box>
                ),
              },
              {
                accessor: 'label',
                render: (item, index) => (
                  <EditableText
                    text={item.label}
                    setText={value => renameTemplate(index, value)}
                  />
                ),
              },
              // { accessor: 'value' },
              {
                accessor: 'actions',
                width: 80,
                title: '',
                textAlign: 'center',
                render: (_item, index) => (
                  <Group gap={4} justify="space-around">
                    <ActionIcon
                      variant="light"
                      color="red"
                      size="sm"
                      onClick={() => deleteItem(index)}
                    >
                      <Trash size={16} />
                    </ActionIcon>
                  </Group>
                ),
              },
            ]}
            idAccessor="label"
            height={300}
          />{' '}
        </Stack>
        <Group justify="end" my="sm" px={8}>
          <Text size="sm" c="dimmed">
            {changesText()}
          </Text>
        </Group>
        <Group justify="space-between">
          <Button variant="default" size="xs" onClick={handleClose}>
            Close
          </Button>
          <Group>
            <Button
              variant="default"
              size="xs"
              onClick={discardChanges}
              disabled={!(changes.order || changes.deleteCount > 0)}
            >
              Discard Changes
            </Button>
            <Button
              size="xs"
              color="cyan"
              onClick={applyChanges}
              disabled={!(changes.order || changes.deleteCount > 0)}
            >
              Apply
            </Button>
          </Group>
        </Group>
      </Modal>
    </>
  );
};
