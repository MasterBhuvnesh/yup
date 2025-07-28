import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface IconProps {
  Icon: React.ComponentType<any>;
  size?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
}

export const AppIcon: React.FC<IconProps> = ({
  Icon,
  size = 24,
  color = 'black',
  strokeWidth = 2,
  fill = 'transparent',
  style,
}) => {
  return (
    <Icon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      style={style}
      fill={fill}
    />
  );
};
