import {
  AppShell,
  Group,
  Paper,
  Stack,
  Text,
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
import { useDisclosure, useLocalStorage, useSessionStorage } from '@mantine/hooks';
import { PanelLayoutType, PanelRefs, ResultItem } from '@/layouts/types';
import { setChipPanelState, setSegmentedControlPanelState } from './panelStateUtils';
import { AppMainToolBar } from './AppMainToolBar';
import { StatusBadge } from '@/components/StatusBadge';
import {
  createErrorResultItem,
  sendTextFSMParseRequest,
} from '@/features/request/sendTextFSMParseRequest';

export const AppMain = () => {
  // Local Storage
  const [inputSendDelayValue] = useLocalStorage<number>({
    key: 'editor-input-send-delay',
    defaultValue: 1000,
  });

  // Session Storage
  const [rawTextEditorValue, setRawTextEditorValue] = useSessionStorage<string>({
    key: 'raw-text-editor-value',
    defaultValue: '// Type your data here',
    getInitialValueInEffect: false,
  });
  const [templateEditorValue, setTemplateEditorValue] = useSessionStorage<string>({
    key: 'template-editor-value',
    defaultValue: '# Type your template here',
    getInitialValueInEffect: false,
  });

  const { colorScheme } = useMantineColorScheme();

  // State

  const [openedNotificationPanel, notificationPanelActions] = useDisclosure(false);
  const [openedResultViewPanel, resultViewPanelActions] = useDisclosure(false);

  const [mainPanelLyout, setMainPanelLyout] = useState<PanelLayoutType>('both');

  // Ref State
  const panelRefs: PanelRefs = {
    data: useRef<ImperativePanelHandle>(null),
    template: useRef<ImperativePanelHandle>(null),
    notification: useRef<ImperativePanelHandle>(null),
    results: useRef<ImperativePanelHandle>(null),
  };

  const notificationPanelDataRef = useRef<any>();
  const resultViewPanelDataRef = useRef<any>();
  const resultObject = useRef<ResultItem>();

  const rawTextEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const templateEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Handler
  const handleRawTextEditorDidMount: OnMount = editor => {
    rawTextEditorRef.current = editor;
    rawTextEditorRef.current.setValue(rawTextEditorValue);
  };
  const handleTemplateEditorDidMount: OnMount = editor => {
    templateEditorRef.current = editor;
    templateEditorRef.current.setValue(templateEditorValue);
  };
  const handleRawTextEditorChange: OnChange = value => {
    if (value) {
      setRawTextEditorValue(value);
    }
  };
  const handleTemplateEditorChange: OnChange = value => {
    if (value) {
      setTemplateEditorValue(value);
    }
  };

  // Functions
  const getRawTextValue: () => string = () => {
    return rawTextEditorRef.current ? rawTextEditorRef.current.getValue() : '';
  };
  const getTemplateValue: () => string = () => {
    return templateEditorRef.current ? templateEditorRef.current.getValue() : '';
  };

  const sendRequest = async () => {
    const rawText = getRawTextValue();
    const template = getTemplateValue();
    if (template === '') {
      return;
    }
    try {
      const response = await sendTextFSMParseRequest(
        rawText,
        template,
        inputSendDelayValue
      );
      resultObject.current = response;
      if (resultObject.current) {
        if (!resultObject.current) {
          return;
        }
        notificationPanelDataRef?.current.prependResult(resultObject.current);
        resultViewPanelDataRef?.current.setResults(resultObject.current);
      }
    } catch (error) {
      notificationPanelDataRef?.current.prependResult(createErrorResultItem(error));
      console.error(error);
    }
  };

  const syncDataPanelSegmentedControlsOnResize = () => {
    setSegmentedControlPanelState(
      'template',
      panelRefs.data,
      mainPanelLyout,
      setMainPanelLyout
    );
  };
  const syncTemplatePanelSegmentedControlsOnResize = () => {
    setSegmentedControlPanelState(
      'data',
      panelRefs.template,
      mainPanelLyout,
      setMainPanelLyout
    );
  };
  const syncNotificationPanelStateChipOnResize = () => {
    setChipPanelState(
      openedNotificationPanel,
      panelRefs.notification,
      notificationPanelActions
    );
  };
  const syncResultViewPanelStateChipOnResize = () => {
    setChipPanelState(openedResultViewPanel, panelRefs.results, resultViewPanelActions);
  };

  useEffect(() => {
    syncDataPanelSegmentedControlsOnResize();
    syncTemplatePanelSegmentedControlsOnResize();
    syncNotificationPanelStateChipOnResize();
    syncResultViewPanelStateChipOnResize();
  }, []);

  return (
    <>
      <AppShell.Main bg="transparent">
        <Stack gap={0} pt={40} style={{ height: '100dvh' }}>
          <AppMainToolBar
            {...{
              panelRefs: panelRefs,
              mainPanelLyout: mainPanelLyout,
              setMainPanelLyout: setMainPanelLyout,
              openedNotificationPanel: openedNotificationPanel,
              notificationPanelActions: notificationPanelActions,
              openedResultViewPanel: openedResultViewPanel,
              resultViewPanelActions: resultViewPanelActions,
              sendRequest: sendRequest,
            }}
          />
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
                        ref={panelRefs.data}
                        onResize={syncDataPanelSegmentedControlsOnResize}
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
                        ref={panelRefs.template}
                        onResize={syncTemplatePanelSegmentedControlsOnResize}
                      >
                        <Stack gap={0} h="100%">
                          <Group px={10} py={8} justify="space-between">
                            <Group>
                              <Text fw={700}>Template</Text>
                              <StatusBadge variant="success" />
                              <StatusBadge variant="error" />
                              <StatusBadge variant="warning" />
                              <StatusBadge variant="info" />
                              <StatusBadge variant="debug" />
                            </Group>
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
                    ref={panelRefs.results}
                    onResize={syncResultViewPanelStateChipOnResize}
                  >
                    <ResultViewPanel ref={resultViewPanelDataRef}></ResultViewPanel>
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
                ref={panelRefs.notification}
                onResize={syncNotificationPanelStateChipOnResize}
              >
                <NotificationPanel ref={notificationPanelDataRef}></NotificationPanel>
              </Panel>
            </PanelGroup>
          </Paper>
        </Stack>
      </AppShell.Main>
    </>
  );
};
