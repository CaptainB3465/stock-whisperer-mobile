import React, { useEffect } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { WatchlistProvider } from '@/context/WatchlistContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AdminProvider } from '@/context/AdminContext';
import { AlertsProvider } from '@/context/AlertsContext';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

function RootNavigator() {
  const { user, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const isTransition = segments[0] === 'transition';
    const isWelcome = segments[0] === undefined || segments[0] === 'index';
    const isAuth = segments[0] === '(auth)';

    if (!user && inAuthGroup) {
      // If not logged in and trying to access tabs, redirect to login
      router.replace('/(auth)/login');
    } else if (user && (isAuth || isWelcome)) {
      // If logged in and on auth/welcome screens, redirect to tabs
      // Note: We removed isTransition from here to allow logout animation
      router.replace('/(tabs)');
    }
  }, [user, isLoaded, segments]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="transition" options={{ headerShown: false, animation: 'fade' }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Chart Analysis' }} />
      <Stack.Screen name="paywall" options={{ presentation: 'fullScreenModal', headerShown: false }} />
      <Stack.Screen name="privacy" options={{ presentation: 'modal', title: 'Data Privacy' }} />
      <Stack.Screen name="admin" options={{ presentation: 'modal', title: 'Admin Panel', headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <AlertsProvider>
            <SubscriptionProvider>
              <WatchlistProvider>
                <RootNavigator />
                <StatusBar style="auto" />
              </WatchlistProvider>
            </SubscriptionProvider>
          </AlertsProvider>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
