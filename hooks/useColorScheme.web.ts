import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';

// Create a context with a default value.
const ColorSchemeContext = createContext<{
  colorScheme: 'light' | 'dark';
  setColorScheme: (scheme: 'light' | 'dark') => void;
  isHydrated: boolean;
}>({
  colorScheme: 'light',
  setColorScheme: () => {},
  isHydrated: false,
});

// The provider component.
export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useNativeColorScheme();
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(systemScheme ?? 'light');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // This effect ensures the color scheme is updated when the system preference changes.
    // It also sets `isHydrated` to true after the initial render.
    setColorScheme(systemScheme ?? 'light');
    setIsHydrated(true);
  }, [systemScheme]);

  const contextValue = { colorScheme, setColorScheme, isHydrated };

  return (
    <ColorSchemeContext.Provider value={contextValue}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

// The hook to consume the context.
export function useColorScheme() {
  const ctx = useContext(ColorSchemeContext);
  if (!ctx) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider');
  }
  return ctx;
}
