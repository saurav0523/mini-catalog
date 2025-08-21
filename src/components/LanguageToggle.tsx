import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    
    // Animate the button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    i18n.changeLanguage(newLanguage);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={toggleLanguage}>
      <Animated.View style={[styles.animatedContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Ionicons name="language" size={20} color="#007AFF" style={styles.icon} />
        <Text style={styles.text}>{currentLanguage.toUpperCase()}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  animatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: '#007AFF',
    letterSpacing: 0.5,
  },
});

export default LanguageToggle;
