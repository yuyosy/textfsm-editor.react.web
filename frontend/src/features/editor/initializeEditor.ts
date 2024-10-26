import { loader } from '@monaco-editor/react';

import { getCompletionItemProviderSuggestions } from '@/features/editor/definitions/CompletionItemProvider';
import { languageConfiguration } from '@/features/editor/definitions/LanguageConfiguration';
import { monarchTokensProvider } from '@/features/editor/definitions/MonarchTokensProvider';
import { textfsmThemeDark as themeDark } from '@/features/editor/themes/ThemeDark';
import { textfsmThemeLight as themeLight } from '@/features/editor/themes/ThemeLight';

export const initializeTextFSMEditor = () => {
  loader.init().then(monaco => {
    monaco.editor.defineTheme('theme-dark', themeDark);
    monaco.editor.defineTheme('theme-light', themeLight);
    monaco.languages.register({ id: 'textfsm' });
    monaco.languages.setLanguageConfiguration('textfsm', languageConfiguration);
    monaco.languages.setMonarchTokensProvider('textfsm', monarchTokensProvider);
    monaco.languages.registerCompletionItemProvider('textfsm', {
      provideCompletionItems: (model: any, position: any) => {
        return { suggestions: getCompletionItemProviderSuggestions(model, position) };
      },
    });
  });
};
