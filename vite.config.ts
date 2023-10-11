import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

process.env.VITE_APP_VERSION = JSON.stringify(process.env.npm_package_version).replace(/"/g, '');

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/': `${__dirname}/src/`,
      '~/': `${__dirname}/public/`,
    },
  },
  plugins: [react()],
});
