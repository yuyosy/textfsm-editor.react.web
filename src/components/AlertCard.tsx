import { Alert, Text } from '@mantine/core';

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
        <Text>
          {mainTitle}
          <Text fz="xs" c="dimmed" fw={400}>
            {subTitle}
          </Text>
        </Text>
      }
      color={color}
    >
      {message}
    </Alert>
  );
};
