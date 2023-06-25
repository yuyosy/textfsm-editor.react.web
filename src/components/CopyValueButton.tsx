import { Tooltip, ActionIcon } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconCheck, IconCopy } from '@tabler/icons-react';

type Props = {
  valueRef: React.MutableRefObject<string>;
};

export const CopyValueButton = ({ valueRef }: Props) => {
  const clipboard = useClipboard({ timeout: 1000 });
  return (
    <Tooltip label={clipboard.copied ? 'Copied' : 'Copy'} withArrow position="bottom">
      <ActionIcon
        color={clipboard.copied ? 'teal' : 'gray'}
        onClick={() => clipboard.copy(valueRef.current)}
      >
        {clipboard.copied ? <IconCheck /> : <IconCopy />}
      </ActionIcon>
    </Tooltip>
  );
};
