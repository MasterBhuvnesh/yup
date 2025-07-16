import { Text, type TextProps } from 'react-native';

import { useScaleFont } from '@/hooks/useFontScale';

export type ThemedTextProps = TextProps & {
  invert?: boolean;
  light?: boolean;
  type?: 'default' | 'title' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  invert,
  light,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = light ? '#fff' : '#000';
  const scale = useScaleFont();

  return (
    <Text
      style={[
        { color },
        type === 'default'
          ? [styles.default(), { fontSize: scale(20) }]
          : undefined,
        type === 'title' ? styles.title() : undefined,
        type === 'subtitle'
          ? [styles.subtitle(), { fontSize: scale(14.5) }]
          : undefined,
        type === 'link' ? styles.link() : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = {
  default: () => ({
    fontFamily: 'Geist-Medium',
    fontSize: 20,
    lineHeight: 24,
  }),
  title: () => ({
    fontFamily: 'Geist-SemiBold',
    fontSize: 32,
    lineHeight: 32,
  }),
  subtitle: () => ({
    fontFamily: 'Geist-Regular',
    fontSize: 14.5,
    lineHeight: 24,
  }),
  link: () => ({
    fontFamily: 'Geist-Regular',
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  }),
};
