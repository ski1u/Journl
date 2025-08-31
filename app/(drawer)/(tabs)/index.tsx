import "@/global.css"

import { ActivityIndicator, Text, View, FlatList, ListRenderItemInfo } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import EntryCard from "@/components/entry-card"
import EntryCardSkeleton from "@/components/entry-card-skeleton"
import { type Entry } from "@/utils/entries"
import { useEntriesList } from "@/hooks/useEntriesList"

export default function Index() {
    const {
        entries,
        list,
        loading,
        loadingMore,
        error,
        empty,
        hasMore,
        visibleIds,
        onViewableItemsChanged,
        viewabilityConfig,
        keyExtractor,
        loadMore,
        pageSize,
        onItemLayout,
        getItemHeight,
        hasItemMeasurement,
    } = useEntriesList({ pageSize: 5, itemVisiblePercentThreshold: 50, visibilityBuffer: 2 })

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </View>
        )
    }

    if (empty) {
        return (
            <View className="flex-1 items-center justify-center px-8">
                <Text className="text-white text-lg">Start Journaling</Text>
                <Text>abc</Text>
            </View>
        )
    }

    const renderItem = ({ item }: ListRenderItemInfo<Entry>) => {
        const isVisible = visibleIds.has(item.id)
        const measuredHeight = getItemHeight(item.id)
        const measured = hasItemMeasurement(item.id)
        return (
            <View
                className="my-4"
                onLayout={(e) => { if (isVisible) onItemLayout(item.id, e.nativeEvent.layout.height) }}
            >
                {isVisible || !measured ? (
                    <EntryCard data={item as any} />
                ) : (
                    <EntryCardSkeleton height={measuredHeight} />
                )}
            </View>
        )
    }

    return (
        <View
            className="flex-1 pt-24 px-8"
            style={{ position: "relative" }}
        >
            <FlatList
                data={list}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                onEndReached={loadMore}
                onEndReachedThreshold={0.4}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                contentContainerStyle={{ paddingBottom: 72 }}
                // Omit getItemLayout to allow variable heights; we keep scroll stable by matching skeleton height to measured card height
                ListFooterComponent={loadingMore ? (
                    <View style={{ paddingVertical: 16 }}>
                        <ActivityIndicator />
                    </View>
                ) : null}
            />
            <BlurView intensity={10} tint="dark" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 75, opacity: 0.4 }} />
            <LinearGradient
                pointerEvents="none"
                colors={["rgba(18,18,20,0)", "rgba(18,18,20,0.3)", "rgba(18,18,20,0.5)", "#1C1C1E"]}
                locations={[0, 0.5, 1]}
                style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 75 }}
            />
        </View>
    )
}