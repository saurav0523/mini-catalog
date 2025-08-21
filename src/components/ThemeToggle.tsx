import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { ThemeMode } from '../theme';

const ThemeToggle: React.FC = () => {
  const { theme, themeMode, setThemeMode, toggleTheme } = useTheme();
  const [showThemeModal, setShowThemeModal] = useState(false);

  const handleThemePress = () => {
    setShowThemeModal(true);
  };

  const handleThemeSelect = (mode: ThemeMode) => {
    setThemeMode(mode);
    setShowThemeModal(false);
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return 'sunny';
      case 'dark':
        return 'moon';
      case 'system':
        return 'desktop';
      default:
        return 'sunny';
    }
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'Light';
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.themeButton, { backgroundColor: theme.colors.surface }]}
        onPress={handleThemePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <Ionicons
          name={getThemeIcon() as any}
          size={20}
          color={theme.colors.primary}
        />
      </TouchableOpacity>

      <Modal
        visible={showThemeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowThemeModal(false)}
        >
          <View
            style={[
              styles.themeModal,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: theme.colors.text },
              ]}
            >
              Choose Theme
            </Text>

            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'light' && {
                  backgroundColor: theme.colors.primary,
                },
              ]}
              onPress={() => handleThemeSelect('light')}
            >
              <Ionicons
                name="sunny"
                size={24}
                color={themeMode === 'light' ? theme.colors.onPrimary : theme.colors.primary}
              />
              <Text
                style={[
                  styles.themeOptionText,
                  {
                    color: themeMode === 'light' ? theme.colors.onPrimary : theme.colors.text,
                  },
                ]}
              >
                Light
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'dark' && {
                  backgroundColor: theme.colors.primary,
                },
              ]}
              onPress={() => handleThemeSelect('dark')}
            >
              <Ionicons
                name="moon"
                size={24}
                color={themeMode === 'dark' ? theme.colors.onPrimary : theme.colors.primary}
              />
              <Text
                style={[
                  styles.themeOptionText,
                  {
                    color: themeMode === 'dark' ? theme.colors.onPrimary : theme.colors.text,
                  },
                ]}
              >
                Dark
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'system' && {
                  backgroundColor: theme.colors.primary,
                },
              ]}
              onPress={() => handleThemeSelect('system')}
            >
              <Ionicons
                name="desktop"
                size={24}
                color={themeMode === 'system' ? theme.colors.onPrimary : theme.colors.primary}
              />
              <Text
                style={[
                  styles.themeOptionText,
                  {
                    color: themeMode === 'system' ? theme.colors.onPrimary : theme.colors.text,
                  },
                ]}
              >
                System
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeModal: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  themeOptionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 16,
  },
});

export default ThemeToggle;
