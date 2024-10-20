import { Alert, Box, Text } from '@mantine/core';

type Props = {
  mainTitle: string;
  subTitle: string;
  color: string;
  message: string;
};

export const AlertCard = ({ mainTitle, subTitle, color, message }: Props) => {
  return (
    <Alert
      title={
        <Box>
          <Text fw={700} c={color}>
            {mainTitle}
          </Text>
          <Text fz="xs" c="dimmed" fw={400}>
            {subTitle}
          </Text>
        </Box>
      }
      color={color}
      p={12}
    >
      {message}
    </Alert>
  );
};
