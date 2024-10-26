import { useState } from 'react';

import { AppShell, Burger, Button, Paper, Stack, Text, Tooltip } from '@mantine/core';
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Edit,
  Package,
  PlaneLanding,
  PlaneTakeoff,
  Settings,
  SquareLibrary,
  SquarePlus,
} from 'lucide-react';

import { EditTemplatesModal } from './modals/EditTemplatesModal';
import { ExportTemplatesModal } from './modals/ExportTemplatesModal';
import { ImportTemplatesModal } from './modals/ImportTemplatesModal';
import { LoadTemplateModal } from './modals/LoadTemplateModal';
import { OptionsModal } from './modals/OptionsModal';
import { PresetTemplatesModal } from './modals/PresetTemplates';
import { SaveTemplateModal } from './modals/SaveTemplateModal';

interface NavbarProps {
  opened: boolean;
  toggle: () => void;
}

type ItemId =
  | 'preset-templates'
  | 'save-template'
  | 'load-template'
  | 'edit-templates'
  | 'import-templates'
  | 'export-templates'
  | 'options';

interface NavItem {
  id: ItemId;
  label: string;
  icon: JSX.Element;
}

const navItems: NavItem[] = [
  {
    id: 'preset-templates',
    label: 'Preset (ntc-template)',
    icon: <Package size={24} strokeWidth={1.5} color="var(--mantine-color-text)" />,
  },
  {
    id: 'save-template',
    label: 'Save Template',
    icon: <SquarePlus size={24} strokeWidth={1.5} color="var(--mantine-color-text)" />,
  },
  {
    id: 'load-template',
    label: 'Load Template',
    icon: (
      <SquareLibrary size={24} strokeWidth={1.5} color="var(--mantine-color-text)" />
    ),
  },
  {
    id: 'edit-templates',
    label: 'Edit Templates',
    icon: <Edit size={24} strokeWidth={1.5} color="var(--mantine-color-text)" />,
  },
  {
    id: 'import-templates',
    label: 'Import Templates',
    icon: <PlaneLanding size={24} strokeWidth={1.5} color="var(--mantine-color-text)" />,
  },
  {
    id: 'export-templates',
    label: 'Export Templates',
    icon: <PlaneTakeoff size={24} strokeWidth={1.5} color="var(--mantine-color-text)" />,
  },
  {
    id: 'options',
    label: 'Options',
    icon: <Settings size={24} strokeWidth={1.5} color="var(--mantine-color-text)" />,
  },
];

export const AppNavbar = ({ opened, toggle }: NavbarProps) => {
  const [openedModal, setOpenedModal] = useState<string | null>(null);

  const openModal = (modalId: string) => {
    setOpenedModal(modalId);
  };
  const closeModal = () => {
    setOpenedModal(null);
  };
  return (
    <>
      <PresetTemplatesModal
        opened={openedModal === 'preset-templates'}
        close={closeModal}
      ></PresetTemplatesModal>
      <SaveTemplateModal
        opened={openedModal === 'save-template'}
        close={closeModal}
      ></SaveTemplateModal>
      <LoadTemplateModal
        opened={openedModal === 'load-template'}
        close={closeModal}
      ></LoadTemplateModal>
      <EditTemplatesModal
        opened={openedModal === 'edit-templates'}
        close={closeModal}
      ></EditTemplatesModal>
      <ImportTemplatesModal
        opened={openedModal === 'import-templates'}
        close={closeModal}
      ></ImportTemplatesModal>
      <ExportTemplatesModal
        opened={openedModal === 'export-templates'}
        close={closeModal}
      ></ExportTemplatesModal>
      <OptionsModal opened={openedModal === 'options'} close={closeModal}></OptionsModal>
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
                    onClick={() => openModal(item.id)}
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
