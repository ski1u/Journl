import "@/global.css"

import React from "react"

import { View, Text } from "react-native"

export default function Badge({ children, className, textClassName } : {
    children: React.ReactNode
    className?: string
    textClassName?: string
}) {
    return (
        <View
            className={"rounded-full border-[#eee] border-[1px] self-start px-3 py-1 " + (className ?? "")}
        >
            <Text
                className={"text-[#eee] w-fit text-xs" + (textClassName ?? "")}
            >{children}</Text>
        </View>
    )
}