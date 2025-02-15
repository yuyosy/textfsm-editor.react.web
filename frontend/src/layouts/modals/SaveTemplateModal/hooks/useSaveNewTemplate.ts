import { addNotificationAtom } from '@/features/state/atoms';
import { useDebouncedValue } from '@mantine/hooks';
import { useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { TemplateInfo } from '../../types';

export const useSaveNewTemplate = (
  savedTemplates: TemplateInfo[],
  setSavedTemplates: (templates: TemplateInfo[]) => void,
  currentEditorContent: string
) => {
  const addNotification = useSetAtom(addNotificationAtom);
  const [templateProperties, setTemplateProperties] = useState<TemplateInfo>({
    label: '',
    value: currentEditorContent,
  });
  const [isNameDuplicate, setIsDuplicateName] = useState<boolean>(false);

  const [debouncedTemplateName] = useDebouncedValue(templateProperties.label, 200);

  useEffect(() => {
    setIsDuplicateName(
      savedTemplates.some(template => template.label === debouncedTemplateName)
    );
  }, [debouncedTemplateName, savedTemplates]);

  const saveTemplateToStorage = () => {
    if (!templateProperties.label || isNameDuplicate) return;

    const updatedTemplates = [...savedTemplates, templateProperties];
    setSavedTemplates(updatedTemplates);
    addNotification({
      type: 'success',
      title: 'Template saved',
      message: `Saved: ${templateProperties.label}`,
    });
    reset();
  };

  const reset = () => {
    setTemplateProperties({
      label: '',
      value: '',
    });
    setIsDuplicateName(false);
  };

  const setTemplateField = (field: keyof TemplateInfo, value: any) => {
    setTemplateProperties({ ...templateProperties, [field]: value });
  };

  return {
    templateProperties,
    isNameDuplicate,
    setTemplateField,
    saveTemplateToStorage,
  };
};
