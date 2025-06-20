import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ColorSchemeProvider, useColorScheme, useSetColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';

export default function RootLayout() {
  return (
    <ColorSchemeProvider>
      <RootLayoutWithToggle />
    </ColorSchemeProvider>
  );
}

function RootLayoutWithToggle() {
  const colorScheme = useColorScheme();
  const setColorScheme = useSetColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <TouchableOpacity
          accessible
          accessibilityLabel="Toggle dark and light mode"
          onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
          style={{
            position: 'absolute',
            top: 40,
            right: 24,
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: 24,
            padding: 8,
            zIndex: 1000,
          }}
        >
          <Ionicons
            name={colorScheme === 'dark' ? 'sunny' : 'moon'}
            size={24}
            color={colorScheme === 'dark' ? '#FFD60A' : '#181A20'}
          />
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
