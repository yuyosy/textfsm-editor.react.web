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
import { useAtomValue } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { BellOff, Eraser } from 'lucide-react';
import { ImperativePanelHandle, Panel } from 'react-resizable-panels';

import { AlertCard } from '@/components/AlertCard';
import { responseResultsAtom } from '@/features/state/atoms';
import { ResultItem } from '@/types';

interface NotificationPanelProps {
  panelRef: RefObject<ImperativePanelHandle>;
  onResizeHandler: () => void;
}
export const NotificationPanel = ({
  panelRef,
  onResizeHandler,
}: NotificationPanelProps) => {
  const responseResults = useAtomValue(responseResultsAtom);
  const resetResponseResults = useResetAtom(responseResultsAtom);

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
          <Tooltip label="Clear" withArrow position="bottom">
            <ActionIcon variant="subtle" color="gray" onClick={resetResponseResults}>
              <Eraser size={22} />
            </ActionIcon>
          </Tooltip>
        </Group>
        {responseResults.length === 0 ? (
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
              {responseResults.map((resultObject: ResultItem, index: number) => {
                if (resultObject.ok && resultObject.data) {
                  const recordCount = resultObject.data.results.length;
                  const message =
                    recordCount === 0
                      ? 'There are no records.'
                      : recordCount === 1
                        ? 'There is 1 record.'
                        : `There are ${recordCount} records.`;
                  const info = {
                    mainTitle: resultObject.data.message,
                    subTitle: resultObject.timestamp,
                    color: 'blue',
                    message: message,
                  };
                  return <AlertCard key={index} {...info}></AlertCard>;
                } else if (!resultObject.ok && resultObject.errors) {
                  const info = {
                    mainTitle: resultObject.errors[0].reason,
                    subTitle: resultObject.timestamp,
                    color: 'red',
                    message: resultObject.errors[0].message,
                  };
                  return <AlertCard key={index} {...info}></AlertCard>;
                }
              })}
            </Stack>
          </ScrollArea>
        )}
      </Stack>
    </Panel>
  );
};
