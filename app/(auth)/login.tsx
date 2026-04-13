import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, SafeAreaView, ActivityIndicator, Alert, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function LoginScreen() {
  const { colors } = useTheme();
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setLoading(true);
    // Mock network request logic
    setTimeout(async () => {
      await signIn(email);
      setLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleBiometric = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setErrorMsg('Biometrics not found on this device.');
        return;
      }

      // Check if we have a last logged in user
      const lastUserStr = await AsyncStorage.getItem('@biometric_last_user');
      if (!lastUserStr) {
        Alert.alert(
          "Personalization Required",
          "Please sign in with your email and password once to enable personalized biometric login."
        );
        return;
      }

      const lastUser = JSON.parse(lastUserStr);

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Sign in as ${lastUser.name}`,
        fallbackLabel: 'Use Passcode',
      });

      if (result.success) {
        setLoading(true);
        // Simulate pulling secure token/session
        setTimeout(async () => {
          await signIn(lastUser.email, lastUser.name);
          setLoading(false);
          router.replace('/(tabs)');
        }, 800);
      } else {
        setErrorMsg('Biometric authentication failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'file:///C:/Users/Administrator/.gemini/antigravity/brain/e6306fc4-5682-4017-98db-f96306073cec/stock_trends_background_1776029064624.png' }}
        style={styles.bg}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <IconSymbol name="chevron.right" size={28} color="#FFFFFF" style={{ transform: [{ rotate: '180deg' }] }} />
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Enter your credentials to access the Java Pit.</Text>

            {errorMsg ? <Text style={[styles.error, { color: colors.badgeNegative }]}>{errorMsg}</Text> : null}

            <View style={styles.form}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }]} 
                placeholder="member@example.com"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }]} 
                placeholder="••••••••"
                placeholderTextColor="rgba(255,255,255,0.4)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <Pressable 
                onPress={handleEmailLogin} 
                disabled={loading}
                style={({pressed}) => [styles.btnPrimary, { opacity: pressed || loading ? 0.7 : 1 }]}
              >
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnPrimaryText}>Sign In</Text>}
              </Pressable>
            </View>

            <View style={styles.dividerBox}>
              <View style={[styles.line, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={[styles.line, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
            </View>

            <Pressable 
              onPress={handleBiometric} 
              style={({pressed}) => [styles.btnBio, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)', opacity: pressed ? 0.7 : 1 }]}
            >
              <Text style={styles.btnBioText}>Sign In with Face ID / Fingerprint</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bg: {
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
  },
  header: {
    padding: 16,
  },
  backBtn: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    color: 'rgba(255,255,255,0.7)',
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 4,
    color: '#FFFFFF',
  },
  input: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    fontSize: 16,
  },
  btnPrimary: {
    backgroundColor: '#34C759',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  btnPrimaryText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.6)',
  },
  btnBio: {
    paddingVertical: 18,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  btnBioText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  error: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
});
