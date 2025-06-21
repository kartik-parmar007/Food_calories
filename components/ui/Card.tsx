import { Colors } from '@/constants/Colors';
import { Shadows, Spacing } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const colorScheme = useColorScheme();
  const safeScheme = colorScheme === 'dark' ? 'dark' : 'light';
  return (
    <BlurView
      intensity={60}
      tint={colorScheme}
      style={[
        styles.card,
        {
          backgroundColor: Colors[safeScheme].glass,
          ...Shadows.neumorph,
        },
        style,
      ]}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
    overflow: 'hidden',
  },
}); 