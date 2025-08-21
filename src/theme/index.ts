export interface ThemeColors {
  // Background colors
  background: string;
  surface: string;
  surfaceVariant: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Primary colors
  primary: string;
  primaryVariant: string;
  onPrimary: string;
  
  // Secondary colors
  secondary: string;
  secondaryVariant: string;
  onSecondary: string;
  
  // Status colors
  success: string;
  error: string;
  warning: string;
  info: string;
  
  // Border and divider colors
  border: string;
  divider: string;
  
  // Card and component colors
  card: string;
  cardBorder: string;
  inputBackground: string;
  inputBorder: string;
  
  // Tab bar colors
  tabBar: string;
  tabBarActive: string;
  tabBarInactive: string;
  
  // Navigation colors
  navigationBar: string;
  navigationTitle: string;
}

export interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: object;
    md: object;
    lg: object;
  };
}

export const lightTheme: Theme = {
  colors: {
    // Background colors
    background: '#FFFFFF',
    surface: '#F8F9FA',
    surfaceVariant: '#F1F3F4',
    
    // Text colors
    text: '#1C1C1E',
    textSecondary: '#6C6C70',
    textTertiary: '#8E8E93',
    
    // Primary colors
    primary: '#007AFF',
    primaryVariant: '#0056CC',
    onPrimary: '#FFFFFF',
    
    // Secondary colors
    secondary: '#5856D6',
    secondaryVariant: '#3634A3',
    onSecondary: '#FFFFFF',
    
    // Status colors
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    info: '#007AFF',
    
    // Border and divider colors
    border: '#E5E5EA',
    divider: '#C6C6C8',
    
    // Card and component colors
    card: '#FFFFFF',
    cardBorder: '#E5E5EA',
    inputBackground: '#FFFFFF',
    inputBorder: '#C6C6C8',
    
    // Tab bar colors
    tabBar: '#FFFFFF',
    tabBarActive: '#007AFF',
    tabBarInactive: '#8E8E93',
    
    // Navigation colors
    navigationBar: '#FFFFFF',
    navigationTitle: '#1C1C1E',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
  },
};

export const darkTheme: Theme = {
  colors: {
    // Background colors
    background: '#000000',
    surface: '#1C1C1E',
    surfaceVariant: '#2C2C2E',
    
    // Text colors
    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    textTertiary: '#EBEBF599',
    
    // Primary colors
    primary: '#0A84FF',
    primaryVariant: '#409CFF',
    onPrimary: '#000000',
    
    // Secondary colors
    secondary: '#5E5CE6',
    secondaryVariant: '#7D7AFF',
    onSecondary: '#000000',
    
    // Status colors
    success: '#30D158',
    error: '#FF453A',
    warning: '#FF9F0A',
    info: '#0A84FF',
    
    // Border and divider colors
    border: '#38383A',
    divider: '#48484A',
    
    // Card and component colors
    card: '#1C1C1E',
    cardBorder: '#38383A',
    inputBackground: '#2C2C2E',
    inputBorder: '#48484A',
    
    // Tab bar colors
    tabBar: '#1C1C1E',
    tabBarActive: '#0A84FF',
    tabBarInactive: '#48484A',
    
    // Navigation colors
    navigationBar: '#1C1C1E',
    navigationTitle: '#FFFFFF',
  },
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 6,
    },
  },
};

export type ThemeMode = 'light' | 'dark' | 'system';
