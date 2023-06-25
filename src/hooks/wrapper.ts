import { useCallback, useRef } from 'react';

export const useWrap = <T extends Function>(callback: T): T => {
  const onChange = useRef<any>();

  onChange.current = callback;

  return useCallback<any>((...args: any) => {
    return onChange.current(...args);
  }, []);
};
