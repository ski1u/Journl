import "@/global.css"

import { View } from "react-native"
import { Button } from "tamagui"
import OnboardForAuth from "@/components/onboard-auth"

import { Link } from "expo-router"

export default function OnboardAuth() {
  return (
    <View className="w-screen h-screen gap-24">
      <View className="h-[65%]"><OnboardForAuth/></View>
      <View
        className="h-[35%] gap-4 px-8">
        <Link href="/(auth)/sign-in" asChild>
          <Button
            backgroundColor="#58a76d"
            color="#fff"
            fontWeight="$600"
            letterSpacing={-0.2}
            width="100%"
          >Sign in</Button>
        </Link>
        <Link href="/(auth)/register" asChild>
          <Button
            variant="outlined"
            borderColor="#ddd"
            borderWidth={1}
            color="#ddd"
            fontWeight="$600"
            letterSpacing={-0.2}
            width="100%"
          >Register</Button>
        </Link>
      </View>
    </View>
  )
}