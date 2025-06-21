import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CalorieResult } from '@/services/geminiService';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from 'react-native';
import ImageSearch from './ImageSearch';
import ProductUrlSearch from './ProductUrlSearch';
import TextSearch from './TextSearch';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export default function CalorieFinder() {
  const [result, setResult] = useState<CalorieResult | null>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'url'>('text');
  
  const { colorScheme, setColorScheme } = useColorScheme();
  const safeScheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[safeScheme];

  const handleResult = (calorieResult: CalorieResult) => {
    setResult(calorieResult);
    // Show success feedback with serving size
    Alert.alert('Success!', `Found nutritional information for ${calorieResult.foodName} (per ${calorieResult.servingSize})`);
  };

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Enhanced Header */}
        <ThemedView style={[styles.header, { backgroundColor: colors.surface }]}>
          <View style={styles.titleContainer}>
            <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
              🍎 Food Calorie Finder
            </ThemedText>
            <Switch
              value={colorScheme === 'dark'}
              onValueChange={toggleColorScheme}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={colorScheme === 'dark' ? colors.accent.mint : '#f4f3f4'}
            />
          </View>
          <ThemedText type="default" style={[styles.subtitle, { color: colors.text }]}>
            Get nutritional information for any food.
          </ThemedText>
        </ThemedView>

        {/* Search Content */}
        <View style={styles.searchContent}>
          {activeTab === 'text' && (
            <TextSearch onResult={handleResult} />
          )}
          {activeTab === 'image' && (
            <ImageSearch onResult={handleResult} />
          )}
          {activeTab === 'url' && (
            <ProductUrlSearch onResult={handleResult} />
          )}
        </View>

        {/* Results Section */}
        {result && (
          <ThemedView style={[styles.resultContainer, { backgroundColor: colors.surface }]}>
            <ThemedText type="subtitle" style={[styles.resultTitle, { color: colors.text }]}>
              📊 Nutritional Information
            </ThemedText>
            <ThemedText style={[styles.foodName, { color: colors.text }]}>{result.foodName}</ThemedText>
            <ThemedText style={[styles.servingSize, { color: colors.text }]}>
              Serving Size: {result.servingSize}
            </ThemedText>
            <ThemedText style={[styles.calories, { color: colors.error }]}>
              Calories: {result.calories}
            </ThemedText>
            {result.nutrients && (
              <View style={styles.nutrientsContainer}>
                {result.nutrients.protein && (
                  <ThemedText style={[styles.nutrient, { color: colors.text }]}>
                    Protein: {result.nutrients.protein}
                  </ThemedText>
                )}
                {result.nutrients.carbs && (
                  <ThemedText style={[styles.nutrient, { color: colors.text }]}>
                    Carbohydrates: {result.nutrients.carbs}
                  </ThemedText>
                )}
                {result.nutrients.fat && (
                  <ThemedText style={[styles.nutrient, { color: colors.text }]}>
                    Fat: {result.nutrients.fat}
                  </ThemedText>
                )}
                {result.nutrients.fiber && (
                  <ThemedText style={[styles.nutrient, { color: colors.text }]}>
                    Fiber: {result.nutrients.fiber}
                  </ThemedText>
                )}
              </View>
            )}
            <ThemedText style={[styles.confidence, { color: colors.text }]}>
              Confidence: {Math.round(result.confidence * 100)}%
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <ThemedView style={[styles.bottomNav, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'text' && { backgroundColor: colors.primary }]}
          onPress={() => setActiveTab('text')}
        >
          <ThemedText style={[styles.navButtonText, { color: activeTab === 'text' ? 'white' : colors.text }]}>
            🔍 Text
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'image' && { backgroundColor: colors.primary }]}
          onPress={() => setActiveTab('image')}
        >
          <ThemedText style={[styles.navButtonText, { color: activeTab === 'image' ? 'white' : colors.text }]}>
            📷 Image
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'url' && { backgroundColor: colors.primary }]}
          onPress={() => setActiveTab('url')}
        >
          <ThemedText style={[styles.navButtonText, { color: activeTab === 'url' ? 'white' : colors.text }]}>
            🔗 URL
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom nav
  },
  header: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.8,
  },
  searchContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  placeholderContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  placeholderText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  placeholderButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  placeholderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 20,
    paddingTop: 10,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 20,
    fontWeight: '600',
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  servingSize: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  calories: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
  },
  nutrientsContainer: {
    marginBottom: 15,
  },
  nutrient: {
    fontSize: 16,
    marginBottom: 5,
  },
  confidence: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
