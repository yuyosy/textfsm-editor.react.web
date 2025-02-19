import { TemplateTag } from '@/layouts/modals/types';
import {
  CheckIcon,
  CloseButton,
  Combobox,
  ComboboxProps,
  Flex,
  Grid,
  Group,
  Input,
  Pill,
  PillsInput,
  ScrollArea,
  Text,
  useCombobox,
} from '@mantine/core';
import { useState } from 'react';
import { TagBadge } from './TagBadege';

export interface TagBadgeMultiSelectProps extends ComboboxProps {
  label: string;
  selectItems: TemplateTag[];
  onChange?: (value: string[]) => void;
  defaultValue?: string[];
  clearable?: boolean;
}

export const TagBadgeMultiSelect = ({
  label,
  selectItems,
  onChange,
  defaultValue = [],
  clearable = false,
  ...props
}: TagBadgeMultiSelectProps) => {
  const [search, setSearch] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue);

  const findItem = (value: string): TemplateTag =>
    selectItems[selectItems.findIndex(item => item.name === value)];

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch('');
    },
    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const handleValueSelect = (val: string) => {
    const newSelectedValues = selectedValues.includes(val)
      ? selectedValues.filter(v => v !== val)
      : [...selectedValues, val];
    setSelectedValues(newSelectedValues);
    onChange && onChange(newSelectedValues);
  };

  const handleValueRemove = (val: string) => {
    const newSelectedValues = selectedValues.filter(v => v !== val);
    setSelectedValues(newSelectedValues);
    onChange && onChange(newSelectedValues);
  };

  const selectedValueNodes = selectedValues.map(item => {
    const tag = findItem(item);
    return (
      <TagBadge
        key={item}
        color={tag ? tag.color : ''}
        p={8}
        mt={2}
        variant={tag ? 'filled' : 'default'}
        style={tag ? {} : { border: 'dashed 1px #666' }}
        autoContrast
      >
        <Flex align="center" wrap="nowrap">
          {item}
          <CloseButton
            onMouseDown={() => handleValueRemove(item)}
            variant="transparent"
            color="gray"
            size={22}
            iconSize={14}
            tabIndex={-1}
          />
        </Flex>
      </TagBadge>
    );
  });

  const groupSelectItems = (items: TemplateTag[], selectedValues: string[]) => {
    return items
      .filter(item => item.name.toLowerCase().includes(search.toLowerCase().trim()))
      .reduce(
        (acc, item) => {
          if (selectedValues.includes(item.name)) {
            acc[1].values.push(item);
          } else {
            acc[0].values.push(item);
          }
          return acc;
        },
        [
          { label: 'available', values: [] as typeof items },
          { label: 'selected', values: [] as typeof items },
        ]
      );
  };

  const groupedItems = groupSelectItems(selectItems, selectedValues);

  const optionNodes = groupedItems.map(group => (
    <Combobox.Group key={group.label} label={group.label}>
      {group.values.map(item => (
        <Combobox.Option
          key={item.name}
          value={item.name}
          active={selectedValues.includes(item.name)}
        >
          <Grid align="center">
            <Grid.Col span="content">
              <Group gap="sm">
                {selectedValues.includes(item.name) ? <CheckIcon size={12} /> : null}
                <TagBadge {...item} />
              </Group>
            </Grid.Col>
            <Grid.Col span="content">
              <Text size="xs" c="dimmed">
                {item.description}
              </Text>
            </Grid.Col>
          </Grid>
        </Combobox.Option>
      ))}
    </Combobox.Group>
  ));

  return (
    <Combobox {...props} store={combobox} onOptionSubmit={handleValueSelect} offset={0}>
      <Combobox.DropdownTarget>
        <PillsInput
          pointer
          label={label}
          onClick={() => combobox.toggleDropdown()}
          rightSection={
            clearable &&
            selectedValues.length > 0 && (
              <CloseButton
                size="sm"
                onMouseDown={event => event.preventDefault()}
                onClick={() => {
                  setSelectedValues([]);
                  onChange && onChange([]);
                }}
                aria-label="Clear value"
              />
            )
          }
        >
          <Pill.Group>
            {selectedValueNodes}
            {selectedValueNodes.length < selectItems.length ? (
              <Input.Placeholder>Pick one or more values</Input.Placeholder>
            ) : (
              <Input.Placeholder>All selected</Input.Placeholder>
            )}
            <Combobox.EventsTarget>
              <PillsInput.Field
                type="hidden"
                onKeyDown={event => {
                  if (event.key === 'Backspace') {
                    event.preventDefault();
                    handleValueRemove(selectedValues[selectedValues.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Search
          value={search}
          onChange={event => setSearch(event.currentTarget.value)}
          placeholder="Search items"
        />
        <Combobox.Options>
          {optionNodes.length > 0 ? (
            <ScrollArea.Autosize mah={200} type="scroll">
              {optionNodes}
            </ScrollArea.Autosize>
          ) : (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          )}
        </Combobox.Options>
        <Combobox.Footer p={0} ml={0} mr={4}>
          <Group justify="space-between">
            <Text fz="xs" c="dimmed">
              Available: {groupedItems[0].values.length}, Selected:{' '}
              {groupedItems[1].values.length}
            </Text>
            <Flex
              align="center"
              onClick={() => combobox.closeDropdown()}
              style={{ cursor: 'pointer' }}
            >
              <Text fz="xs" c="dimmed">
                Close
              </Text>
              <CloseButton size="sm" />
            </Flex>
          </Group>
        </Combobox.Footer>
      </Combobox.Dropdown>
    </Combobox>
  );
};
