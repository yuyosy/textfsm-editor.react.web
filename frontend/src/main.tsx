import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { App } from '@/layouts/App.tsx';

import '@mantine/core/styles.css';
import '@mantine/code-highlight/styles.css';
import 'mantine-datatable/styles.css';

import './layout.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
