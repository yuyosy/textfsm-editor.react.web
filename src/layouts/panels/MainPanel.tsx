import ResizeHandle from '@/components/resizable-panels/ResizeHandle';
import { Alert, Group, ScrollArea, Stack, Text } from '@mantine/core';
import { OnChange } from '@monaco-editor/react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { SimpleEditor } from '@/features/editor/components/SimpleEditor';
import { TextFSMEditor } from '@/features/editor/components/TextFSMEditor';
import { ResultObject, sendTextFSMParseRequest } from '@/features/request/sendTextFSMParseRequest';
import { useListState } from '@mantine/hooks';

export const MainPanel = () => {
  const [responseResults, responseResultsHandlers] = useListState<ResultObject>([]);

  const values: EditorValues = {
    dataEditorValue: '',
    templateEditorValue: '',
  };

  const sendRequest = async (values: EditorValues) => {
    const result = await sendTextFSMParseRequest(values);
    responseResultsHandlers.prepend(result);
    console.log(result);
  };

  const onChangeDataEditor: OnChange = (value) => {
    values.dataEditorValue = value === undefined ? '' : value;
    sendRequest(values);
  };
  const onChangeTemplateEditor: OnChange = (value) => {
    values.templateEditorValue = value === undefined ? '' : value;
    sendRequest(values);
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
              <Stack spacing={0} h="100%">
                <Group px={10} py={8} position="apart">
                  <Text fw={700}>Data</Text>
                </Group>
                <SimpleEditor
                  value={values.dataEditorValue}
                  onChangeFunc={onChangeDataEditor}
                ></SimpleEditor>
              </Stack>
            </Panel>
            <ResizeHandle />
            <Panel defaultSize={42}>
              <Stack spacing={0} h="100%">
                <Group px={10} py={8} position="apart">
                  <Text fw={700}>Template</Text>
                </Group>
                <TextFSMEditor
                  value={values.templateEditorValue}
                  onChangeFunc={onChangeTemplateEditor}
                ></TextFSMEditor>
              </Stack>
            </Panel>
            <ResizeHandle />
            <Panel defaultSize={16} collapsible>
              <Stack spacing={0} h="100%">
                <Group px={10} py={8} position="apart">
                  <Text fw={700}>Console</Text>
                </Group>
                <ScrollArea h="100%">
                  <Stack p={10} pr={16}>
                    {responseResults.map((resultObject: ResultObject, index: number) => {
                      if (resultObject.ok) {
                        return (
                          <Alert
                            key={index}
                            title={
                              <Text>
                                {resultObject.results.message}
                                <Text fz="xs" c="dimmed" fw={400}>
                                  {resultObject.timestamp}
                                </Text>
                              </Text>
                            }
                            color={resultObject.results.ok ? '' : 'red'}
                          >
                            {resultObject.results.message_detail}
                          </Alert>
                        );
                      } else {
                        return (
                          <Alert
                            key={resultObject.timestamp}
                            title={
                              <Text>
                                {resultObject.message}
                                <Text fz="xs" c="dimmed" fw={400}>
                                  {resultObject.timestamp}
                                </Text>
                              </Text>
                            }
                            color="red"
                          >
                            {resultObject.message_detail}
                          </Alert>
                        );
                      }
                    })}
                  </Stack>
                </ScrollArea>
              </Stack>
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
