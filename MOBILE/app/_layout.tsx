import { useEffect } from 'react';

import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';

import '@/styles/global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import HomeHeader from '@/components/ui/HomeHeader';

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
    <SafeAreaProvider>
      <StatusBar hidden />
      <Stack
        screenOptions={{
          animation: 'fade',
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            header: () => <HomeHeader />,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
