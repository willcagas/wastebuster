import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'mon': require('../assets/fonts/Montserrat-Regular.ttf'),
    'mon-sb': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    'mon-b': require('../assets/fonts/Montserrat-Bold.ttf')
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync();
      setIsReady(true);
    }, 750);

    return () => clearTimeout(timer);
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen name="category/[name]" options={{ headerTitle: '', headerTransparent: true}} />
      <Stack.Screen name="event/[id]" options={{ headerTitle: '', headerTransparent: true}} />
    </Stack>
  );
}
