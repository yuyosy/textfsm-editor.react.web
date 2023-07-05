import ResizeHandle from '@/components/resizable-panels/ResizeHandle';
import { ActionIcon, Divider, Group, Stack, Switch, Text, Tooltip } from '@mantine/core';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { sendTextFSMParseRequest } from '@/features/request/sendTextFSMParseRequest';
import { NotificationPanel } from './NotificationPanel';
import { useRef } from 'react';
import { ResultViewPanel } from './ResultViewPanel';
import { SimpleEditorPanel } from './SimpleEditorPanel';
import { TextFSMEditorPanel } from './TextFSMEditorPanel';
import { IconSend } from '@tabler/icons-react';
import { useForceUpdate, useLocalStorage } from '@mantine/hooks';
import { ResultObject } from '@/types';
import { setRefValue } from '@/utils/helpers';
import { onChangeEditorWrapper } from '@/features/editor/onChange';
import { TemplateManagerToolBarItem } from './TemplateManagerToolBarItem';
import { OptionToolBarItem } from './OptionToolBarItem';

export const MainPanel = () => {
  // Local Storage
  const [editorAutoParse, setEditorAutoParse] = useLocalStorage<boolean>({
    key: 'editor-auto-parse',
    defaultValue: false,
  });
  const [inputSendDelayValue] = useLocalStorage<number>({
    key: 'editor-input-send-delay',
    defaultValue: 1000,
  });

  // Ref State
  const notificationPanelRef = useRef<any>();
  const resultViewPanelRef = useRef<any>();
  const editorDataValue = useRef<string>('');
  const editorTemplateValue = useRef<string>('');
  const resultObject = useRef<ResultObject>();

  // Functions
  const sendRequest = async () => {
    if (editorTemplateValue.current === '') {
      return;
    }
    setResultObject(
      await sendTextFSMParseRequest(
        editorDataValue.current,
        editorTemplateValue.current,
        inputSendDelayValue
      )
    );
    ParseResult();
  };

  const ParseResult = () => {
    const resultObject = getResultObject();
    if (!resultObject) {
      return;
    }
    if (notificationPanelRef.current) {
      notificationPanelRef.current.prependResult(resultObject);
    }
    if (resultViewPanelRef.current && resultObject.ok && resultObject.response_result.ok) {
      resultViewPanelRef.current.setResults(
        resultObject.response_result.headers.map((item) => {
          return { accessor: item };
        }),
        resultObject.response_result.results
      );
    }
  };

  const setResultObject = (obj: ResultObject) => {
    resultObject.current = obj;
  };
  const getResultObject = (): ResultObject | undefined => {
    return resultObject ? resultObject.current : undefined;
  };

  const setEditorDataValue = (value: string) => {
    setRefValue(editorDataValue, value);
  };

  const setEditorTemplateValue = (value: string) => {
    setRefValue(editorTemplateValue, value);
  };

  const onChangeEditor = (func: (value: string) => void) => (value: string | undefined) => {
    func(value === undefined ? '' : value);
    if (editorAutoParse) {
      sendRequest();
    }
  };

  const forceUpdate = useForceUpdate();

  const loadTemplateAndRefresh = (value: string) => {
    setEditorTemplateValue(value);
    forceUpdate(); // Is there a better way?
  };

  const onChangeTemplateEditor = onChangeEditorWrapper(onChangeEditor(setEditorTemplateValue));
  const onChangeDataEditor = onChangeEditorWrapper(onChangeEditor(setEditorDataValue));

  return (
    <>
      <Stack spacing={0} h="100%">
        {/* ToolBar */}
        <Group position="apart" px={10} py={8} bg="#7c83871d">
          <Group>
            <TemplateManagerToolBarItem
              valueRef={editorTemplateValue}
              setTemplateValue={loadTemplateAndRefresh}
            ></TemplateManagerToolBarItem>
          </Group>
          <Group>
            {/* Actions */}
            <Text size="sm">Send</Text>
            <Tooltip label="Send" withArrow position="bottom">
              <ActionIcon
                variant="default"
                onClick={() => {
                  sendRequest();
                }}
              >
                <IconSend size="1.125rem" />
              </ActionIcon>
            </Tooltip>
            <Divider orientation="vertical" />
            <Text size="sm">AutoParse</Text>
            <Switch
              labelPosition="left"
              onLabel="ON"
              offLabel="OFF"
              checked={editorAutoParse}
              onChange={(event) => setEditorAutoParse(event.currentTarget.checked)}
            />
            <Divider orientation="vertical" />
            {/* Options */}
            <OptionToolBarItem></OptionToolBarItem>
          </Group>
        </Group>
        {/* Main */}
        <PanelGroup direction="vertical" autoSaveId="persistence">
          <Panel defaultSize={70}>
            <PanelGroup direction="horizontal" autoSaveId="persistence">
              <Panel defaultSize={42}>
                <SimpleEditorPanel
                  valueRef={editorDataValue}
                  onChangeFunc={onChangeDataEditor}
                ></SimpleEditorPanel>
              </Panel>
              <ResizeHandle />
              <Panel defaultSize={42}>
                <TextFSMEditorPanel
                  valueRef={editorTemplateValue}
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
    </>
  );
};
