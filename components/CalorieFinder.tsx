import TextSearch from '@/components/TextSearch';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CalorieResult, geminiService } from '@/services/geminiService';
import { Ionicons } from '@expo/vector-icons';
import { requestCameraPermissionsAsync } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

type ImagePickerResult = {
  canceled: boolean;
  assets: Array<{
    uri: string;
    base64?: string;
    type?: string;
    name?: string;
  }>;
};

const analyzeImage = async (base64Image: string, setResult: (result: CalorieResult | null) => void, setSummary: (summary: string | null) => void, setLoading: (loading: boolean) => void) => {
  try {
    setLoading(true);
    const result = await geminiService.analyzeFoodImage(base64Image);
    setResult(result);
    setSummary(result.summary);
  } catch (error) {
    console.error('Error analyzing image:', error);
    Alert.alert('Error', 'Failed to analyze image. Please try again.');
  } finally {
    setLoading(false);
  }
};

const pickImage = async (setPermissionError: (error: string | null) => void, setImage: (image: string | null) => void, setResult: (result: CalorieResult | null) => void, setSummary: (summary: string | null) => void, setLoading: (loading: boolean) => void, galleryPermission: boolean | null) => {
  setPermissionError(null);
  try {
    if (galleryPermission === false) {
      setPermissionError('Permission to access gallery was denied. Please enable it in settings.');
      setLoading(false);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setPermissionError('Permission to access gallery was denied. Please enable it in settings.');
      setLoading(false);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setImage(asset.uri);
      setResult(null);
      setSummary(null);
      if (asset.base64) {
        await analyzeImage(asset.base64, setResult, setSummary, setLoading);
      } else {
        Alert.alert('Error', 'Failed to get image data');
      }
    }
  } catch (error) {
    console.error('Error picking image:', error);
    Alert.alert('Error', 'Failed to pick image');
  } finally {
    setPermissionError(null);
  }
};

const takePhoto = async (setImage: (image: string | null) => void, setResult: (result: CalorieResult | null) => void, setLoading: (loading: boolean) => void) => {
  try {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
      setResult(null);
      if (result.assets[0].base64) {
        await analyzeImage(result.assets[0].base64, setResult, setSummary, setLoading);
      }
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to take photo');
  }
};

