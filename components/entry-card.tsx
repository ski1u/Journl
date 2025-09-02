import "@/global.css"

import React from "react"
import { View, Text, Image, ImageSourcePropType, Pressable, Platform, ActionSheetIOS, Alert } from "react-native"
import { Card } from "tamagui"

import { Tables } from "@/types/supabase"
import { formatDate } from "@/utils/date"

import { Ellipsis } from "lucide-react-native"

type Entry = Tables<"entries">

export default function EntryCard({ data }: {
    data: Entry
}) {
    const { id, title, body, image_paths, is_archived, created_at, updated_at } = data

    // ---

    const maxPreviewImages = 1
    const rawImagePaths = Array.isArray((data as any)?.image_paths)
        ? ((data as any).image_paths as unknown[])
        : []
    const images: ImageSourcePropType[] = rawImagePaths
        .slice(0, maxPreviewImages)
        .map((p) => (typeof p === "string" ? { uri: p } : (p as ImageSourcePropType)))
    const placeholdersCount = Math.max(0, maxPreviewImages - images.length)
    const when = formatDate(updated_at ?? created_at)

    const handleMenuPress = (title: string, id: string) => {
        const titleLabel = title.length >= 20 ? title.slice(0, 18) + "..." : title
        const archiveLabel = (is_archived ? "Unarchive" : "Archive")
        if (Platform.OS === "ios") {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: [archiveLabel, `Delete "${titleLabel}"`, "Cancel"],
                    cancelButtonIndex: 2,
                    destructiveButtonIndex: 1,
                    userInterfaceStyle: "dark",
                },
                (buttonIndex) => {
                    if (buttonIndex === 0) {
                        // toggle archive
                    } else if (buttonIndex === 1) {
                        // delete
                    }
                }
            )
        } // else -> implement andriod
    }

    const [isLongPressActive, setIsLongPressActive] = React.useState(false)

    return (
        <Pressable
            delayLongPress={250}
            onLongPress={() => setIsLongPressActive(true)}
            onPressOut={() => setIsLongPressActive(false)}
        >
            <Card
                padding={6}
                borderRadius={16}
                style={[{ backgroundColor: "#222226" }, isLongPressActive && { opacity: 0.75 }]}
            >
            <Card.Header
                padding={0}
                style={{ gap: 8 }}
            >
                <View
                    className="gap-2"
                >
                    <View
                        className="flex-row justify-evenly gap-4"
                    >
                        {images.map((source, index) => (
                            <Image
                                source={source}
                                style={{ width: 80, height: 108 }}
                                resizeMode="cover"
                                key={`entry-image-${index}`}
                            />
                        ))}
{/*                         {placeholdersCount > 0 &&
                            Array.from({ length: placeholdersCount }).map((_, index) => (
                                <Card
                                    style={{
                                        width: "100%", height: 176,
                                        overflow: "hidden",
                                        flexDirection: "column", justifyContent: "center", alignItems: "center",
                                    }}
                                    borderRadius={14}
                                    key={`entry-placeholder-image-${index}`}
                                >
                                    <LinearGradient
                                        colors={["#333", "#000"]}
                                        style={{
                                            position: "absolute",
                                            top: 0, left: 0, right: 0, bottom: 0,
                                            opacity: Math.max(0.2, 0.8 - index * 0.2),
                                        }}
                                    />
                                    {index === 0 && <Plus color="#ddd" size={28} />}
                                </Card>
                            ))} */}
                    </View>
                </View>

                <View className="gap-3 px-3 pb-2">
                    <Text className="text-white font-semibold text-xl tracking-tight" numberOfLines={1}>{title}</Text>
                    <Text className="text-gray-200 text-base" numberOfLines={3}>{body}</Text>
                </View>

                <View
                    className="flex-row justify-between items-center border-t-[1px] border-[#888] px-3 py-1"
                >
                    <Text className="text-gray-400 text-sm font-medium tracking-tight">{when ?? ""}</Text>
                    <Pressable hitSlop={8} onPress={() => handleMenuPress(title!, id)}>
                        <Ellipsis color="#ccc" size={24} />
                    </Pressable>
                </View>
            </Card.Header>
            </Card>
        </Pressable>
    )
}