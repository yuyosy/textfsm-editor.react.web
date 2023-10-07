import { ActionIcon, Box, Button, Group, List, Modal, Stack, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { TemplateInfo } from './types';
import { useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { IconArrowDown, IconArrowUp, IconArrowsUpDown, IconTrash } from '@tabler/icons-react';

type Props = {
  opened: boolean;
  close: () => void;
};

export const EditTemplatesModal = ({ opened, close }: Props) => {
  // Local Storage
  const [templateList, setTemplateList] = useLocalStorage<TemplateInfo[]>({
    key: 'editor-template-list',
    defaultValue: [],
  });

  const [edittingTemplateList, setEdittingTemplateList] = useState<TemplateInfo[]>([]);
  const [changesOrder, setChangesOrder] = useState<boolean>(false);
  const [changesDelete, setChangesDelete] = useState<number>(0);

  // Hook
  useEffect(() => {
    setEdittingTemplateList([...templateList]);
    resetState();
  }, [opened]);

  const moveUpArrayIndex = (index: number) => {
    if (index === 0) return;
    const newArr = [...edittingTemplateList];
    [newArr[index], newArr[index - 1]] = [newArr[index - 1], newArr[index]];
    setEdittingTemplateList(newArr);
    if (!changesOrder) {
      setChangesOrder(true);
    }
  };

  const moveDownArrayIndex = (index: number) => {
    if (index === edittingTemplateList.length - 1) return;
    const newArr = [...edittingTemplateList];
    [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
    setEdittingTemplateList(newArr);
    if (!changesOrder) {
      setChangesOrder(true);
    }
  };

  const deleteItem = (index: number) => {
    if (edittingTemplateList.length === 0) return;
    setEdittingTemplateList(edittingTemplateList.filter((_, i) => i !== index));
    setChangesDelete(changesDelete + 1);
  };

  const applyChanges = () => {
    setTemplateList(edittingTemplateList);
    resetState();
  };

  const changesText = (): string => {
    return changesOrder || changesDelete > 0
      ? (changesOrder ? 'Change order' : '') +
          (changesOrder && changesDelete > 0 ? ' & ' : '') +
          (changesDelete > 0 ? `Delete ${changesDelete} item${changesDelete == 1 ? '' : 's'}` : '')
      : 'No changes.';
  };

  const resetState = () => {
    setChangesOrder(false);
    setChangesDelete(0);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Edit Templates" size="lg">
        <Stack>
          <List size="sm">
            <List.Item>
              To change the order, click the arrow button in the direction you want to move.
            </List.Item>
            <List.Item>
              The changes such as sorting or deleting will not be reflected until the Apply button
              is pressed.
            </List.Item>
            <List.Item>
              In the future, I plan to implement a feature that allows users to rename templates.
            </List.Item>
          </List>
          <DataTable
            records={edittingTemplateList}
            columns={[
              {
                accessor: 'move',
                title: (
                  <Group>
                    <IconArrowsUpDown size={14} />
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
                      <IconArrowUp size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant="transparent"
                      color="green"
                      disabled={index === edittingTemplateList.length - 1}
                      onClick={() => moveDownArrayIndex(index)}
                    >
                      <IconArrowDown size={18} />
                    </ActionIcon>
                  </Box>
                ),
              },
              {
                accessor: 'label',
              },
              // { accessor: 'value' },
              {
                accessor: 'actions',
                title: <Text mr="xs">Row actions</Text>,
                textAlignment: 'right',
                render: (_item, index) => (
                  <Group spacing={4} position="right" noWrap>
                    <ActionIcon
                      variant="light"
                      color="red"
                      size="sm"
                      onClick={() => deleteItem(index)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ),
              },
            ]}
            idAccessor="label"
            height={300}
          />
        </Stack>
        <Group position="apart" mt="lg">
          <Button variant="default" size="xs" onClick={close}>
            Close
          </Button>
          <Group>
            <Text size="sm" c="dimmed">
              {changesText()}
            </Text>
            <Button size="xs" color="cyan" onClick={applyChanges}>
              Apply
            </Button>
          </Group>
        </Group>
      </Modal>
    </>
  );
};