export default function CalorieFinder() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<CalorieResult | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [galleryPermission, setGalleryPermission] = useState<boolean | null>(null);
  const [searchMode, setSearchMode] = useState<'image' | 'text'>('image');

  useEffect(() => {
    (async () => {
      const { status } = await requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryStatus.status === 'granted');

      if (status !== 'granted' || galleryStatus.status !== 'granted') {
        setPermissionError('Please grant both camera and gallery permissions to use this feature.');
      }
    })();
  }, []);

  const analyzeImage = async (base64Image: string) => {
    try {
      setLoading(true);
      const result = await geminiService.analyzeFoodImage(base64Image);
      setResult(result);
      setSummary(`Confidence: ${Math.round(result.confidence * 100)}%`);
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    setPermissionError(null);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setPermissionError('Permission to access gallery was denied. Please enable it in settings.');
        setLoading(false);
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        setImage(asset.uri);
        setResult(null);
        setSummary(null);
        if (asset.base64) {
          await analyzeImage(asset.base64);
        } else {
          Alert.alert('Error', 'Failed to get image data');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setPermissionError(null);
    }
  };

  const resetImage = () => {
    setImage(null);
    setResult(null);
    setSummary(null);
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
        setResult(null);
        if (result.assets[0].base64) {
          await analyzeImage(result.assets[0].base64);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryStatus.status === 'granted');

      if (status !== 'granted' || galleryStatus.status !== 'granted') {
        setPermissionError('Please grant both camera and gallery permissions to use this feature.');
      }
    })();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    subtitle: {
      textAlign: 'center',
      fontSize: 16,
      opacity: 0.8,
    },
    buttonContainer: {
      flexDirection: 'column',
      gap: 20,
    },
    button: {
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cameraButton: {
      backgroundColor: '#007AFF',
    },
    galleryButton: {
      backgroundColor: '#34C759',
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
    },
    permissionText: {
      textAlign: 'center',
      color: '#FF3B30',
      marginTop: 10,
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    image: {
      width: '100%',
      aspectRatio: 4/3,
      borderRadius: 8,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: '#fff',
      fontSize: 16,
      marginTop: 16,
    },
    resultContainer: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    nutrientContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    nutrientIcon: {
      width: 24,
      height: 24,
      marginRight: 8,
    },
    nutrientLabel: {
      fontSize: 16,
      color: '#333',
    },
    nutrientValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#007AFF',
      marginLeft: 'auto',
    },
    divider: {
      height: 1,
      backgroundColor: '#eee',
      marginVertical: 16,
    },
    summaryContainer: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    summaryText: {
      fontSize: 16,
      color: '#666',
      lineHeight: 24,
    },
  });

  const renderSearchOptions = () => (
    <ThemedView style={styles.searchOptionsContainer}>
      <TouchableOpacity
        style={[
          styles.searchOption,
          searchMode === 'image' && styles.searchOptionActive
        ]}
        onPress={() => setSearchMode('image')}
      >
        <ThemedText style={[
          styles.searchOptionText,
          searchMode === 'image' && styles.searchOptionTextActive
        ]}>
          📸 Image Search
        </ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.searchOption,
          searchMode === 'text' && styles.searchOptionActive
        ]}
        onPress={() => setSearchMode('text')}
      >
        <ThemedText style={[
          styles.searchOptionText,
          searchMode === 'text' && styles.searchOptionTextActive
        ]}>
          🔍 Text Search
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  const renderImageSearch = () => (
    <ThemedView style={[styles.buttonContainer, { flexDirection: 'column', gap: 20 }]}>
      <TouchableOpacity
        style={[styles.button, styles.cameraButton]}
        onPress={takePhoto}
        disabled={cameraPermission === false}
        accessibilityLabel="Take a photo of your food"
      >
        <Ionicons name="camera" size={24} color="#fff" style={{ marginRight: 10 }} />
        <ThemedText style={styles.buttonText}>Take Photo</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.galleryButton]}
        onPress={pickImage}
        accessibilityLabel="Upload an image from your gallery"
      >
        <Ionicons name="image" size={24} color="#fff" style={{ marginRight: 10 }} />
        <ThemedText style={styles.buttonText}>Upload From Gallery</ThemedText>
      </TouchableOpacity>

      {cameraPermission === false && (
        <ThemedText style={styles.permissionText}>
          Camera permission is required to take photos
        </ThemedText>
      )}
      {permissionError && (
        <ThemedText style={styles.permissionText}>{permissionError}</ThemedText>
      )}
    </ThemedView>
  );

  const renderResultCard = () => (
    <ThemedView style={styles.resultCard}>
      <ThemedText type="subtitle" style={styles.foodName}>{result?.foodName}</ThemedText>
      <ThemedText>Calories: {result?.calories}</ThemedText>
      <ThemedText>Serving Size: {result?.servingSize}</ThemedText>
      {/* Add more details as needed, e.g. nutrients, confidence, etc. */}
      {summary && (
        <ThemedView style={styles.summaryContainer}>
          <ThemedText type="subtitle" style={styles.summaryTitle}>Summary</ThemedText>
          <ThemedText style={styles.summaryText}>{summary}</ThemedText>
        </ThemedView>
      )}
      <TouchableOpacity style={styles.tryAgainButton} onPress={resetImage}>
        <Ionicons name="refresh" size={20} color="#fff" style={{ marginRight: 6 }} />
        <ThemedText style={styles.tryAgainButtonText}>Try Again</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  const handleTextSearchResult = (searchResult: CalorieResult) => {
    setResult(searchResult);
    setImage(null);
    setSummary(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Calories Finder
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Find nutritional information by taking a photo or searching by name
        </ThemedText>
      </ThemedView>

      {renderSearchOptions()}

      {!image && !result && (
        searchMode === 'image' ? renderImageSearch() : 
        <TextSearch onResult={handleTextSearchResult} />
      )}

      {image && (
        <ThemedView style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.foodImage} />
          {loading && (
            <ThemedView style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#007AFF" />
              <ThemedText style={styles.loadingText}>Analyzing your food...</ThemedText>
            </ThemedView>
          )}
          {!loading && result && renderResultCard()}
          <TouchableOpacity style={styles.resetButton} onPress={resetImage}>
            <ThemedText style={styles.resetButtonText}>Try Another Image</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}

      {result && !image && renderResultCard()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.8,
  },
  searchOptionsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 4,
  },
  searchOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchOptionActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchOptionTextActive: {
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 20,
  },
  button: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraButton: {
    backgroundColor: '#007AFF',
  },
  galleryButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  permissionText: {
    textAlign: 'center',
    color: '#FF3B30',
    marginTop: 10,
  },
  imageContainer: {
    alignItems: 'center',
  },
  foodImage: {
    width: 300,
    height: 225,
    borderRadius: 12,
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  resultContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  foodName: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 24,
  },
  calorieCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  calorieNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  calorieLabel: {
    fontSize: 18,
    marginTop: 5,
  },
  servingSize: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 5,
  },
  nutrientsContainer: {
    marginBottom: 15,
  },
  nutrientsTitle: {
    marginBottom: 10,
    fontSize: 18,
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  nutrientLabel: {
    fontSize: 16,
  },
  nutrientValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  confidenceText: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7,
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultCard: {
    width: '100%',
    padding: 24,
    borderRadius: 18,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  calorieBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 16,
  },
  calorieBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF9500',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  calorieBadgeNumber: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 2,
  },
  calorieBadgeLabel: {
    color: '#FF9500',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  calorieBadgeTextCol: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 2,
  },
  tryAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 18,
    alignSelf: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  tryAgainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderRadius: 12,
  },
}); 