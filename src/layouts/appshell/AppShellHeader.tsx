import { ActionIcon, Group, Header, Text, Tooltip, useMantineColorScheme } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';

export const AppHeader = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <>
      <Header height={40}>
        <Group sx={{ height: '100%' }} px={10} position="apart">
          <Text fw={700}>Test</Text>
          <Group>
            <Tooltip
              label={colorScheme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              withArrow
              position="bottom"
            >
              <ActionIcon onClick={() => toggleColorScheme()}>
                {colorScheme === 'dark' ? <IconSun /> : <IconMoonStars />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Header>
    </>
  );
};
