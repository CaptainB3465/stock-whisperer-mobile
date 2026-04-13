import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, SafeAreaView, ActivityIndicator, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function RegisterScreen() {
  const { colors } = useTheme();
  const { signIn } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      await signIn(email, name);
      setLoading(false);
      router.replace('/(tabs)');
    }, 1500);
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the exclusive Java Pit community.</Text>

            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

            <View style={styles.form}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: 'rgba(255,255,255,0.08)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }]}
                placeholder="e.g. Veronica Smith"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={name}
                onChangeText={setName}
              />

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
                onPress={handleRegister}
                disabled={loading}
                style={({ pressed }) => [styles.btnPrimary, { opacity: pressed || loading ? 0.7 : 1 }]}
              >
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnPrimaryText}>Secure Registration</Text>}
              </Pressable>
            </View>

            <Text style={styles.terms}>
              By creating an account, you agree to our{' '}
              <Text style={{ fontWeight: 'bold' }}>Terms of Service</Text> and{' '}
              <Text style={{ fontWeight: 'bold' }}>Privacy Policy</Text>.
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bg: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  safeArea: { flex: 1 },
  header: { padding: 16 },
  backBtn: { padding: 8, alignSelf: 'flex-start' },
  content: { padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8, color: '#FFFFFF' },
  subtitle: { fontSize: 16, marginBottom: 32, color: 'rgba(255,255,255,0.7)' },
  form: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, marginLeft: 4, color: '#FFFFFF' },
  input: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 24, fontSize: 16 },
  btnPrimary: { backgroundColor: '#34C759', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  btnPrimaryText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  error: { color: '#FF3B30', marginBottom: 16, fontWeight: 'bold' },
  terms: { fontSize: 12, textAlign: 'center', marginTop: 16, paddingHorizontal: 16, color: 'rgba(255,255,255,0.6)' },
});
