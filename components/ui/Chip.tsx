import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSizes } from '@/constants/Theme';

export function Chip({ label, color, icon }: { label: string; color: string; icon?: React.ReactNode }) {
  return (
    <View style={[styles.chip, { backgroundColor: color }]}> 
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginRight: Spacing.sm,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    color: '#fff',
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
}); 