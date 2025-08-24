import "@/global.css"

import { View } from "react-native"
import { Card } from "tamagui"

export default function EntryCardSkeleton({ height }: { height?: number }) {
    const CARD_HEIGHT = height ?? 220
    return (
        <Card style={{ backgroundColor: "#222", borderColor: "#444", borderWidth: 1, height: CARD_HEIGHT }}>
            <Card.Header style={{ gap: 12 }}>
                <View style={{ height: 28, width: 160, backgroundColor: "#333", borderRadius: 6 }} />
                <View style={{ flexDirection: "row", gap: 8 }}>
                    {[0, 1, 2, 3].map((i) => (
                        <View key={i} style={{ width: 80, height: 108, backgroundColor: "#333", borderRadius: 8, opacity: 0.5 }} />
                    ))}
                </View>
                <View style={{ height: 18, width: "80%", backgroundColor: "#333", borderRadius: 6 }} />
            </Card.Header>
        </Card>
    )
}


