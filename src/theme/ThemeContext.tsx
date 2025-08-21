import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme, ThemeMode } from './index';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [theme, setTheme] = useState<Theme>(lightTheme);

  // Load saved theme mode from storage
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
          setThemeMode(savedMode as ThemeMode);
        }
      } catch (error) {
        console.log('Failed to load theme mode:', error);
      }
    };

    loadThemeMode();
  }, []);

  // Update theme based on mode and system preference
  useEffect(() => {
    const getCurrentTheme = (): Theme => {
      if (themeMode === 'system') {
        return systemColorScheme === 'dark' ? darkTheme : lightTheme;
      }
      return themeMode === 'dark' ? darkTheme : lightTheme;
    };

    setTheme(getCurrentTheme());
  }, [themeMode, systemColorScheme]);

  // Save theme mode to storage
  const saveThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.log('Failed to save theme mode:', error);
    }
  };

  // Set theme mode and save to storage
  const handleSetThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode);
    saveThemeMode(mode);
  };

  // Toggle between light and dark (skip system mode)
  const toggleTheme = () => {
    const newMode: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
    handleSetThemeMode(newMode);
  };

  const value: ThemeContextType = {
    theme,
    themeMode,
    setThemeMode: handleSetThemeMode,
    toggleTheme,
    isDark: theme === darkTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
