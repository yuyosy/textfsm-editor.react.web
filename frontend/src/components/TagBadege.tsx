import { Badge, MantineSize } from '@mantine/core';

export interface TagBadgeProps {
  name: string;
  color: string;
  size?: MantineSize | (string & {}) | undefined;
}

export const TagBadge = ({ name, color, size = 'md' }: TagBadgeProps) => (
  <Badge color={color} variant="filled" tt="unset" size={size} autoContrast>
    {name}
  </Badge>
);
