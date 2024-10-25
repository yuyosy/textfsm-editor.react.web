import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';

import {
  createErrorResultItem,
  sendTextFSMParseRequest,
} from '@/features/request/sendTextFSMParseRequest';
import {
  responseResultsAtom,
  responseStateAtom,
  resultViewValueAtom,
} from '@/features/state/atoms';
import {
  parseRequestDelayAtom,
  rawTextEditorValueAtom,
  templateEditorValueAtom,
} from '@/features/state/storageAtoms';
import { useSetAtom } from 'jotai';

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

  const readResponseResults = useAtomCallback(
    useCallback(get => {
      return get(responseResultsAtom);
    }, [])
  );
  const setResponseState = useSetAtom(responseStateAtom);
  const setResponseResults = useSetAtom(responseResultsAtom);
  const setResultViewValue = useSetAtom(resultViewValueAtom);

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
      setResponseResults([response, ...readResponseResults()]);
      setResultViewValue(response);
    } catch (error) {
      setResponseResults([createErrorResultItem(error), ...readResponseResults()]);
      console.error(error);
    }
  };

  return sendRequest;
};
