import { MutableRefObject, useRef, useState } from 'react';

import {
  Button,
  Divider,
  Group,
  List,
  Modal,
  Stack,
  Stepper,
  Text,
  TextInput,
} from '@mantine/core';
import { useAtomValue, useSetAtom } from 'jotai';

import { TransferList } from '@/components/TransferList';
import { savedTemplateListAtom } from '@/features/state/storageAtoms';
import { useFileSave } from '@/hooks/useFileSave';
import { getCurrentDateTimeString } from '@/utils/datetime';

import { addNotificationAtom } from '@/features/state/atoms';

type ModalContentProps = {
  close: () => void;
  focusRef: MutableRefObject<HTMLDivElement>;
};

export const ExportTemplatesModalContent = ({ close, focusRef }: ModalContentProps) => {
  const addNotification = useSetAtom(addNotificationAtom);
  const savedTemplates = useAtomValue(savedTemplateListAtom);
  const textInputRef = useRef<HTMLInputElement>(null);
  const [handleFileExport] = useFileSave();
  const [activeStep, setActiveStep] = useState(0);
  const [defaultExportFileName, setDefaultExportFileName] = useState('');
  const [selectedTemplateNames, setSelectedTemplateNames] = useState<string[]>([]);

  const initialLeftData = savedTemplates.map(template => template.label);
  const initialRightData: string[] = [];

  const nextStep = () => setActiveStep(current => (current < 2 ? current + 1 : current));
  const prevStep = () => setActiveStep(current => (current > 0 ? current - 1 : current));

  const proceedToNextStep = () => {
    setDefaultExportFileName(
      getCurrentDateTimeString('textfsm-editor_exported-templates_yyyymmdd-hhmmss.json')
    );
    nextStep();
  };

  const returnToPreviousStep = () => prevStep();

  const handleTransferChange = (_leftData: string[], rightData: string[]) => {
    setSelectedTemplateNames(rightData);
  };

  const saveSelectedTemplatesToFile = () => {
    const fileName = textInputRef.current?.value
      ? textInputRef.current?.value
      : defaultExportFileName;

    const selectedTemplateData = savedTemplates.filter(template =>
      selectedTemplateNames.includes(template.label)
    );

    const data = JSON.stringify(selectedTemplateData);
    handleFileExport(fileName, data);
    addNotification({
      type: 'success',
      title: 'Templates exported',
      message: `Exported: ${fileName}`,
    });

    close();
  };

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title fz={18} fw={700}>
          Export Templates
        </Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <Stack ref={focusRef}>
          <Text>Export saved templates as a JSON file.</Text>
          <Stepper
            active={activeStep}
            onStepClick={setActiveStep}
            size="sm"
            allowNextStepsSelect={false}
          >
            <Stepper.Step label="Step 1" description="Select templates">
              <Stack p={8}>
                <Divider my="sm" />
                <TransferList
                  initialLeftData={initialLeftData}
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
                <Button
                  size="xs"
                  onClick={proceedToNextStep}
                  disabled={!selectedTemplateNames.length}
                >
                  Next step
                </Button>
              </Group>
            </Stepper.Step>
            <Stepper.Step label="Step 2" description="Export templates JSON">
              <Stack p={8}>
                <Divider my="sm" />
                <List size="xs">
                  <List.Item>
                    If the file name is not specified, it will be exported with the
                    default file name.
                  </List.Item>
                  <List.Item>
                    Default file name :
                    `textfsm-editor_exported-templates_yyyymmdd-hhmmss.json`
                  </List.Item>
                </List>
                <TextInput
                  ref={textInputRef}
                  placeholder="Enter file name..."
                  label="Export file name"
                  value={defaultExportFileName}
                  onChange={e => setDefaultExportFileName(e.target.value)}
                />
              </Stack>
              <Group justify="space-between" mt="lg">
                <Button variant="default" size="xs" onClick={close}>
                  Close
                </Button>
                <Group>
                  <Button variant="default" size="xs" onClick={returnToPreviousStep}>
                    Back
                  </Button>
                  <Button size="xs" onClick={saveSelectedTemplatesToFile}>
                    Export Templates
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
