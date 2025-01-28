import { useCallback } from 'react';

import { useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';

import {
  createErrorResultItem,
  sendTextFSMParseRequest,
} from '@/features/request/sendTextFSMParseRequest';
import {
  addNotificationAtom,
  responseStateAtom,
  resultViewValueAtom,
} from '@/features/state/atoms';
import {
  parseRequestDelayAtom,
  rawTextEditorValueAtom,
  templateEditorValueAtom,
} from '@/features/state/storageAtoms';

export const useSendRequest = () => {
  const readRawText = useAtomCallback(
    useCallback(get => {
      return get(rawTextEditorValueAtom);
    }, [])
  );
  const readTemplate = useAtomCallback(
    useCallback(get => {
      return get(templateEditorValueAtom);
    }, [])
  );
  const readParseRequestDelay = useAtomCallback(
    useCallback(get => {
      return get(parseRequestDelayAtom);
    }, [])
  );

  const setResponseState = useSetAtom(responseStateAtom);
  const setResultViewValue = useSetAtom(resultViewValueAtom);
  const addNotification = useSetAtom(addNotificationAtom);

  const sendRequest = async () => {
    const template = readTemplate();
    if (template === '') {
      return;
    }
    try {
      const response = await sendTextFSMParseRequest(
        readRawText(),
        template,
        readParseRequestDelay()
      );
      setResponseState(response.ok ? 'success' : 'error');
      setResultViewValue(response);

      if (response.ok && response.data) {
        const recordCount = response.data.results.length;
        const message =
          recordCount === 0
            ? 'There are no records.'
            : recordCount === 1
              ? 'There is 1 record.'
              : `There are ${recordCount} records.`;

        addNotification({
          type: 'api',
          title: response.data.message,
          message: message,
          metadata: {
            recordCount,
            results: response.data.results,
          },
        });
      } else if (!response.ok && response.errors) {
        addNotification({
          type: 'error',
          title: response.errors[0].reason,
          message: response.errors[0].message,
          metadata: {
            errors: response.errors,
          },
        });
      }
    } catch (error) {
      const errorResult = createErrorResultItem(error);
      setResponseState('error');
      setResultViewValue(errorResult);

      const errorReason =
        error instanceof Error ? error.constructor.name : 'UnknownError';
      const errorMessage = error instanceof Error ? error.message : String(error);

      addNotification({
        type: 'error',
        title: errorReason,
        message: errorMessage,
        metadata: {
          error: error instanceof Error ? error : String(error),
        },
      });
      console.error(error);
    }
  };

  return sendRequest;
};
