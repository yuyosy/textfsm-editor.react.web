import { Text, Divider, Group, ActionIcon, Tooltip, Switch } from '@mantine/core';
import { PanelSelector } from './PanelSelector';
import { PanelToggleChip } from './PanelToggleChip';
import { Send } from 'lucide-react';
import { handlePanelToggle } from './panelStateUtils';
import { useLocalStorage } from '@mantine/hooks';
import { DisclosureActions, PanelLayoutType, PanelRefs } from './types';
import { Dispatch, SetStateAction } from 'react';

interface AppMainToolBarProps {
  panelRefs: PanelRefs;
  mainPanelLyout: PanelLayoutType;
  setMainPanelLyout: Dispatch<SetStateAction<PanelLayoutType>>;
  openedNotificationPanel: boolean;
  notificationPanelActions: DisclosureActions;
  openedResultViewPanel: boolean;
  resultViewPanelActions: DisclosureActions;
  sendRequest: () => void;
}

export const AppMainToolBar = ({
  panelRefs,
  mainPanelLyout,
  setMainPanelLyout,
  openedNotificationPanel,
  notificationPanelActions,
  openedResultViewPanel,
  resultViewPanelActions,
  sendRequest,
}: AppMainToolBarProps) => {
  // Local Storage
  const [editorAutoParse, setEditorAutoParse] = useLocalStorage<boolean>({
    key: 'editor-auto-parse',
    defaultValue: false,
  });
  return (
    <Group mx={5} justify="space-between">
      <Group gap={5}>
        <PanelSelector
          mainPanelLyout={mainPanelLyout}
          setMainPanelLyout={setMainPanelLyout}
          dataPanelImperativeHandleRef={panelRefs.data}
          templatePanelImperativeHandleRef={panelRefs.template}
        />
        <Divider orientation="vertical" color="var(--mantine-color-default-border)" />
        <PanelToggleChip
          opened={openedNotificationPanel}
          label="NotificationPanel"
          handlePanelToggle={(checked: boolean) => {
            handlePanelToggle(checked, panelRefs.notification, notificationPanelActions);
          }}
        />
        <PanelToggleChip
          opened={openedResultViewPanel}
          label="ResultViewPanel"
          handlePanelToggle={(checked: boolean) => {
            handlePanelToggle(checked, panelRefs.results, resultViewPanelActions);
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
              console.log('sendRequest');
            }}
          >
            <Send size="1.125rem" />
          </ActionIcon>
        </Tooltip>
        <Divider orientation="vertical" color="var(--mantine-color-default-border)" />
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
  );
};
