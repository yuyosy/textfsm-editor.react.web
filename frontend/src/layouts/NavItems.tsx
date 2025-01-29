import {
  Edit,
  Info,
  Package,
  PlaneLanding,
  PlaneTakeoff,
  Settings,
  SquareLibrary,
  SquarePlus,
} from 'lucide-react';

import { NavItem } from './types';

export const navItems: NavItem[] = [
  {
    id: 'preset-templates',
    label: 'Preset (ntc-templates)',
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
  {
    id: 'about-info',
    label: 'About',
    icon: <Info size={24} strokeWidth={1.5} color="var(--mantine-color-text)" />,
  },
];
