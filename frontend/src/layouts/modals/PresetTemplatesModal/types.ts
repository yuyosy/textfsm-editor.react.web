export type MatchType = 'all' | 'regex' | 'fuzzy';

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
  matchType: MatchType;
}

export interface PlatformTemplatesDict {
  [platform: string]: NtcTemplateInfo[];
}

export interface SearchParams {
  template: string;
  platform: string;
  command: string;
}
