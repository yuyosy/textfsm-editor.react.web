import { AlertCard } from '@/components/AlertCard';
import { ActionIcon, Group, ScrollArea, Stack, Text, Tooltip } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { Eraser } from 'lucide-react';
import { forwardRef, useImperativeHandle } from 'react';
import { ResultItem } from '../types';

export const NotificationPanel = forwardRef((_props, ref) => {
  const [responseResults, responseResultsHandlers] = useListState<ResultItem>([]);

  useImperativeHandle(ref, () => ({
    prependResult(result: ResultItem) {
      responseResultsHandlers.prepend(result);
    },
  }));
  return (
    <Stack gap={0} h="100%">
      <Group px={10} py={8} justify="space-between">
        <Text fw={700}>Console</Text>
        <Tooltip label="Clear" withArrow position="bottom">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => {
              responseResultsHandlers.setState([]);
            }}
          >
            <Eraser size={22} />
          </ActionIcon>
        </Tooltip>
      </Group>
      <ScrollArea h="100%">
        <Stack p={10} pr={16}>
          {responseResults.map((resultObject: ResultItem, index: number) => {
            if (resultObject.ok && resultObject.data) {
              const info = {
                mainTitle: resultObject.data.message,
                subTitle: '',
                color: '',
                message: resultObject.data.message,
              };
              return <AlertCard key={index} {...info}></AlertCard>;
            } else if (!resultObject.ok && resultObject.errors) {
              const info = {
                mainTitle: resultObject.errors[0].reason,
                subTitle: '',
                color: '',
                message: resultObject.errors[0].message,
              };
              return <AlertCard key={index} {...info}></AlertCard>;
            }
          })}
        </Stack>
      </ScrollArea>
    </Stack>
  );
});
