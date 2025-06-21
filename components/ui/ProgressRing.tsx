import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { FontSizes } from '@/constants/Theme';

export function ProgressRing({ value, max, color, size = 80, label }: { value: number; max: number; color: string; size?: number; label?: string }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference * (1 - progress);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#eee"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference},${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={styles.value}>{Math.round(value)}</Text>
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  value: {
    position: 'absolute',
    top: '38%',
    alignSelf: 'center',
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: '#222',
  },
  label: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    fontSize: FontSizes.sm,
    color: '#888',
  },
}); 