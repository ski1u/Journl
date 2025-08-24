import { supabase } from "./supabase/client"
import type { Tables } from "@/types/supabase"

export type Entry = Tables<"entries">

let cachedEntries: Entry[] | null = null
let isLoaded = false

export async function fetchEntriesForCurrentUser(force = false): Promise<{ entries: Entry[]; error: string | null }> {
    if (isLoaded && cachedEntries && !force) { return { entries: cachedEntries, error: null } }

    const { data: userResult, error: userError } = await supabase.auth.getUser()
    if (userError || !userResult?.user?.id) { return { entries: [], error: userError?.message ?? "No user found" } }

    const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("user_id", userResult.user.id)
        .order("updated_at", { ascending: false, nullsFirst: false })
    if (error) { return { entries: [], error: error.message } }

    cachedEntries = (data as unknown as Entry[]) ?? []
    isLoaded = true
    return { entries: cachedEntries, error: null }
}

export function getCachedEntries(): Entry[] | null { return cachedEntries }
export function setCachedEntries(entries: Entry[]): void { cachedEntries = entries; isLoaded = true }


// Paging helpers
export type PagedEntries = { entries: Entry[]; error: string | null; hasMore: boolean }

export async function fetchEntriesPage(params: { limit: number; offset: number }): Promise<PagedEntries> {
    const { limit, offset } = params
    const { data: userResult, error: userError } = await supabase.auth.getUser()
    if (userError || !userResult?.user?.id) { return { entries: [], error: userError?.message ?? "No user found", hasMore: false } }

    const { data, error, count } = await supabase
        .from("entries")
        .select("*", { count: "exact" })
        .eq("user_id", userResult.user.id)
        .order("updated_at", { ascending: false, nullsFirst: false })
        .range(offset, offset + limit - 1)

    if (error) { return { entries: [], error: error.message, hasMore: false } }

    const rows = (data as unknown as Entry[]) ?? []
    const total = typeof count === "number" ? count : rows.length
    const hasMore = offset + rows.length < total

    // update cache progressively
    if (!cachedEntries) cachedEntries = []
    const merged = [...(cachedEntries ?? [])]
    rows.forEach((row) => {
        const idx = merged.findIndex((e) => e.id === row.id)
        if (idx >= 0) merged[idx] = row
        else merged.push(row)
    })
    cachedEntries = merged
    isLoaded = true
    return { entries: rows, error: null, hasMore }
}


