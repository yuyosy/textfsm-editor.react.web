import { Group, Stack, Text } from '@mantine/core';
import { SimpleEditor } from '@/features/editor/components/SimpleEditor';
import { editor } from 'monaco-editor';
import { CopyValueButton } from '@/components/CopyValueButton';

type Props = {
  valueRef: React.MutableRefObject<string>;
  onChangeFunc: (value: string | undefined, ev: editor.IModelContentChangedEvent) => void;
};

export const SimpleEditorPanel = ({ valueRef, onChangeFunc }: Props) => {
  return (
    <Stack spacing={0} h="100%">
      <Group px={10} py={8} position="apart">
        <Text fw={700}>Data</Text>
        <CopyValueButton valueRef={valueRef}></CopyValueButton>
      </Group>
      <SimpleEditor value={valueRef.current} onChangeFunc={onChangeFunc}></SimpleEditor>
    </Stack>
  );
};
