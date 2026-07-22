import { Sparkles, Smile, Coffee, Gem, Camera, Infinity } from "lucide-react";
import type { StoryMilestone } from "@/types";

/** The six chapters of our love story timeline. */
export const STORY: StoryMilestone[] = [
  {
    id: "meet",
    title: "The First Hello ❤️",
    date: "Where two worlds quietly met",
    description:
      "Some stories begin with fireworks; ours began with a simple hello. In a moment so ordinary I almost missed it, the universe was quietly rewriting my whole life. I didn't know it yet, but that little hello was the first line of my favourite story — the one where I finally found you. ❤️",
    icon: Sparkles,
    accent: "#f7a8b8",
  },
  {
    id: "smile",
    title: "Falling, Slowly 😊",
    date: "The way you became my favourite thought",
    description:
      "It didn't happen all at once. I fell for you the way you fall asleep — slowly, and then all at once. Your laugh, your kindness, the way you made even the dull days feel golden. Little by little you became my first thought in the morning and my last one at night, and I never wanted it any other way. ❤️",
    icon: Smile,
    accent: "#e8b298",
  },
  {
    id: "date",
    title: "Our First Date ❤️",
    date: "The day the screen finally faded",
    description:
      "After all the waiting, all the late-night talks and endless calls, we were finally in the same place at the same time. The whole world went soft and quiet around us. Every laugh, every shy glance, every little pause felt like it belonged only to us. It wasn't about where we were — it was the simple, dizzying joy of finally being together. ❤️",
    icon: Coffee,
    accent: "#c9b6f0",
  },
  {
    id: "proposal",
    title: "The First 'I Love You' ❤️",
    date: "Three words, one forever",
    description:
      "My heart was racing and my hands were shaking, but I knew exactly what I wanted to say. And when those three little words finally left my lips — and you said them back — the whole world stood still. It wasn't just a confession; it was the beginning of us, a promise I've cherished every single day since. ❤️",
    icon: Gem,
    accent: "#d99a86",
  },
  {
    id: "memories",
    title: "A Thousand Little Moments ❤️",
    date: "Every day, a new page",
    description:
      "Somewhere between the endless calls, the silly jokes, the little fights and the sweeter making-ups, we built a whole world together. Every laugh, every tear, every ordinary Tuesday turned into a memory I'd never trade. Through every high and every low, we only grew closer — and I hope we keep collecting these little moments for a lifetime. ❤️",
    icon: Camera,
    accent: "#ffb6ce",
  },
  {
    id: "forever",
    title: "Forever, Together",
    date: "From here to always",
    description:
      "Wherever the road goes next, I go there holding your hand. You are my favourite chapter, my whole book, my forever.",
    icon: Infinity,
    accent: "#c9b6f0",
  },
];
