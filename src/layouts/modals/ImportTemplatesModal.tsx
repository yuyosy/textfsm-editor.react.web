import {
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Notification,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { Dropzone, FileRejection, FileWithPath } from '@mantine/dropzone';
import { useLocalStorage } from '@mantine/hooks';
import { IconFileCode, IconUpload, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { TemplateInfo } from './types';

type Props = {
  opened: boolean;
  close: () => void;
};

export const ImportTemplatesModal = ({ opened, close }: Props) => {
  // Local Storage
  const [templateList, setTemplateList] = useLocalStorage<TemplateInfo[]>({
    key: 'editor-template-list',
    defaultValue: [],
  });

  // States
  const [importTargetFiles, setImportTargetFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);

  const importTemplates = () => {
    const namesInTemplateList = new Set(templateList.map((item) => item.label));
    let newArr = [...templateList];
    const filtered = importTargetFiles.filter((item) => !namesInTemplateList.has(item.name));
    filtered.map(async (item) => {
      try {
        const text = await item.text();
        return [...newArr, ...JSON.parse(text)];
      } catch (error) {
        console.warn(error);
        return newArr;
      }
    });
    setTemplateList(newArr);
  };

  const dropFiles = (files: FileWithPath[]) => {
    const namesInAlreadyFiles = new Set(importTargetFiles.map((item) => item.name));
    setImportTargetFiles([
      ...importTargetFiles,
      ...files.filter((item) => !namesInAlreadyFiles.has(item.name)),
    ]);
  };

  const rejectFiles = (files: FileRejection[]) => {
    const namesInAlreadyFiles = new Set(rejectedFiles.map((item) => item.file.name));
    setRejectedFiles([
      ...rejectedFiles,
      ...files.filter((item) => !namesInAlreadyFiles.has(item.file.name)),
    ]);
  };

  const deleteImportTargetFilesItem = (index: number) => {
    if (importTargetFiles.length === 0) return;
    setImportTargetFiles(importTargetFiles.filter((_, i) => i !== index));
  };
  const deleteRejectedFilesItem = (index: number) => {
    if (rejectedFiles.length === 0) return;
    setRejectedFiles(rejectedFiles.filter((_, i) => i !== index));
  };

  const resetState = () => {
    setImportTargetFiles([]);
    setRejectedFiles([]);
  };

  // Hook
  useEffect(() => {
    resetState();
  }, [opened]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Import Templates" size="lg">
        <Stack>
          <Text>Import JSON and add templates.</Text>
          <Dropzone
            onDrop={dropFiles}
            onReject={rejectFiles}
            maxSize={3 * 1024 ** 2}
            accept={['application/json']}
            multiple
          >
            <Group position="center" spacing="xl">
              <Dropzone.Accept>
                <IconUpload size={32} stroke={1.2} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size={32} stroke={1.2} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconFileCode size={32} stroke={1.2} />
              </Dropzone.Idle>
              <Box>
                <Text inline>Drag JSON files here or click to select files</Text>
              </Box>
            </Group>
          </Dropzone>
          <Divider label="Selected Files" labelPosition="center" />
          <ScrollArea h={250}>
            <Stack>
              {importTargetFiles.map((item: File, index) => {
                return (
                  <Notification
                    key={item.name}
                    title={item.name}
                    onClose={() => deleteImportTargetFilesItem(index)}
                    withBorder
                  ></Notification>
                );
              })}
              {rejectedFiles.map((item, index) => {
                const errors = item.errors.map((err) => {
                  return <Text size="sm">{err.message}</Text>;
                });
                return (
                  <Notification
                    key={'error' + item.file.name}
                    title={item.file.name}
                    color="red"
                    onClose={() => deleteRejectedFilesItem(index)}
                    withBorder
                  >
                    {errors}
                  </Notification>
                );
              })}
            </Stack>
          </ScrollArea>
        </Stack>
        <Group position="apart" mt="lg">
          <Button variant="default" size="xs" onClick={close}>
            Close
          </Button>
          <Button size="xs" color="cyan" onClick={importTemplates}>
            Import
          </Button>
        </Group>
      </Modal>
    </>
  );
};
