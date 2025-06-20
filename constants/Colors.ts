/**
 * World-class color palette for food/nutrition app UI (2025 trends)
 */

const tintColorLight = '#0A84FF'; // Primary blue
const tintColorDark = '#64D2FF'; // Primary blue (dark mode)

export const Colors = {
  light: {
    text: '#1A1A1A', // Main text
    background: '#F8FAFC', // App background
    surface: '#FFFFFF', // Card/Surface
    primary: tintColorLight, // Primary action
    secondary: '#FF9500', // Secondary/Accent
    success: '#34C759', // Success/Good
    warning: '#FFD60A', // Warning
    error: '#FF3B30', // Error
    macroCarbs: '#FFD60A', // Carbs (yellow)
    macroProtein: '#0A84FF', // Protein (blue)
    macroFat: '#FF9500', // Fat (orange)
    micro: '#A3FFCB', // Micronutrients (mint)
    vegan: '#30D158', // Vegan indicator
    allergen: '#FF3B30', // Allergen indicator
    expiry: '#FF9500', // Expiry indicator
    icon: '#6B7280', // Icon default
    border: '#E5E7EB', // Border
    card: '#FFFFFF', // Card
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorLight,
    shadow: 'rgba(0,0,0,0.08)',
    glass: 'rgba(255,255,255,0.6)', // Glassmorphism
  },
  dark: {
    text: '#F8FAFC',
    background: '#181A20',
    surface: '#23262F',
    primary: tintColorDark,
    secondary: '#FFD60A',
    success: '#30D158',
    warning: '#FFD60A',
    error: '#FF453A',
    macroCarbs: '#FFD60A',
    macroProtein: '#64D2FF',
    macroFat: '#FFB86C',
    micro: '#A3FFCB',
    vegan: '#30D158',
    allergen: '#FF453A',
    expiry: '#FFB86C',
    icon: '#A1A1AA',
    border: '#23262F',
    card: '#23262F',
    tabIconDefault: '#A1A1AA',
    tabIconSelected: tintColorDark,
    shadow: 'rgba(0,0,0,0.32)',
    glass: 'rgba(35,38,47,0.6)',
  },
};
