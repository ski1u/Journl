import "@/global.css"

import { View } from "react-native"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import Button from "./button"

import { Plus } from "lucide-react-native"

export default function CreateEntryFloatingButton({ onPress }: { onPress?: () => void }) {
    return (
        <View
            style={{
                position: "relative",
                borderRadius: 999,
                overflow: "hidden",
                elevation: 8,
            }}
        >
            <BlurView
                intensity={15}
                tint="dark"
                style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
                pointerEvents="none"
            />
            <LinearGradient
                colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,0.1)"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
                pointerEvents="none"
            />
            <View
                style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}
                pointerEvents="none"
            />
            <Button
                appearance="outline"
                backgroundColor="transparent"
                borderWidth={0}
                borderColor="transparent"
                borderRadius={999}
                width="auto"
                height="auto"
                padding={16}
                pressStyle={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                onPress={onPress}
            >
                <Plus color="#58a76d" size={32} />
            </Button>
        </View>
    )
}