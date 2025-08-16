import "@/global.css"

import { useRef, useState, useEffect } from "react"

import { FlatList, Text, View, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native"
import Badge from "./badge"
import { Image } from "tamagui"

import { onboardAuthData } from "@/assets/onboard"

const { width } = Dimensions.get("window")

export default function OnboardForAuth() {
    const [view, setView] = useState<number>(0)
    const flatListRef = useRef<FlatList>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    // ---

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => { const index = Math.round(e.nativeEvent.contentOffset.x / width); setView(index) }
    const stopAutoScroll = () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    const startAutoScroll = () => { stopAutoScroll(); intervalRef.current = setInterval(() => { goNext() }, 5000) }

    const goToSlide = (index: number) => { flatListRef.current?.scrollToIndex({ index, animated: true }); setView(index) }
    const goNext = () => {
        const nextIndex = (view + 1) % onboardAuthData.length
        goToSlide(nextIndex)
      }

      useEffect(() => {
        startAutoScroll()
        return stopAutoScroll
      }, [view])

    return (
        <FlatList
            ref={flatListRef}
            data={onboardAuthData}
            keyExtractor={(_, i) => i.toString()}
            horizontal
            pagingEnabled
            snapToInterval={width}
            decelerationRate="fast"
            onScroll={handleScroll}
            onScrollBeginDrag={stopAutoScroll}
            onMomentumScrollEnd={startAutoScroll}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
            <View style={{ width }} className="flex-col justify-end gap-2 px-8">
                <Badge>{item.tag}</Badge>
                <Text className="text-white text-3xl font-bold tracking-tighter">{item.title}</Text>
                <Text className="text-[#ddd] text-xs">{item.desc}</Text>
                <item.Image />
              </View>
            )}
        />
    )
}