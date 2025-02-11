import { addNotificationAtom } from '@/features/state/atoms';
import { useDebouncedValue } from '@mantine/hooks';
import { useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { TemplateInfo } from '../../types';

export const useSaveTemplate = (
  savedTemplates: TemplateInfo[],
  setSavedTemplates: (templates: TemplateInfo[]) => void,
  currentEditorContent: string
) => {
  const addNotification = useSetAtom(addNotificationAtom);
  const [newTemplateName, setNewTemplateName] = useState<string>('');
  const [existingTemplateName, setExistingTemplateName] = useState<string | null>(null);
  const [isDuplicateName, setIsDuplicateName] = useState<boolean>(false);

  const [debouncedTemplateName] = useDebouncedValue(newTemplateName, 200);

  useEffect(() => {
    setIsDuplicateName(
      savedTemplates.some(template => template.label === debouncedTemplateName)
    );
  }, [debouncedTemplateName, savedTemplates]);

  const saveTemplateToStorage = () => {
    const templateName = newTemplateName || existingTemplateName;
    if (!templateName) return;

    const updatedTemplates = [...savedTemplates];
    const existingIndex = updatedTemplates.findIndex(
      template => template.label === templateName
    );

    const templateData = {
      label: templateName,
      value: currentEditorContent,
    };

    if (existingIndex !== -1) {
      updatedTemplates[existingIndex] = templateData;
    } else {
      updatedTemplates.push(templateData);
    }

    setSavedTemplates(updatedTemplates);
    addNotification({
      type: 'success',
      title: 'Template saved',
      message: `Saved: ${templateName}`,
    });
    reset();
  };

  const reset = () => {
    setNewTemplateName('');
    setExistingTemplateName(null);
    setIsDuplicateName(false);
  };

  return {
    newTemplateName,
    setNewTemplateName,
    existingTemplateName,
    setExistingTemplateName,
    isDuplicateName,
    saveTemplateToStorage,
  };
};
