import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/layouts/App.tsx';

import '@mantine/code-highlight/styles.css';
import '@mantine/core/styles.css';
import 'mantine-datatable/styles.css';

import './layout.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
