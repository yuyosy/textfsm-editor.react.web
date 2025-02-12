import { Modal, Stack, Stepper, Text } from '@mantine/core';
import { MutableRefObject, useState } from 'react';
import { ExportTemplatesSection } from './ExportTemplatesSection';
import { SelectTemplatesSection } from './SelectTemplatesSection';
import { useExportTemplates } from './hooks/useExportTemplates';

type ModalContentProps = {
  close: () => void;
  focusRef: MutableRefObject<HTMLDivElement>;
};

export const ExportTemplatesModalContent = ({ close, focusRef }: ModalContentProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const exportTemplates = useExportTemplates();

  const nextStep = () => setActiveStep(current => (current < 2 ? current + 1 : current));
  const prevStep = () => setActiveStep(current => (current > 0 ? current - 1 : current));

  const proceedToNextStep = () => {
    nextStep();
  };

  const returnToPreviousStep = () => prevStep();

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
              <SelectTemplatesSection
                close={close}
                proceedToNextStep={proceedToNextStep}
                exportTemplates={exportTemplates}
              />
            </Stepper.Step>
            <Stepper.Step label="Step 2" description="Export templates JSON">
              <ExportTemplatesSection
                close={close}
                returnToPreviousStep={returnToPreviousStep}
                selectedTemplateNames={exportTemplates.selectedTemplateNames}
              />
            </Stepper.Step>
          </Stepper>
        </Stack>
      </Modal.Body>
    </Modal.Content>
  );
};
