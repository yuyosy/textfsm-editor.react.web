import { savedTemplateListAtom } from '@/features/state/storageAtoms';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

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
