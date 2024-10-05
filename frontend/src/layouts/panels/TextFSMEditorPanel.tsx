import { Group, Stack, Text } from '@mantine/core';
import { editor } from 'monaco-editor';
import { TextFSMEditor } from '@/features/editor/components/TextFSMEditor';
import { CopyValueButton } from '@/components/CopyValueButton';

type Props = {
  valueRef: React.MutableRefObject<string>;
  onChangeFunc: (value: string | undefined, ev: editor.IModelContentChangedEvent) => void;
};

export const TextFSMEditorPanel = ({ valueRef, onChangeFunc }: Props) => {
  return (
    <Stack spacing={0} h="100%">
      <Group px={10} py={8} position="apart">
        <Text fw={700}>Template</Text>
        <CopyValueButton valueRef={valueRef}></CopyValueButton>
      </Group>
      <TextFSMEditor value={valueRef.current} onChangeFunc={onChangeFunc}></TextFSMEditor>
    </Stack>
  );
};
