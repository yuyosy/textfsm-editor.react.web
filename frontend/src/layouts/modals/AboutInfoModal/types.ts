import { RefObject } from 'react';

export type ModalContentProps = {
  close: () => void;
  focusRef: RefObject<HTMLDivElement>;
};
