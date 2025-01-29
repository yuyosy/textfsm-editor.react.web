import { ChangeEvent, useState } from 'react';

import {
  ActionIcon,
  Checkbox,
  Combobox,
  Flex,
  Grid,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  useCombobox,
} from '@mantine/core';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// 型定義を追加
interface RenderListProps {
  options: string[];
  onTransfer: (options: string[]) => void;
  type: 'forward' | 'backward';
  searchPlaceholder?: string;
}

interface TransferListProps {
  initialLeftData: string[];
  initialRightData: string[];
  leftSearchPlaceholder?: string;
  rightSearchPlaceholder?: string;
  onChange?: (leftData: string[], rightData: string[]) => void;
}

const RenderList = ({
  options,
  onTransfer,
  type,
  searchPlaceholder = 'Search items...',
}: RenderListProps) => {
  const [value, setValue] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const combobox = useCombobox();

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const handleValueSelect = (val: string) => {
    setValue(current =>
      current.includes(val) ? current.filter(v => v !== val) : [...current, val]
    );
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.currentTarget.checked;
    if (checked) {
      setValue(filteredOptions.map(option => option));
    } else {
      setValue([]);
    }
  };

  const handleTransfer = () => {
    onTransfer(value);
    setValue([]);
  };

  // チェックボックスの状態を計算
  const isAllSelected =
    filteredOptions.length > 0 && value.length === filteredOptions.length;
  const isIndeterminate = value.length > 0 && value.length < filteredOptions.length;

  const items = filteredOptions.map(item => (
    <Combobox.Option
      value={item}
      key={item}
      active={value.includes(item)}
      onMouseOver={() => combobox.resetSelectedOption()}
    >
      <Group gap="sm" wrap="nowrap">
        <Checkbox
          checked={value.includes(item)}
          onChange={() => {}}
          aria-hidden
          tabIndex={-1}
          style={{ pointerEvents: 'none' }}
        />
        <Text fz={14} truncate="end">
          {item}
        </Text>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Stack gap={4}>
      <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
        <Combobox.EventsTarget>
          <Stack gap="xs">
            <Flex
              wrap="nowrap"
              gap={4}
              direction={type === 'forward' ? 'row' : 'row-reverse'}
            >
              <TextInput
                w="100%"
                placeholder={searchPlaceholder}
                value={search}
                onChange={event => {
                  setSearch(event.currentTarget.value);
                  combobox.updateSelectedOptionIndex();
                }}
              />
              <ActionIcon variant="default" size={36} onClick={handleTransfer}>
                {type === 'forward' ? <ChevronRight /> : <ChevronLeft />}
              </ActionIcon>
            </Flex>
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={handleSelectAll}
              label="Select All"
            />
          </Stack>
        </Combobox.EventsTarget>
        <Combobox.Options
          h={250}
          bd="solid calc(0.0625rem * var(--mantine-scale)) var(--mantine-color-default-border)"
          styles={{ options: { borderRadius: 5 } }}
        >
          <ScrollArea p={4} h={250} type="auto" offsetScrollbars="y">
            {items.length > 0 ? (
              items
            ) : (
              <Combobox.Empty>Nothing found....</Combobox.Empty>
            )}
          </ScrollArea>
        </Combobox.Options>
      </Combobox>
    </Stack>
  );
};

export const TransferList = ({
  initialLeftData,
  initialRightData,
  leftSearchPlaceholder,
  rightSearchPlaceholder,
  onChange,
}: TransferListProps) => {
  const [data, setData] = useState<[string[], string[]]>([
    initialLeftData,
    initialRightData,
  ]);

  const handleTransfer = (transferFrom: number, options: string[]) =>
    setData(current => {
      const transferTo = transferFrom === 0 ? 1 : 0;
      const transferFromData = current[transferFrom].filter(
        item => !options.includes(item)
      );
      const transferToData = [...current[transferTo], ...options];

      const result = [];
      result[transferFrom] = transferFromData;
      result[transferTo] = transferToData;

      // データが変更された時にコールバックを呼び出し
      onChange?.(result[0], result[1]);

      return result as [string[], string[]];
    });

  return (
    <Grid>
      <Grid.Col span={6}>
        <RenderList
          type="forward"
          options={data[0]}
          onTransfer={options => handleTransfer(0, options)}
          searchPlaceholder={leftSearchPlaceholder}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <RenderList
          type="backward"
          options={data[1]}
          onTransfer={options => handleTransfer(1, options)}
          searchPlaceholder={rightSearchPlaceholder}
        />
      </Grid.Col>
    </Grid>
    // <Flex gap={5}>
    //   <RenderList
    //     type="forward"
    //     options={data[0]}
    //     onTransfer={options => handleTransfer(0, options)}
    //     searchPlaceholder={leftSearchPlaceholder}
    //   />
    //   <RenderList
    //     type="backward"
    //     options={data[1]}
    //     onTransfer={options => handleTransfer(1, options)}
    //     searchPlaceholder={rightSearchPlaceholder}
    //   />
    // </Flex>
  );
};
