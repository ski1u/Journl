import "@/global.css"

import React from "react"
import { View, Text, Image, ImageSourcePropType, Pressable, ActionSheetIOS, Platform, findNodeHandle } from "react-native"
import { Card } from "tamagui"

import { Tables } from "@/types/supabase"
import { formatEditedLabel } from "@/utils/date"

import { Plus, Ellipsis } from "lucide-react-native"

type Entry = Tables<"entries">

export default function EntryCard({ data }: {
    data: Entry
}) {
    const { title, body, image_paths, is_archived, created_at, updated_at } = data

    // ---

    const rawImagePaths = Array.isArray((data as any)?.image_paths)
        ? ((data as any).image_paths as unknown[])
        : []
    const images: ImageSourcePropType[] = rawImagePaths
        .slice(0, 4)
        .map((p) => (typeof p === "string" ? { uri: p } : (p as ImageSourcePropType)))
    const placeholdersCount = Math.max(0, 4 - images.length)
    const editedLabel = formatEditedLabel(updated_at ?? created_at)

    const ellipsisRef = React.useRef<View>(null)

    const onPressEllipsis = () => {
        if (Platform.OS !== "ios") return
        const anchor = findNodeHandle(ellipsisRef.current) ?? undefined
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ["Cancel", is_archived ? "Unarchive" : "Archive", "Delete"],
                cancelButtonIndex: 0,
                destructiveButtonIndex: 2,
                anchor,
                userInterfaceStyle: "dark",
            },
            (buttonIndex) => {
                if (buttonIndex === 1) { // handle archive/unarchive

                } else if (buttonIndex === 2) { // handle delete
                    
                }
            }
        )
    }

    return (
        <Card
            style={{ backgroundColor: "#222", borderColor: "#444", borderWidth: 1 }}
        >
            <Card.Header
                style={{ gap: 12 }}
            >
                <View
                    className="gap-2"
                >
                    <Text className="text-white font-bold text-3xl tracking-tight" numberOfLines={1}>{title}</Text>
                    <View
                        className="flex-row justify-between"
                    >
                        {images.map((source, index) => (
                            <Image
                                source={source}
                                style={{ width: 80, height: 108 }}
                                resizeMode="cover"
                                key={`entry-image-${index}`}
                            />
                        ))}
                        {placeholdersCount > 0 &&
                            Array.from({ length: placeholdersCount }).map((_, index) => (
                                <Card
                                    style={{
                                        width: 80, height: 108,
                                        backgroundColor: "#444",
                                        opacity: Math.max(0.2, 0.8 - index * 0.2),
                                        flexDirection: "column", justifyContent: "center", alignItems: "center"
                                    }}
                                    key={`entry-placeholder-image-${index}`}
                                >{index === 0 && <Plus color="#ddd" size={32} />}</Card>
                            ))}
                    </View>
                </View>

                <Text className="text-gray-400" numberOfLines={2}>{body}</Text>

                <View
                    className="flex-row justify-between items-center"
                >
                    <Text className="text-[#ddd]">{editedLabel ?? ""}</Text>
                    <Pressable ref={ellipsisRef} onPress={onPressEllipsis} hitSlop={8}>
                        <Ellipsis color="#ddd" size={24} />
                    </Pressable>
                </View>
            </Card.Header>
        </Card>
    )
}