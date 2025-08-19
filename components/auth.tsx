import "@/global.css"

import { useForm, Controller } from "react-hook-form"

import { View, Text, Pressable } from "react-native"
import { Input } from "tamagui"
import Button from "./button"
import { Link, useRouter } from "expo-router"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import type { ComponentType } from "react"
import { Mail, Lock, ArrowLeft } from "lucide-react-native"

const schema = z.object({
    email: z.email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormValues = z.infer<typeof schema>

export default function Auth({ type = "sign-in" } : {
    type: "sign-in" | "register"
}) {
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: "", password: "" }
    })
    const router = useRouter()

    const onSubmit = (data: FormValues) => {
        console.log(`[${type}] submit`, data)
    }
    
    const fields: Array<{
        name: keyof FormValues
        placeholder: string
        keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "number-pad"
        secureTextEntry?: boolean
        autoCapitalize?: "none" | "sentences" | "words" | "characters"
        icon: ComponentType<{ size?: number; color?: string }>
    }> = [
        { name: "email", placeholder: "demo@demo.com", keyboardType: "email-address", autoCapitalize: "none", icon: Mail },
        { name: "password", placeholder: "demodemo", secureTextEntry: true, autoCapitalize: "none", icon: Lock },
    ]
    
    return (
    <>
        <Pressable
            onPress={() => {
                if (router.canGoBack()) {
                    router.back()
                } else {
                    router.replace("/(auth)/onboard-auth")
                }
            }}
            className="absolute top-24 left-8"
        >
            <ArrowLeft color="#fff" size={32} />
        </Pressable>

        <View
            className="py-64 px-8 gap-4"
        >
            <Text className="text-white font-semibold tracking-tighter text-4xl border-l-white border-l-4 pl-4">
                {type === "register" ? "Create a new account" : "Sign in"}
            </Text>

            <View className="mt-8 gap-6">
                {fields.map((f) => {
                    const Icon = f.icon
                    const err = (errors as Record<string, { message?: string }>)[f.name as string]

                    return (
                        <View key={f.name as string}>
                            <Controller
                                control={control}
                                name={f.name as any}
                                render={({ field }) => (
                                    <View style={{ position: "relative" }}>
                                        <Input
                                            value={field.value}
                                            onChangeText={field.onChange}
                                            onBlur={field.onBlur}
                                            placeholder={f.placeholder}
                                            keyboardType={f.keyboardType}
                                            secureTextEntry={f.secureTextEntry}
                                            autoCapitalize={f.autoCapitalize}
                                            autoCorrect={false}
                                            placeholderTextColor="#999"
                                            fontSize={12}
                                            color="#fff"
                                            backgroundColor="$colorTransparent"
                                            paddingLeft={36}
                                            borderColor={err?.message ? "#f87171" : "#fff"}
                                        />
                                        <View style={{ position: "absolute", left: 12, top: 0, bottom: 0, justifyContent: "center" }}>
                                            <Icon size={16} color="#999" />
                                        </View>
                                    </View>
                                )}
                            />
                            {(() => {
                                return err?.message ? (
                                    <Text className="text-red-400 text-xs mt-2">{err.message}</Text>
                                ) : null
                            })()}
                        </View>
                    )
                })}
            </View>

            {type === "sign-in" && (
                    <Text className="text-blue-400 text-sm">Forgot Password?</Text>
                )}

            <View className="mt-6">
                <Button
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    width="100%"
                >
                    {type === "register" ? "Create account" : "Sign in"}
                </Button>
            </View>

            <Link href={type === "register" ? "/(auth)/sign-in" : "/(auth)/register"} className="mt-2"><Text
                className="underline underline-offset-8 text-xs text-white text-center">
                {type === "register" ? "Already have an account?" : "Don't have an account?"}</Text></Link>
        </View>
    </>
    )
}