import { useRef, useState } from 'react';

import { AppShell, Paper, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useSetAtom } from 'jotai';
import { ImperativePanelHandle, Panel, PanelGroup } from 'react-resizable-panels';

import ResizeHandle from '@/components/resizable-panels/ResizeHandle';
import { addNotificationAtom } from '@/features/state/atoms';
import { useAutoRequest } from '@/hooks/useSendRequest';
import { PanelLayoutType, PanelRefs } from '@/layouts/types';

import { AppMainToolBar } from './AppMainToolBar';
import { NotificationPanel } from './panels/NotificationPanel';
import { RawTextEditorPanel } from './panels/RawTextEditorPanel';
import { ResultViewPanel } from './panels/ResultViewPanel';
import { TemplateEditorPanel } from './panels/TemplateEditorPanel';
import { setChipPanelState, setSegmentedControlPanelState } from './panelStateUtils';

export const AppMain = () => {
  const [openedNotificationPanel, notificationPanelActions] = useDisclosure(false);
  const [openedResultViewPanel, resultViewPanelActions] = useDisclosure(false);

  const [mainPanelLyout, setMainPanelLyout] = useState<PanelLayoutType>('both');

  const addNotification = useSetAtom(addNotificationAtom);
  useAutoRequest(addNotification);

  // Ref State
  const panelRefs: PanelRefs = {
    data: useRef<ImperativePanelHandle>(null),
    template: useRef<ImperativePanelHandle>(null),
    notification: useRef<ImperativePanelHandle>(null),
    results: useRef<ImperativePanelHandle>(null),
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
            }}
          />
          <Paper h="100%" m={8} radius="md" shadow="xs" style={{ overflow: 'hidden' }}>
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
                      <RawTextEditorPanel
                        panelRef={panelRefs.data}
                        onResizeHandler={syncDataPanelSegmentedControlsOnResize}
                      />
                      <ResizeHandle />
                      <TemplateEditorPanel
                        panelRef={panelRefs.template}
                        onResizeHandler={syncTemplatePanelSegmentedControlsOnResize}
                      />
                    </PanelGroup>
                  </Panel>
                  <ResizeHandle />
                  <ResultViewPanel
                    panelRef={panelRefs.results}
                    onResizeHandler={syncResultViewPanelStateChipOnResize}
                  />
                </PanelGroup>
              </Panel>
              <ResizeHandle />
              <NotificationPanel
                panelRef={panelRefs.notification}
                onResizeHandler={syncNotificationPanelStateChipOnResize}
              />
            </PanelGroup>
          </Paper>
        </Stack>
      </AppShell.Main>
    </>
  );
};
