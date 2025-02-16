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
}

export const TagBadgeMultiSelect = ({
  label,
  selectItems,
  onChange,
  ...props
}: TagBadgeMultiSelectProps) => {
  const [search, setSearch] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

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
    setSelectedValues(current =>
      current.includes(val) ? current.filter(v => v !== val) : [...current, val]
    );
    onChange && onChange(selectedValues);
  };

  const handleValueRemove = (val: string) =>
    setSelectedValues(current => current.filter(v => v !== val));

  const selectedValueNodes = selectedValues.map(item => (
    <TagBadge key={item} color={findItem(item).color} p={8} mt={2} autoContrast>
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
  ));

  const optionNodes = selectItems
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
        { label: 'available', values: [] as typeof selectItems },
        { label: 'selected', values: [] as typeof selectItems },
      ]
    )
    .map(group => (
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
            selectedValues && (
              <CloseButton
                size="sm"
                onMouseDown={event => event.preventDefault()}
                onClick={() => setSelectedValues([])}
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
      </Combobox.Dropdown>
    </Combobox>
  );
};
