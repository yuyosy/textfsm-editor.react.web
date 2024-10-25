export type PanelLayoutType = 'both' | 'data' | 'template';

export interface PanelRefs {
  data: RefObject<ImperativePanelHandle>;
  template: RefObject<ImperativePanelHandle>;
  notification: RefObject<ImperativePanelHandle>;
  results: RefObject<ImperativePanelHandle>;
}

export interface DisclosureActions {
  readonly open: () => void;
  readonly close: () => void;
  readonly toggle: () => void;
}
