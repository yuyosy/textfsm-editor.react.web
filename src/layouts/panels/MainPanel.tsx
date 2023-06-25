import ResizeHandle from '@/components/resizable-panels/ResizeHandle';
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  List,
  Menu,
  Modal,
  NumberInput,
  Select,
  SelectItem,
  Stack,
  Switch,
  Text,
  Tooltip,
} from '@mantine/core';
import { OnChange } from '@monaco-editor/react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { sendTextFSMParseRequest } from '@/features/request/sendTextFSMParseRequest';
import { NotificationPanel } from './NotificationPanel';
import { useRef, useState } from 'react';
import { ResultViewPanel } from './ResultViewPanel';
import { SimpleEditorPanel } from './SimpleEditorPanel';
import { TextFSMEditorPanel } from './TextFSMEditorPanel';
import {
  IconBookmarks,
  IconEdit,
  IconListDetails,
  IconPlus,
  IconSend,
  IconSettings,
} from '@tabler/icons-react';
import { useLocalStorage } from '@mantine/hooks';
import { useWrap } from '@/hooks/wrapper';
import { ResultObject } from '@/types';

export const MainPanel = () => {
  // Local Storage
  const [editorAutoParse, setEditorAutoParse] = useLocalStorage<boolean>({
    key: 'editor-auto-parse',
    defaultValue: false,
  });
  const [inputSendDelayValue, setInputSendDelayValue] = useLocalStorage<number>({
    key: 'editor-input-send-delay',
    defaultValue: 1000,
  });
  const [templateList, setTemplateList] = useLocalStorage<{ [key: string]: string }>({
    key: 'editor-template-list',
    defaultValue: {},
  });

  // Ref State
  const notificationPanelRef = useRef<any>();
  const resultViewPanelRef = useRef<any>();
  const editorDataValue = useRef<string>('');
  const editorTemplateValue = useRef<string>('');
  const resultObject = useRef<ResultObject>();

  // Element State
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState<boolean>(false);
  const [showLoadTemplateModal, setShowLoadTemplateModal] = useState<boolean>(false);
  // const [templateName, setTemplateName] = useInputState<string>('');
  const [templateSelectItems, setTemplateSelectItems] = useState<(string | SelectItem)[]>([]);
  const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const sendRequest = async () => {
    if (editorTemplateValue.current === '') {
      return;
    }
    resultObject.current = await sendTextFSMParseRequest(
      editorDataValue,
      editorTemplateValue,
      inputSendDelayValue
    );

    if (notificationPanelRef.current) {
      notificationPanelRef.current.prependResult(resultObject.current);
    }
    if (resultViewPanelRef.current && resultObject.current.ok && resultObject.current.results.ok) {
      resultViewPanelRef.current.setResults(
        resultObject.current.results.headers.map((item) => {
          return { accessor: item };
        }),
        resultObject.current.results.results
      );
    }
  };

  const onChangeDataEditor: OnChange = (value) => {
    editorDataValue.current = value === undefined ? '' : value;
    if (editorAutoParse) {
      sendRequest();
    }
  };
  const onChangeTemplateEditor: OnChange = (value) => {
    editorTemplateValue.current = value === undefined ? '' : value;
    if (editorAutoParse) {
      sendRequest();
    }
  };

  const openSaveTemplateModal = useWrap(() => {
    setShowSaveTemplateModal(true);
    setSelectedTemplateName(null);
    setTemplateSelectItems(
      Object.keys(templateList).map((key) => {
        return { value: key, label: key };
      })
    );
  });

  const closeSaveTemplateModal = useWrap(() => {
    setShowSaveTemplateModal(false);
  });

  const saveTemplate = useWrap(() => {
    const newTemplate = {
      [selectedTemplateName === null ? '' : selectedTemplateName]: editorTemplateValue.current,
    };
    setTemplateList({ ...templateList, ...newTemplate });
    closeSaveTemplateModal();
  });
  const openLoadTemplateModal = useWrap(() => {
    setShowLoadTemplateModal(true);
    setSelectedTemplate(null);
    setTemplateSelectItems(
      Object.keys(templateList).map((key) => {
        return { value: key, label: key };
      })
    );
  });

  const closeLoadTemplateModal = useWrap(() => {
    setShowLoadTemplateModal(false);
  });

  const loadTemplate = useWrap(() => {
    editorTemplateValue.current = templateList[selectedTemplate === null ? '' : selectedTemplate];
    closeLoadTemplateModal();
  });

  return (
    <>
      <Modal opened={showSaveTemplateModal} onClose={closeSaveTemplateModal} title="Save Template">
        <Stack>
          <List size="xs">
            <List.Item>
              To create a new template, enter a template name and select "Create" from the drop-down
              menu.
            </List.Item>
            <List.Item>
              To overwrite an existing template, select one from the drop-down menu.
            </List.Item>
          </List>
          <Select
            label="Template Name"
            placeholder="Input template name or select one."
            data={templateSelectItems}
            value={selectedTemplateName}
            onChange={setSelectedTemplateName}
            getCreateLabel={(query) => `[+] Create "${query}"`}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setTemplateSelectItems((current) => [...current, item]);
              return item;
            }}
            creatable
            searchable
            withinPortal
          />
        </Stack>
        <Group position="apart" mt="lg">
          <Button variant="default" size="xs" onClick={closeSaveTemplateModal}>
            Close
          </Button>
          <Button size="xs" color="cyan" onClick={saveTemplate} disabled={!selectedTemplateName}>
            Save Template
          </Button>
        </Group>
      </Modal>
      <Modal opened={showLoadTemplateModal} onClose={closeLoadTemplateModal} title="Load Template">
        <Stack>
          <Select
            label="Template"
            placeholder="Pick one"
            data={templateSelectItems}
            value={selectedTemplate}
            onChange={setSelectedTemplate}
            searchable
            withinPortal
          />
        </Stack>
        <Group position="apart" mt="lg">
          <Button variant="default" size="xs" onClick={closeLoadTemplateModal}>
            Close
          </Button>
          <Button size="xs" color="cyan" onClick={loadTemplate} disabled={!selectedTemplate}>
            Load Template
          </Button>
        </Group>
      </Modal>
      <Stack spacing={0} h="100%">
        {/* Menu */}
        <Group position="apart" px={10} py={8} bg="#7c83871d">
          <Group>
            {/* Save Template */}
            <Menu
              position="bottom-start"
              trigger="hover"
              openDelay={100}
              closeDelay={400}
              withArrow
              shadow="md"
              width={400}
            >
              <Menu.Target>
                <Button
                  variant="filled"
                  size="xs"
                  leftIcon={<IconListDetails size={18} strokeWidth={1.5} />}
                >
                  Templates
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item icon={<IconPlus size={14} />} onClick={openSaveTemplateModal}>
                  Save Template
                </Menu.Item>
                <Menu.Item icon={<IconBookmarks size={14} />} onClick={openLoadTemplateModal}>
                  Load Template
                </Menu.Item>
                <Menu.Item icon={<IconEdit size={14} />}>Edit Templates</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
          <Group>
            <Text size="sm">Send</Text>
            <Tooltip label="Send" withArrow position="bottom">
              <ActionIcon
                variant="default"
                onClick={() => {
                  sendRequest();
                }}
              >
                <IconSend size="1.125rem" />
              </ActionIcon>
            </Tooltip>
            <Divider orientation="vertical" />
            <Text size="sm">AutoParse</Text>
            <Switch
              labelPosition="left"
              onLabel="ON"
              offLabel="OFF"
              checked={editorAutoParse}
              onChange={(event) => setEditorAutoParse(event.currentTarget.checked)}
            />
            {/* Options */}
            <Menu position="bottom-end" withArrow shadow="md" width={400} closeOnItemClick={false}>
              <Menu.Target>
                <Button
                  variant="default"
                  size="xs"
                  leftIcon={<IconSettings size={18} strokeWidth={1.5} />}
                >
                  Options
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label fw={600}>Editor Options</Menu.Label>
                <Group p={10} position="apart">
                  <Text fz="sm">
                    Input send delay
                    <Text fz="xs" c="dimmed">
                      Only when AutoParse is active (ON).
                    </Text>
                  </Text>
                  <NumberInput
                    step={500}
                    min={500}
                    max={5000}
                    size="xs"
                    value={inputSendDelayValue}
                    onChange={(value) => setInputSendDelayValue(value === '' ? 1000 : value)}
                    parser={(value) => value.replace(/\sms/g, '')}
                    formatter={(value) => (!Number.isNaN(parseFloat(value)) ? `${value} ms` : '')}
                  />
                </Group>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
        {/* Main */}
        <PanelGroup direction="vertical" autoSaveId="persistence">
          <Panel defaultSize={70}>
            <PanelGroup direction="horizontal" autoSaveId="persistence">
              <Panel defaultSize={42}>
                <SimpleEditorPanel
                  valueRef={editorDataValue}
                  onChangeFunc={onChangeDataEditor}
                ></SimpleEditorPanel>
              </Panel>
              <ResizeHandle />
              <Panel defaultSize={42}>
                <TextFSMEditorPanel
                  valueRef={editorTemplateValue}
                  onChangeFunc={onChangeTemplateEditor}
                ></TextFSMEditorPanel>
              </Panel>
              <ResizeHandle />
              <Panel defaultSize={16} collapsible>
                <NotificationPanel ref={notificationPanelRef}></NotificationPanel>
              </Panel>
            </PanelGroup>
          </Panel>
          <ResizeHandle />
          <Panel defaultSize={30} collapsible>
            <ResultViewPanel ref={resultViewPanelRef}></ResultViewPanel>
          </Panel>
        </PanelGroup>
      </Stack>
    </>
  );
};
