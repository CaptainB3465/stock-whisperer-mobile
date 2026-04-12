import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && user) {
      router.replace('/(tabs)');
    }
  }, [user, isLoaded]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.branding}>
          <IconSymbol name="briefcase.fill" size={64} color="#34C759" />
          <Text style={[styles.title, { color: colors.text }]}>The Stock Whisperer</Text>
          <Text style={[styles.subtitle, { color: colors.subText }]}>Secured Dark Pool Access</Text>
        </View>
        
        <View style={styles.actionContainer}>
          <Pressable 
            onPress={() => router.push('/(auth)/register')} 
            style={({pressed}) => [styles.btnPrimary, { opacity: pressed ? 0.8 : 1 }]}
          >
            <Text style={styles.btnPrimaryText}>Create Account</Text>
          </Pressable>

          <Pressable 
            onPress={() => router.push('/(auth)/login')} 
            style={({pressed}) => [styles.btnOutline, { borderColor: colors.text, opacity: pressed ? 0.6 : 1 }]}
          >
            <Text style={[styles.btnOutlineText, { color: colors.text }]}>Member Sign In</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.push('/privacy')} style={styles.privacyBtn}>
          <Text style={[styles.privacyText, { color: colors.subText }]}>Data Privacy & Encrypted Communications Guarantee</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  branding: {
    alignItems: 'center',
    marginTop: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  actionContainer: {
    width: '100%',
    marginBottom: 40,
  },
  btnPrimary: {
    backgroundColor: '#34C759',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnPrimaryText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnOutline: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  btnOutlineText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  privacyBtn: {
    alignItems: 'center',
    marginBottom: 20,
  },
  privacyText: {
    fontSize: 12,
    textDecorationLine: 'underline',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
