/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import { version } from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // https://vite.dev/config/#using-environment-variables-in-config
  const env = loadEnv(mode, process.cwd());

  // Experimental -->
  //
  // const useBundled =
  //   env.VITE_USE_BUNDLED_MONACO === 'true' || env.VITE_USE_BUNDLED_MONACO === 'True';
  //
  // <-- Experimental

  return {
    root: 'src',
    plugins: [react()],
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[sname].js',
          assetFileNames: 'assets/[name].[ext]',
        },
      },
    },
    resolve: {
      alias: {
        // Experimental -->
        //
        // Dynamically set alias for the Monaco initialization module
        // Bundling Monaco adds 15MB to the size
        //
        // '@/features/editor/initializeEditor': useBundled
        //   ? resolve(__dirname, 'src/features/editor/initializeEditorBundledMonaco.ts')
        //   : resolve(__dirname, 'src/features/editor/initializeEditor.ts'),
        //
        // <-- Experimental
        '@/': `${__dirname}/src/`,
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(version),
      __API_ENTRYPOINT__: JSON.stringify(
        mode === 'production'
          ? env.VITE_API_ENTRYPOINT_PROD || '/'
          : env.VITE_API_ENTRYPOINT_DEV || 'http://localhost:8000'
      ),
    },
    test: {
      dir: 'tests',
      exclude: ['**/*.local*'],
      reporters: ['json', 'default'],
      outputFile: '../.coverage/test-output.json',
    },
  };
});
