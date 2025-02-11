import { MutableRefObject } from 'react';

export interface NtcTemplateInfo {
  template: string;
  hostname: string;
  platform: string;
  command_raw: string;
  command_regex: string;
}

export interface NtcTemplateIndex {
  version: string;
  template_list: NtcTemplateInfo[];
}

export interface SearchedTemplateInfo extends NtcTemplateInfo {
  matchType: 'regex' | 'fuzzy';
}

export interface PlatformTemplatesDict {
  [platform: string]: NtcTemplateInfo[];
}

export type ModalContentProps = {
  close: () => void;
  focusRef: MutableRefObject<HTMLDivElement>;
};

export interface SearchParams {
  template: string;
  platform: string;
  command: string;
}
