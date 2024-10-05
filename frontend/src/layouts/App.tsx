import { AppShell, MantineProvider, createTheme } from '@mantine/core';
import { AppHeader } from './appshell/AppShellHeader';
import { AppFooter } from './appshell/AppShellFooter';
import { MainPanel } from './panels/MainPanel';
import { initializeTextFSMEditor } from '@/features/editor/initializeEditor';

const theme = createTheme({
  /** Your theme override here */
});

export const App = () => {
  // refer to : https://mantine.dev/guides/dark-theme/#save-to-localstorage-and-add-keyboard-shortcut
  // const [colorScheme, setColorScheme] = useLocalStorage<MantineColorScheme>({
  //   key: 'mantine-color-scheme',
  //   defaultValue: 'light',
  //   getInitialValueInEffect: true,
  // });

  initializeTextFSMEditor();

  return (
    <>
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <AppShell>
          <AppHeader />
          <MainPanel />
          <AppFooter />
        </AppShell>
      </MantineProvider>
    </>
  );
};
