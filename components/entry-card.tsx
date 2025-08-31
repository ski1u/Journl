import "@/global.css"

import React from "react"
import { View, Text, Image, ImageSourcePropType, Pressable, ActionSheetIOS, Platform, findNodeHandle } from "react-native"
import { Card, Popover } from "tamagui"
import { LinearGradient } from "expo-linear-gradient"

import { Tables } from "@/types/supabase"
import { formatDate } from "@/utils/date"

import { Plus, Ellipsis } from "lucide-react-native"

type Entry = Tables<"entries">

export default function EntryCard({ data }: {
    data: Entry
}) {
    const { title, body, image_paths, is_archived, created_at, updated_at } = data

    // ---

    const maxPreviewImages = 1
    const rawImagePaths = Array.isArray((data as any)?.image_paths)
        ? ((data as any).image_paths as unknown[])
        : []
    const images: ImageSourcePropType[] = rawImagePaths
        .slice(0, maxPreviewImages)
        .map((p) => (typeof p === "string" ? { uri: p } : (p as ImageSourcePropType)))
    const placeholdersCount = Math.max(0, maxPreviewImages - images.length)
    const editedLabel = formatDate(updated_at ?? created_at)

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
            padding={6}
            borderRadius={16}
            style={{ backgroundColor: "#222226" }}
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

                <View className="gap-4 px-3 pb-2">
                    <Text className="text-white font-semibold text-xl tracking-tight" numberOfLines={1}>{title}</Text>
                    <Text className="text-gray-200 text-base" numberOfLines={3}>{body}</Text>
                </View>

                <View
                    className="flex-row justify-between items-center border-t-[1px] border-[#888] px-3 py-2"
                >
                    <Text className="text-gray-400 text-sm font-medium tracking-tight">{editedLabel ?? ""}</Text>
                    <Pressable ref={ellipsisRef} onPress={onPressEllipsis} hitSlop={8}>
                        <Ellipsis color="#ccc" size={24} />
                    </Pressable>
                </View>
            </Card.Header>
        </Card>
    )
}