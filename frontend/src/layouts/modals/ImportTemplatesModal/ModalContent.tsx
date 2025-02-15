import { addNotificationAtom } from '@/features/state/atoms';
import { savedTemplateListAtom } from '@/features/state/storageAtoms';
import { Button, Group, Modal, Stack, Stepper, Text } from '@mantine/core';
import { FileRejection } from '@mantine/dropzone';
import { useAtom, useSetAtom } from 'jotai';
import { useRef, useState } from 'react';
import { TemplateInfo } from '../types';
import { DropzoneSection } from './DropzoneSection';
import { useParseJsonTemplates } from './hooks/useParseJsonTemplates';
import { ImportSelectionSection } from './ImportSelectionSection';
import { TemplateListSection } from './TemplateListSection';
import { LoadedJsonData, ModalContentProps } from './types';

export const ImportTemplatesModalContent = ({ close, focusRef }: ModalContentProps) => {
  const addNotification = useSetAtom(addNotificationAtom);
  const [templateList, setTemplateList] = useAtom(savedTemplateListAtom);
  const [selectedJsonFiles, setSelectedJsonFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [availableTemplates, setAvailableTemplates] = useState<string[]>([]);
  const [processedJsonData, setProcessedJsonData] = useState<LoadedJsonData[]>([]);
  const openRef = useRef<() => void>(null);

  const initialRightData: string[] = [];

  const nextStep = () => setActiveStep(current => (current < 3 ? current + 1 : current));
  const prevStep = () => setActiveStep(current => (current > 0 ? current - 1 : current));

  const { parseJsonTemplates } = useParseJsonTemplates();

  const proceedToValidationStep = () => {
    nextStep();
    parseJsonTemplates(selectedJsonFiles, setProcessedJsonData, templateList);
  };
  const proceedToSelectionStep = () => {
    setAvailableTemplates(
      processedJsonData.filter(item => !item.hasFormatError).map(item => item.label)
    );
    nextStep();
  };

  const returnToPreviousStep = () => prevStep();

  const handleTransferChange = (_leftData: string[], rightData: string[]) => {
    setSelectedTemplates(rightData);
  };

  const saveSelectedTemplates = async () => {
    const newTemplateList: TemplateInfo[] = [
      ...templateList,
      ...processedJsonData
        .filter(item => selectedTemplates.includes(item.label))
        .map(item => ({
          label: item.label,
          value: item.value,
        })),
    ];
    setTemplateList(newTemplateList);
    addNotification({
      type: 'success',
      title: 'Templates imported',
      message:
        selectedTemplates.length === 1
          ? `Imported: ${selectedTemplates.length} file`
          : `Imported: ${selectedTemplates.length} files`,
    });
    close();
  };

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title fz={18} fw={700}>
          Import Templates
        </Modal.Title>
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
            p={8}
          >
            <Stepper.Step label="Step 1" description="Load templates JSON">
              <DropzoneSection
                openRef={openRef}
                selectedJsonFiles={selectedJsonFiles}
                rejectedFiles={rejectedFiles}
                setSelectedJsonFiles={setSelectedJsonFiles}
                setRejectedFiles={setRejectedFiles}
              />
              <Group justify="space-between" mt="lg">
                <Button variant="default" size="xs" onClick={close}>
                  Close
                </Button>
                <Button
                  size="xs"
                  onClick={proceedToValidationStep}
                  disabled={!selectedJsonFiles.length}
                >
                  Next step
                </Button>
              </Group>
            </Stepper.Step>
            <Stepper.Step label="Step 2" description="List of templates">
              <TemplateListSection processedJsonData={processedJsonData} />
              <Group justify="space-between" mt="lg">
                <Button variant="default" size="xs" onClick={close}>
                  Close
                </Button>
                <Group>
                  <Button variant="default" size="xs" onClick={returnToPreviousStep}>
                    Back
                  </Button>
                  <Button size="xs" onClick={proceedToSelectionStep}>
                    Select Templates
                  </Button>
                </Group>
              </Group>
            </Stepper.Step>
            <Stepper.Step label="Step 3" description="Import templates">
              <ImportSelectionSection
                availableTemplates={availableTemplates}
                initialRightData={initialRightData}
                handleTransferChange={handleTransferChange}
              />
              <Group justify="space-between" mt="lg">
                <Button variant="default" size="xs" onClick={close}>
                  Close
                </Button>
                <Group>
                  <Button variant="default" size="xs" onClick={returnToPreviousStep}>
                    Back
                  </Button>
                  <Button
                    size="xs"
                    onClick={saveSelectedTemplates}
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
