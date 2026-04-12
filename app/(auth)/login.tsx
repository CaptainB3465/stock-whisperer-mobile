import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
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

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your Stock Whisperer account',
        fallbackLabel: 'Use Passcode',
      });

      if (result.success) {
        setLoading(true);
        // Simulate pulling secure token
        setTimeout(async () => {
          await signIn('biometric_member@stockwhisperer.com');
          setLoading(false);
          router.replace('/(tabs)');
        }, 500);
      } else {
        setErrorMsg('Biometric authentication failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="chevron.right" size={28} color={colors.text} style={{ transform: [{ rotate: '180deg' }] }} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>Enter your credentials to access the Java Pit.</Text>

        {errorMsg ? <Text style={[styles.error, { color: colors.badgeNegative }]}>{errorMsg}</Text> : null}

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]} 
            placeholder="member@example.com"
            placeholderTextColor={colors.subText}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={[styles.label, { color: colors.text }]}>Password</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]} 
            placeholder="••••••••"
            placeholderTextColor={colors.subText}
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
          <View style={[styles.line, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.subText }]}>OR</Text>
          <View style={[styles.line, { backgroundColor: colors.border }]} />
        </View>

        <Pressable 
          onPress={handleBiometric} 
          style={({pressed}) => [styles.btnBio, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={[styles.btnBioText, { color: colors.text }]}>Sign In with Face ID / Fingerprint</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 4,
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
  },
  error: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
});
