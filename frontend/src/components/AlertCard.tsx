import { memo } from 'react';

import { Alert, Text, Tooltip } from '@mantine/core';

type Props = {
  mainTitle: string;
  timestamp: string;
  color: string;
  message: string;
  onClose?: () => void;
};

export const AlertCard = memo<Props>(
  ({ mainTitle, timestamp, color, message, onClose }: Props) => {
    return (
      <Alert
        title={
          <Tooltip label={timestamp} position="bottom-start">
            <Text fw={700} c={color}>
              {mainTitle}
            </Text>
          </Tooltip>
        }
        color={color}
        p={10}
        withCloseButton={!!onClose}
        onClose={onClose}
      >
        {message}
      </Alert>
    );
  },
);
