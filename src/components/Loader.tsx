import React from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

const { width } = Dimensions.get('window');

interface LoaderProps {
  height?: number;
  width?: number;
  borderRadius?: number;
}

const Loader: React.FC<LoaderProps> = ({
  height = 200,
  width: loaderWidth = width - 32,
  borderRadius = 8,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.loader,
        {
          height,
          width: loaderWidth,
          borderRadius,
          opacity,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    backgroundColor: '#E5E5EA',
  },
});

export default Loader;
