import { AppShell, Text } from '@mantine/core';

export const AppFooter = () => {
  return (
    <>
      <AppShell.Footer h={25} px={10} bg="transparent">
        <Text size="sm" c="dimmed">
          Footer
        </Text>
      </AppShell.Footer>
    </>
  );
};
