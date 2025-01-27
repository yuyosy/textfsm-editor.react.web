import { savedTemplateListAtom } from '@/features/state/storageAtoms';
import {
  ActionIcon,
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
  Tooltip,
} from '@mantine/core';
import { Dropzone, FileRejection, FileWithPath } from '@mantine/dropzone';
import { useAtom } from 'jotai';
import { FileJson, Upload, X } from 'lucide-react';
import { DataTable } from 'mantine-datatable';
import { MutableRefObject, useRef, useState } from 'react';

import { TransferList } from '@/components/TransferList';
import 'mantine-datatable/styles.layer.css';
import { TemplateInfo } from './types';

type ImportedTemplateInfo = {
  fileName: string;
  templateInfo: TemplateInfo[];
  hasFormatError: boolean;
};
type LoadedJsonData = {
  fileName: string;
  label: string;
  labelOrigin: string;
  value: string;
  isDuplicate: boolean;
  isAlreadySaved: boolean;
  hasFormatError: boolean;
};

type ModalContentProps = {
  close: () => void;
  focusRef: MutableRefObject<HTMLDivElement>;
};

export const ImportTemplatesModalContent = ({ close, focusRef }: ModalContentProps) => {
  const [templateList, setTemplateList] = useAtom(savedTemplateListAtom);
  const [importTargetFiles, setImportTargetFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [leftData, setLeftData] = useState<string[]>([]);
  const [loadedJsonData, setLoadedJsonData] = useState<LoadedJsonData[]>([]);
  const openRef = useRef<() => void>(null);

  const initialRightData: string[] = [];

  const nextStep = () => setActiveStep(current => (current < 3 ? current + 1 : current));
  const prevStep = () => setActiveStep(current => (current > 0 ? current - 1 : current));
  const nextValidateStep = () => {
    nextStep();
    loadJsonFiles();
  };
  const nextImportStep = () => {
    setLeftData(
      loadedJsonData.filter(item => !item.hasFormatError).map(item => item.label)
    );
    nextStep();
  };

  const handleTransferChange = (_leftData: string[], rightData: string[]) => {
    setSelectedTemplates(rightData);
  };

  const checkLoadedJsonFiles = (results: ImportedTemplateInfo[]): LoadedJsonData[] => {
    const getLoadedJsonData = (
      item: ImportedTemplateInfo,
      label: string,
      labelOrigin: string,
      value: string,
      hasFormatError: boolean,
      isDuplicate: boolean,
      isAlreadySaved: boolean
    ) => {
      return {
        fileName: item.fileName,
        label: label,
        labelOrigin: labelOrigin,
        value: value,
        isDuplicate: isDuplicate,
        isAlreadySaved: isAlreadySaved,
        hasFormatError: hasFormatError,
      };
    };
    if (!Array.isArray(results)) {
      return [];
    }
    const processedJsonData: LoadedJsonData[] = [];
    const namesInTemplateList = new Set(templateList.map(item => item.label));

    const renameLabel = (label: string) => {
      // if dupulicate or already saved, add number suffix to label. if added suffix is already used, add another suffix.
      let suffix = 1;
      while (
        processedJsonData.some(item => item.label === label) ||
        namesInTemplateList.has(label)
      ) {
        label = `${label}_${suffix}`;
        suffix++;
      }
      return label;
    };

    for (const item of results) {
      if (item.hasFormatError) {
        processedJsonData.push(
          getLoadedJsonData(item, '-', '-', '', true, false, false)
        );
      }
      if (!Array.isArray(item.templateInfo) || item.templateInfo === null) {
        processedJsonData.push(
          getLoadedJsonData(item, '-', '-', '', false, false, false)
        );
      }

      for (const data of item.templateInfo) {
        if (!data) continue;
        const isDuplicate = processedJsonData.some(item => item.label === data.label);
        const isAlreadySaved = namesInTemplateList.has(data.label);
        const hasFormatError = !('label' in data && 'value' in data);
        let label = data.label;
        if (isDuplicate || isAlreadySaved) {
          label = `${label}_${item.fileName}`;
        }
        label = renameLabel(label);
        const loadedJsonData = getLoadedJsonData(
          item,
          label,
          data.label,
          data.value,
          hasFormatError,
          isDuplicate,
          isAlreadySaved
        );
        processedJsonData.push(loadedJsonData);
      }
    }
    return processedJsonData;
  };
  const loadJsonFiles = async () => {
    const promises = importTargetFiles.map(async item => {
      try {
        const text = await item.text();
        console.log(text);
        return {
          fileName: item.name,
          templateInfo: JSON.parse(text) as TemplateInfo[],
          hasFormatError: false,
        };
      } catch (error) {
        return {
          fileName: item.name,
          templateInfo: [],
          hasFormatError: true,
        };
      }
    });
    const results = await Promise.all(promises);
    console.log(results);
    const checkedData = checkLoadedJsonFiles(results);
    console.log(checkedData);
    setLoadedJsonData(checkedData);
  };

  const importTemplates = async () => {
    const newTemplateList = [...templateList];
    newTemplateList.push(
      ...loadedJsonData.filter(item => selectedTemplates.includes(item.label))
    );
    setTemplateList(newTemplateList);
    close();
  };

  const dropFiles = (files: FileWithPath[]) => {
    const namesInAlreadyFiles = new Set(importTargetFiles.map(item => item.name));
    setImportTargetFiles([
      ...importTargetFiles,
      ...files.filter(item => !namesInAlreadyFiles.has(item.name)),
    ]);
  };

  const rejectFiles = (files: FileRejection[]) => {
    const namesInAlreadyFiles = new Set(rejectedFiles.map(item => item.file.name));
    setRejectedFiles([
      ...rejectedFiles,
      ...files.filter(item => !namesInAlreadyFiles.has(item.file.name)),
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

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title>Import Templates</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <Stack ref={focusRef}>
          <Text>Load JSON and import templates.</Text>
          <Stepper
            active={activeStep}
            onStepClick={setActiveStep}
            size="sm"
            allowNextStepsSelect={false}
          >
            <Stepper.Step label="Step 1" description="Load templates JSON">
              <Stack>
                <Divider my="xs" />
                <Dropzone
                  openRef={openRef}
                  onDrop={dropFiles}
                  onReject={rejectFiles}
                  activateOnClick={false}
                  maxSize={3 * 1024 ** 2}
                  accept={['application/json']}
                  multiple
                  p={10}
                  style={{ border: '1px dashed #666', borderRadius: '4px' }}
                >
                  <Group
                    justify="center"
                    gap="xl"
                    onClick={() => openRef.current?.()}
                    style={{ cursor: 'pointer' }}
                  >
                    <Dropzone.Accept>
                      <Upload size={32} strokeWidth={1.2} />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <X size={32} strokeWidth={1.2} />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <FileJson size={32} strokeWidth={1.2} />
                    </Dropzone.Idle>
                    <Box>
                      <Text inline>Drag JSON files here or click to here</Text>
                    </Box>
                  </Group>
                  <Divider
                    label="Selected Files"
                    labelPosition="center"
                    variant="dashed"
                  />
                  <ScrollArea h={250}>
                    <Stack gap="xs">
                      {importTargetFiles.map((item: File, index) => {
                        return (
                          <Notification
                            key={item.name}
                            title={item.name}
                            onClose={() => deleteImportTargetFilesItem(index)}
                            py={2}
                            withBorder
                          ></Notification>
                        );
                      })}
                      {rejectedFiles.map((item, index) => {
                        const errors = item.errors.map((err, index) => {
                          return (
                            <Text size="sm" key={`errormsg_${item.file.name}_${index}`}>
                              {err.message}
                            </Text>
                          );
                        });
                        return (
                          <Notification
                            key={'error_' + item.file.name}
                            title={item.file.name}
                            color="red"
                            onClose={() => deleteRejectedFilesItem(index)}
                            py={2}
                            withBorder
                          >
                            {errors}
                          </Notification>
                        );
                      })}
                    </Stack>
                  </ScrollArea>
                </Dropzone>
              </Stack>
              <Group justify="space-between" mt="lg">
                <Button variant="default" size="xs" onClick={close}>
                  Close
                </Button>
                <Button
                  size="xs"
                  onClick={nextValidateStep}
                  disabled={!importTargetFiles.length}
                >
                  Next step
                </Button>
              </Group>
            </Stepper.Step>
            <Stepper.Step label="Step 2" description="List of templates">
              <Stack>
                <Divider my="xs" />
                {/* <Text size="sm" c="dimmed">
                  If the template has the same name as an already saved template, it will
                  be renamed before importing. If the imported template has the same
                  name, it will be renamed before importing. Saved templates can be
                  edited from `Edit Template`.
                </Text> */}
                <DataTable
                  records={loadedJsonData}
                  columns={[
                    {
                      accessor: 'label',
                      render: item => (
                        <Stack gap={0}>
                          <Text size="sm">{item.label}</Text>
                          {item.label !== item.labelOrigin && (
                            <Text size="xs" c="dimmed">
                              renamed from {item.labelOrigin}
                            </Text>
                          )}
                        </Stack>
                      ),
                    },
                    {
                      accessor: 'sourceFile',
                      textAlign: 'center',
                      render: item => {
                        return (
                          <Tooltip label={item.fileName} position="bottom">
                            <ActionIcon variant="default">
                              <FileJson size={16} strokeWidth={1.2} />
                            </ActionIcon>
                          </Tooltip>
                        );
                      },
                    },
                    {
                      accessor: 'state',
                      render: item => {
                        const status = [];
                        if (item.isDuplicate) status.push('Duplicate');
                        if (item.isAlreadySaved) status.push('Already Saved');
                        if (item.hasFormatError) status.push('Format Error');
                        return <Text size="xs">{status.join(', ')}</Text>;
                      },
                    },
                  ]}
                  idAccessor={item => item.fileName + item.label}
                />
              </Stack>
              <Group justify="space-between" mt="lg">
                <Button variant="default" size="xs" onClick={close}>
                  Close
                </Button>
                <Group>
                  <Button variant="default" size="xs" onClick={prevStep}>
                    Back
                  </Button>
                  <Button size="xs" onClick={nextImportStep}>
                    Select Templates
                  </Button>
                </Group>
              </Group>
            </Stepper.Step>
            <Stepper.Step label="Step 3" description="Import templates">
              <Stack>
                <Divider my="sm" />
                <List size="xs">
                  <List.Item>
                    Templates with the same name as those already saved cannot be
                    imported and will be excluded from the list.
                  </List.Item>
                </List>
                <TransferList
                  initialLeftData={leftData}
                  initialRightData={initialRightData}
                  leftSearchPlaceholder="Search unselected templates..."
                  rightSearchPlaceholder="Search selected templates..."
                  onChange={handleTransferChange}
                />
              </Stack>
              <Group justify="space-between" mt="lg">
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
                    disabled={!selectedTemplates.length}
                  >
                    Import Templates
                  </Button>
                </Group>
              </Group>
            </Stepper.Step>
          </Stepper>
        </Stack>
      </Modal.Body>
    </Modal.Content>
  );
};
