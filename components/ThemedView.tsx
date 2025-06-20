import { View, type ViewProps } from 'react-native';

import { Spacing } from '@/constants/Theme';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  padding?: number;
  borderRadius?: number;
};

export function ThemedView({ style, lightColor, darkColor, padding = Spacing.md, borderRadius = 16, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor, padding, borderRadius }, style]} {...otherProps} />;
}
