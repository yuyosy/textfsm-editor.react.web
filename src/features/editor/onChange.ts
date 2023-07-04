import { OnChange } from '@monaco-editor/react';

export const onChangeEditorWrapper =
  (func: (...args: any) => void): OnChange =>
  (value, event) => {
    func(value, event);
  };
