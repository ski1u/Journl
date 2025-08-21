import "@/global.css"

import { useState } from "react"
import { Pressable, View, Text } from "react-native"
import { AnimatePresence, MotiView } from "moti"

import Button from "./button"
import ProgressCircle from "./progression-circles"
import { Input } from "tamagui"
import Badge from "./badge"

import { useRouter } from "expo-router"
import { useForm, Controller } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod"

import { ArrowLeft, ArrowRight } from 'lucide-react-native'

import { onboardingQuestionsData as qData, onboardingQuestionsSchema as qSchema } from "@/assets/onboard"
import LoadingScreen from "./loading-screen"
import { onboardAction, checkUniqueHandle } from "@/utils/supabase/onboard"

const OnboardInput = ({ className, ...props } : {
    className?: string
} & React.ComponentProps<typeof Input>) => {
    return (
        <Input
            className={'shadow-none outline-none ring-0 border-0 border-b-2 rounded-none w-full' + (className ?? "")}
            autoCapitalize="none"
            autoCorrect={false}
            {...props}
        />
    )
}
const OnboardBadge = ({ checked, onCheckedChange, className, children, ...props } : {
    children: React.ReactNode
    checked: boolean
    onCheckedChange: () => void
    className?: string
} & React.ComponentProps<typeof Badge>) => {
    return (
        <Pressable onPress={onCheckedChange} className="w-full">
            <MotiView
                from={{ backgroundColor: 'rgba(0,0,0,0)' }}
                animate={{ backgroundColor: checked ? '#58a76d' : 'rgba(0,0,0,0)' }}
                transition={{ type: 'timing', duration: 125 }}
                style={{ borderRadius: 6 }}
            >
                <Badge
                    className={`border-[1px] border-[#333] py-4 px-3 rounded-md ` + (className ?? "")}
                    textClassName={checked ? "text-base text-white" : "text-base text-[#999]"}
                    textStyle={{ fontWeight: checked ? '600' as const : '400' as const }}
                    {...props}
                >
                    {children}
                </Badge>
            </MotiView>
        </Pressable>
    )
}
const OnboardArrow = ({ dir, func, className, size, ...props } : {
    dir: "left" | "right"
    className?: string
    size?: number
    func: () => Promise<void>
}) => {
    const arrowClassName = 'cursor-pointer transition duration-500 hover:-translate-y-[2px]'

    return dir === "left" ? (
        <Pressable onPress={func}>
            <ArrowLeft color='#999' size={size} className={(arrowClassName ?? "") + " mr-24 " + (className ?? "")} {...props} />
        </Pressable>
    ) : (
        <Pressable onPress={func}>
            <ArrowRight color='#999' size={size} className={(arrowClassName ?? "") + " ml-24 " + (className ?? "")} {...props} />
        </Pressable>
    )
}
const LastCTA = ({ handleStep, lastMessage } : {
    lastMessage: string
    handleStep: (action: "next" | "prev") => Promise<void>
}) => {
    return (
    <View className='flex items-center flex-col gap-4'>
        <Badge className='rounded-full w-fit' fullWidth={false}>You're all set.</Badge>
        <Text className='text-white text-center text-4xl font-semibold leading-tight md:w-2/3'>
            {lastMessage}
        </Text>

        <View className='flex-row items-center gap-8'>
            <OnboardArrow size={40} className='m-0' dir='left' func={() => handleStep("prev")} />
            <Button onPress={() => handleStep("next")}>Get Started</Button>
        </View>
    </View>
    )
}

