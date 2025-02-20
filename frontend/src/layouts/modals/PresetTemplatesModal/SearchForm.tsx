import {
  CloseButton,
  Code,
  Divider,
  Group,
  HoverCard,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import { CircleHelp } from 'lucide-react';
import { usePlatformPriority } from './hooks/usePlatformPriority';
import { SearchParams } from './types';
import { normalize } from './utils';

interface SearchFormProps {
  templates: { [platform: string]: any[] };
  searchParams: SearchParams;
  isAndCondition: boolean;
  isFuzzyEnabled: boolean;
  selectedPlatform: string | null;
  handleSearchParamsChange: (field: keyof SearchParams, value: string) => void;
  handlePlatformChange: (platform: string | null) => void;
  handleAndConditionChange: (value: boolean) => void;
  handleFuzzyEnabledChange: (value: boolean) => void;
}

export const SearchForm = ({
  templates,
  searchParams,
  isAndCondition,
  isFuzzyEnabled,
  selectedPlatform,
  handleSearchParamsChange,
  handlePlatformChange,
  handleAndConditionChange,
  handleFuzzyEnabledChange,
}: SearchFormProps) => {
  const { platformPriorities } = usePlatformPriority();

  const groupedPlatforms = Object.keys(templates).reduce(
    (acc, platform) => {
      const priority =
        platformPriorities.find(p => p.platform === platform)?.priority || 0;
      if (!acc[priority]) {
        acc[priority] = [];
      }
      acc[priority].push(platform);
      return acc;
    },
    {} as { [priority: number]: string[] }
  );

  const sortedGroups = Object.keys(groupedPlatforms)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <Stack>
      <Select
        label="Select Platform"
        placeholder="Pick one"
        data={sortedGroups.map(priority => ({
          group: `Priority ${priority}`,
          items: groupedPlatforms[priority].map(platform => ({
            value: platform,
            label: normalize(platform),
          })),
        }))}
        value={selectedPlatform}
        onChange={handlePlatformChange}
        comboboxProps={{ shadow: 'lg' }}
        clearable
        searchable
      />
      <Divider my="2" />
      <TextInput
        label="Template Name"
        placeholder="Search by template name"
        value={searchParams.template}
        onChange={e => handleSearchParamsChange('template', e.target.value)}
        rightSection={
          <CloseButton
            size="sm"
            onClick={() => handleSearchParamsChange('template', '')}
          />
        }
      />
      <TextInput
        label="Command"
        placeholder="Search by command"
        value={searchParams.command}
        onChange={e => handleSearchParamsChange('command', e.target.value)}
        rightSection={
          <CloseButton
            size="sm"
            onClick={() => handleSearchParamsChange('command', '')}
          />
        }
      />
      <Group>
        <Switch
          size="xs"
          label="Use AND condition for filters"
          checked={isAndCondition}
          onChange={e => handleAndConditionChange(e.currentTarget.checked)}
        />
        <Switch
          size="xs"
          label="Enable Fuzzy Match"
          checked={isFuzzyEnabled}
          onChange={e => handleFuzzyEnabledChange(e.currentTarget.checked)}
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
    </Stack>
  );
};
