import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, Animated, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function TransitionScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(1.1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of animations for a premium feel
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),
      ])
    ]).start();

    // Navigate away after 4 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        router.replace('/(auth)/login');
      });
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backgroundContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <ImageBackground
          source={{ uri: 'file:///C:/Users/Administrator/.gemini/antigravity/brain/e6306fc4-5682-4017-98db-f96306073cec/stock_trends_background_1776029064624.png' }}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
        </ImageBackground>
      </Animated.View>

      <StatusBar style="light" />
      
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[
          styles.content,
          {
            opacity: textOpacity,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <View style={styles.glassLabel}>
            <Text style={styles.label}>STOCK WHISPERER • INTELLIGENCE</Text>
          </View>
          
          <Text style={styles.title}>Stock Tracker</Text>
          
          <View style={styles.dividerRoot}>
            <View style={styles.divider} />
            <View style={styles.dividerDot} />
            <View style={styles.divider} />
          </View>
          
          <Text style={styles.subtitle}>Your Online Market Analyzer</Text>
          
          <View style={styles.loaderContainer}>
            <Animated.View 
              style={[
                styles.loaderBar, 
                { 
                  width: textOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 180]
                  }) 
                }
              ]} 
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  glassLabel: {
    backgroundColor: 'rgba(52,199,89,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.3)',
    marginBottom: 24,
  },
  label: {
    color: '#34C759',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  dividerRoot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dividerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34C759',
    marginHorizontal: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 3,
    textTransform: 'lowercase',
    marginBottom: 40,
  },
  loaderContainer: {
    width: 120,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  loaderBar: {
    height: '100%',
    backgroundColor: '#34C759',
  },
});
