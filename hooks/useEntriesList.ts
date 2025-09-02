import React from "react"
import type { ListRenderItemInfo, ViewToken } from "react-native"
import { fetchEntriesForCurrentUser, fetchEntriesPage, getCachedEntries, type Entry } from "@/utils/entries"

export type UseEntriesListOptions = {
    pageSize?: number
    itemVisiblePercentThreshold?: number
    minimumViewTimeMs?: number
    visibilityBuffer?: number
    showArchived?: boolean
}

export function useEntriesList(options: UseEntriesListOptions = {}) {
    const pageSize = options.pageSize ?? 5
    const visibilityBuffer = Math.max(0, options.visibilityBuffer ?? 1)
    const itemVisiblePercentThreshold = options.itemVisiblePercentThreshold ?? 20
    const minimumViewTimeMs = options.minimumViewTimeMs ?? 80
    const showArchived = options.showArchived ?? false

    const [entries, setEntries] = React.useState<Entry[] | null>(getCachedEntries(showArchived))
    const [loading, setLoading] = React.useState<boolean>(!entries)
    const [error, setError] = React.useState<string | null>(null)

    const [visibleIds, setVisibleIds] = React.useState<Set<string>>(new Set())
    const [pageCount, setPageCount] = React.useState<number>(1)
    const [list, setList] = React.useState<Entry[]>([])
    const [loadingMore, setLoadingMore] = React.useState<boolean>(false)
    const [hasMore, setHasMore] = React.useState<boolean>(false)
    const heightsRef = React.useRef<Map<string, number>>(new Map())
    const [measureTick, setMeasureTick] = React.useState(0)

    // Reset to appropriate cache bucket when filter changes
    React.useEffect(() => {
        const cached = getCachedEntries(showArchived)
        setEntries(cached)
        setLoading(!cached)
        setError(null)
    }, [showArchived])

    // Fetch if nothing cached for the active filter
    React.useEffect(() => {
        let isMounted = true
        ;(async () => {
            if (entries) return
            const { entries: fetched, error } = await fetchEntriesForCurrentUser(false, showArchived)
            if (!isMounted) return
            if (error) {
                setError(error)
                setLoading(false)
                return
            }
            setEntries(fetched)
            setLoading(false)
        })()
        return () => { isMounted = false }
    }, [entries, showArchived])

    React.useEffect(() => {
        if (!entries) return
        setList(entries.slice(0, pageSize))
        setHasMore(entries.length > pageSize)
        setPageCount(1)
    }, [entries, pageSize])

    const onViewableItemsChanged = React.useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        const indices = viewableItems
            .map((vi) => (typeof vi.index === "number" ? vi.index : -1))
            .filter((i) => i >= 0)
        if (indices.length === 0) return
        const min = Math.max(0, Math.min(...indices) - visibilityBuffer)
        const max = Math.max(...indices) + visibilityBuffer
        const next = new Set<string>()
        for (let i = min; i <= max && i < list.length; i++) {
            const item = list[i]
            if (item?.id) next.add(item.id)
        }
        setVisibleIds(next)
    }, [list, visibilityBuffer])

    const viewabilityConfig = React.useMemo(() => ({ itemVisiblePercentThreshold, minimumViewTime: minimumViewTimeMs }), [itemVisiblePercentThreshold, minimumViewTimeMs])

    // Prefill visible ids for initial render to avoid flashing all skeletons
    React.useEffect(() => {
        if (list.length === 0) return
        const prefill = new Set<string>()
        const max = Math.min(list.length - 1, 0 + visibilityBuffer)
        for (let i = 0; i <= max; i++) {
            const item = list[i]
            if (item?.id) prefill.add(item.id)
        }
        setVisibleIds(prefill)
    }, [list, visibilityBuffer])

    const keyExtractor = React.useCallback((item: Entry, index?: number) => `${item.id}-${index ?? 0}` as string, [])

    const renderItemWithSkeleton = React.useCallback(
        (renderCard: (info: ListRenderItemInfo<Entry>) => React.ReactElement) =>
            ({ item, index }: ListRenderItemInfo<Entry>) => {
                const isVisible = visibleIds.has(item.id)
                return renderCard({ item, index, separators: undefined as any })
            },
        [visibleIds]
    )

    const loadMore = React.useCallback(async () => {
        if (loadingMore || !hasMore) return
        setLoadingMore(true)
        try {
            const nextOffset = pageCount * pageSize
            const { entries: next, error, hasMore: more } = await fetchEntriesPage({ limit: pageSize, offset: nextOffset, showArchived })
            if (!error) {
                setList((prev) => {
                    const seen = new Set(prev.map((e) => e.id))
                    const merged = [...prev]
                    next.forEach((row) => { if (!seen.has(row.id)) { merged.push(row); seen.add(row.id) } })
                    return merged
                })
                setPageCount((c) => c + 1)
                setHasMore(more)
            } else {
                setError(error)
            }
        } finally {
            setLoadingMore(false)
        }
    }, [loadingMore, hasMore, pageCount, pageSize, showArchived])

    const empty = !loading && (!!entries ? entries.length === 0 : true)

    const onItemLayout = React.useCallback((id: string, height: number) => {
        // Ignore absurd values to avoid runaway skeleton heights
        if (!Number.isFinite(height) || height <= 0 || height > 2000) return
        const prev = heightsRef.current.get(id)
        if (prev !== height) {
            heightsRef.current.set(id, height)
            setMeasureTick((t) => t + 1)
        }
    }, [])

    const getItemHeight = React.useCallback((id: string) => {
        const h = heightsRef.current.get(id)
        if (!Number.isFinite(h as number)) return 220
        const height = (h as number)
        // Clamp skeleton height into a sane range
        return Math.max(140, Math.min(height, 600))
    }, [])

    const hasItemMeasurement = React.useCallback((id: string) => {
        return heightsRef.current.has(id)
    }, [])

    return {
        // data & status
        entries,
        list,
        loading,
        loadingMore,
        error,
        empty,
        hasMore,
        // viewability
        visibleIds,
        onViewableItemsChanged,
        viewabilityConfig,
        keyExtractor,
        // paging
        loadMore,
        pageSize,
        // measurements
        onItemLayout,
        getItemHeight,
        hasItemMeasurement,
    }
}


