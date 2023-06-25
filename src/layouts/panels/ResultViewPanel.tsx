import { CopyValueButton } from '@/components/CopyValueButton';
import { Text, Tabs, Stack, Group, ScrollArea } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { Prism } from '@mantine/prism';
import { IconBorderAll, IconCode } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { forwardRef, useImperativeHandle } from 'react';

type Header = {
  accessor: string;
};

export const ResultViewPanel = forwardRef((_props, ref) => {
  const [resultHeaders, setResultHeaders] = useListState<Header>([]);
  const [resultData, setResultData] = useListState<any[]>([]);

  const tsvDataDeliver = (): React.MutableRefObject<string> => {
    const headers = Object.values(resultHeaders)
      .map((item) => item['accessor'])
      .join('\t');
    const rows = resultData
      .reduce((previous, current) => {
        return previous.concat([Object.values(current).join('\t')]);
      }, [])
      .join('\n');
    return { current: `${headers}\n${rows}` };
  };

  const jsonDataDeliver = (): React.MutableRefObject<string> => {
    return { current: JSON.stringify(resultData, null, '  ') };
  };

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
            <CopyValueButton valueRef={tsvDataDeliver()}></CopyValueButton>
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
            withBorder
            withColumnBorders
          />
        </Stack>
      </Tabs.Panel>
      <Tabs.Panel value="json">
        <Stack spacing={0} h="100%">
          <Group px={10} py={4} position="apart">
            <Text>JSON View</Text>
            <CopyValueButton valueRef={jsonDataDeliver()}></CopyValueButton>
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
