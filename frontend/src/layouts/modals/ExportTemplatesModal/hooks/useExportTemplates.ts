import { useState } from 'react';

import { useAtomValue } from 'jotai';

import { savedTemplateListAtom } from '@/features/state/storageAtoms';

export const useExportTemplates = () => {
  const savedTemplates = useAtomValue(savedTemplateListAtom);
  const [selectedTemplateNames, setSelectedTemplateNames] = useState<string[]>([]);

  const initialLeftData = savedTemplates.map(template => template.label);
  const initialRightData: string[] = [];

  const handleTransferChange = (_leftData: string[], rightData: string[]) => {
    setSelectedTemplateNames(rightData);
  };

  return {
    selectedTemplateNames,
    initialLeftData,
    initialRightData,
    handleTransferChange,
  };
};
