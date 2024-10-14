import { CopyValueButton } from '@/components/CopyValueButton';
import ResizeHandle from '@/components/resizable-panels/ResizeHandle';
import { Editor } from '@/features/editor/Editor';
import { sendTextFSMParseRequest } from '@/features/request/sendTextFSMParseRequest';
import {
  ActionIcon,
  AppShell,
  Divider,
  Group,
  Stack,
  Switch,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import type { OnChange, OnMount } from '@monaco-editor/react';
import { Send } from 'lucide-react';
import type { editor } from 'monaco-editor';
import { useRef } from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { NotificationPanel } from './NotificationPanel';
import { OptionToolBarItem } from './OptionToolBarItem';
import { ResultViewPanel } from './ResultViewPanel';
import { TemplateManagerToolBarItem } from './TemplateManagerToolBarItem';
import { ResultItem } from '../types';

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

  // TODO editor theme switch
  const { colorScheme } = useMantineColorScheme();

  // Ref State
  const notificationPanelRef = useRef<any>();
  const resultViewPanelRef = useRef<any>();
  const resultObject = useRef<ResultItem>();

  const rawTextEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const templateEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleRawTextEditorDidMount: OnMount = editor => {
    rawTextEditorRef.current = editor;
  };
  const handleTemplateEditorDidMount: OnMount = editor => {
    templateEditorRef.current = editor;
  };
  const handleRawTextEditorChange: OnChange = value => {
    console.debug(value);
  };
  const handleTemplateEditorChange: OnChange = value => {
    console.debug(value);
  };

  const getRawTextValue: () => string = () => {
    return rawTextEditorRef.current ? rawTextEditorRef.current.getValue() : '';
  };
  const getTemplateValue: () => string = () => {
    return templateEditorRef.current ? templateEditorRef.current.getValue() : '';
  };

  // Functions
  const sendRequest = async () => {
    if (templateEditorRef.current?.getValue() === '') {
      return;
    }
    const rawText = rawTextEditorRef.current ? rawTextEditorRef.current.getValue() : '';
    const template = templateEditorRef.current
      ? templateEditorRef.current.getValue()
      : '';
    setResultObject(
      await sendTextFSMParseRequest(rawText, template, inputSendDelayValue)
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
    if (resultViewPanelRef.current && resultObject.ok && resultObject.data) {
      resultViewPanelRef.current.setResults(
        resultObject.data.header.map(item => {
          return { accessor: item };
        }),
        resultObject.data.results
      );
    }
  };

  const setResultObject = (obj: ResultItem) => {
    resultObject.current = obj;
  };
  const getResultObject = (): ResultItem | undefined => {
    return resultObject ? resultObject.current : undefined;
  };

  return (
    <AppShell.Main>
      <Stack gap={0} pt={40} pb={25} style={{ height: '100dvh' }}>
        {/* ToolBar */}
        <Group justify="space-between" px={10} py={8} bg="#7c83871d">
          <Group>
            <TemplateManagerToolBarItem
              editorRef={templateEditorRef}
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
                <Send size="1.125rem" />
              </ActionIcon>
            </Tooltip>
            <Divider orientation="vertical" />
            <Text size="sm">AutoParse</Text>
            <Switch
              labelPosition="left"
              onLabel="ON"
              offLabel="OFF"
              checked={editorAutoParse}
              onChange={event => setEditorAutoParse(event.currentTarget.checked)}
            />
            <Divider orientation="vertical" />
            {/* Options */}
            <OptionToolBarItem></OptionToolBarItem>
          </Group>
        </Group>
        {/* Main */}
        <PanelGroup direction="vertical" autoSaveId="persistence">
          <Panel defaultSize={70} collapsedSize={0} minSize={10} collapsible={true}>
            <PanelGroup direction="horizontal" autoSaveId="persistence">
              <Panel defaultSize={42} collapsedSize={0} minSize={10} collapsible={true}>
                <Stack gap={0} h="100%">
                  <Group px={10} py={8} justify="space-between">
                    <Text fw={700}>Data</Text>
                    <CopyValueButton value={getRawTextValue()}></CopyValueButton>
                  </Group>
                  <Editor
                    defaultLanguage="plain"
                    theme={colorScheme === 'dark' ? 'theme-dark' : 'theme-light'}
                    onMount={handleRawTextEditorDidMount}
                    onChange={handleRawTextEditorChange}
                  />
                </Stack>
              </Panel>
              <ResizeHandle />
              <Panel defaultSize={42} collapsedSize={0} minSize={10} collapsible={true}>
                <Stack gap={0} h="100%">
                  <Group px={10} py={8} justify="space-between">
                    <Text fw={700}>Template</Text>
                    <CopyValueButton value={getTemplateValue()}></CopyValueButton>
                  </Group>
                  <Editor
                    defaultLanguage="textfsm"
                    theme={colorScheme === 'dark' ? 'theme-dark' : 'theme-light'}
                    onMount={handleTemplateEditorDidMount}
                    onChange={handleTemplateEditorChange}
                  />
                </Stack>
              </Panel>
              <ResizeHandle />
              <Panel defaultSize={16} collapsedSize={0} minSize={10} collapsible={true}>
                <NotificationPanel ref={notificationPanelRef}></NotificationPanel>
              </Panel>
            </PanelGroup>
          </Panel>
          <ResizeHandle />
          <Panel defaultSize={30} collapsedSize={0} minSize={10} collapsible={true}>
            <ResultViewPanel ref={resultViewPanelRef}></ResultViewPanel>
          </Panel>
        </PanelGroup>
      </Stack>
    </AppShell.Main>
  );
};
