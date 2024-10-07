import {
  ActionIcon,
  AppShell,
  Divider,
  Group,
  Paper,
  Stack,
  Switch,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { CopyValueButton } from '@/components/CopyValueButton';
import ResizeHandle from '@/components/resizable-panels/ResizeHandle';
import { Editor } from '@/features/editor/Editor';
import type { OnChange, OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';
import { ImperativePanelHandle, Panel, PanelGroup } from 'react-resizable-panels';
import { NotificationPanel } from './panels/NotificationPanel';
import { ResultViewPanel } from './panels/ResultViewPanel';
import { sendTextFSMParseRequest } from '@/features/request/sendTextFSMParseRequest';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { ResultObject } from '@/types';
import { Send } from 'lucide-react';
import { PanelSelector } from './PanelSelector';
import { PanelToggleChip } from './PanelToggleChip';
import { PanelLayoutType } from './types';
import {
  handlePanelToggle,
  setChipPanelState,
  setSegmentedControlPanelState,
} from './panelStateUtils';

export const AppMain = () => {
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

  // State

  const [opendNotificationPanel, { toggle: toggleNotificationPanel }] =
    useDisclosure(false);
  const [opendResultViewPanel, { toggle: toggleResultViewPanel }] = useDisclosure(false);

  const [mainPanelLyout, setMainPanelLyout] = useState<PanelLayoutType>('both');

  // Ref State
  const notificationPanelRef = useRef<any>();
  const resultViewPanelRef = useRef<any>();
  const resultObject = useRef<ResultObject>();

  const rawTextEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const templateEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const dataPanelImperativeHandleRef = useRef<ImperativePanelHandle>(null);
  const templatePanelImperativeHandleRef = useRef<ImperativePanelHandle>(null);
  const notificationPanelImperativeHandleRef = useRef<ImperativePanelHandle>(null);
  const resultViewPanelImperativeHandleRef = useRef<ImperativePanelHandle>(null);

  // Handler
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

  // Functions
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
    if (
      resultViewPanelRef.current &&
      resultObject.ok &&
      resultObject.response_result.ok
    ) {
      resultViewPanelRef.current.setResults(
        resultObject.response_result.headers.map(item => {
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

  useEffect(() => {
    setSegmentedControlPanelState(
      'template',
      dataPanelImperativeHandleRef,
      mainPanelLyout,
      setMainPanelLyout
    );
    setSegmentedControlPanelState(
      'data',
      templatePanelImperativeHandleRef,
      mainPanelLyout,
      setMainPanelLyout
    );
    setChipPanelState(
      opendNotificationPanel,
      notificationPanelImperativeHandleRef,
      toggleNotificationPanel
    );
    setChipPanelState(
      opendResultViewPanel,
      resultViewPanelImperativeHandleRef,
      toggleResultViewPanel
    );
  }, []);

  return (
    <>
      <AppShell.Main bg="transparent">
        <Stack gap={0} pt={40} style={{ height: '100dvh' }}>
          <Group mx={5} justify="space-between">
            <Group gap={5}>
              <PanelSelector
                mainPanelLyout={mainPanelLyout}
                setMainPanelLyout={setMainPanelLyout}
                dataPanelImperativeHandleRef={dataPanelImperativeHandleRef}
                templatePanelImperativeHandleRef={templatePanelImperativeHandleRef}
              />
              <Divider
                orientation="vertical"
                color="var(--mantine-color-default-border)"
              />
              <PanelToggleChip
                opened={opendNotificationPanel}
                label="NotificationPanel"
                handlePanelToggle={(checked: boolean) => {
                  handlePanelToggle(
                    checked,
                    notificationPanelImperativeHandleRef,
                    toggleNotificationPanel
                  );
                }}
              />
              <PanelToggleChip
                opened={opendResultViewPanel}
                label="ResultViewPanel"
                handlePanelToggle={(checked: boolean) => {
                  handlePanelToggle(
                    checked,
                    resultViewPanelImperativeHandleRef,
                    toggleResultViewPanel
                  );
                }}
              />
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
              <Divider
                orientation="vertical"
                color="var(--mantine-color-default-border)"
              />
              <Text size="sm">AutoParse</Text>
              <Switch
                labelPosition="left"
                onLabel="ON"
                offLabel="OFF"
                checked={editorAutoParse}
                onChange={event => setEditorAutoParse(event.currentTarget.checked)}
              />
            </Group>
          </Group>
          <Paper h="100%" m={5} radius="md" shadow="xs" style={{ overflow: 'hidden' }}>
            <PanelGroup direction="horizontal" autoSaveId="top">
              <Panel defaultSize={80} collapsedSize={0} minSize={10} collapsible={true}>
                <PanelGroup direction="vertical" autoSaveId="main">
                  <Panel
                    id="main-panel"
                    order={1}
                    defaultSize={70}
                    collapsedSize={0}
                    minSize={10}
                    collapsible={true}
                  >
                    <PanelGroup direction="horizontal" autoSaveId="editor">
                      <Panel
                        id="data-panel"
                        order={1}
                        defaultSize={50}
                        collapsedSize={0}
                        minSize={10}
                        collapsible={true}
                        ref={dataPanelImperativeHandleRef}
                        onResize={() =>
                          setSegmentedControlPanelState(
                            'template',
                            dataPanelImperativeHandleRef,
                            mainPanelLyout,
                            setMainPanelLyout
                          )
                        }
                      >
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
                      <Panel
                        id="template-panel"
                        order={2}
                        defaultSize={50}
                        collapsedSize={0}
                        minSize={10}
                        collapsible={true}
                        ref={templatePanelImperativeHandleRef}
                        onResize={() =>
                          setSegmentedControlPanelState(
                            'data',
                            templatePanelImperativeHandleRef,
                            mainPanelLyout,
                            setMainPanelLyout
                          )
                        }
                      >
                        <Stack gap={0} h="100%">
                          <Group px={10} py={8} justify="space-between">
                            <Text fw={700}>Template</Text>
                            <CopyValueButton
                              value={getTemplateValue()}
                            ></CopyValueButton>
                          </Group>
                          <Editor
                            defaultLanguage="textfsm"
                            theme={colorScheme === 'dark' ? 'theme-dark' : 'theme-light'}
                            onMount={handleTemplateEditorDidMount}
                            onChange={handleTemplateEditorChange}
                          />
                        </Stack>
                      </Panel>
                    </PanelGroup>
                  </Panel>
                  <ResizeHandle />
                  <Panel
                    id="result-panel"
                    order={2}
                    defaultSize={50}
                    collapsedSize={0}
                    minSize={10}
                    collapsible={true}
                    ref={resultViewPanelImperativeHandleRef}
                    onResize={() =>
                      setChipPanelState(
                        opendResultViewPanel,
                        resultViewPanelImperativeHandleRef,
                        toggleResultViewPanel
                      )
                    }
                  >
                    <ResultViewPanel ref={resultViewPanelRef}></ResultViewPanel>
                  </Panel>
                </PanelGroup>
              </Panel>
              <ResizeHandle />
              <Panel
                id="notification-panel"
                order={2}
                defaultSize={20}
                collapsedSize={0}
                minSize={10}
                collapsible={true}
                ref={notificationPanelImperativeHandleRef}
                onResize={() =>
                  setChipPanelState(
                    opendNotificationPanel,
                    notificationPanelImperativeHandleRef,
                    toggleNotificationPanel
                  )
                }
              >
                <NotificationPanel ref={notificationPanelRef}></NotificationPanel>
              </Panel>
            </PanelGroup>
          </Paper>
        </Stack>
      </AppShell.Main>
    </>
  );
};
