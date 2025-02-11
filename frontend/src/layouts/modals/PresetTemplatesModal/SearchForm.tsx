import {
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
import { SearchParams } from './types';

interface SearchFormProps {
  templates: { [platform: string]: any[] };
  searchParams: SearchParams;
  isAndCondition: boolean;
  isFuzzyEnabled: boolean;
  selectedPlatform: string | null;
  onSearchParamsChange: (field: keyof SearchParams, value: string) => void;
  onPlatformChange: (platform: string | null) => void;
  onAndConditionChange: (value: boolean) => void;
  onFuzzyEnabledChange: (value: boolean) => void;
}

export const SearchForm = ({
  templates,
  searchParams,
  isAndCondition,
  isFuzzyEnabled,
  selectedPlatform,
  onSearchParamsChange,
  onPlatformChange,
  onAndConditionChange,
  onFuzzyEnabledChange,
}: SearchFormProps) => {
  return (
    <Stack>
      <Select
        label="Select Platform"
        placeholder="Pick one"
        data={Object.keys(templates).map(platform => ({
          value: platform,
          label: platform,
        }))}
        value={selectedPlatform}
        onChange={onPlatformChange}
        clearable
        searchable
      />
      <Divider my="2" />
      <TextInput
        label="Template Name"
        placeholder="Search by template name"
        value={searchParams.template}
        onChange={e => onSearchParamsChange('template', e.target.value)}
      />
      <TextInput
        label="Command"
        placeholder="Search by command"
        value={searchParams.command}
        onChange={e => onSearchParamsChange('command', e.target.value)}
      />
      <Group>
        <Switch
          size="xs"
          label="Use AND condition for filters"
          checked={isAndCondition}
          onChange={e => onAndConditionChange(e.currentTarget.checked)}
        />
        <Switch
          size="xs"
          label="Enable Fuzzy Match"
          checked={isFuzzyEnabled}
          onChange={e => onFuzzyEnabledChange(e.currentTarget.checked)}
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
