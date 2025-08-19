import "@/global.css"

import { Text, View } from "react-native"
import { Link } from "expo-router"
import Button from "@/components/button"

export default function NotFound() {
    return (
        <>
            <View className="flex-1 justify-center items-center gap-6">
                <Text className="font-semibold text-3xl tracking-tighter text-white">
                    Uh oh! Page not found.
                </Text>

                <Link href="/(drawer)/(tabs)/index">
                <Button
                >Go back home</Button></Link>
            </View>
        </>
    )
}