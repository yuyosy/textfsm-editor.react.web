import { resolve } from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { version } from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
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
      '@/': `${__dirname}/src/`,
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  server: {
    host: true,
  },
});
