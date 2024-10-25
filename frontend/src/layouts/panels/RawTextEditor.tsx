import { Editor } from '@/features/editor/Editor';
import { rawTextEditorValueAtom } from '@/features/state/storageAtoms';
import { debounce } from '@/utils/debounce';
import { useMantineColorScheme } from '@mantine/core';
import type { OnChange, OnMount } from '@monaco-editor/react';
import { useAtom } from 'jotai';
import type { editor } from 'monaco-editor';
import { useRef } from 'react';

type RawTextEditorProps = {};

export const RawTextEditor = ({}: RawTextEditorProps) => {
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
