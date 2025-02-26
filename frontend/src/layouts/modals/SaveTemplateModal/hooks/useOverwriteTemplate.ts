import { useState } from 'react';

import { useSetAtom } from 'jotai';

import { addNotificationAtom } from '@/features/state/atoms';

import { TemplateInfo } from '../../types';

export const useOverwriteTemplate = (
  savedTemplates: TemplateInfo[],
  setSavedTemplates: (templates: TemplateInfo[]) => void,
  currentEditorContent: string
) => {
  const addNotification = useSetAtom(addNotificationAtom);
  const [existingTemplateName, setExistingTemplateName] = useState<string | null>(null);

  const saveTemplateToStorage = () => {
    if (!existingTemplateName) return;

    const updatedTemplates = [...savedTemplates];
    const existingIndex = updatedTemplates.findIndex(
      template => template.label === existingTemplateName
    );

    if (existingIndex !== -1) {
      updatedTemplates[existingIndex] = {
        ...updatedTemplates[existingIndex],
        value: currentEditorContent,
      };
    }

    setSavedTemplates(updatedTemplates);
    addNotification({
      type: 'success',
      title: 'Template saved',
      message: `Saved: ${existingTemplateName}`,
    });
    reset();
  };

  const reset = () => {
    setExistingTemplateName(null);
  };

  return {
    setExistingTemplateName,
    saveTemplateToStorage,
  };
};
