import { useState } from 'react';

import { Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useSetAtom } from 'jotai';

import {
  rawTextEditorValueAtom,
  templateEditorValueAtom,
} from '@/features/state/storageAtoms';
import { HistoryAutoSaveItem } from '@/types';

import { HistoryDataTable } from './HistoryDataTable';
import { ModalContentProps } from './types';

export const HistoryModalContent = ({ focusRef, close }: ModalContentProps) => {
  const setTemplateEditorValue = useSetAtom(templateEditorValueAtom);
  const setRawTextEditorValue = useSetAtom(rawTextEditorValueAtom);

  const [selectedHistory, setSelectedHistory] = useState<HistoryAutoSaveItem | null>(
    null
  );

  const handleSelectHistory = (historyItem: HistoryAutoSaveItem) => {
    setSelectedHistory(historyItem);
  };

  const handleLoadHistory = () => {
    if (selectedHistory) {
      setRawTextEditorValue(selectedHistory.data);
      setTemplateEditorValue(selectedHistory.template);
      close();
    }
  };

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title fz={18} fw={700}>
          History
        </Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <Stack ref={focusRef} p={8}>
          <Stack gap={2}>
            <Text size="sm" c="dimmed">
              When you send a parse request, the values of Data, Template, and Result are
              temporarily stored. If the limit is reached, the oldest ones are removed.
            </Text>
            <Text size="sm" c="dimmed">
              You can enable/disable and change the retention limit in the Options.
            </Text>
          </Stack>
          <HistoryDataTable onSelect={handleSelectHistory} />
          <TextInput
            label="Selected Template"
            value={selectedHistory?.timestamp || ''}
            readOnly
          />
        </Stack>
        <Group justify="space-between" mt="lg">
          <Button variant="default" size="xs" onClick={close}>
            Close
          </Button>
          <Button
            size="xs"
            color="cyan"
            onClick={handleLoadHistory}
            disabled={!selectedHistory}
          >
            Load History
          </Button>
        </Group>
      </Modal.Body>
    </Modal.Content>
  );
};
