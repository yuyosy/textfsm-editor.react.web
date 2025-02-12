import { ActionIcon, Group, Rating, Stack, Text } from '@mantine/core';
import { StarOff } from 'lucide-react';
import { DataTable } from 'mantine-datatable';
import { useFetchTemplates } from '../PresetTemplatesModal/hooks/useFetchTemplates';
import { usePlatformPriority } from '../PresetTemplatesModal/hooks/usePlatformPriority';

interface PlatformPrioritySectionProps {}

export const PlatformPrioritySection = ({}: PlatformPrioritySectionProps) => {
  const { platformPriorities, setPlatformPriority, removePlatformPriority } =
    usePlatformPriority();
  const { templates } = useFetchTemplates();

  const platforms = Object.keys(templates).map(platform => {
    return {
      platform: platform,
      priority: platformPriorities.find(p => p.platform === platform)?.priority || 0,
    };
  });

  return (
    <Stack>
      <Text size="sm" fw={500}>
        Platform Priority
      </Text>
      <Text size="xs">Select your favorite platforms and set their priority.</Text>
      <Text size="xs" c="dimmed">
        The default value is 0, and higher values take precedence. In the case of the
        same priority, it will be in ascending order.
      </Text>
      <DataTable
        height={300}
        idAccessor="platform"
        records={platforms}
        columns={[
          { accessor: 'platform', title: 'Platform' },
          {
            accessor: 'priority',
            title: 'Priority',
            render: record => (
              <Group>
                <ActionIcon
                  size="ms"
                  color="gray"
                  variant="transparent"
                  onClick={_event => removePlatformPriority(record.platform)}
                >
                  <StarOff size={16} />
                </ActionIcon>
                <Rating
                  value={record.priority}
                  onChange={value => setPlatformPriority(record.platform, value)}
                  count={5}
                />
              </Group>
            ),
          },
        ]}
        scrollAreaProps={{ type: 'always', offsetScrollbars: 'y' }}
        borderRadius="sm"
        withTableBorder
        withColumnBorders
      />
    </Stack>
  );
};
