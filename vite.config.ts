import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

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
