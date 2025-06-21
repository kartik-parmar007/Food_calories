import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  Linking,
  View,
} from 'react-native';
import { geminiService, CalorieResult } from '@/services/geminiService';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface ProductUrlSearchProps {
  onResult: (result: CalorieResult) => void;
}

export default function ProductUrlSearch({ onResult }: ProductUrlSearchProps) {
  const [productUrl, setProductUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const extractProductInfo = async () => {
    if (!productUrl.trim()) {
      Alert.alert('Error', 'Please enter a product URL');
      return;
    }

    if (!validateUrl(productUrl.trim())) {
      Alert.alert('Error', 'Please enter a valid URL');
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 Analyzing product URL:', productUrl.trim());
      const result = await geminiService.getNutritionalInfoFromUrl(productUrl.trim());
      console.log('✅ Product analysis successful:', result);
      onResult(result);
    } catch (error) {
      console.error('❌ Product analysis failed:', error);
      let errorMessage = 'Failed to analyze product. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      Alert.alert('Analysis Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openUrl = async () => {
    if (productUrl.trim() && validateUrl(productUrl.trim())) {
      try {
        await Linking.openURL(productUrl.trim());
      } catch (error) {
        Alert.alert('Error', 'Could not open the URL');
      }
    } else {
      Alert.alert('Error', 'Please enter a valid URL first');
    }
  };

  const clearUrl = () => {
    setProductUrl('');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        🔗 Product URL Search
      </ThemedText>
      
      <ThemedText style={styles.description}>
        Enter a product URL from a grocery store or food website. The app will extract the product name from the URL and provide nutritional information.
      </ThemedText>
      
      <TextInput
        style={styles.input}
        placeholder="Enter product URL (e.g., https://www.example.com/product)"
        placeholderTextColor="#999"
        value={productUrl}
        onChangeText={setProductUrl}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        returnKeyType="search"
        onSubmitEditing={extractProductInfo}
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.analyzeButton]}
          onPress={extractProductInfo}
          disabled={loading || !productUrl.trim()}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <ThemedText style={styles.buttonText}>🔍 Analyze Product</ThemedText>
          )}
        </TouchableOpacity>
        
        <View style={styles.secondaryButtons}>
          <TouchableOpacity
            style={[styles.secondaryButton, styles.openButton]}
            onPress={openUrl}
            disabled={!productUrl.trim()}
          >
            <ThemedText style={styles.secondaryButtonText}>🌐 Open URL</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.secondaryButton, styles.clearButton]}
            onPress={clearUrl}
            disabled={!productUrl.trim()}
          >
            <ThemedText style={styles.secondaryButtonText}>🗑️ Clear</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      
      <ThemedText style={styles.supportedSites}>
        Works with most product URLs from Amazon, Walmart, Target, Kroger, and other major retailers
      </ThemedText>
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
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  analyzeButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#34C759',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  supportedSites: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,
    color: '#999',
    fontStyle: 'italic',
  },
}); 