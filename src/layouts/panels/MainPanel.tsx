import ResizeHandle from '@/components/resizable-panels/ResizeHandle';
import { Group, Stack, Text } from '@mantine/core';
import { OnChange } from '@monaco-editor/react';
import { useState } from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { loader } from '@monaco-editor/react';
import { SimpleEditor } from '@/features/editor/SimpleEditor';
import { textfsmThemeDark as themeDark } from '@/features/editor/themes/ThemeDark';
import { textfsmThemeLight as themeLight } from '@/features/editor/themes/ThemeLight';
import { TextFSMEditor } from '@/features/editor/TextFSMEditor';
import { languageConfiguration } from '@/features/editor/definitions/LanguageConfiguration';
import { monarchTokensProvider } from '@/features/editor/definitions/MonarchTokensProvider';
import { getCompletionItemProviderSuggestions } from '@/features/editor/definitions/CompletionItemProvider';

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

export const MainPanel = () => {
  const [dataEditorValue, setDataEditorValue] = useState('');
  const [templateEditorValue, setTemplateEditorValue] = useState('');

  const onChangeDataEditor: OnChange = (value) => {
    setDataEditorValue(value ? value : '');
    // console.log(value);
  };
  const onChangeTemplateEditor: OnChange = (value) => {
    setTemplateEditorValue(value ? value : '');
    // console.log(value);
  };
  return (
    <Stack spacing={0} h="100%">
      <Group px={10} py={8} position="apart">
        <Group>
          <Text size="sm">A</Text>
        </Group>
        <Group>
          <Text size="sm">B</Text>
        </Group>
      </Group>
      <PanelGroup direction="vertical" autoSaveId="persistence">
        <Panel defaultSize={70}>
          <PanelGroup direction="horizontal" autoSaveId="persistence">
            <Panel defaultSize={42}>
              {/* <Editor value={dataEditorValue} onChange={onChangeDataEditor}></Editor> */}
              <SimpleEditor
                defaultValue={dataEditorValue}
                onChangeValueFunc={onChangeDataEditor}
              ></SimpleEditor>
            </Panel>
            <ResizeHandle />
            <Panel defaultSize={42}>
              <TextFSMEditor
                defaultValue={templateEditorValue}
                onChangeValueFunc={onChangeTemplateEditor}
              ></TextFSMEditor>
              {/* <Editor value={templateEditorValue} onChange={onChangeTemplateEditor}></Editor> */}
            </Panel>
            <ResizeHandle />
            <Panel defaultSize={16} collapsible>
              right
            </Panel>
          </PanelGroup>
        </Panel>
        <ResizeHandle />
        <Panel defaultSize={30} collapsible>
          bottom
        </Panel>
      </PanelGroup>
    </Stack>
  );
};
