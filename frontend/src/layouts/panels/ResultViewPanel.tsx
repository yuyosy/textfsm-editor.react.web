import { RefObject } from 'react';

import { CodeHighlight } from '@mantine/code-highlight';
import { Group, ScrollArea, Stack, Tabs, Text } from '@mantine/core';
import { useAtomValue } from 'jotai';
import { Braces, Table } from 'lucide-react';
import { DataTable } from 'mantine-datatable';
import { ImperativePanelHandle, Panel } from 'react-resizable-panels';

import { CopyValueButton } from '@/components/CopyValueButton';
import { resultViewValueAtom } from '@/features/state/atoms';
import { Result } from '@/features/types';

import { FileDownloadButton } from '@/components/FileDownloadButton';
import '@mantine/code-highlight/styles.css';
import 'mantine-datatable/styles.layer.css';

interface ResultViewPanelProps {
  panelRef: RefObject<ImperativePanelHandle>;
  onResizeHandler: () => void;
}
export const ResultViewPanel = ({ panelRef, onResizeHandler }: ResultViewPanelProps) => {
  const resultViewValue = useAtomValue(resultViewValueAtom);
  // const [resultHeaders, setResultHeaders] = useListState<string>([]);
  // const [resultData, setResultData] = useListState<any>([]);

  const tsvDataDeliver = (): string => {
    const header = getHeader();
    const results = getResults();
    if (header && results) {
      const headerString = header.join('\t');
      const rowsString = results
        .map(row =>
          header
            .map(key => {
              const value = row[key] ?? '';
              return String(value).replace(/\t/g, ' ');
            })
            .join('\t')
        )
        .join('\n');

      return `${headerString}\n${rowsString}`;
    }
    return '';
  };

  const jsonDataDeliver = (): string => {
    return JSON.stringify(getResults(), null, '  ');
  };

  const getHeader = (): string[] =>
    resultViewValue && resultViewValue.data && resultViewValue.data.header
      ? resultViewValue.data.header
      : [];
  const getResults = (): Result[] =>
    resultViewValue && resultViewValue.data && resultViewValue.data.results
      ? resultViewValue.data.results
      : [];

  return (
    <Panel
      id="result-panel"
      order={2}
      defaultSize={50}
      collapsedSize={0}
      minSize={10}
      collapsible={true}
      ref={panelRef}
      onResize={onResizeHandler}
    >
      <Tabs
        variant="pills"
        radius={0}
        defaultValue="table"
        orientation="vertical"
        h="100%"
      >
        <Tabs.List>
          <Tabs.Tab value="table" leftSection={<Table size="0.8rem" />}>
            Table
          </Tabs.Tab>
          <Tabs.Tab value="json" leftSection={<Braces size="0.8rem" />}>
            JSON
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="table">
          <Stack gap={0} h="100%">
            <Group px={10} py={4} justify="space-between">
              <Text fw={700}>Table View</Text>
              <Group>
                <FileDownloadButton
                  content={tsvDataDeliver()}
                  filename="textfsm-editor-result.tsv"
                />
                <CopyValueButton value={tsvDataDeliver()}></CopyValueButton>
              </Group>
            </Group>
            <DataTable
              columns={getHeader().map(value => {
                return { accessor: value };
              })}
              records={getResults().map((item, index) => {
                const entries = Object.entries(item).map(([key, val]) => {
                  if (Array.isArray(val)) {
                    return [key, val.join(', ')];
                  }
                  return [key, val];
                });
                entries.push(['$index', index]);
                return Object.fromEntries(entries);
              })}
              idAccessor="$index"
              striped
              withTableBorder
              withColumnBorders
            />
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="json">
          <Stack gap={0} h="100%">
            <Group px={10} py={4} justify="space-between">
              <Text fw={700}>JSON View</Text>
              <Group>
                <FileDownloadButton
                  content={jsonDataDeliver()}
                  filename="textfsm-editor-result.json"
                />
                <CopyValueButton value={jsonDataDeliver()}></CopyValueButton>
              </Group>
            </Group>
            <ScrollArea h="100%">
              <CodeHighlight
                code={JSON.stringify(getResults(), null, '  ')}
                language="json"
                h="100%"
                withCopyButton={false}
              />
            </ScrollArea>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Panel>
  );
};
