import { MutableRefObject } from 'react';

export type ChangesState = {
  orderChanged: boolean;
  deleteCount: number;
  renameCount: number;
};

export type ModalContentProps = {
  close: () => void;
  focusRef: MutableRefObject<HTMLDivElement>;
};
