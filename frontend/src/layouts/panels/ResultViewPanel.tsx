import { CopyValueButton } from '@/components/CopyValueButton';
import { CodeHighlight } from '@mantine/code-highlight';
import { Group, ScrollArea, Stack, Tabs, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { Braces, Table } from 'lucide-react';
import { DataTable } from 'mantine-datatable';
import { forwardRef, useImperativeHandle } from 'react';

import '@mantine/code-highlight/styles.css';
import { TextFSMParseResult } from '@/features/types';

export const ResultViewPanel = forwardRef((_props, ref) => {
  const [resultHeaders, setResultHeaders] = useListState<string>([]);
  const [resultData, setResultData] = useListState<any>([]);

  const tsvDataDeliver = (): string => {
    if (resultHeaders && resultData) {
      const header = resultHeaders.join('\t');
      const rows = resultData
        .reduce((previous, current) => {
          return previous.concat([Object.values(current).join('\t')]);
        }, [])
        .join('\n');
      return `${header}\n${rows}`;
    }
    return '';
  };

  const jsonDataDeliver = (): string => {
    return JSON.stringify(resultData, null, '  ');
  };

  useImperativeHandle(ref, () => ({
    setResults(data: TextFSMParseResult) {
      setResultHeaders.setState(data.header ? data.header : []);
      setResultData.setState(data.results ? data.results : []);
    },
  }));

  return (
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
            <CopyValueButton value={tsvDataDeliver()}></CopyValueButton>
          </Group>
          <DataTable
            columns={resultHeaders.map(value => {
              return { accessor: value };
            })}
            records={resultData.map((item, index) => {
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
            <CopyValueButton value={jsonDataDeliver()}></CopyValueButton>
          </Group>
          <ScrollArea h="100%">
            <CodeHighlight
              code={JSON.stringify(resultData, null, '  ')}
              language="json"
              h="100%"
              withCopyButton={false}
            />
          </ScrollArea>
        </Stack>
      </Tabs.Panel>
    </Tabs>
  );
});
