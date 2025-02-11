import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import Fuse from 'fuse.js';
import { useEffect, useMemo, useState } from 'react';
import { useFetchTemplates } from './hooks/useFetchTemplates';
import { useLoadPresetTemplate } from './hooks/useLoadPresetTemplate';
import { SearchForm } from './SearchForm';
import { TemplateTable } from './TemplateTable';
import { ModalContentProps, SearchedTemplateInfo, SearchParams } from './types';
import { getFuzzyFilteredTemplates, getRegexFilteredTemplates } from './utils';

export const PresetTemplatesModalContent = ({ close, focusRef }: ModalContentProps) => {
  const { templates, loading } = useFetchTemplates();
  const { loadTemplate } = useLoadPresetTemplate();
  const [selectedRecords, setSelectedRecords] = useState<SearchedTemplateInfo[]>([]);
  const [isAndCondition, setIsAndCondition] = useState(true);
  const [isFuzzyEnabled, setIsFuzzyEnabled] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const [searchParams, setSearchParams] = useState<SearchParams>({
    template: '',
    platform: '',
    command: '',
  });
  const [debounced] = useDebouncedValue(searchParams, 300);

  const handleSearchParamsChange = (field: keyof SearchParams, value: string) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  const handlePlatformChange = (platform: string | null) => {
    setSelectedPlatform(platform);
  };

  const handleAndConditionChange = (value: boolean) => {
    setIsAndCondition(value);
  };

  const handleFuzzyEnabledChange = (value: boolean) => {
    setIsFuzzyEnabled(value);
  };

  const fuse = useMemo(
    () =>
      new Fuse(Object.values(templates).flat(), {
        keys: ['template'],
        threshold: 0.6,
      }),
    [templates]
  );

  const regexFilteredTemplates = useMemo(() => {
    return getRegexFilteredTemplates(
      templates,
      searchParams,
      isAndCondition,
      selectedPlatform
    );
  }, [templates, searchParams, isAndCondition, selectedPlatform]);

  const fuzzyFilteredTemplates = useMemo(() => {
    if (!isFuzzyEnabled) {
      return [];
    }
    return getFuzzyFilteredTemplates(
      fuse,
      searchParams.command,
      regexFilteredTemplates,
      selectedPlatform
    );
  }, [
    fuse,
    searchParams.command,
    regexFilteredTemplates,
    selectedPlatform,
    isFuzzyEnabled,
  ]);

  useEffect(() => {
    const combinedTemplates: SearchedTemplateInfo[] = [
      ...regexFilteredTemplates,
      ...fuzzyFilteredTemplates,
    ];
    if (combinedTemplates.length > 0) {
      setSelectedRecords(combinedTemplates);
    } else {
      setSelectedRecords([]);
    }
  }, [
    isAndCondition,
    debounced,
    templates,
    searchParams,
    regexFilteredTemplates,
    fuzzyFilteredTemplates,
  ]);

  const handleSelectTemplate = (template: string) => {
    setSelectedTemplate(template);
  };

  const handleLoadTemplate = () => {
    loadTemplate(selectedTemplate);
    close();
  };

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title fz={18} fw={700}>
          Preset Templates
        </Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <Stack ref={focusRef} p={8}>
          <SearchForm
            templates={templates}
            searchParams={searchParams}
            isAndCondition={isAndCondition}
            isFuzzyEnabled={isFuzzyEnabled}
            selectedPlatform={selectedPlatform}
            onSearchParamsChange={handleSearchParamsChange}
            onPlatformChange={handlePlatformChange}
            onAndConditionChange={handleAndConditionChange}
            onFuzzyEnabledChange={handleFuzzyEnabledChange}
          />
          <TemplateTable
            templates={selectedRecords}
            loading={loading}
            onSelectTemplate={handleSelectTemplate}
          />
          <TextInput label="Selected Template" value={selectedTemplate} readOnly />
        </Stack>
        <Group justify="space-between" mt="lg">
          <Button variant="default" size="xs" onClick={close}>
            Close
          </Button>
          <Button
            size="xs"
            color="cyan"
            onClick={handleLoadTemplate}
            disabled={!selectedTemplate}
          >
            Load Template
          </Button>
        </Group>
      </Modal.Body>
    </Modal.Content>
  );
};
