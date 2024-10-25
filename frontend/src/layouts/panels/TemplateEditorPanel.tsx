import { CopyValueButton } from '@/components/CopyValueButton';
import { Group, Stack, Text } from '@mantine/core';
import { RefObject } from 'react';
import { ImperativePanelHandle, Panel } from 'react-resizable-panels';
import { TemplateEditor } from './TemplateEditor';

import { StatusBadge } from '@/components/StatusBadge';
import { responseStateAtom } from '@/features/state/atoms';
import { templateEditorValueAtom } from '@/features/state/storageAtoms';
import { useAtomValue } from 'jotai';

const ResponseState = () => {
  const responseState = useAtomValue(responseStateAtom);
  return <StatusBadge variant={responseState} />;
};
const CopyButton = () => {
  const value = useAtomValue(templateEditorValueAtom);
  return <CopyValueButton value={value} />;
};

interface TemplateEditorPanelProps {
  panelRef: RefObject<ImperativePanelHandle>;
  onResizeHandler: () => void;
}

export const TemplateEditorPanel = ({
  panelRef,
  onResizeHandler,
}: TemplateEditorPanelProps) => {
  return (
    <Panel
      id="template-panel"
      order={2}
      defaultSize={50}
      collapsedSize={0}
      minSize={10}
      collapsible={true}
      ref={panelRef}
      onResize={onResizeHandler}
    >
      <Stack gap={0} h="100%">
        <Group px={10} py={8} justify="space-between">
          <Group>
            <Text fw={700}>Template</Text>
            <ResponseState />
          </Group>
          <CopyButton />
        </Group>
        <TemplateEditor />
      </Stack>
    </Panel>
  );
};
