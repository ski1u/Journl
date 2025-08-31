export function formatEditedLabel(iso?: string | null): string | null {
    if (!iso) return null
    const updatedTime = new Date(iso).getTime()
    if (!Number.isFinite(updatedTime)) return null
    const diffMs = Date.now() - updatedTime
    if (diffMs < 0) return null

    const seconds = Math.floor(diffMs / 1000)
    if (seconds < 60) return `Edited ${seconds}s ago`

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `Edited ${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `Edited ${hours} ${hours === 1 ? "hr" : "hrs"} ago`

    const days = Math.floor(hours / 24)
    if (days < 30) return `Edited ${days} ${days === 1 ? "day" : "days"} ago`

    const months = Math.floor(days / 30)
    if (months < 12) return `Edited ${months} ${months === 1 ? "month" : "months"} ago`

    const years = Math.floor(months / 12)
    return `Edited ${years} ${years === 1 ? "year" : "years"} ago`
}

export function formatDate(iso?: string | null): string | null {
    if (!iso) return null
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return null

    const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ] as const

    const monthsAbbrev = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
    ] as const

    const weekday = weekdays[date.getDay()]
    const month = monthsAbbrev[date.getMonth()]
    const day = date.getDate()

    return `${weekday}, ${month} ${day}`
}