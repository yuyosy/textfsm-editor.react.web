import { ActionIcon, Tooltip } from '@mantine/core';
import { FileDown } from 'lucide-react';

interface DownloadButtonProps {
  content: string;
  filename: string;
  mimeType?: string;
}

export const FileDownloadButton = ({
  content,
  filename,
  mimeType = 'text/plain',
}: DownloadButtonProps) => {
  const handleDownload = () => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Tooltip label="Download" withArrow position="bottom">
      <ActionIcon variant="subtle" color="gray" onClick={handleDownload}>
        <FileDown size={22} />
      </ActionIcon>
    </Tooltip>
  );
};
