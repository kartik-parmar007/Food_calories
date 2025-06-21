import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';

const ColorSchemeContext = createContext<{
  colorScheme: 'light' | 'dark';
  setColorScheme: (scheme: 'light' | 'dark') => void;
  isHydrated: boolean;
}>({
  colorScheme: 'light',
  setColorScheme: () => {},
  isHydrated: false,
});

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useNativeColorScheme();
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(systemScheme ?? 'light');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setColorScheme(systemScheme ?? 'light');
    setIsHydrated(true);
  }, [systemScheme]);

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme, isHydrated }}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

export function useColorScheme() {
  const ctx = useContext(ColorSchemeContext);
  if (!ctx) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider');
  }
  return ctx;
} 