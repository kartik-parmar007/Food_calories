import { createContext, useContext, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';

const ColorSchemeContext = createContext({
  colorScheme: 'light',
  setColorScheme: (scheme: 'light' | 'dark') => {},
});

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useNativeColorScheme();
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(systemScheme ?? 'light');

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

export function useColorScheme() {
  const ctx = useContext(ColorSchemeContext);
  return ctx.colorScheme;
}

export function useSetColorScheme() {
  const ctx = useContext(ColorSchemeContext);
  return ctx.setColorScheme;
} 