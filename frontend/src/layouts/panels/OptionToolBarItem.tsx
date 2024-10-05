import { Button, Group, Menu, NumberInput, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconSettings } from '@tabler/icons-react';

export const OptionToolBarItem = () => {
  const [inputSendDelayValue, setInputSendDelayValue] = useLocalStorage<number>({
    key: 'editor-input-send-delay',
    defaultValue: 1000,
  });

  return (
    <>
      <Menu position="bottom-end" withArrow shadow="md" width={400} closeOnItemClick={false}>
        <Menu.Target>
          <Button
            variant="default"
            size="xs"
            leftIcon={<IconSettings size={18} strokeWidth={1.5} />}
          >
            Options
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label fw={600}>Editor Options</Menu.Label>
          <Group p={10} position="apart">
            <Text fz="sm">
              Input send delay
              <Text fz="xs" c="dimmed">
                Only when AutoParse is active (ON).
              </Text>
            </Text>
            <NumberInput
              step={500}
              min={500}
              max={5000}
              size="xs"
              value={inputSendDelayValue}
              onChange={(value) => setInputSendDelayValue(value === '' ? 1000 : value)}
              parser={(value) => value.replace(/\sms/g, '')}
              formatter={(value) => (!Number.isNaN(parseFloat(value)) ? `${value} ms` : '')}
            />
          </Group>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
