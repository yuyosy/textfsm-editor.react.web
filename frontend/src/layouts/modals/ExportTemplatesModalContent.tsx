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
import { useAtomValue } from 'jotai';

import { savedTemplateListAtom } from '@/features/state/storageAtoms';
import { useFileSave } from '@/hooks/useFileSave';
import { getCurrentDateTimeString } from '@/utils/datetime';

type ModalContentProps = {
  close: () => void;
  focusRef: MutableRefObject<HTMLDivElement>;
};

type TransferListData = [
  { value: string; label: string }[],
  { value: string; label: string }[],
];

export const ExportTemplatesModalContent = ({ close, focusRef }: ModalContentProps) => {
  const readTemplateList = useAtomValue(savedTemplateListAtom);

  const [transferListData] = useState<TransferListData>([
    [
      ...readTemplateList.map((item, index) => {
        return { value: index.toString(), label: item.label };
      }),
    ],
    [],
  ]);

  const textInputRef = useRef<HTMLInputElement>(null);
  const [handleSave] = useFileSave();
  const [activeStep, setActiveStep] = useState(0);
  const [defaultFileName, setDefaultFileName] = useState('');
  const nextStep = () => {
    setDefaultFileName(
      getCurrentDateTimeString('export-templates_yyyymmdd-hhmmss.json')
    );
    setActiveStep(current => (current < 2 ? current + 1 : current));
  };
  const prevStep = () => setActiveStep(current => (current > 0 ? current - 1 : current));

  const exportTemplates = () => {
    // const defaultFileName = getCurrentDateTimeString('export-templates_yyyymmdd-hhmmss.json');
    const fileName = textInputRef.current?.value
      ? textInputRef.current?.value
      : defaultFileName;
    const targetIndices = transferListData[1].map(item => item.value);
    const data = JSON.stringify(
      readTemplateList.filter((_, index) => targetIndices.includes(index.toString()))
    );
    handleSave(fileName, data);
    close();
  };

  // // Hook
  // useEffect(() => {
  //   setActiveStep(0);
  //   setTransferListData([
  //     [
  //       ...templateList.map((item, index) => {
  //         return { value: index.toString(), label: item.label };
  //       }),
  //     ],
  //     [],
  //   ]);
  // }, [opened]);

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title>Export Templates</Modal.Title>
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
              <Stack>
                <Divider my="sm" />
                {/* <TransferList
                  value={transferListData}
                  onChange={setTransferListData}
                  searchPlaceholder="Search..."
                  nothingFound="Nothing here"
                  titles={['Unselected', 'Selected']}
                  breakpoint="sm"
                  transferAllMatchingFilter
                ></TransferList> */}
              </Stack>
              <Group justify="space-between" mt="lg">
                <Button variant="default" size="xs" onClick={close}>
                  Close
                </Button>
                <Button
                  size="xs"
                  onClick={nextStep}
                  disabled={!transferListData[1].length}
                >
                  Next step
                </Button>
              </Group>
            </Stepper.Step>
            <Stepper.Step label="Step 2" description="Export templates JSON">
              <Stack>
                <Divider my="sm" />
                <List size="xs">
                  <List.Item>
                    If the file name is not specified, it will be exported with the
                    default file name.
                  </List.Item>
                  <List.Item>
                    Default file name : `export-templates_yyyymmdd-hhmmss.json`
                  </List.Item>
                </List>
                <TextInput
                  ref={textInputRef}
                  placeholder={defaultFileName}
                  label="Export file name"
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
                  <Button size="xs" onClick={exportTemplates}>
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
