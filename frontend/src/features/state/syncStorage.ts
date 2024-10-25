import { createJSONStorage } from 'jotai/utils';
import { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage';

export const sessionStorage = <T>(): SyncStorage<T> | undefined => {
  if (typeof window !== 'undefined') {
    return createJSONStorage<T>(() => window.sessionStorage);
  }
  return undefined;
};

export const localStorage = <T>(): SyncStorage<T> | undefined => {
  if (typeof window !== 'undefined') {
    return createJSONStorage<T>(() => window.localStorage);
  }
  return undefined;
};
