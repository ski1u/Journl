import Grass from "@/assets/images/grass.svg"
import Camera from "@/assets/images/camera.svg"
import Adventure from "@/assets/images/adventure.svg"

import { z } from "zod"

interface Onboard {
  tag: string
  title: string
  desc: string
  image: any
}
interface OnboardQuestion {
  id: string,
  question: string,
  type: "text" | "select" | "multi-select",
  required?: boolean,
  options?: string[] | { value: string, option: string }[],
  placeholder?: string
}

export const onboardAuthData: Onboard[] = [
  {
    tag: "About",
    title: "Document the small moments.",
    desc: "Journl allows you to capture anything in specific with images and journal entries, using it as a reflective tool.",
    image: Grass,
  },
  {
    tag: "Features",
    title: "Seamlessly add photos.",
    desc: "Use your camera or gallery to pair visuals with your entries, making each moment more vivid.",
    image: Camera,
  },
  {
    tag: "Value",
    title: "Reflect & grow.",
    desc: "Look back on your past, track your moods, and build a journaling habit that helps you grow.",
    image: Adventure,
  },
]

export const onboardingQuestionsData: OnboardQuestion[] = [
    {
      id: 'handle',
      question: "What do you want your handle to be?",
      type: 'text',
      required: true,
      placeholder: 'johndoe',
    },
    {
      id: 'name',
      question: "What's a full name would you like to go by?",
      type: 'text',
      required: true,
      placeholder: 'John Doe',
    },
    {
      id: 'reason',
      question: "Why did you download this app?",
      type: "select",
      required: false,
      options: [
        { value: "track-mood-trends", option: "📈 Track mood trends over time" },
        { value: "habit-building", option: "📅 Build a consistent journaling habit" },
        { value: "mental-health-insights", option: "🧘 Gain mental health insights" },
        { value: "gratitude-tracking", option: "🙏 Build gratitude and positivity" },
        { value: "goal-tracking", option: "🎯 Set goals and review progress" },
        { value: "life-logging", option: "📓 Life logging with analytics" },
        { value: "other", option: "❓ Other" },
      ]
    }
]

export const reasonValues = [
  "track-mood-trends",
  "habit-building",
  "mental-health-insights",
  "gratitude-tracking",
  "goal-tracking",
  "life-logging",
  "other"
] as const

export const onboardingQuestionsSchema = z.object({
  handle: z
  .string()
  .min(3, { message: "Handle should be at least 3 characters" })
  .max(24, { message: "Handle should not be larger than 24 characters" })
  .regex(/^[a-zA-Z0-9_]*$/, {
    message: "Handle should only contain letters, numbers, and underscores",
  }),
  name: z
    .string()
    .min(3, { message: "Name should be larger than 3 characters" })
    .max(32, { message: "Name should not be larger than 32 characters" })
    .regex(/^[a-zA-Z0-9 ]*$/, {
      message: "Name should only contain letters, numbers, and spaces",
    }),
  reason: z.enum(reasonValues).optional().nullable(),
})