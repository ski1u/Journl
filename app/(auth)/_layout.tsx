import { Stack } from "expo-router"

import { useColorScheme } from "react-native"

export default function AuthLayout() {
  const colorScheme = useColorScheme()

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { 
          backgroundColor: colorScheme === "dark" ? "#121212" : "#ffffff"
        }
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  )
}