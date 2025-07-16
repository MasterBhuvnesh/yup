import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  light?: string;
};

export function ThemedView({
  style,
  light = '#fff',
  ...otherProps
}: ThemedViewProps) {
  return <View style={[{ backgroundColor: light }, style]} {...otherProps} />;
}
