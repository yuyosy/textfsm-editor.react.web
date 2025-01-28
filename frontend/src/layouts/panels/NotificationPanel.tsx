import { RefObject } from 'react';

import {
  ActionIcon,
  Box,
  Center,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useAtom, useAtomValue } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { BellOff, Eraser } from 'lucide-react';
import { ImperativePanelHandle, Panel } from 'react-resizable-panels';

import { AlertCard } from '@/components/AlertCard';
import {
  clearNotificationsAtom,
  notificationsAtom,
  removeNotificationAtom,
} from '@/features/state/atoms';
import { Notification } from '@/types';

interface NotificationPanelProps {
  panelRef: RefObject<ImperativePanelHandle>;
  onResizeHandler: () => void;
}

const getColorByType = (type: Notification['type']): string => {
  switch (type) {
    case 'success':
      return 'green';
    case 'warning':
      return 'yellow';
    case 'error':
      return 'red';
    case 'api':
      return 'blue';
    default:
      return 'gray';
  }
};

export const NotificationPanel = ({
  panelRef,
  onResizeHandler,
}: NotificationPanelProps) => {
  const notifications = useAtomValue(notificationsAtom);
  const clearNotifications = useResetAtom(clearNotificationsAtom);
  const [, removeNotification] = useAtom(removeNotificationAtom);

  return (
    <Panel
      id="notification-panel"
      order={2}
      defaultSize={20}
      collapsedSize={0}
      minSize={10}
      collapsible={true}
      ref={panelRef}
      onResize={onResizeHandler}
    >
      <Stack gap={0} h="100%">
        <Group px={10} py={8} justify="space-between">
          <Text fw={700}>Notifications</Text>
          <Tooltip label="Clear all" withArrow position="bottom">
            <ActionIcon variant="subtle" color="gray" onClick={clearNotifications}>
              <Eraser size={22} />
            </ActionIcon>
          </Tooltip>
        </Group>
        {notifications.length === 0 ? (
          <Center w="100%" h="100%">
            <Flex align="center" direction="column">
              <Box className="mantine-datatable-empty-state-icon">
                <BellOff color="#868e96" />
              </Box>
              <Text fz="sm" c="dimmed">
                No notifications
              </Text>
            </Flex>
          </Center>
        ) : (
          <ScrollArea h="100%">
            <Stack p={10} pr={16}>
              {notifications.map(notification => (
                <AlertCard
                  key={notification.id}
                  mainTitle={notification.title}
                  timestamp={notification.timestamp}
                  color={getColorByType(notification.type)}
                  message={notification.message}
                  onClose={() => removeNotification(notification.id)}
                />
              ))}
            </Stack>
          </ScrollArea>
        )}
      </Stack>
    </Panel>
  );
};
