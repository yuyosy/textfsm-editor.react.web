import { Tooltip, ActionIcon } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { Check, Copy } from 'lucide-react';

type Props = {
  value: string;
};

export const CopyValueButton = ({ value }: Props) => {
  const clipboard = useClipboard({ timeout: 1000 });
  return (
    <Tooltip label={clipboard.copied ? 'Copied' : 'Copy'} withArrow position="bottom">
      <ActionIcon
        color={clipboard.copied ? 'teal' : 'gray'}
        onClick={() => clipboard.copy(value)}
      >
        {clipboard.copied ? <Check /> : <Copy />}
      </ActionIcon>
    </Tooltip>
  );
};
