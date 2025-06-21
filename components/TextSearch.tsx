import { CalorieResult, geminiService } from '@/services/geminiService';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface TextSearchProps {
  onResult: (result: CalorieResult) => void;
}

export default function TextSearch({ onResult }: TextSearchProps) {
  const [foodName, setFoodName] = useState('');
  const [loading, setLoading] = useState(false);

  const searchFood = async () => {
    if (!foodName.trim()) {
      Alert.alert('Error', 'Please enter a food name');
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 Starting search for:', foodName.trim());
      const result = await geminiService.getNutritionalInfo(foodName.trim());
      console.log('✅ Search successful:', result);
      onResult(result);
    } catch (error) {
      console.error('❌ Search failed:', error);
      let errorMessage = 'Failed to get nutritional information. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      Alert.alert('Search Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        Search by Food Name
      </ThemedText>
      
      <TextInput
        style={styles.input}
        placeholder="Enter food name (e.g., apple, chicken breast)"
        placeholderTextColor="#999"
        value={foodName}
        onChangeText={setFoodName}
        onSubmitEditing={searchFood}
        returnKeyType="search"
      />
      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={searchFood}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <ThemedText style={styles.buttonText}>🔍 Search</ThemedText>
        )}
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 