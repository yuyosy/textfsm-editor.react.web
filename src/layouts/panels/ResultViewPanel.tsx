import {
  Text,
  Tabs,
  Stack,
  Group,
  CopyButton,
  Tooltip,
  ActionIcon,
  ScrollArea,
} from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { Prism } from '@mantine/prism';
import { IconBorderAll, IconCheck, IconCode, IconCopy } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { forwardRef, useImperativeHandle } from 'react';

type Header = {
  accessor: string;
};

export const ResultViewPanel = forwardRef((_props, ref) => {
  const [resultHeaders, setResultHeaders] = useListState<Header>([]);
  const [resultData, setResultData] = useListState<any[]>([]);

  useImperativeHandle(ref, () => ({
    setResults(header: any[], data: any[]) {
      setResultHeaders.setState(header);
      setResultData.setState(data);
    },
  }));

  return (
    <Tabs variant="pills" radius={0} defaultValue="table" orientation="vertical" h="100%">
      <Tabs.List>
        <Tabs.Tab value="table" icon={<IconBorderAll size="0.8rem" />}>
          Table
        </Tabs.Tab>
        <Tabs.Tab value="json" icon={<IconCode size="0.8rem" />}>
          JSON
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="table">
        <Stack spacing={0} h="100%">
          <Group px={10} py={4} position="apart">
            <Text>Table View</Text>
            <CopyButton value={JSON.stringify(resultData, null, '  ')} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="bottom">
                  <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                    {copied ? <IconCheck /> : <IconCopy />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
          <DataTable
            columns={resultHeaders}
            records={resultData.map((item, index) => {
              return { ...item, $index: index };
            })}
            idAccessor="$index"
            striped
            // height='100%'
          />
        </Stack>
      </Tabs.Panel>
      <Tabs.Panel value="json">
        <Stack spacing={0} h="100%">
          <Group px={10} py={4} position="apart">
            <Text>JSON View</Text>
            <CopyButton value={JSON.stringify(resultData, null, '  ')} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="bottom">
                  <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                    {copied ? <IconCheck /> : <IconCopy />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
          <ScrollArea h="100%">
            <Prism withLineNumbers noCopy language="json" h="100%">
              {JSON.stringify(resultData, null, '  ')}
            </Prism>
          </ScrollArea>
        </Stack>
      </Tabs.Panel>
    </Tabs>
  );
});
