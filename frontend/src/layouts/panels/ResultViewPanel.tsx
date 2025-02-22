import { RefObject } from 'react';

import { CodeHighlight } from '@mantine/code-highlight';
import { Group, ScrollArea, Stack, Tabs, Text } from '@mantine/core';
import { useAtomValue } from 'jotai';
import { Braces, Table } from 'lucide-react';
import { DataTable } from 'mantine-datatable';
import { ImperativePanelHandle, Panel } from 'react-resizable-panels';

import { CopyValueButton } from '@/components/CopyValueButton';
import { resultViewValueAtom } from '@/features/state/atoms';

import { FileDownloadButton } from '@/components/FileDownloadButton';
import { resultJSON, resultTSV } from '@/features/fileNames';
import { useDataDeliver } from '@/hooks/useDataDeliver';
import { getCurrentDateTimeString } from '@/utils/datetime';

interface ResultViewPanelProps {
  panelRef: RefObject<ImperativePanelHandle>;
  onResizeHandler: () => void;
}
export const ResultViewPanel = ({ panelRef, onResizeHandler }: ResultViewPanelProps) => {
  const resultViewValue = useAtomValue(resultViewValueAtom);

  const header = resultViewValue?.data?.header || [];
  const results = resultViewValue?.data?.results || [];

  const { tsvDataDeliver, jsonDataDeliver } = useDataDeliver({ header, results });

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
                  filename={getCurrentDateTimeString(resultTSV)}
                />
                <CopyValueButton value={tsvDataDeliver()} />
              </Group>
            </Group>
            <DataTable
              columns={header.map(value => ({ accessor: value }))}
              records={results.map((item, index) => {
                const entries = Object.entries(item).map(([key, val]) => [
                  key,
                  Array.isArray(val) ? val.join(', ') : val,
                ]);
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
                  filename={getCurrentDateTimeString(resultJSON)}
                />
                <CopyValueButton value={jsonDataDeliver()} />
              </Group>
            </Group>
            <ScrollArea h="100%">
              <CodeHighlight
                code={jsonDataDeliver()}
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
