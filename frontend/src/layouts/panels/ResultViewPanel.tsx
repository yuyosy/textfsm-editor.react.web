import { CopyValueButton } from '@/components/CopyValueButton';
import { CodeHighlight } from '@mantine/code-highlight';
import { Group, ScrollArea, Stack, Tabs, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { Braces, Table } from 'lucide-react';
import { DataTable } from 'mantine-datatable';
import { forwardRef, useImperativeHandle } from 'react';

import '@mantine/code-highlight/styles.css';

type Header = {
  accessor: string;
};

export const ResultViewPanel = forwardRef((_props, ref) => {
  const [resultHeaders, setResultHeaders] = useListState<Header>([]);
  const [resultData, setResultData] = useListState<any[]>([]);

  const tsvDataDeliver = (): string => {
    const headers = Object.values(resultHeaders)
      .map(item => item['accessor'])
      .join('\t');
    const rows = resultData
      .reduce((previous, current) => {
        return previous.concat([Object.values(current).join('\t')]);
      }, [])
      .join('\n');
    return `${headers}\n${rows}`;
  };

  const jsonDataDeliver = (): string => {
    return JSON.stringify(resultData, null, '  ');
  };

  useImperativeHandle(ref, () => ({
    setResults(header: any[], data: any[]) {
      setResultHeaders.setState(header);
      setResultData.setState(data);
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
            <Text>Table View</Text>
            <CopyValueButton value={tsvDataDeliver()}></CopyValueButton>
          </Group>
          <DataTable
            columns={resultHeaders}
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
            <Text>JSON View</Text>
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
