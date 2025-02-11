import { addNotificationAtom } from '@/features/state/atoms';
import { useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { TemplateInfo } from '../../types';

export const useLoadTemplate = (
  availableTemplates: TemplateInfo[],
  setEditorContent: (value: string) => void
) => {
  const addNotification = useSetAtom(addNotificationAtom);
  return useCallback(
    (templateName: string | null) => {
      const selectedTemplate = availableTemplates.find(
        template => template.label === templateName
      );
      if (selectedTemplate) {
        setEditorContent(selectedTemplate.value);
        addNotification({
          type: 'success',
          title: 'Template loaded',
          message: `Loaded: ${selectedTemplate.label}`,
        });
      }
    },
    [availableTemplates, setEditorContent]
  );
};
