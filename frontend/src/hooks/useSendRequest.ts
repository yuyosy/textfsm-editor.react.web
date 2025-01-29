import { useCallback, useEffect, useRef } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
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
  autoRequestEnabledAtom,
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

  const sendRequest = async (immediate = false) => {
    const template = readTemplate();
    if (template === '') {
      return;
    }
    try {
      const response = await sendTextFSMParseRequest(
        readRawText(),
        template,
        immediate ? 0 : readParseRequestDelay()
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

export const useAutoRequest = () => {
  const autoRequestEnabled = useAtomValue(autoRequestEnabledAtom);
  const rawTextValue = useAtomValue(rawTextEditorValueAtom);
  const templateValue = useAtomValue(templateEditorValueAtom);
  const sendRequest = useSendRequest();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const readParseRequestDelay = useAtomCallback(
    // 不要な再レンダリングトリガー防止
    useCallback(get => {
      return get(parseRequestDelayAtom);
    }, [])
  );

  useEffect(() => {
    if (!autoRequestEnabled || templateValue === '') {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      sendRequest(false);
      timeoutRef.current = null;
    }, readParseRequestDelay());

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    autoRequestEnabled,
    rawTextValue,
    templateValue,
    sendRequest,
    readParseRequestDelay,
  ]);
};
