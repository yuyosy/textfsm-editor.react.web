import { useRef } from 'react';

import { useMantineColorScheme } from '@mantine/core';
import { useAtom } from 'jotai';

import { Editor } from '@/features/editor/Editor';
import { rawTextEditorValueAtom } from '@/features/state/storageAtoms';
import { debounce } from '@/utils/debounce';

import type { OnChange, OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

export const RawTextEditor = () => {
  const { colorScheme } = useMantineColorScheme();
  const [rawTextEditorValue, setRawTextEditorValue] = useAtom(rawTextEditorValueAtom);
  const rawTextEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const saveRawTextToSessionStorage = debounce((value: string) => {
    setRawTextEditorValue(value);
  }, 500);

  const handleRawTextEditorDidMount: OnMount = editor => {
    rawTextEditorRef.current = editor;
    rawTextEditorRef.current.setValue(rawTextEditorValue);
  };
  const handleRawTextEditorChange: OnChange = value => {
    if (value) {
      saveRawTextToSessionStorage(value);
    }
  };

  return (
    <Editor
      defaultLanguage="plain"
      theme={colorScheme === 'dark' ? 'theme-dark' : 'theme-light'}
      onMount={handleRawTextEditorDidMount}
      onChange={handleRawTextEditorChange}
    />
  );
};
