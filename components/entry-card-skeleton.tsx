import "@/global.css"

import { View } from "react-native"
import { Card } from "tamagui"

export default function EntryCardSkeleton({ height }: { height?: number }) {
    const CARD_HEIGHT = height ?? 220
    return (
        <Card style={{ backgroundColor: "#222226", height: CARD_HEIGHT, padding: 18, gap: 16 }}>
            <Card backgroundColor="#333" width="80%" height="30%" />
            <View className="gap-2 w-full h-full">
                <Card backgroundColor="#444" width="70%" height="15%" />
                <Card backgroundColor="#444" width="50%" height="15%" />
            </View>
        </Card>
    )
}


