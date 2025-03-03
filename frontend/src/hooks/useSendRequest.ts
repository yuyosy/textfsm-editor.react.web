import { useCallback, useEffect, useRef } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';

import {
  createErrorResultItem,
  sendTextFSMParseRequest,
} from '@/features/request/sendTextFSMParseRequest';
import { historyAutoSaveHandler } from '@/features/state/actionAtoms';
import { responseStateAtom, resultViewValueAtom } from '@/features/state/atoms';
import {
  autoRequestEnabledAtom,
  parseRequestDelayAtom,
  rawTextEditorValueAtom,
  templateEditorValueAtom,
} from '@/features/state/storageAtoms';
import { NotificationItemInfo } from '@/types';

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
  const autoSaveHandler = useSetAtom(historyAutoSaveHandler);

  const sendRequest = async (immediate = false) => {
    const template = readTemplate();
    if (template === '') {
      return { response: null, notification: null };
    }
    let notification: NotificationItemInfo | null = null;
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
        notification = {
          type: 'api',
          title: response.data.message,
          message: message,
          metadata: { recordCount, results: response.data.results },
        };
        autoSaveHandler({
          template: template,
          data: readRawText(),
          result: JSON.stringify(response.data.results, null, 2),
          status: 'success',
        });
      } else if (!response.ok && response.errors) {
        notification = {
          type: 'error',
          title: response.errors[0].reason,
          message: response.errors[0].message,
          metadata: { errors: response.errors },
        };
        autoSaveHandler({
          template: template,
          data: readRawText(),
          result: '',
          status: 'error',
        });
      }
      return { response, notification };
    } catch (error) {
      const errorResult = createErrorResultItem(error);
      setResponseState('error');
      setResultViewValue(errorResult);
      const errorReason =
        error instanceof Error ? error.constructor.name : 'UnknownError';
      const errorMessage = error instanceof Error ? error.message : String(error);
      notification = {
        type: 'error',
        title: errorReason,
        message: errorMessage,
        metadata: { error: error instanceof Error ? error : String(error) },
      };
      console.error(error);
      return { response: errorResult, notification };
    }
  };

  return sendRequest;
};

export const useAutoRequest = (
  onNotification?: (notification: NotificationItemInfo) => void
) => {
  const autoRequestEnabled = useAtomValue(autoRequestEnabledAtom);
  const rawTextValue = useAtomValue(rawTextEditorValueAtom);
  const templateValue = useAtomValue(templateEditorValueAtom);
  const sendRequest = useSendRequest();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastValuesRef = useRef({ rawText: '', template: '' });

  const readEditorValues = useAtomCallback(
    useCallback(get => {
      return {
        rawText: get(rawTextEditorValueAtom),
        template: get(templateEditorValueAtom),
      };
    }, [])
  );

  const readParseRequestDelay = useAtomCallback(
    useCallback(get => {
      return get(parseRequestDelayAtom);
    }, [])
  );

  useEffect(() => {
    if (!autoRequestEnabled) {
      return;
    }

    const currentValues = readEditorValues();

    if (
      currentValues.rawText === lastValuesRef.current.rawText &&
      currentValues.template === lastValuesRef.current.template
    ) {
      return;
    }

    lastValuesRef.current = currentValues;

    if (currentValues.template === '') {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      const result = await sendRequest(true);
      // Call external notification handler if provided
      if (result.notification && onNotification) {
        onNotification(result.notification);
      }
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
    readEditorValues,
    onNotification,
  ]);
};
