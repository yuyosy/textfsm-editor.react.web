import {
  Box,
  Button,
  Divider,
  Group,
  List,
  Modal,
  Notification,
  ScrollArea,
  Stack,
  Stepper,
  Text,
  TransferList,
  TransferListData,
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
  const [activeStep, setActiveStep] = useState(0);
  const nextStep = () => {
    setActiveStep((current) => (current < 2 ? current + 1 : current));
    loadJsonFiles();
  };
  const prevStep = () => setActiveStep((current) => (current > 0 ? current - 1 : current));
  const [transferListData, setTransferListData] = useState<TransferListData>([[], []]);

  const loadJsonFiles = async () => {
    const promises: Promise<TemplateInfo[]>[] = importTargetFiles.map(async (item) => {
      try {
        const text = await item.text();
        return JSON.parse(text);
      } catch (error) {
        console.warn(error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    const namesInTemplateList = new Set(templateList.map((item) => item.label));
    const filtered = results
      .filter((result) => result !== null)
      .flat()
      .filter((item) => !namesInTemplateList.has(item.label));
    setTransferListData([[], filtered]);
  };

  const importTemplates = async () => {
    let newArr = [...templateList];
    newArr = [...newArr, ...transferListData[1]];
    setTemplateList(newArr);
    close();
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
    setActiveStep(0);
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
          <Text>Load JSON and import templates.</Text>
          <Stepper
            active={activeStep}
            onStepClick={setActiveStep}
            breakpoint="sm"
            allowNextStepsSelect={false}
          >
            <Stepper.Step label="Step 1" description="Load templates JSON">
              <Stack>
                <Divider my="sm" />
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
                <Divider label="Selected Files" labelPosition="center" variant="dashed" />
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
                <Button size="xs" onClick={nextStep} disabled={!importTargetFiles.length}>
                  Next step
                </Button>
              </Group>
            </Stepper.Step>
            <Stepper.Step label="Step 2" description="Import templates">
              <Stack>
                <Divider my="sm" />
                <List size="xs">
                  <List.Item>
                    Templates with the same name as those already saved cannot be imported and will
                    be excluded from the list.
                  </List.Item>
                </List>
                <TransferList
                  value={transferListData}
                  onChange={setTransferListData}
                  searchPlaceholder="Search..."
                  nothingFound="Nothing here"
                  titles={['Unselected', 'Selected']}
                  breakpoint="sm"
                  transferAllMatchingFilter
                ></TransferList>
              </Stack>
              <Group position="apart" mt="lg">
                <Button variant="default" size="xs" onClick={close}>
                  Close
                </Button>
                <Group>
                  <Button variant="default" size="xs" onClick={prevStep}>
                    Back
                  </Button>
                  <Button
                    size="xs"
                    onClick={importTemplates}
                    disabled={!transferListData[1].length}
                  >
                    Import Templates
                  </Button>
                </Group>
              </Group>
            </Stepper.Step>
          </Stepper>
        </Stack>
      </Modal>
    </>
  );
};
