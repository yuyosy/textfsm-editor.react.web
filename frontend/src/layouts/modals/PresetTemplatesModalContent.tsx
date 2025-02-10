import { api } from '@/features/api';
import { addNotificationAtom } from '@/features/state/atoms';
import { templateEditorValueAtom } from '@/features/state/storageAtoms';
import {
  Badge,
  Button,
  Code,
  Divider,
  Group,
  HoverCard,
  Modal,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import Fuse from 'fuse.js';
import { useSetAtom } from 'jotai';
import { CircleHelp } from 'lucide-react';
import { DataTable } from 'mantine-datatable';
import { MutableRefObject, useCallback, useEffect, useMemo, useState } from 'react';

interface TemplateInfo {
  template: string;
  hostname: string;
  platform: string;
  command_raw: string;
  command_regex: string;
}
interface TemplateIndex {
  version: string;
  template_list: TemplateInfo[];
}
interface SearchedTemplateInfo extends TemplateInfo {
  matchType: 'regex' | 'fuzzy';
}
type ModalContentProps = {
  close: () => void;
  focusRef: MutableRefObject<HTMLDivElement>;
};

const regexSearch = (regex: string, text: string): boolean => {
  try {
    const re = new RegExp(regex.trim(), 'i');
    return re.test(text);
  } catch (e) {
    return false;
  }
};

export const PresetTemplatesModalContent = ({ close, focusRef }: ModalContentProps) => {
  const addNotification = useSetAtom(addNotificationAtom);
  const [templates, setTemplates] = useState<{ [platform: string]: TemplateInfo[] }>({});
  const [selectedRecords, setSelectedRecords] = useState<SearchedTemplateInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAndCondition, setIsAndCondition] = useState(true);
  const [isFuzzyEnabled, setIsFuzzyEnabled] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const setEditorContent = useSetAtom(templateEditorValueAtom);

  const [searchParams, setSearchParams] = useState({
    template: '',
    platform: '',
    command: '',
  });
  const [debounced] = useDebouncedValue(searchParams, 300);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response: TemplateIndex = await api.get('/api/ntc-templates');
      if (!response.template_list) {
        throw new Error('Invalid response format');
      }
      const groupedTemplates = response.template_list.reduce(
        (acc, template) => {
          if (!acc[template.platform]) {
            acc[template.platform] = [];
          }
          acc[template.platform].push(template);
          return acc;
        },
        {} as { [platform: string]: TemplateInfo[] }
      );

      setTemplates(groupedTemplates);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchParams({ ...searchParams, template: e.target.value });
    },
    [searchParams]
  );

  const handleCommandSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchParams({ ...searchParams, command: e.target.value });
    },
    [searchParams]
  );

  const fuse = useMemo(
    () =>
      new Fuse(Object.values(templates).flat(), {
        keys: ['template'],
        threshold: 0.6,
      }),
    [templates]
  );

  const regexFilteredTemplates = useMemo(() => {
    if (selectedPlatform === null) {
      return [];
    }
    return Object.values(templates[selectedPlatform] || []).filter(
      ({ template, command_raw, command_regex }) => {
        const conditions = [];

        if (searchParams.template !== '') {
          conditions.push(
            template.toLowerCase().includes(searchParams.template.trim().toLowerCase())
          );
        }
        if (searchParams.command !== '') {
          conditions.push(
            command_raw
              .toLowerCase()
              .includes(searchParams.command.trim().toLowerCase()) ||
              regexSearch(command_regex, searchParams.command)
          );
        }

        return isAndCondition
          ? conditions.every(value => value === true)
          : conditions.some(value => value === true);
      }
    );
  }, [templates, searchParams, isAndCondition, selectedPlatform]);

  const fuzzyFilteredTemplates = useMemo(() => {
    if (!isFuzzyEnabled) {
      return [];
    }
    return fuse
      .search(searchParams.command)
      .map(result => result.item)
      .filter(
        item =>
          item.platform === selectedPlatform &&
          !regexFilteredTemplates.some(
            regexItem =>
              regexItem.template === item.template &&
              regexItem.command_raw === item.command_raw
          )
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
      ...regexFilteredTemplates.map(template => ({
        ...template,
        matchType: 'regex' as const,
      })),
      ...fuzzyFilteredTemplates.map(template => ({
        ...template,
        matchType: 'fuzzy' as const,
      })),
    ];
    setSelectedRecords(combinedTemplates);
  }, [
    isAndCondition,
    debounced,
    templates,
    searchParams,
    regexFilteredTemplates,
    fuzzyFilteredTemplates,
  ]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSelectTemplate = (template: string) => {
    setSelectedTemplate(template);
  };

  const handleLoadTemplate = async () => {
    try {
      const response = await api.get(`/api/ntc-templates/${selectedTemplate}`, {
        responseType: 'text',
      });
      setEditorContent(response);
      addNotification({
        type: 'success',
        title: 'Preset template loaded',
        message: `Loaded: ${selectedTemplate}`,
      });
      close();
    } catch (error) {
      console.error('Failed to load template:', error);
    }
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
        <Stack ref={focusRef}>
          <Select
            label="Select Platform"
            placeholder="Pick one"
            data={Object.keys(templates).map(platform => ({
              value: platform,
              label: platform,
            }))}
            value={selectedPlatform}
            onChange={setSelectedPlatform}
            clearable
            searchable
          />
          <Divider my="2" />
          <TextInput
            label="Template Name"
            placeholder="Search by template name"
            value={searchParams.template}
            onChange={handleTemplateSearchChange}
          />
          <TextInput
            label="Command"
            placeholder="Search by command"
            value={searchParams.command}
            onChange={handleCommandSearchChange}
          />
          <Group>
            <Switch
              size="xs"
              label="Use AND condition for filters"
              checked={isAndCondition}
              onChange={e => setIsAndCondition(e.currentTarget.checked)}
            />
            <Switch
              size="xs"
              label="Enable Fuzzy Match"
              checked={isFuzzyEnabled}
              onChange={e => setIsFuzzyEnabled(e.currentTarget.checked)}
            />{' '}
            <HoverCard width={280} shadow="md">
              <HoverCard.Target>
                <CircleHelp size={16} color="#5e5e5e" />
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text size="sm">
                  The command regular expression <Code>abc[[xyz]]</Code> means
                  <Code>abc(x(y(z)?)?)?</Code> and will match <Code>abc</Code>,{' '}
                  <Code>abcx</Code>, <Code>abcxy</Code>, and <Code>abcxyz</Code>.
                </Text>
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>
          <DataTable
            height={300}
            minHeight={300}
            withTableBorder
            noRecordsText="Select a platform to view templates"
            borderRadius="sm"
            striped
            highlightOnHover
            idAccessor={item => item.template + item.platform + item.command_raw}
            fetching={loading}
            records={selectedRecords}
            scrollAreaProps={{ type: 'always', offsetScrollbars: 'y' }}
            columns={[
              {
                accessor: 'template',
                title: 'Template',
                render: record => (
                  <Stack gap={0}>
                    <Text>{record.template}</Text>
                    <Text size="xs" c="dimmed" p={4}>
                      {record.command_raw}
                    </Text>
                    <Group gap={8}>
                      <Badge
                        variant="default"
                        color="blue"
                        radius="sm"
                        size="xs"
                        tt="capitalize"
                      >
                        {record.platform}
                      </Badge>
                      <Badge
                        variant="dot"
                        color={record.matchType === 'regex' ? 'green' : 'blue'}
                        radius="sm"
                        size="xs"
                        tt="capitalize"
                      >
                        {record.matchType === 'regex' ? 'Regex Match' : 'Fuzzy Match'}
                      </Badge>
                    </Group>
                  </Stack>
                ),
              },
              {
                accessor: 'actions',
                title: 'Select',
                render: record => (
                  <Button
                    variant="default"
                    size="xs"
                    onClick={() => handleSelectTemplate(record.template)}
                  >
                    Select
                  </Button>
                ),
              },
            ]}
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
