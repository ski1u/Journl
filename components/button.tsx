import "@/global.css"

import React, { forwardRef } from "react"

import { Button as TButton, ButtonProps as TButtonProps } from "tamagui"

type Appearance = "primary" | "outline"

export type AppButtonProps = TButtonProps & {
    appearance?: Appearance
}

const primaryDefaults: Partial<TButtonProps> = {
    backgroundColor: "#58a76d",
    color: "#fff",
    borderColor: "transparent",
    pressTheme: false,
}

const outlineDefaults: Partial<TButtonProps> = {
    variant: "outlined",
    borderColor: "#ddd",
    borderWidth: 1,
    color: "#ddd",
}

export default forwardRef<any, AppButtonProps>(function Button(
    { appearance = "primary", pressStyle, children, ...rest },
    ref
) {
    const baseDefaults = appearance === "primary" ? primaryDefaults : outlineDefaults

    const mergedPressStyle = {
        ...(appearance === "primary" ? { backgroundColor: "rgba(88,167,109,0.75)", borderWidth: 0, outlineColor: "transparent", outlineWidth: 0 } : {}),
        ...pressStyle,
    }

    return (
        <TButton
            ref={ref}
            {...baseDefaults}
            {...rest}
            pressStyle={mergedPressStyle}
        >
            {children}
        </TButton>
    )
})