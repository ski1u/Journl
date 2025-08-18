import "@/global.css"

import { useRef, useState, useEffect } from "react"

import { FlatList, Text, View, Dimensions, NativeSyntheticEvent, NativeScrollEvent, useColorScheme } from "react-native"
import { MotiView } from "moti"
import Badge from "./badge"

import { onboardAuthData } from "@/assets/onboard"

const { width } = Dimensions.get("window")

export default function OnboardForAuth() {
    const [view, setView] = useState<number>(0)
    const flatListRef = useRef<FlatList>(null)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

    const colorScheme = useColorScheme()
    const activeDotColor = colorScheme === "dark" ? "#fff" : "#000"
    const inactiveOpacity = 0.35

    return (
        <View
          className="gap-8 h-full"
        >
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
                <View style={{ width }} className="flex-col justify-end gap-2 px-8 overflow-hidden">
                    <View style={{ width: "100%", height: 200, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
                        <item.image width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
                    </View>
                    <Badge>{item.tag}</Badge>
                    <Text className="text-white text-3xl font-bold tracking-tighter">{item.title}</Text>
                    <Text className="text-[#ddd] text-xs">{item.desc}</Text>
                  </View>
                )}
            />
            <View style={{ width }}>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 }}>
                    {onboardAuthData.map((_, index) => {
                        const isActive = index === view

                        return (
                            <MotiView
                                key={index}
                                from={{ width: isActive ? 8 : 18, opacity: isActive ? 0.6 : inactiveOpacity }}
                                animate={{ width: isActive ? 18 : 8, opacity: isActive ? 1 : inactiveOpacity, backgroundColor: activeDotColor }}
                                transition={{ type: "timing", duration: 250 }}
                                style={{ height: 8, borderRadius: 9999, marginHorizontal: 4, backgroundColor: activeDotColor }}
                            />
                        )
                    })}
                </View>
            </View>
        </View>
    )
}