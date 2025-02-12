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
  const [newTemplateName, setNewTemplateName] = useState<string>('');
  const [isDuplicateName, setIsDuplicateName] = useState<boolean>(false);

  const [debouncedTemplateName] = useDebouncedValue(newTemplateName, 200);

  useEffect(() => {
    setIsDuplicateName(
      savedTemplates.some(template => template.label === debouncedTemplateName)
    );
  }, [debouncedTemplateName, savedTemplates]);

  const saveTemplateToStorage = () => {
    if (!newTemplateName || isDuplicateName) return;

    const updatedTemplates = [
      ...savedTemplates,
      {
        label: newTemplateName,
        value: currentEditorContent,
      },
    ];

    setSavedTemplates(updatedTemplates);
    addNotification({
      type: 'success',
      title: 'Template saved',
      message: `Saved: ${newTemplateName}`,
    });
    reset();
  };

  const reset = () => {
    setNewTemplateName('');
    setIsDuplicateName(false);
  };

  return {
    setNewTemplateName,
    saveTemplateToStorage,
    isDuplicateName,
  };
};
