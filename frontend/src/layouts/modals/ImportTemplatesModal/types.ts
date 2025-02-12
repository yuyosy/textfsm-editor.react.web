import { MutableRefObject } from 'react';
import { TemplateInfo } from '../types';

export type ModalContentProps = {
  close: () => void;
  focusRef: MutableRefObject<HTMLDivElement>;
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
  value: string;
  isDuplicate: boolean;
  isAlreadySaved: boolean;
  hasFormatError: boolean;
};
