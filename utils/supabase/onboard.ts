import { supabase } from "./client"

import { onboardingQuestionsSchema } from "@/assets/onboard"
import { z } from "zod"

export const onboardAction = async (data: z.infer<typeof onboardingQuestionsSchema>) => {
    const { data: userResult, error: userError } = await supabase.auth.getUser()
    if (userError || !userResult?.user?.id) {  return { success: false, error: userError?.message ?? "No user found" } }

    const { reason, ...rest } = (data as any) ?? {}
    const reasonString: string | null = Array.isArray(reason)
        ? reason.join(",")
        : reason ?? null

    const { error } = await supabase
        .from("profiles")
        .update({
            ...rest,
            onboarded: true,
            reason: reasonString,
        })
        .eq("id", userResult.user.id)

    if (error) return { success: false, error: error.message }
    return { success: true as const }
}

export const checkUniqueHandle = async (handle: string) => {
    const { data, error } = await supabase
        .from("profiles")
        .select("handle")
        .eq("handle", handle)
        .maybeSingle()

    if (error && (error as any)?.code !== "PGRST116") { return { isUnique: false, error: "Failed to check handle uniqueness" } }
    return { isUnique: !data, error: null as string | null }
}
