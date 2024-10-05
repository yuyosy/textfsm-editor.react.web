// import { initializeEditor } from '@/features/editor/initialize';
import { App } from '@/layouts/App.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@mantine/core/styles.css';

// initializeEditor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
