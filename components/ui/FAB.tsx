import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

export function FAB({ 
  icon, 
  onPress, 
  style, 
  color 
}: { 
  icon: string; 
  onPress: () => void; 
  style?: ViewStyle;
  color?: string;
}) {
  const colorScheme = useColorScheme();
  const safeScheme = colorScheme === 'dark' ? 'dark' : 'light';
  const iconColor = color || Colors[safeScheme].text;
  
  return (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor: Colors[safeScheme].surface }, style]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityLabel="Quick action"
    >
      <Ionicons name={icon as any} size={24} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },
}); 