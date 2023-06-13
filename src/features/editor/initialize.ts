
import { loader } from '@monaco-editor/react';

import { textfsmThemeDark as themeDark } from '@/features/editor/themes/ThemeDark';
import { textfsmThemeLight as themeLight } from '@/features/editor/themes/ThemeLight';
import { languageConfiguration } from '@/features/editor/definitions/LanguageConfiguration';
import { monarchTokensProvider } from '@/features/editor/definitions/MonarchTokensProvider';
import { getCompletionItemProviderSuggestions } from '@/features/editor/definitions/CompletionItemProvider';

export const initializeEditor = () => {
    loader.config({ paths: { vs: 'libs/monaco-editor/min/vs' } });

    loader.init().then((monaco) => {
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
}