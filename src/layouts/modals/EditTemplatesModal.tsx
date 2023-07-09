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

  // Hook
  useEffect(() => {
    setEdittingTemplateList([...templateList]);
  }, [opened]);

  const moveUpArrayIndex = (index: number) => {
    if (index === 0) return;
    const newArr = [...edittingTemplateList];
    [newArr[index], newArr[index - 1]] = [newArr[index - 1], newArr[index]];
    setEdittingTemplateList(newArr);
  };

  const moveDownArrayIndex = (index: number) => {
    if (index === edittingTemplateList.length - 1) return;
    const newArr = [...edittingTemplateList];
    [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
    setEdittingTemplateList(newArr);
  };

  const deleteItem = (index: number) => {
    if (edittingTemplateList.length === 0) return;
    setEdittingTemplateList(edittingTemplateList.filter((_, i) => i !== index));
  };

  const applyChanges = () => {
    setTemplateList(edittingTemplateList);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Edit Templates" size="lg">
        <Stack>
          <List size="xs">
            <List.Item>
              To change the order, click the arrow button in the direction you want to move.
            </List.Item>
            <List.Item>
              The changes such as sorting or deleting will not be reflected until the Apply button
              is pressed.
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
          />
        </Stack>
        <Group position="apart" mt="lg">
          <Button variant="default" size="xs" onClick={close}>
            Close
          </Button>
          <Button size="xs" color="cyan" onClick={applyChanges}>
            Apply
          </Button>
        </Group>
      </Modal>
    </>
  );
};
