import { Editor, OnChange } from '@monaco-editor/react';
import { useMantineColorScheme } from '@mantine/core';

export const SimpleEditor = ({
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
      theme={colorScheme === 'dark' ? 'theme-dark' : 'theme-light'}
      onChange={onChangeValueFunc}
      options={{ tabSize: 2, mouseWheelZoom: true }}
    />
  );
};
