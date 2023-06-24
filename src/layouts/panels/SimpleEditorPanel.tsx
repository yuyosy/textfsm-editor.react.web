import { Group, Stack, Text } from '@mantine/core';
import { SimpleEditor } from '@/features/editor/components/SimpleEditor';
import { editor } from 'monaco-editor';
import { CopyValueButton } from '@/components/CopyValueButton';
type Props = {
  dataDeliver: () => string;
  onChangeFunc: (value: string | undefined, ev: editor.IModelContentChangedEvent) => void;
};

export const SimpleEditorPanel = ({ dataDeliver, onChangeFunc }: Props) => {
  return (
    <Stack spacing={0} h="100%">
      <Group px={10} py={8} position="apart">
        <Text fw={700}>Data</Text>
        <CopyValueButton getValueFunc={dataDeliver}></CopyValueButton>
      </Group>
      <SimpleEditor value={dataDeliver()} onChangeFunc={onChangeFunc}></SimpleEditor>
    </Stack>
  );
};
