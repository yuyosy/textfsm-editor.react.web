import { RefObject } from 'react';

export interface ExportTemplates {
  selectedTemplateNames: string[];
  initialLeftData: string[];
  initialRightData: string[];
  handleTransferChange: (_leftData: string[], rightData: string[]) => void;
}

export type ModalContentProps = {
  close: () => void;
  focusRef: RefObject<HTMLDivElement>;
};

export type SelectTemplatesSectionProps = {
  close: () => void;
  proceedToNextStep: () => void;
  exportTemplates: ExportTemplates;
};

export type ExportTemplatesSectionProps = {
  close: () => void;
  returnToPreviousStep: () => void;
  selectedTemplateNames: string[];
};
