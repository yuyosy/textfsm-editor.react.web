import { AppShell, Burger, Button, Paper, Stack, Text, Tooltip } from '@mantine/core';
import { useSetAtom } from 'jotai';
import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';

import { controlModalAtom } from '@/features/state/atoms';

import { ModalController } from './modals/ModalController';
import { navItems } from './NavItems';

interface NavbarProps {
  opened: boolean;
  toggle: () => void;
}

export const AppNavbar = ({ opened, toggle }: NavbarProps) => {
  const setControlModalAtom = useSetAtom(controlModalAtom);
  return (
    <>
      <ModalController />
      <AppShell.Navbar bg="transparent">
        <Paper h="100%" my={8} ml={8} radius="md" shadow="xs">
          <Stack h="100%" p={6} justify="space-between">
            <Stack gap={6}>
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              {navItems.map((item, index) => (
                <Tooltip
                  key={index}
                  label={item.label}
                  position="right"
                  events={{ hover: !opened, focus: true, touch: false }}
                  withArrow
                >
                  <Button
                    px={6}
                    variant="subtle"
                    justify="left"
                    fullWidth
                    leftSection={item.icon}
                    onClick={() => setControlModalAtom({ opened: true, type: item.id })}
                  >
                    <Text c="var(--mantine-color-text)">{item.label}</Text>
                  </Button>
                </Tooltip>
              ))}
            </Stack>
            <Button
              px={6}
              onClick={toggle}
              variant="subtle"
              justify="left"
              fullWidth
              visibleFrom="sm"
              leftSection={
                opened ? (
                  <ArrowLeftFromLine
                    size={24}
                    strokeWidth={1.5}
                    color="var(--mantine-color-text)"
                  />
                ) : (
                  <ArrowRightFromLine
                    size={24}
                    strokeWidth={1.5}
                    color="var(--mantine-color-text)"
                  />
                )
              }
            >
              <Text c="var(--mantine-color-text)">{opened ? 'Collapse' : 'Expand'}</Text>
            </Button>
          </Stack>
        </Paper>
      </AppShell.Navbar>
    </>
  );
};
