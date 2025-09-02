import { supabase } from "./supabase/client"
import type { Tables } from "@/types/supabase"

export type Entry = Tables<"entries">

// Maintain cache per archived filter to avoid mixing datasets
type CacheBucket = { entries: Entry[] | null; isLoaded: boolean }
const cache: Record<"true" | "false", CacheBucket> = {
    true: { entries: null, isLoaded: false },
    false: { entries: null, isLoaded: false },
}

export async function fetchEntriesForCurrentUser(force = false, archived = false): Promise<{ entries: Entry[]; error: string | null }> {
    const bucketKey = archived ? "true" : "false"
    const bucket = cache[bucketKey]
    if (bucket.isLoaded && bucket.entries && !force) { return { entries: bucket.entries, error: null } }

    const { data: userResult, error: userError } = await supabase.auth.getUser()
    if (userError || !userResult?.user?.id) { return { entries: [], error: userError?.message ?? "No user found" } }

    const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", userResult.user.id)
        .eq("is_archived", archived)
        .order("updated_at", { ascending: false, nullsFirst: false })
    if (error) { return { entries: [], error: error.message } }

    cache[bucketKey].entries = (data as unknown as Entry[]) ?? []
    cache[bucketKey].isLoaded = true
    return { entries: cache[bucketKey].entries!, error: null }
}

export function getCachedEntries(archived: boolean): Entry[] | null {
    return cache[archived ? "true" : "false"].entries
}
export function setCachedEntries(entries: Entry[], archived: boolean): void {
    const key = archived ? "true" : "false"
    cache[key].entries = entries
    cache[key].isLoaded = true
}


// Paging helpers
export type PagedEntries = { entries: Entry[]; error: string | null; hasMore: boolean }

export async function fetchEntriesPage(params: { limit: number; offset: number; showArchived: boolean }): Promise<PagedEntries> {
    const { limit, offset, showArchived } = params
    const { data: userResult, error: userError } = await supabase.auth.getUser()
    if (userError || !userResult?.user?.id) { return { entries: [], error: userError?.message ?? "No user found", hasMore: false } }

    const { data, error, count } = await supabase
        .from("entries")
        .select("*", { count: "exact" })
        .eq("user_id", userResult.user.id)
        .eq("is_archived", showArchived)
        .order("updated_at", { ascending: false, nullsFirst: false })
        .range(offset, offset + limit - 1)

    if (error) { return { entries: [], error: error.message, hasMore: false } }

    const rows = (data as unknown as Entry[]) ?? []
    const total = typeof count === "number" ? count : rows.length
    const hasMore = offset + rows.length < total

    // update cache progressively for the active filter bucket
    const bucketKey = showArchived ? "true" : "false"
    const existing = cache[bucketKey].entries ?? []
    const merged = [...existing]
    rows.forEach((row) => {
        const idx = merged.findIndex((e) => e.id === row.id)
        if (idx >= 0) merged[idx] = row
        else merged.push(row)
    })
    cache[bucketKey].entries = merged
    cache[bucketKey].isLoaded = true
    return { entries: rows, error: null, hasMore }
}


