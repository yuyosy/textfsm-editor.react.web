import { AppShell, Burger, Button, Paper, Stack, Tooltip } from '@mantine/core';
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Edit,
  LibraryBig,
  Package,
  PlaneLanding,
  PlaneTakeoff,
  Plus,
  Settings,
} from 'lucide-react';

interface NavbarProps {
  opened: boolean;
  toggle: () => void;
}

interface NavItem {
  label: string;
  icon: JSX.Element;
}

const navItems: NavItem[] = [
  { label: 'Preset', icon: <Package size={24} strokeWidth={1.5} /> },
  { label: 'Save Template', icon: <Plus size={24} strokeWidth={1.5} /> },
  { label: 'Load Template', icon: <LibraryBig size={24} strokeWidth={1.5} /> },
  { label: 'Edit Templates', icon: <Edit size={24} strokeWidth={1.5} /> },
  { label: 'Import Templates', icon: <PlaneLanding size={24} strokeWidth={1.5} /> },
  { label: 'Export Templates', icon: <PlaneTakeoff size={24} strokeWidth={1.5} /> },
  { label: 'Options', icon: <Settings size={24} strokeWidth={1.5} /> },
];

export const AppNavbar = ({ opened, toggle }: NavbarProps) => {
  return (
    <>
      <AppShell.Navbar bg="transparent">
        <Paper h="100%" m={5} radius="md" shadow="xs">
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
                    color="dark"
                    justify="left"
                    fullWidth
                    leftSection={item.icon}
                  >
                    {item.label}
                  </Button>
                </Tooltip>
              ))}
            </Stack>
            <Button
              px={6}
              onClick={toggle}
              variant="subtle"
              color="dark"
              justify="left"
              fullWidth
              visibleFrom="sm"
              leftSection={
                opened ? (
                  <ArrowLeftFromLine size={24} strokeWidth={1.5} />
                ) : (
                  <ArrowRightFromLine size={24} strokeWidth={1.5} />
                )
              }
            >
              {opened ? 'Collapse' : 'Expand'}
            </Button>
          </Stack>
        </Paper>
      </AppShell.Navbar>
    </>
  );
};
