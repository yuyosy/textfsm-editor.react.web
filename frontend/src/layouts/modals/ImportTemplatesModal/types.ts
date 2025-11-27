import type { RefObject } from 'react';
import type { TemplateInfo } from '../types';

export type ModalContentProps = {
  close: () => void;
  focusRef: RefObject<HTMLDivElement>;
};

export type ImportedTemplateInfo = {
  fileName: string;
  templateInfo: TemplateInfo[];
  hasFormatError: boolean;
};

export type LoadedJsonData = {
  fileName: string;
  label: string;
  labelOrigin: string;
  templateInfoData: TemplateInfo | null;
  isDuplicate: boolean;
  isAlreadySaved: boolean;
  hasFormatError: boolean;
};

export type ProcessedJsonData = {
  fileName: string;
  label: string;
  templateInfoData: TemplateInfo;
};
