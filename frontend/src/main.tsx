import ReactDOM from 'react-dom/client';
import { App } from '@/layouts/App.tsx';
import { initializeEditor } from '@/features/editor/initialize';

initializeEditor();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
