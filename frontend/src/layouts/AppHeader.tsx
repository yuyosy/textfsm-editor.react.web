import {
  ActionIcon,
  AppShell,
  Burger,
  Group,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  opened: boolean;
  toggle: () => void;
}
export const AppHeader = ({ opened, toggle }: HeaderProps) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <>
      <AppShell.Header h={40} bg="transparent">
        <Group h="100%" px={5} justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group align="baseline">
            <Text fw={700}>TextFSM-Editor</Text>
            <Text size="xs" c="dimmed">
              ver.{__APP_VERSION__}
            </Text>
          </Group>
          <Tooltip
            label={colorScheme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            withArrow
            position="bottom"
          >
            <ActionIcon variant="subtle" mx={4} onClick={() => toggleColorScheme()}>
              {colorScheme === 'dark' ? (
                <Sun strokeWidth={1.5} />
              ) : (
                <Moon strokeWidth={1.5} />
              )}
            </ActionIcon>
          </Tooltip>
        </Group>
      </AppShell.Header>
    </>
  );
};
