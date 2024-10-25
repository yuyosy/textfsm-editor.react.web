import { CopyValueButton } from '@/components/CopyValueButton';
import { Group, Stack, Text } from '@mantine/core';
import { RefObject } from 'react';
import { ImperativePanelHandle, Panel } from 'react-resizable-panels';
import { RawTextEditor } from './RawTextEditor';

interface RawTextEditorPanelProps {
  panelRef: RefObject<ImperativePanelHandle>;
  onResizeHandler: () => void;
}
export const RawTextEditorPanel = ({
  panelRef,
  onResizeHandler,
}: RawTextEditorPanelProps) => {
  return (
    <Panel
      id="data-panel"
      order={1}
      defaultSize={50}
      collapsedSize={0}
      minSize={10}
      collapsible={true}
      ref={panelRef}
      onResize={onResizeHandler}
    >
      <Stack gap={0} h="100%">
        <Group px={10} py={8} justify="space-between">
          <Text fw={700}>Data</Text>
          <CopyValueButton value={'getRawTextValue()'}></CopyValueButton>
        </Group>
        <RawTextEditor />
      </Stack>
    </Panel>
  );
};
