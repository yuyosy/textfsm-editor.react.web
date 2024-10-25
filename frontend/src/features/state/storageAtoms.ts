import { atomWithStorage } from 'jotai/utils';
import { localStorage, sessionStorage } from './syncStorage';

export const parseRequestDelayAtom = atomWithStorage<number>(
  'options-editor-parse-request-delay',
  1000,
  localStorage(),
  {
    getOnInit: true,
  }
);

export const autoRequestEnabledAtom = atomWithStorage<boolean>(
  'options-editor-auto-request-enabled',
  false,
  localStorage(),
  {
    getOnInit: true,
  }
);

export const rawTextEditorValueAtom = atomWithStorage<string>(
  'data-editor-value',
  '// Type your data here',
  sessionStorage(),
  {
    getOnInit: true,
  }
);

export const templateEditorValueAtom = atomWithStorage<string>(
  'template-editor-value',
  '# Type your template herssse',
  sessionStorage(),
  {
    getOnInit: true,
  }
);
