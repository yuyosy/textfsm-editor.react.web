// Function to trigger file download using Blob

type DataType = Blob | ArrayBuffer | string;

export const downloadFile = (
  content: DataType,
  filename: string,
  mimeType: string = 'text/plain'
) => {
  const blob =
    typeof content === 'string'
      ? new Blob([content], { type: mimeType })
      : content instanceof Blob
        ? content
        : new Blob([content], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};
