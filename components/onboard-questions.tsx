import "@/global.css"

import { useState } from "react"
import { Pressable, View, Text } from "react-native"
import { AnimatePresence, MotiView } from "moti"
import * as Haptics from 'expo-haptics'

import Button from "./button"
import ProgressCircle from "./progression-circles"
import { Input } from "tamagui"
import Badge from "./badge"

import { useRouter } from "expo-router"
import { useForm, Controller } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod"

import { ArrowLeft, ArrowRight } from 'lucide-react-native'

import { onboardingQuestionsData as qData, onboardingQuestionsSchema as qSchema, onboardingQuestionsFeatures as qFeatures } from "@/assets/onboard"
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
                animate={{ backgroundColor: checked ? '#58a76d50' : 'rgba(0,0,0,0)' }}
                transition={{ type: 'timing', duration: 125 }}
                style={{ borderRadius: 6 }}
                className={`border-[1px] border-[#333] py-4 px-3 rounded-md ` + (className ?? "")}
            >
{/*                 <Badge
                    className={`border-[1px] border-[#333] py-4 px-3 rounded-md ` + (className ?? "")}
                    textClassName={checked ? "text-base text-white" : "text-base text-[#999]"}
                    textStyle={{ fontFamily: checked ? 'Inter_600SemiBold' : 'Inter_400Regular' }}
                    {...props}
                >
                    {children}
                </Badge> */}
                <Text
                    className="text-white"
                >{children}</Text>
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
        <Pressable className="bg-gray-800 rounded-full p-2" onPress={func}>
            <ArrowLeft color='#fff' size={28} className={(arrowClassName ?? "") + " mr-24 " + (className ?? "")} {...props} />
        </Pressable>
    ) : (
        <Pressable className="bg-gray-800 rounded-full p-2" onPress={func}>
            <ArrowRight color='#fff' size={28} className={(arrowClassName ?? "") + " ml-24 " + (className ?? "")} {...props} />
        </Pressable>
    )
}
const SecondToLastCTA = ({ handleStep } : {
    handleStep: (action: "next" | "prev") => Promise<void>
}) => {
    return (
        <View
            className="flex-col justify-center h-screen"
        >
            <View className="h-[80%] flex-col justify-center">
                <Text className="text-white text-2xl">With
                    <Text className="text-[#58a76d] font-semibold tracking-tight"> Journl</Text>,
                    you will be able to:
                </Text>

                <View className="gap-6 mt-8">
                    {qFeatures.map((feature, fIndex) => (
                        <MotiView
                            key={`onboarding-questions-feature-${fIndex}`}
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ type: 'timing', duration: 300, delay: fIndex * 450 }}
                        >
                            <Text className="text-white font-medium text-lg">{feature}</Text>
                        </MotiView>
                    ))}
                </View>
            </View>

            <View className='flex-row w-full items-center justify-between h-[20%]'>
                <OnboardArrow size={32} className='m-0' dir='left' func={() => handleStep("prev")} />
                <Button
                    style={{ width: "80%" }}
                    onPress={() => handleStep("next")}>Next</Button>
            </View>
        </View>
    )
}
const LastCTA = ({ handleStep, lastMessage, loading } : {
    lastMessage: string
    loading?: boolean
    handleStep: (action: "next" | "prev") => Promise<void>
}) => {
    return (
    <View className='h-screen'>
        <View
            className="flex-col gap-4 items-center justify-center h-[80%]"
        >
            <Badge
                className='rounded-full w-fit'
                textClassName="text-xs"
                fullWidth={false}
            >You're all set.</Badge>
            <Text className='text-white text-center text-3xl font-semibold leading-tight tracking-tight md:w-2/3'>
                {lastMessage}
            </Text>
        </View>

        <View className='flex-row w-full items-center justify-between h-[20%]'>
            <OnboardArrow size={32} className='m-0' dir='left' func={() => handleStep("prev")} />
            <Button
                style={{ width: "80%" }}
                loading={!!loading}
                onPress={() => handleStep("next")}>Get Started</Button>
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
            return
        }

        // Question steps: 0..qData.length-1 → validate and advance
        if (step < qData.length) {
            const currentId = qData[step].id as keyof z.infer<typeof qSchema>

            if (currentId === 'handle') {
                const handleValue = form.getValues('handle')
                if (handleValue) {
                    setLoading(true)
                    const { isUnique } = await checkUniqueHandle(handleValue)
                    if (!isUnique) {
                        form.setError('handle', { 
                            type: 'manual', 
                            message: 'This handle is already taken. Please choose a different one.' 
                        })
                        setLoading(false)
                        return
                    }
                }
            }

            const valid = await form.trigger(currentId); if (!valid) { setLoading(false); return }
            setStep((s) => s + 1); setLoading(false)
            await Haptics.selectionAsync()
            return
        }

        // SecondToLastCTA → just advance to LastCTA
        if (step === qData.length) {
            setStep((s) => s + 1)
            await Haptics.selectionAsync()
            return
        }

        // LastCTA → finish flow
        await onFinish()
    }

    const lastMessage = "Ready to get inspired or share your wisdom with the world?"
    
    return (
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
                    className="h-screen"
                >
                {step < qData.length ? (() => {
                    const { id, question, type, required, placeholder, options } = qData[step]
                    return (
                        <View
                            className="gap-2 h-[80%] flex-col justify-center" // Question Label & Input Group & Error Message
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
                                                        const toggleOption = () => { field.onChange(isChecked ? "" : optionValue) }
                                                        return (
                                                            <OnboardBadge
                                                                key={`onboarding-select-${optionIndex}`}
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
                })() : step === qData.length ? <SecondToLastCTA handleStep={handleStep} /> : <LastCTA loading={loading} lastMessage={lastMessage} handleStep={handleStep} />}

                {(step < qData.length) && (
                    <View className='flex-row w-full items-center justify-between h-[20%]'>
                        {step !== 0 && <OnboardArrow size={32} className='m-0' dir='left' func={() => handleStep("prev")} />}
                        <Button
                            style={{ width: step === 0 ? "100%" : "80%" }}
                            loading={loading}
                            onPress={() => handleStep("next")}>Next</Button>
                    </View>
                )}
                </MotiView>
            </View>
        </AnimatePresence>
    </View>
  )
}

export default OnboardQuestions