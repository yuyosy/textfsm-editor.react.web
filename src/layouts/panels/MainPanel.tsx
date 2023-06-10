import ResizeHandle from '@/components/resizable-panels/ResizeHandle';
import { Panel, PanelGroup } from 'react-resizable-panels';

export const MainPanel = () => {
  return (
    <PanelGroup direction="vertical" autoSaveId="persistence">
      <Panel>
        <PanelGroup direction="horizontal">
          <Panel>left</Panel>
          <ResizeHandle />
          <Panel>center</Panel>
          <ResizeHandle />
          <Panel collapsible>right</Panel>
        </PanelGroup>
      </Panel>
      <ResizeHandle />
      <Panel collapsible>bottom</Panel>
    </PanelGroup>
  );
};
