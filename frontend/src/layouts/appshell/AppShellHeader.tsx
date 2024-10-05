import {
  ActionIcon,
  AppShell,
  Group,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { Moon, Sun } from 'lucide-react';

export const AppHeader = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <>
      <AppShell.Header h={40}>
        <Group h="100%" px={10} justify="space-between">
          <Text fw={700}>TextFSM-Editor</Text>
          <Group>
            <Tooltip
              label={colorScheme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              withArrow
              position="bottom"
            >
              <ActionIcon onClick={() => toggleColorScheme()}>
                {colorScheme === 'dark' ? <Sun /> : <Moon />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </AppShell.Header>
    </>
  );
};
