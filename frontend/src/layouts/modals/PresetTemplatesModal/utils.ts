import { regexTest } from '@/utils/regexTest';
import Fuse from 'fuse.js';
import {
  NtcTemplateInfo,
  PlatformTemplatesDict,
  SearchedTemplateInfo,
  SearchParams,
} from './types';

// Function to filter templates based on regex and search parameters
export const getRegexFilteredTemplates = (
  templates: PlatformTemplatesDict,
  searchParams: SearchParams,
  isAndCondition: boolean,
  selectedPlatform: string | null
): SearchedTemplateInfo[] => {
  if (selectedPlatform === null) {
    return [];
  }
  return Object.values(templates[selectedPlatform] || [])
    .filter(({ template, command_raw, command_regex }) => {
      const conditions: boolean[] = [];
      if (searchParams.template !== '') {
        conditions.push(
          template.toLowerCase().includes(searchParams.template.trim().toLowerCase())
        );
      }
      if (searchParams.command !== '') {
        conditions.push(
          command_raw
            .toLowerCase()
            .includes(searchParams.command.trim().toLowerCase()) ||
            regexTest(command_regex, searchParams.command)
        );
      }

      return isAndCondition
        ? conditions.every(value => value === true)
        : conditions.some(value => value === true);
    })
    .map(item => ({
      ...item,
      matchType: searchParams.command === '' ? 'all' : 'regex',
    }));
};

// Function to filter templates based on fuzzy search
export const getFuzzyFilteredTemplates = (
  fuse: Fuse<NtcTemplateInfo>,
  searchValue: string,
  regexFilteredTemplates: any[],
  selectedPlatform: string | null
): SearchedTemplateInfo[] => {
  return fuse
    .search(searchValue)
    .map(result => result.item)
    .filter(
      item =>
        item.platform === selectedPlatform &&
        !regexFilteredTemplates.some(
          regexItem =>
            regexItem.template === item.template &&
            regexItem.command_raw === item.command_raw
        )
    )
    .map(item => ({ ...item, matchType: 'fuzzy' }));
};
