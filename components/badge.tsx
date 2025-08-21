import "@/global.css"

import React from "react"

import { View, Text, TextStyle, ViewStyle } from "react-native"

export default function Badge({ children, className, textClassName, textStyle, fullWidth = true, ...rest } : {
    children: React.ReactNode
    className?: string
    textClassName?: string
    textStyle?: TextStyle
    fullWidth?: boolean
} & React.ComponentProps<typeof View>) {
    const incomingStyle = (rest as any)?.style as ViewStyle | ViewStyle[] | undefined
    const mergedContainerStyle = Array.isArray(incomingStyle)
        ? [{ alignSelf: fullWidth ? 'stretch' : 'auto' } as ViewStyle, ...incomingStyle]
        : [{ alignSelf: fullWidth ? 'stretch' : 'auto' } as ViewStyle, incomingStyle].filter(Boolean)

    return (
        <View
            className={"rounded-full border-[#eee] border-[1px] px-3 py-1 " + (className ?? "")}
            style={mergedContainerStyle as any}
            {...rest}
        >
            <Text
                className={"text-[#eee] text-xs " + (textClassName ?? "")}
                style={textStyle}
            >{children}</Text>
        </View>
    )
}