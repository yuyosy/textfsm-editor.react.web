import { useSetAtom } from 'jotai';

import { api } from '@/features/api';
import { addNotificationAtom } from '@/features/state/atoms';
import { templateEditorValueAtom } from '@/features/state/storageAtoms';

export const useLoadPresetTemplate = () => {
  const addNotification = useSetAtom(addNotificationAtom);
  const setEditorContent = useSetAtom(templateEditorValueAtom);

  const loadTemplate = async (templateName: string) => {
    try {
      const response = await api.get(`/api/ntc-templates/${templateName}`, {
        responseType: 'text',
      });
      setEditorContent(response);
      addNotification({
        type: 'success',
        title: 'Preset template loaded',
        message: `Loaded: ${templateName}`,
      });
    } catch (error) {
      console.error('Failed to load template:', error);
      addNotification({
        type: 'error',
        title: 'Failed to load preset template',
        message: `Failed to load: ${templateName}`,
      });
    }
  };

  return { loadTemplate };
};
