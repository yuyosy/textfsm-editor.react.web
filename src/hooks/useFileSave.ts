import { useState } from 'react';

type DataType = Blob | ArrayBuffer | string;

export const useFileSave = (): [(fileName: string, data: DataType) => void, Error | null] => {
  const [error, setError] = useState<Error | null>(null);

  const saveFile = (fileName: string, data: DataType) => {
    const blob =
      typeof data === 'string'
        ? new Blob([data], { type: 'text/plain' })
        : data instanceof Blob
        ? data
        : new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handle = (fileName: string, data: DataType) => {
    try {
      saveFile(fileName, data);
    } catch (err: any) {
      setError(err);
    }
  };

  return [handle, error];
};
