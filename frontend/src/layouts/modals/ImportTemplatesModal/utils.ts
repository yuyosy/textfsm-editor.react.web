import { TemplateInfo } from '../types';
import { ImportedTemplateInfo, LoadedJsonData } from './types';

export const validateAndProcessTemplates = (
  results: ImportedTemplateInfo[],
  templateList: TemplateInfo[]
): LoadedJsonData[] => {
  const getLoadedJsonData = (
    item: ImportedTemplateInfo,
    label: string,
    labelOrigin: string,
    value: string,
    hasFormatError: boolean,
    isDuplicate: boolean,
    isAlreadySaved: boolean
  ) => {
    return {
      fileName: item.fileName,
      label: label,
      labelOrigin: labelOrigin,
      value: value,
      isDuplicate: isDuplicate,
      isAlreadySaved: isAlreadySaved,
      hasFormatError: hasFormatError,
    };
  };
  if (!Array.isArray(results)) {
    return [];
  }
  const processedJsonData: LoadedJsonData[] = [];
  const namesInTemplateList = new Set(templateList.map(item => item.label));

  const renameLabel = (label: string) => {
    let suffix = 1;
    while (
      processedJsonData.some(item => item.label === label) ||
      namesInTemplateList.has(label)
    ) {
      label = `${label}_${suffix}`;
      suffix++;
    }
    return label;
  };

  for (const item of results) {
    if (item.hasFormatError) {
      processedJsonData.push(getLoadedJsonData(item, '-', '-', '', true, false, false));
    }
    if (!Array.isArray(item.templateInfo) || item.templateInfo === null) {
      processedJsonData.push(getLoadedJsonData(item, '-', '-', '', false, false, false));
    }

    for (const data of item.templateInfo) {
      if (!data) continue;
      const isDuplicate = processedJsonData.some(item => item.label === data.label);
      const isAlreadySaved = namesInTemplateList.has(data.label);
      const hasFormatError = !('label' in data && 'value' in data);
      let label = data.label;
      if (isDuplicate || isAlreadySaved) {
        label = `${label}_${item.fileName}`;
      }
      label = renameLabel(label);
      const loadedJsonData = getLoadedJsonData(
        item,
        label,
        data.label,
        data.value,
        hasFormatError,
        isDuplicate,
        isAlreadySaved
      );
      processedJsonData.push(loadedJsonData);
    }
  }
  return processedJsonData;
};

export const parseJsonTemplates = async (
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
};
