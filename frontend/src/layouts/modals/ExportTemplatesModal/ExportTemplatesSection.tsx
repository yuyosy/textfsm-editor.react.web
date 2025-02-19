import { exportedTemplatesJSON } from '@/features/fileNames';
import { addNotificationAtom } from '@/features/state/atoms';
import { savedTemplateListAtom } from '@/features/state/storageAtoms';
import { useFileSave } from '@/hooks/useFileSave';
import { getCurrentDateTimeString } from '@/utils/datetime';
import { Button, Divider, Group, List, Stack, TextInput } from '@mantine/core';
import { useAtomValue, useSetAtom } from 'jotai';
import { useRef, useState } from 'react';
import { ExportTemplatesSectionProps } from './types';

export const ExportTemplatesSection = ({
  close,
  returnToPreviousStep,
  selectedTemplateNames,
}: ExportTemplatesSectionProps) => {
  const addNotification = useSetAtom(addNotificationAtom);
  const [defaultExportFileName, setDefaultExportFileName] = useState(
    getCurrentDateTimeString(exportedTemplatesJSON)
  );
  const textInputRef = useRef<HTMLInputElement>(null);
  const savedTemplates = useAtomValue(savedTemplateListAtom);
  const [handleFileExport] = useFileSave();

  const saveSelectedTemplatesToFile = () => {
    const fileName = textInputRef.current?.value
      ? textInputRef.current?.value
      : defaultExportFileName;

    console.log(selectedTemplateNames);
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
  };

  return (
    <Stack p={8}>
      <Divider my="sm" />
      <List size="xs">
        <List.Item>
          If the file name is not specified, it will be exported with the default file
          name.
        </List.Item>
        <List.Item>
          Default file name : `textfsm-editor_exported-templates_yyyymmdd-hhmmss.json`
        </List.Item>
      </List>
      <TextInput
        ref={textInputRef}
        placeholder="Enter file name..."
        label="Export file name"
        value={defaultExportFileName}
        onChange={e => setDefaultExportFileName(e.target.value)}
      />
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
    </Stack>
  );
};