const OnboardQuestions = () => {
    const [step, setStep] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof qSchema>>({
        resolver: zodResolver(qSchema),
        mode: "onTouched",
    })
    const router = useRouter()

    const onFinish = form.handleSubmit(async (data: z.infer<typeof qSchema>) => {
        setLoading(true)
        const result = await onboardAction(data)
        if (result?.success) { router.replace("/(drawer)" as any) }
        setLoading(false)
    })
    const handleStep = async (action: "next" | "prev") => {
        if (action === "prev") {
            if (step > 0) setStep((s) => s - 1)
            else {}
            return
        }

        if (step < qData.length) {
            const currentId = qData[step].id as keyof z.infer<typeof qSchema>
            
            // Checking for unique handles for validation
            if (currentId === 'handle') {
                const handleValue = form.getValues('handle')
                if (handleValue) {
                    const { isUnique, error } = await checkUniqueHandle(handleValue)
                    if (!isUnique) {
                        form.setError('handle', { 
                            type: 'manual', 
                            message: 'This handle is already taken. Please choose a different one.' 
                        })
                        return
                    }
                }
            }
            
            const valid = await form.trigger(currentId); if (!valid) return
            setStep((s) => s + 1)
        } else await onFinish()
    }

    const lastMessage = "Ready to get inspired or share your wisdom with the world?"
    
    return !loading ? (
    <View className='w-screen h-screen flex-col justify-center items-center px-8'>
        <ProgressCircle className='absolute top-24 shadow-lg' currentProgress={step} maximumProgress={qData.length} />
        <AnimatePresence exitBeforeEnter>
            <View style={{ position: 'relative', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <MotiView
                    key={String(step)}
                    from={{ opacity: 0, translateY: 25 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0, translateY: -25 }}
                    transition={{ type: "timing", duration: 500 }}
                    style={{ position: 'absolute', left: 0, right: 0, alignItems: 'center' }}
                >
                {step < qData.length ? (() => {
                    const { id, question, type, required, placeholder, options } = qData[step]
                    return (
                        <View
                            className="gap-2" // Question Label & Input Group & Error Message
                        >
                            <View
                                className="gap-8" // Question Label & Input
                            >
                                <Text className='text-white text-4xl font-semibold'>
                                    {question}
                                    {required && <Text className="text-red-400"> *</Text>}
                                </Text>

                                {type === "text" ? (
                                    id === "handle" ? (
                                        <View className='flex-row items-center w-full border-b-2 border-[#333]'>
                                            <Text className='text-[#999] text-lg'>@</Text>
                                            <Controller
                                                control={form.control}
                                                name={id as any}
                                                render={({ field }) => (
                                                    <OnboardInput
                                                        placeholder={placeholder}
                                                        key={`onboarding-input-${id}`}
                                                        onChangeText={field.onChange}
                                                        value={field.value ?? ""}
                                                        backgroundColor="$colorTransparent"
                                                        color="#fff"
                                                        borderWidth={0}
                                                        width="90%"
                                                    />
                                                )}
                                            />
                                        </View>
                                    ) : (
                                        <Controller
                                            control={form.control}
                                            name={id as any}
                                            render={({ field }) => (
                                                <OnboardInput
                                                    className='w-2/3'
                                                    placeholder={placeholder}
                                                    key={`onboarding-input-${id}`}
                                                    onChangeText={field.onChange}
                                                    value={field.value ?? ""}
                                                    backgroundColor="$colorTransparent"
                                                    color="#fff"
                                                    borderWidth={0}
                                                    borderBottomWidth={1}
                                                    borderRadius={0}
                                                    borderColor="#333"
                                                    width="90%"
                                                />
                                            )}
                                        />
                                    )
                                ) : type === "select" ? (
                                    <Controller
                                        control={form.control}
                                        name={id as any}
                                        defaultValue=""
                                        render={({ field }) => {
                                            const selectedValue = field.value as string
                                            return (
                                                <View className='flex-col gap-2 w-full'>
                                                    {options?.map((option, optionIndex) => {
                                                        const optionValue = typeof option === 'string'
                                                            ? option.split(" ").join("-").toLowerCase()
                                                            : option.value
                                                        const optionLabel = typeof option === 'string' ? option : option.option
                                                        const isChecked = selectedValue === optionValue
                                                        const selectOption = () => { field.onChange(optionValue) }
                                                        return (
                                                            <OnboardBadge
                                                                key={`onboarding-select-${optionIndex}`}
                                                                checked={isChecked}
                                                                onCheckedChange={selectOption}
                                                            >
                                                                <Text>{optionLabel}</Text>
                                                            </OnboardBadge>
                                                        )
                                                    })}
                                                </View>
                                            )
                                        }}
                                    />
                                ) : type === "multi-select" ? (
                                    <Controller
                                        control={form.control}
                                        name={id as any}
                                        defaultValue={[]}
                                        render={({ field }) => {
                                            const selectedValues = (field.value as string[]) ?? []
                                            return (
                                                <View className='flex-row flex-wrap gap-3'>
                                                    {options?.map((option, optionIndex) => {
                                                        const optionValue = typeof option === 'string'
                                                            ? option.split(" ").join("-").toLowerCase()
                                                            : option.value
                                                        const optionLabel = typeof option === 'string' ? option : option.option
                                                        const isChecked = selectedValues.includes(optionValue)
                                                        const toggleOption = () => {
                                                            const newValues = isChecked
                                                                ? selectedValues.filter((v) => v !== optionValue)
                                                                : [...selectedValues, optionValue]
                                                            field.onChange(newValues)
                                                        }
                                                        return (
                                                            <OnboardBadge
                                                                key={`onboarding-multiselect-${optionIndex}`}
                                                                checked={isChecked}
                                                                onCheckedChange={toggleOption}
                                                            >
                                                                <Text>{optionLabel}</Text>
                                                            </OnboardBadge>
                                                        )
                                                    })}
                                                </View>
                                            )
                                        }}
                                    />
                                ) : null}
                            </View>

                            {(() => {
                                const err: unknown = form.formState.errors[id as keyof z.infer<typeof qSchema>]
                                const message = (err as { message?: string } | undefined)?.message
                                return message ? (
                                    <Text className='text-red-400 mt-2'>{message}</Text>
                                ) : null
                            })()}
                        </View>
                    )
                })() : <LastCTA lastMessage={lastMessage} handleStep={handleStep} />}

                {(step < qData.length) && (
                    <View className={`flex-row w-full justify-between items-center
                    ${(qData[step].type === "select" || qData[step].type === "multi-select") ? "mt-8" : "mt-32"}`}>
                        <OnboardArrow size={32} dir='left' func={() => handleStep("prev")} />
                        <OnboardArrow size={32} dir='right' func={() => handleStep("next")} />
                    </View>
                )}
                </MotiView>
            </View>
        </AnimatePresence>
    </View>
  ) : <LoadingScreen/>
}

export default OnboardQuestions