import { ActionIcon, Tooltip } from '@mantine/core';
import { FileDown } from 'lucide-react';

import { downloadFile } from '@/utils/downloadFile';

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
  return (
    <Tooltip label="Download" withArrow position="bottom">
      <ActionIcon
        variant="subtle"
        color="gray"
        onClick={() => downloadFile(content, filename, mimeType)}
      >
        <FileDown size={22} />
      </ActionIcon>
    </Tooltip>
  );
};
