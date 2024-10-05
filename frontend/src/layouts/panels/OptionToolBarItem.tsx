import { Button, Group, Menu, NumberInput, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { Settings } from 'lucide-react';

export const OptionToolBarItem = () => {
  const [inputSendDelayValue, setInputSendDelayValue] = useLocalStorage<number>({
    key: 'editor-input-send-delay',
    defaultValue: 1000,
  });

  return (
    <>
      <Menu
        position="bottom-end"
        withArrow
        shadow="md"
        width={400}
        closeOnItemClick={false}
      >
        <Menu.Target>
          <Button
            variant="default"
            size="xs"
            leftSection={<Settings size={18} strokeWidth={1.5} />}
          >
            Options
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label fw={600}>Editor Options</Menu.Label>
          <Group p={10} justify="space-between">
            <Text fz="sm">Input send delay</Text>
            <Text fz="xs" c="dimmed">
              Only when AutoParse is active (ON).
            </Text>
            <NumberInput
              step={500}
              min={500}
              max={5000}
              size="xs"
              value={inputSendDelayValue}
              onChange={value =>
                setInputSendDelayValue(value === '' ? 1000 : Number(value))
              }
              suffix="ms"
            />
          </Group>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
