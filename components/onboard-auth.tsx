import "@/global.css"

import { useRef, useState, useEffect } from "react"

import { FlatList, Text, View, Dimensions, NativeSyntheticEvent, NativeScrollEvent, useColorScheme } from "react-native"
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle } from "react-native-reanimated"
import Badge from "./badge"

import { onboardAuthData } from "@/assets/onboard"

const { width } = Dimensions.get("window")

export default function OnboardForAuth() {
    const [view, setView] = useState<number>(0)
    const flatListRef = useRef<FlatList>(null)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const scrollX = useSharedValue(0)
    const n = onboardAuthData.length
    const loopedData = n > 1 ? [onboardAuthData[n - 1], ...onboardAuthData, onboardAuthData[0]] : onboardAuthData

    // ---

    const scrollHandler = useAnimatedScrollHandler((event) => { scrollX.value = event.contentOffset.x })
    const stopAutoScroll = () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    const startAutoScroll = () => { stopAutoScroll(); intervalRef.current = setInterval(() => { goNext() }, 5000) }

    const goToSlide = (originalIndex: number) => {
        // map original index (0..n-1) to visible index (1..n) when looping
        const visibleIndex = n > 1 ? originalIndex + 1 : originalIndex
        ;(flatListRef.current as any)?.scrollToIndex({ index: visibleIndex, animated: true })
        setView(originalIndex)
    }
    const goNext = () => {
        if (n <= 1) return
        const nextOriginal = (view + 1) % n
        const targetVisible = view === n - 1 ? n + 1 : view + 2
        ;(flatListRef.current as any)?.scrollToIndex({ index: targetVisible, animated: true })
        setView(nextOriginal)
    }

    useEffect(() => { startAutoScroll(); return stopAutoScroll }, [view])

    const colorScheme = useColorScheme()
    const activeDotColor = colorScheme === "dark" ? "#fff" : "#000"
    const inactiveOpacity = 0.35

    const Dot = ({ index }: { index: number }) => {
        const animatedStyle = useAnimatedStyle(() => {
            const page = scrollX.value / width
            const center = (index + 1)
            const d1 = Math.abs(page - center)
            const d2 = Math.abs(page - (center + n))
            const d3 = Math.abs(page - (center - n))
            const d = Math.min(d1, d2, d3)
            const t = Math.max(0, 1 - Math.min(d, 1))
            const w = 8 + (18 - 8) * t
            const op = inactiveOpacity + (1 - inactiveOpacity) * t
            return { width: w, opacity: op }
        })

        return (
            <Animated.View
                style={[{ height: 8, borderRadius: 9999, marginHorizontal: 4, backgroundColor: activeDotColor, shadowColor: activeDotColor, shadowOpacity: 25, shadowOffset: { width: 0, height: 0 }, shadowRadius: 1.25 }, animatedStyle]}
            />
        )
    }

    return (
        <View
          className="gap-8 h-full"
        >
            <Animated.FlatList
                ref={flatListRef}
                data={loopedData}
                keyExtractor={(_, i) => i.toString()}
                horizontal
                pagingEnabled
                snapToInterval={width}
                decelerationRate="fast"
                onScroll={scrollHandler}
                onScrollBeginDrag={stopAutoScroll}
                onMomentumScrollEnd={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                    startAutoScroll()
                    if (n <= 1) return
                    const visibleIndex = Math.round(e.nativeEvent.contentOffset.x / width)
                    if (visibleIndex === 0) {
                        ;(flatListRef.current as any)?.scrollToIndex({ index: n, animated: false })
                        setView(n - 1)
                        return
                    }
                    if (visibleIndex === n + 1) {
                        ;(flatListRef.current as any)?.scrollToIndex({ index: 1, animated: false })
                        setView(0)
                        return
                    }
                    setView(visibleIndex - 1)
                }}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                initialScrollIndex={n > 1 ? 1 : 0}
                getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
                renderItem={({ item }) => (
                <View style={{ width }} className="flex-col justify-end gap-2 px-8 overflow-hidden">
                    <View style={{ width: "100%", height: 200, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
                        <item.image width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
                    </View>
                    <Badge fullWidth={false}>{item.tag}</Badge>
                    <Text className="text-white text-3xl font-bold tracking-tighter">{item.title}</Text>
                    <Text className="text-[#ddd] text-sm">{item.desc}</Text>
                  </View>
                )}
            />
            <View style={{ width }}>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 }}>
                    {onboardAuthData.map((_, index) => (
                        <Dot key={index} index={index} />
                    ))}
                </View>
            </View>
        </View>
    )
}