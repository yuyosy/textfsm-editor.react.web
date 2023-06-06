import { AppShell, MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { AppHeader } from './appshell/AppShellHeader';
import { AppFooter } from './appshell/AppShellFooter';
import { MainPanel } from './panels/MainPanel';

export const App = () => {


  // refer to : https://mantine.dev/guides/dark-theme/#save-to-localstorage-and-add-keyboard-shortcut
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });


  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  return (
    <>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          theme={{
            colorScheme,
            globalStyles: (_) => ({
              main: {
                height: '100vh'
              },
            })
          }} withGlobalStyles withNormalizeCSS withCSSVariables
        >
          <AppShell
            padding={0}
            header={<AppHeader />}
            footer={<AppFooter />}
          >
            <MainPanel />
          </AppShell>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}