import type { JSX, RefObject } from 'react';
import type { ImperativePanelHandle } from 'react-resizable-panels';
import type { ModalId } from './modals/types';

export type PanelLayoutType = 'both' | 'data' | 'template';

export interface PanelRefs {
  data: RefObject<ImperativePanelHandle | null>;
  template: RefObject<ImperativePanelHandle | null>;
  notification: RefObject<ImperativePanelHandle | null>;
  results: RefObject<ImperativePanelHandle | null>;
}

export interface DisclosureActions {
  readonly open: () => void;
  readonly close: () => void;
  readonly toggle: () => void;
}

export interface NavItem {
  id: ModalId;
  label: string;
  icon: JSX.Element;
}
