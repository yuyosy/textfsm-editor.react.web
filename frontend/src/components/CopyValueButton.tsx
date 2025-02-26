import { ActionIcon, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { Check, Copy } from 'lucide-react';

interface CopyValueButtonProps {
  value: string;
}

export const CopyValueButton = ({ value }: CopyValueButtonProps) => {
  const clipboard = useClipboard({ timeout: 1000 });
  return (
    <Tooltip label={clipboard.copied ? 'Copied' : 'Copy'} withArrow position="bottom">
      <ActionIcon
        variant="subtle"
        color={clipboard.copied ? 'teal' : 'gray'}
        onClick={() => clipboard.copy(value)}
      >
        {clipboard.copied ? <Check size={22} /> : <Copy size={22} />}
      </ActionIcon>
    </Tooltip>
  );
};
