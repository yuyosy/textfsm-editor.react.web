export interface TemplateInfo {
  label: string;
  value: string;
  // experimental
  tags?: string[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemProps {
  label: string;
  value: string;
}

export interface ModalState {
  opened: boolean;
  type: ModalId;
}

export type ModalId =
  | 'not-active'
  | 'preset-templates'
  | 'save-template'
  | 'load-template'
  | 'edit-templates'
  | 'import-templates'
  | 'export-templates'
  | 'history'
  | 'options'
  | 'about-info';

export interface PlatformPriority {
  platform: string;
  priority: number;
}

export interface TemplateTag {
  name: string;
  description: string;
  color: string;
}
