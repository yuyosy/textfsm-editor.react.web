import ResizeHandle from '@/components/resizable-panels/ResizeHandle';
import { Group, Stack, Text } from '@mantine/core';
import { OnChange } from '@monaco-editor/react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { sendTextFSMParseRequest } from '@/features/request/sendTextFSMParseRequest';
import { NotificationPanel } from './NotificationPanel';
import { useRef } from 'react';
import { ResultViewPanel } from './ResultViewPanel';
import { SimpleEditorPanel } from './SimpleEditorPanel';
import { TextFSMEditorPanel } from './TextFSMEditorPanel';
// import { testData, testTemplate } from './testData';

export const MainPanel = () => {
  const notificationPanelRef = useRef<any>();
  const resultViewPanelRef = useRef<any>();

  const values: EditorValues = {
    dataEditorValue: '',
    templateEditorValue: '',
    // dataEditorValue: testData,
    // templateEditorValue: testTemplate,
  };

  const sendRequest = async (values: EditorValues) => {
    const result = await sendTextFSMParseRequest(values);
    if (notificationPanelRef.current) {
      notificationPanelRef.current.prependResult(result);
    }
    if (resultViewPanelRef.current && result.ok && result.results.ok) {
      resultViewPanelRef.current.setResults(
        result.results.headers.map((item) => {
          return { accessor: item };
        }),
        result.results.results
      );
    }
    console.log(result);
  };

  const dataStringDeliver = () => {
    return values.dataEditorValue;
  };
  const templateStringDeliver = () => {
    return values.templateEditorValue;
  };

  const onChangeDataEditor: OnChange = (value) => {
    values.dataEditorValue = value === undefined ? '' : value;
    sendRequest(values);
  };
  const onChangeTemplateEditor: OnChange = (value) => {
    values.templateEditorValue = value === undefined ? '' : value;
    sendRequest(values);
  };

  return (
    <Stack spacing={0} h="100%">
      <Group px={10} py={8} position="apart">
        <Group>
          <Text size="sm">A</Text>
        </Group>
        <Group>
          <Text size="sm">B</Text>
        </Group>
      </Group>
      <PanelGroup direction="vertical" autoSaveId="persistence">
        <Panel defaultSize={70}>
          <PanelGroup direction="horizontal" autoSaveId="persistence">
            <Panel defaultSize={42}>
              <SimpleEditorPanel
                dataDeliver={dataStringDeliver}
                onChangeFunc={onChangeDataEditor}
              ></SimpleEditorPanel>
            </Panel>
            <ResizeHandle />
            <Panel defaultSize={42}>
              <TextFSMEditorPanel
                dataDeliver={templateStringDeliver}
                onChangeFunc={onChangeTemplateEditor}
              ></TextFSMEditorPanel>
            </Panel>
            <ResizeHandle />
            <Panel defaultSize={16} collapsible>
              <NotificationPanel ref={notificationPanelRef}></NotificationPanel>
            </Panel>
          </PanelGroup>
        </Panel>
        <ResizeHandle />
        <Panel defaultSize={30} collapsible>
          <ResultViewPanel ref={resultViewPanelRef}></ResultViewPanel>
        </Panel>
      </PanelGroup>
    </Stack>
  );
};
