import { useRef } from 'react';

import { useMantineColorScheme } from '@mantine/core';
import { useAtom } from 'jotai';

import { Editor } from '@/features/editor/Editor';
import { templateEditorValueAtom } from '@/features/state/storageAtoms';
import { debounce } from '@/utils/debounce';

import type { OnChange, OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

export const TemplateEditor = () => {
  const { colorScheme } = useMantineColorScheme();
  const [templateEditorValue, setTemplateEditorValue] = useAtom(templateEditorValueAtom);
  const templateEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const saveTemplateToSessionStorage = debounce((value: string) => {
    setTemplateEditorValue(value);
  }, 500);

  const handleTemplateEditorDidMount: OnMount = editor => {
    templateEditorRef.current = editor;
    templateEditorRef.current.setValue(templateEditorValue);
  };
  const handleTemplateEditorChange: OnChange = value => {
    if (value) {
      saveTemplateToSessionStorage(value);
    }
  };

  return (
    <Editor
      defaultLanguage="textfsm"
      theme={colorScheme === 'dark' ? 'theme-dark' : 'theme-light'}
      onMount={handleTemplateEditorDidMount}
      onChange={handleTemplateEditorChange}
    />
  );
};
