import { useEffect, useState } from 'react';

import { api } from '@/features/api';

import { NtcTemplateIndex, PlatformTemplatesDict } from '../types';

export const useFetchTemplates = () => {
  const [templates, setTemplates] = useState<PlatformTemplatesDict>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const response = (await api.get('/api/ntc-templates')) as NtcTemplateIndex;
        if (!response.template_list) {
          throw new Error('Invalid response format');
        }
        const groupedTemplates = response.template_list.reduce((acc, template) => {
          if (!acc[template.platform]) {
            acc[template.platform] = [];
          }
          acc[template.platform].push(template);
          return acc;
        }, {} as PlatformTemplatesDict);

        setTemplates(groupedTemplates);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return { templates, loading };
};
