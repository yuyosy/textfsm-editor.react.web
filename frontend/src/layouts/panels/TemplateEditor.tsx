import { Editor } from '@/features/editor/Editor';
import { templateEditorValueAtom } from '@/features/state/storageAtoms';
import { debounce } from '@/utils/debounce';
import { useMantineColorScheme } from '@mantine/core';
import type { OnChange, OnMount } from '@monaco-editor/react';
import { useAtom } from 'jotai';
import type { editor } from 'monaco-editor';
import { useRef } from 'react';

type TemplateEditorProps = {};

export const TemplateEditor = ({}: TemplateEditorProps) => {
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
