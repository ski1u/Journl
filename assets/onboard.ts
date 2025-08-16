import Grass from "@/assets/images/grass.svg"
import Camera from "@/assets/images/camera.svg"
import Adventure from "@/assets/images/adventure.svg"

interface Onboard {
  tag: string
  title: string
  desc: string
  image: any
}

export const onboardAuthData: Onboard[] = [
  {
    tag: "About",
    title: "Document the small moments.",
    desc: "Journl allows you to capture anything in specific with images and journal entries, using it as a reflective tool",
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