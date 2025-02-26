import { RefObject } from 'react';

export type ChangesState = {
  orderChanged: boolean;
  deleteCount: number;
  renameCount: number;
  tagUpdateCount: number;
};

export type ModalContentProps = {
  close: () => void;
  focusRef: RefObject<HTMLDivElement>;
};
