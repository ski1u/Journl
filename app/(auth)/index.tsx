import "@/global.css"

import { View, Text } from "react-native"
import Button from "@/components/button"
import OnboardForAuth from "@/components/onboard-auth"

import { Link } from "expo-router"

export default function OnboardAuth() {
  return (
    <View className="w-screen h-screen gap-12 relative">
      <View
        className="flex-row justify-center items-center absolute left-1/2 -translate-x-1/2 top-[10%]"
        pointerEvents="none"
      >
        <Text className="text-white tracking-tight font-medium">Welcome to </Text>
        <Text className="text-[#58a76d] tracking-tight font-bold">Journl.</Text>
      </View>
      <View className="h-[65%]"><OnboardForAuth/></View>
      <View
        className="h-[35%] gap-4 px-8">
        <Link href="/(auth)/sign-in" asChild>
          <Button fontWeight="$6" letterSpacing={-0.2} width="100%">Sign in</Button>
        </Link>
        <Link href="/(auth)/register" asChild>
          <Button appearance="outline" fontWeight="$6" letterSpacing={-0.2} width="100%">Register</Button>
        </Link>
      </View>
    </View>
  )
}