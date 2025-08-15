import { Stack, useRouter } from "expo-router"

export default function AuthLayout() {
  const router = useRouter()
  
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { 
          // backgroundColor: colorScheme === "dark" ? "#121212" : "#ffffff" 
        }
      }}
    >
      <Stack.Screen name="onboard-auth" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    </Stack>
  )
}