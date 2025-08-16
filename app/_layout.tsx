import "@/global.css"

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, useFonts } from "@expo-google-fonts/inter";
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { StatusBar } from "expo-status-bar"
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import type { Session } from "@supabase/supabase-js";
import { TamaguiProvider } from "tamagui";

import { useColorScheme } from 'react-native';
import { supabase } from "@/utils/supabase/client";
import tamaguiConfig from "@/tamagui.config";

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    ...FontAwesome.font,
  }); const router = useRouter(); const segments = useSegments(); const rootNavigationState = useRootNavigationState()
  const [session, setSession] = useState<Session | null>(null); const [authInitialized, setAuthInitialized] = useState(false)

  useEffect(() => {
    if (error) throw error;
  }, [error]); useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    let isMounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return
      setSession(data.session ?? null)
      setAuthInitialized(true)
    }); const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => { setSession(newSession) })

    return () => { isMounted = false; subscription.subscription?.unsubscribe() }
  }, []); useEffect(() => {
    if (!rootNavigationState?.key || !authInitialized) return
    const inAuthGroup = segments[0] === "(auth)"
    if (!session && !inAuthGroup) { router.replace("/(auth)/onboard-auth") }
    else if (session && inAuthGroup) { router.replace("/(drawer)/(tabs)/home") }
  }, [session, segments, rootNavigationState?.key, authInitialized])

  if (!loaded) {
    return null;
  }

  ;(Text as any).defaultProps = (Text as any).defaultProps || {}
  ;(Text as any).defaultProps.style = [
    (Text as any).defaultProps.style,
    { fontFamily: "Inter_400Regular" }
  ]

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <TamaguiProvider config={tamaguiConfig}>
          <StatusBar  />

          <Stack
            screenOptions={{
              contentStyle: {
                backgroundColor: colorScheme === "dark" ? "#121212" : "#f5f5f5"
              }
            }}
          >
            <Stack.Screen
              name="(drawer)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)"
              options={{ headerShown: false }}
            />
          </Stack>
        </TamaguiProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}