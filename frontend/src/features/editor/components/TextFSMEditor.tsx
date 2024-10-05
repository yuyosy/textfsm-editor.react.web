import { Editor, OnChange } from '@monaco-editor/react';
import { useMantineColorScheme } from '@mantine/core';

type Props = {
  value: string;
  onChangeFunc: OnChange;
};

export const TextFSMEditor = ({ value, onChangeFunc }: Props) => {
  const { colorScheme } = useMantineColorScheme();
  return (
    <Editor
      value={value}
      defaultLanguage="textfsm"
      theme={colorScheme === 'dark' ? 'theme-dark' : 'theme-light'}
      onChange={onChangeFunc}
      options={{ tabSize: 2, mouseWheelZoom: true }}
    />
  );
};
