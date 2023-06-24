import { Tooltip, ActionIcon } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconCheck, IconCopy } from '@tabler/icons-react';

type Props = {
  getValueFunc: () => string;
};

export const CopyValueButton = ({ getValueFunc }: Props) => {
  const clipboard = useClipboard({ timeout: 1000 });

  return (
    <Tooltip label={clipboard.copied ? 'Copied' : 'Copy'} withArrow position="bottom">
      <ActionIcon
        color={clipboard.copied ? 'teal' : 'gray'}
        onClick={() => clipboard.copy(getValueFunc())}
      >
        {clipboard.copied ? <IconCheck /> : <IconCopy />}
      </ActionIcon>
    </Tooltip>
  );
};
