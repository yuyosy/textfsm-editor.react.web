import { memo } from 'react';

import {
  Editor as MonacoEditor,
  type EditorProps as MonacoEditorProps,
  type OnChange,
  type OnMount,
} from '@monaco-editor/react';

const monacoOptions: MonacoEditorProps['options'] = {
  scrollbar: {
    alwaysConsumeMouseWheel: false,
    verticalScrollbarSize: 10,
  },
  minimap: { enabled: true },
  tabSize: 2,
  mouseWheelZoom: true,
  fontSize: 13,
  renderValidationDecorations: 'off',
};

export const Editor: React.FC<{
  defaultLanguage: string;
  theme: string;
  onMount: OnMount;
  onChange: OnChange;
}> = memo(({ defaultLanguage, theme, onMount, onChange }) => {
  return (
    <MonacoEditor
      height="100%"
      defaultLanguage={defaultLanguage}
      theme={theme}
      onMount={onMount}
      onChange={onChange}
      options={monacoOptions}
    />
  );
});
