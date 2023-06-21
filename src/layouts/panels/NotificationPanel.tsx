import { AlertCard } from '@/components/AlertCard';
import { ResultObject } from '@/features/request/sendTextFSMParseRequest';
import { Stack } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { forwardRef, useImperativeHandle } from 'react';

export const NotificationPanel = forwardRef((_props, ref) => {
  const [responseResults, responseResultsHandlers] = useListState<ResultObject>([]);

  useImperativeHandle(ref, () => ({
    prependResult(result: ResultObject) {
      responseResultsHandlers.prepend(result);
    },
  }));
  return (
    <Stack p={10} pr={16}>
      {responseResults.map((resultObject: ResultObject) => {
        const info = {
          mainTitle: resultObject.results.message,
          subTitle: resultObject.timestamp,
          color: resultObject.ok && resultObject.results?.ok ? '' : 'red',
          message: resultObject.ok
            ? resultObject.results.message_detail
            : resultObject.message_detail,
        };
        return <AlertCard key={resultObject.timestamp} {...info}></AlertCard>;
      })}
    </Stack>
  );
});
