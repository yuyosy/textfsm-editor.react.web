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
          <Text fw={700}>{mainTitle}</Text>
          <Text fz="xs" c="dimmed" fw={400}>
            {subTitle}
          </Text>
        </Box>
      }
      color={color}
    >
      {message}
    </Alert>
  );
};
