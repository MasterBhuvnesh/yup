import { useEffect } from 'react';

import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import '@/styles/global.css';

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    'Geist-Regular': require('@/assets/fonts/Geist-Regular.ttf'),
    'Geist-Bold': require('@/assets/fonts/Geist-Bold.ttf'),
    'Geist-Medium': require('@/assets/fonts/Geist-Medium.ttf'),
    'Geist-SemiBold': require('@/assets/fonts/Geist-SemiBold.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar />

      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
    </>
  );
}
