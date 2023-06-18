import ResizeHandle from '@/components/resizable-panels/ResizeHandle';
import { Group, Stack, Text } from '@mantine/core';
import { OnChange } from '@monaco-editor/react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { SimpleEditor } from '@/features/editor/components/SimpleEditor';
import { TextFSMEditor } from '@/features/editor/components/TextFSMEditor';
import { debounceSendRequest } from '@/features/request/debounce';

export const MainPanel = () => {
  const values: EditorValues = {
    dataEditorValue: '',
    templateEditorValue: '',
  };

  const onChangeDataEditor: OnChange = (value) => {
    values.dataEditorValue = value === undefined ? '' : value;
    debounceSendRequest(values);
  };
  const onChangeTemplateEditor: OnChange = (value) => {
    values.templateEditorValue = value === undefined ? '' : value;
    debounceSendRequest(values);
  };

  return (
    <Stack spacing={0} h="100%">
      <Group px={10} py={8} position="apart">
        <Group>
          <Text size="sm">A</Text>
        </Group>
        <Group>
          <Text size="sm">B</Text>
        </Group>
      </Group>
      <PanelGroup direction="vertical" autoSaveId="persistence">
        <Panel defaultSize={70}>
          <PanelGroup direction="horizontal" autoSaveId="persistence">
            <Panel defaultSize={42}>
              {/* <Editor value={dataEditorValue} onChange={onChangeDataEditor}></Editor> */}
              <SimpleEditor
                value={values.dataEditorValue}
                onChangeFunc={onChangeDataEditor}
              ></SimpleEditor>
            </Panel>
            <ResizeHandle />
            <Panel defaultSize={42}>
              <TextFSMEditor
                value={values.templateEditorValue}
                onChangeFunc={onChangeTemplateEditor}
              ></TextFSMEditor>
              {/* <Editor value={templateEditorValue} onChange={onChangeTemplateEditor}></Editor> */}
            </Panel>
            <ResizeHandle />
            <Panel defaultSize={16} collapsible>
              right
            </Panel>
          </PanelGroup>
        </Panel>
        <ResizeHandle />
        <Panel defaultSize={30} collapsible>
          bottom
        </Panel>
      </PanelGroup>
    </Stack>
  );
};
