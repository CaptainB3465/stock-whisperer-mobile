import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export function SkeletonLoader() {
  const { colors } = useTheme();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.85] });

  return (
    <Animated.View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, opacity }]}>
      <View style={styles.row}>
        <View style={[styles.pill, styles.wide, { backgroundColor: colors.border }]} />
        <View style={[styles.pill, styles.narrow, { backgroundColor: colors.border }]} />
      </View>
      <View style={[styles.pill, styles.medium, { backgroundColor: colors.border, marginTop: 12 }]} />
      <View style={[styles.pill, styles.xwide, { backgroundColor: colors.border, marginTop: 8 }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    borderRadius: 6,
    height: 16,
  },
  wide: { width: '35%' },
  medium: { width: '50%' },
  narrow: { width: '20%' },
  xwide: { width: '80%' },
});
