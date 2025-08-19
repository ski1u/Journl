import "@/global.css"

import { useState } from "react"

import { View, Text } from "react-native"

import { z } from "zod"

export default function OnboardQuestions() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-white text-2xl">Onboarding Questions</Text>
    </View>
  )
}