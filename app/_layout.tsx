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
import { PortalProvider } from "@tamagui/portal"

import { useColorScheme, Text } from 'react-native';
import LoadingScreen from "@/components/loading-screen";
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
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null)

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
    let isMounted = true
    async function loadProfile() {
      if (!session) { if (isMounted) setIsOnboarded(null); return }
      const { data } = await supabase
        .from('profiles')
        .select('onboarded')
        .eq('id', session.user.id)
        .maybeSingle()
      if (!isMounted) return
      setIsOnboarded(!!data?.onboarded)
    }
    loadProfile()
    return () => { isMounted = false }
  }, [session]); useEffect(() => {
    if (!rootNavigationState?.key || !authInitialized) return
    const inAuthGroup = segments[0] === "(auth)"
    const atOnboardQuestions = segments[0] === "onboard-questions"

    if (!session) { if (!inAuthGroup) { router.replace("/(auth)") }; return }
    if (isOnboarded === false && !atOnboardQuestions) { router.replace("/onboard-questions"); return }
    if (isOnboarded === true && (inAuthGroup || atOnboardQuestions)) { router.replace("/(drawer)/(tabs)"); return }
  }, [session, isOnboarded, segments, rootNavigationState?.key, authInitialized])

  const ready = loaded && authInitialized && (!session || isOnboarded !== null)

  if (!ready) { return <LoadingScreen  /> }

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={{
        ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
        colors: {
          ...((colorScheme === 'dark' ? DarkTheme : DefaultTheme).colors),
          background: '#121214',
          card: '#121214',
        }
      }}>
        <TamaguiProvider config={tamaguiConfig}>
          <PortalProvider shouldAddRootHost>
            <StatusBar  />

            <Stack
              screenOptions={{
                contentStyle: {
                  // backgroundColor: '#121214'
                },
                headerShown: false
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
          </PortalProvider>
        </TamaguiProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}