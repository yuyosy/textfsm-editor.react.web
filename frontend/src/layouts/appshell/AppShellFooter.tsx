import { Anchor, AppShell, Group, Text } from '@mantine/core';

export const AppFooter = () => {
  return (
    <>
    <AppShell.Footer h={25} px={10}>
      <Group justify="space-between">
          <Group>
            {import.meta.env.VITE_APP_VERSION ? (
              <Text size="sm" c="dimmed">
                ver.{import.meta.env.VITE_APP_VERSION}
              </Text>
            ) : (
              ''
            )}
          </Group>
          <Group>
            <Text size="sm" c="dimmed">
              Made by yuyosy
            </Text>
            <Anchor size="sm" href="https://github.com/yuyosy" target="_blank">
              GitHub
            </Anchor>
          </Group>
        </Group>
      </AppShell.Footer>
    </>
  );
};
