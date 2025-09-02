import "@/global.css"

import React from "react"
import { ActivityIndicator, Text, View, FlatList, ListRenderItemInfo, Pressable, useWindowDimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import MaskedView from "@react-native-masked-view/masked-view"
import EntryCard from "@/components/entry-card"
import EntryCardSkeleton from "@/components/entry-card-skeleton"
import CreateEntryFloatingButton from "@/components/floating-create-entry-button"
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet"

import { type Entry } from "@/utils/entries"
import { useEntriesList } from "@/hooks/useEntriesList"

import { formatDate } from "@/utils/date"

import { Bookmark } from "lucide-react-native"

export default function Journals() {
    const sheetRef = React.useRef<any>(null)
    const { height: windowHeight } = useWindowDimensions()
    const scrollRef = React.useRef<any>(null)
    const inputRef = React.useRef<any>(null)
    const [entryText, setEntryText] = React.useState("")

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

    if (loading) { return <View className="flex-1 items-center justify-center"><ActivityIndicator /></View> }

    if (empty) {
        return (
            <View className="flex-1 items-center justify-center px-8 gap-1">
                <Text className="text-white text-2xl font-semibold">Start Journaling.</Text>
                <Text numberOfLines={3} className="text-gray-400 w-[60%] text-center">Experience doucmenting the small moments in life.</Text>
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
            <MaskedView
                pointerEvents="none"
                style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 250 }}
                maskElement={
                    <LinearGradient
                        colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)"]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={{ flex: 1 }}
                    />
                }
            >
                <BlurView intensity={5} tint="dark" style={{ flex: 1 }} />
            </MaskedView>

            <LinearGradient
                pointerEvents="none"
                colors={["rgba(18,18,20,0)", "rgba(18,18,20,0.3)", "rgba(18,18,20,0.5)", "#1C1C1E"]}
                locations={[0, 0.5, 0.85, 1]}
                style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 250 }}
            />

            <View style={{ position: "absolute", right: 32, bottom: 40 }}>
                <CreateEntryFloatingButton onPress={() => {
                    sheetRef.current?.snapToIndex?.(0)
                }} />
            </View>

            <BottomSheet
                ref={sheetRef}
                snapPoints={["92%"]}
                topInset={Math.round(windowHeight * (1 - 0.92))}
                enablePanDownToClose
                enableDynamicSizing={false}
                enableContentPanningGesture={false}
                index={-1}
                keyboardBehavior="interactive"
                android_keyboardInputMode="adjustPan"
                keyboardBlurBehavior="restore"
                backdropComponent={(props) => (
                    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
                )}
                backgroundStyle={{ backgroundColor: "#222" }}
                handleIndicatorStyle={{ backgroundColor: "#ddd" }}
                onChange={(idx) => { if (idx === 0) setTimeout(() => inputRef.current?.focus?.(), 80) }}
            >
                <BottomSheetScrollView
                    ref={scrollRef}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48, gap: 20 }}
                    keyboardShouldPersistTaps="handled"
                    maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
                >
                    <View
                        className="w-full flex-row justify-between items-center"
                    >
                        <Pressable
                            onPress={() => {}}
                        ><Bookmark color="#58a76d" /></Pressable>
                        <Text className="text-lg font-semibold text-white tracking-tight">{formatDate(new Date().toISOString())}</Text>
                        <Pressable
                            onPress={() => {}}
                        ><Text className="text-[#58a76d] text-lg font-medium">Done</Text></Pressable>
                    </View>

                    <BottomSheetTextInput
                        ref={inputRef}
                        value={entryText}
                        onChangeText={(t) => {
                            setEntryText(t)
                            requestAnimationFrame(() => scrollRef.current?.scrollToEnd?.({ animated: true }))
                        }}
                        placeholder="Start writing your journal..."
                        placeholderTextColor="#888"
                        multiline
                        onContentSizeChange={() => {
                            requestAnimationFrame(() => scrollRef.current?.scrollToEnd?.({ animated: true }))
                        }}
                        onFocus={() => scrollRef.current?.scrollToEnd?.({ animated: true })}
                        textAlignVertical="top"
                        style={{
                            color: "#eee",
                            fontSize: 16,
                            lineHeight: 20,
                            backgroundColor: "transparent",
                            minHeight: 140
                        }}
                    />
                </BottomSheetScrollView>
            </BottomSheet>
        </View>
    )
}