import {
  AppShell,
  MantineProvider,
  colorsTuple,
  createTheme,
  virtualColor,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { initializeTextFSMEditor } from '@/features/editor/initializeEditor';

import { AppHeader } from './AppHeader';
import { AppMain } from './AppMain';
import { AppNavbar } from './AppNav';

const theme = createTheme({
  black: '#484951',
  colors: {
    'base-dark': colorsTuple('#343637'),
    'base-light': colorsTuple('#e1e4e6'),
    'base-background': virtualColor({
      name: 'base-background',
      dark: 'base-dark',
      light: 'base-light',
    }),
  },
});

export const App = () => {
  // refer to : https://mantine.dev/guides/dark-theme/#save-to-localstorage-and-add-keyboard-shortcut
  // const [colorScheme, setColorScheme] = useLocalStorage<MantineColorScheme>({
  //   key: 'mantine-color-scheme',
  //   defaultValue: 'light',
  //   getInitialValueInEffect: true,
  // });

  initializeTextFSMEditor();
  const [opened, { toggle }] = useDisclosure();
  const navbarWidth = opened ? 300 : 60;

  return (
    <>
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <AppShell
          layout="alt"
          withBorder={false}
          navbar={{
            width: navbarWidth,
            breakpoint: 'sm',
            collapsed: { mobile: !opened },
          }}
          bg="base-background"
        >
          <AppHeader opened={opened} toggle={toggle} />
          <AppNavbar opened={opened} toggle={toggle} />
          <AppMain />
          {/* <AppFooter /> */}
        </AppShell>
      </MantineProvider>
    </>
  );
};
