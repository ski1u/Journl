import "@/global.css"

import React from "react"

import { ActivityIndicator, Text, View, FlatList, ListRenderItemInfo } from "react-native"
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
                <Text className="text-white text-lg">No entries for right now... try creating some!</Text>
            </View>
        )
    }

    const renderItem = ({ item }: ListRenderItemInfo<Entry>) => {
        const isVisible = visibleIds.has(item.id)
        const measuredHeight = getItemHeight(item.id)
        const measured = hasItemMeasurement(item.id)
        return (
            <View
                style={{ paddingHorizontal: 32, paddingVertical: 8 }}
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
            className="pt-16"
        >
            <FlatList
                data={list}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                onEndReached={loadMore}
                onEndReachedThreshold={0.4}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                // Omit getItemLayout to allow variable heights; we keep scroll stable by matching skeleton height to measured card height
                ListFooterComponent={loadingMore ? (
                    <View style={{ paddingVertical: 16 }}>
                        <ActivityIndicator />
                    </View>
                ) : null}
            />
        </View>
    )
}