import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { Fonts, FontSizes, FontWeights } from '@/constants/Theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: FontSizes.md,
    lineHeight: 24,
    fontFamily: Fonts.regular,
    fontWeight: FontWeights.regular,
  },
  defaultSemiBold: {
    fontSize: FontSizes.md,
    lineHeight: 24,
    fontFamily: Fonts.medium,
    fontWeight: FontWeights.medium,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
    lineHeight: 36,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
    lineHeight: 28,
  },
  link: {
    lineHeight: 30,
    fontSize: FontSizes.md,
    color: '#0A84FF',
    fontWeight: FontWeights.medium,
    fontFamily: Fonts.medium,
    textDecorationLine: 'underline',
  },
});
