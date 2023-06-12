import { Editor, OnChange } from '@monaco-editor/react';
import { useMantineColorScheme } from '@mantine/core';

export const TextFSMEditor = ({
  defaultValue,
  onChangeValueFunc,
}: {
  defaultValue: string;
  onChangeValueFunc: OnChange;
}) => {
  const { colorScheme } = useMantineColorScheme();
  return (
    <Editor
      value={defaultValue}
      defaultLanguage="textfsm"
      theme={colorScheme === 'dark' ? 'theme-dark' : 'theme-light'}
      onChange={onChangeValueFunc}
      options={{ tabSize: 2, mouseWheelZoom: true }}
    />
  );
};
