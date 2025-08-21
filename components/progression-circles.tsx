import React from "react"
import { View } from "react-native"

interface ProgressCircleProps {
    currentProgress: number
    maximumProgress: number
    circleSize?: number
    className?: string
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
    currentProgress,
    maximumProgress,
    circleSize,
    className,
}) => {
    const dotSize = circleSize ?? 8

    return (
        <View className={("flex-row p-2 rounded-xl bg-gray-100 ") + (className ?? "")}> 
            {Array.from({ length: maximumProgress }).map((_, index) => (
                <View
                    key={index}
                    className={(currentProgress >= index ? "bg-black" : "bg-gray-300") + " opacity-75 rounded-full"}
                    style={{
                        width: dotSize,
                        height: dotSize,
                        marginRight: index === maximumProgress - 1 ? 0 : 8,
                    }}
                />
            ))}
        </View>
    )
}

export default ProgressCircle