import { useCallback } from 'react';
import { TemplateInfo } from '../../types';
import { LoadedJsonData } from '../types';
import { validateAndProcessTemplates } from '../utils';

export const useParseJsonTemplates = () => {
  const parseJsonTemplates = useCallback(
    async (
      selectedJsonFiles: File[],
      setProcessedJsonData: (data: LoadedJsonData[]) => void,
      templateList: TemplateInfo[]
    ) => {
      const promises = selectedJsonFiles.map(async item => {
        try {
          const text = await item.text();
          return {
            fileName: item.name,
            templateInfo: JSON.parse(text) as TemplateInfo[],
            hasFormatError: false,
          };
        } catch (error) {
          return {
            fileName: item.name,
            templateInfo: [],
            hasFormatError: true,
          };
        }
      });
      const results = await Promise.all(promises);
      const checkedData = validateAndProcessTemplates(results, templateList);
      setProcessedJsonData(checkedData);
    },
    []
  );

  return { parseJsonTemplates };
};
