import { TextFSMParseAPIResponse } from '@/features/types';

export type PanelLayoutType = 'both' | 'data' | 'template';

export interface PanelRefs {
  data: RefObject<ImperativePanelHandle>;
  template: RefObject<ImperativePanelHandle>;
  notification: RefObject<ImperativePanelHandle>;
  results: RefObject<ImperativePanelHandle>;
}

interface Timestamp {
  timestamp: string;
}

export interface ResultItem extends TextFSMParseAPIResponse, Timestamp {}
