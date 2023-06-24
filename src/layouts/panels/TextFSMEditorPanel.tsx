import { Group, Stack, Text } from '@mantine/core';
import { editor } from 'monaco-editor';
import { TextFSMEditor } from '@/features/editor/components/TextFSMEditor';
import { CopyValueButton } from '@/components/CopyValueButton';

type Props = {
  dataDeliver: () => string;
  onChangeFunc: (value: string | undefined, ev: editor.IModelContentChangedEvent) => void;
};

export const TextFSMEditorPanel = ({ dataDeliver, onChangeFunc }: Props) => {
  return (
    <Stack spacing={0} h="100%">
      <Group px={10} py={8} position="apart">
        <Text fw={700}>Template</Text>
        <CopyValueButton getValueFunc={dataDeliver}></CopyValueButton>
      </Group>
      <TextFSMEditor value={dataDeliver()} onChangeFunc={onChangeFunc}></TextFSMEditor>
    </Stack>
  );
};
