import { Badge, BadgeProps } from '@mantine/core';

export interface TagBadgeProps extends BadgeProps {
  name?: string;
  children?: React.ReactNode;
}

export const TagBadge = ({ name, children, ...props }: TagBadgeProps) => (
  <Badge
    {...props}
    tt={props.tt || 'unset'}
    autoContrast={props.autoContrast === undefined ? true : props.autoContrast}
  >
    {name}
    {children}
  </Badge>
);
