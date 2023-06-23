import ResizeHandle from '@/components/resizable-panels/ResizeHandle';
import { ActionIcon, CopyButton, Group, ScrollArea, Stack, Text, Tooltip } from '@mantine/core';
import { OnChange } from '@monaco-editor/react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { SimpleEditor } from '@/features/editor/components/SimpleEditor';
import { TextFSMEditor } from '@/features/editor/components/TextFSMEditor';
import { sendTextFSMParseRequest } from '@/features/request/sendTextFSMParseRequest';
import { NotificationPanel } from './NotificationPanel';
import { useRef } from 'react';
import { ResultViewPanel } from './ResultViewPanel';
import { IconCheck, IconCopy } from '@tabler/icons-react';

export const MainPanel = () => {
  const notificationPanelRef = useRef<any>();
  const resultViewPanelRef = useRef<any>();

  const values: EditorValues = {
    dataEditorValue: '',
    templateEditorValue: '',
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
              <Stack spacing={0} h="100%">
                <Group px={10} py={8} position="apart">
                  <Text fw={700}>Data</Text>
                  {/* Not working CopyButton */}
                  <CopyButton value={values.dataEditorValue} timeout={2000}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="bottom">
                        <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                          {copied ? <IconCheck /> : <IconCopy />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                  {/* Not working CopyButton */}
                </Group>
                <SimpleEditor
                  value={values.dataEditorValue}
                  onChangeFunc={onChangeDataEditor}
                ></SimpleEditor>
              </Stack>
            </Panel>
            <ResizeHandle />
            <Panel defaultSize={42}>
              <Stack spacing={0} h="100%">
                <Group px={10} py={8} position="apart">
                  <Text fw={700}>Template</Text>
                  {/* Not working CopyButton */}
                  <CopyButton value={values.templateEditorValue} timeout={2000}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="bottom">
                        <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                          {copied ? <IconCheck /> : <IconCopy />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                  {/* Not working CopyButton */}
                </Group>
                <TextFSMEditor
                  value={values.templateEditorValue}
                  onChangeFunc={onChangeTemplateEditor}
                ></TextFSMEditor>
              </Stack>
            </Panel>
            <ResizeHandle />
            <Panel defaultSize={16} collapsible>
              <Stack spacing={0} h="100%">
                <Group px={10} py={8} position="apart">
                  <Text fw={700}>Console</Text>
                </Group>
                <ScrollArea h="100%">
                  <NotificationPanel ref={notificationPanelRef}></NotificationPanel>
                </ScrollArea>
              </Stack>
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
