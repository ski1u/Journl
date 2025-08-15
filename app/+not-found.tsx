import "@/global.css"

import { Text, View } from "react-native"

export default function NotFound() {
    return (
        <>
            <View className="flex-1 justify-center items-center gap-4">
                <Text className="text-semibold text-4xl tracking-tighter">
                    Uh oh! Page not found.
                </Text>
            </View>
        </>
    )
}