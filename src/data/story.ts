import { Sparkles, Smile, Coffee, Gem, Camera, Infinity } from "lucide-react";
import type { StoryMilestone } from "@/types";

/** The six chapters of our love story timeline. Original wording. */
export const STORY: StoryMilestone[] = [
  {
    id: "meet",
    title: "The First Meet",
    date: "A quiet evening in autumn",
    description:
      "Two strangers, one crowded room, and a glance that lasted a heartbeat too long. The world went soft at the edges and somehow I already knew.",
    icon: Sparkles,
    accent: "#f7a8b8",
  },
  {
    id: "smile",
    title: "The First Smile",
    date: "The morning after",
    description:
      "You smiled and gravity rearranged itself. I have spent every day since trying to earn that smile again — and getting delightfully lucky.",
    icon: Smile,
    accent: "#e8b298",
  },
  {
    id: "date",
    title: "Our First Date",
    date: "Coffee that turned into hours",
    description:
      "Two cups became six. The café closed around us while we talked about everything and nothing, already fluent in each other.",
    icon: Coffee,
    accent: "#c9b6f0",
  },
  {
    id: "proposal",
    title: "The Proposal",
    date: "Under a sky full of promises",
    description:
      "On one knee, with a shaking voice and a ring that caught the last of the sunset, I asked forever. You said yes before I finished the question.",
    icon: Gem,
    accent: "#d99a86",
  },
  {
    id: "memories",
    title: "A Thousand Memories",
    date: "Every ordinary, extraordinary day",
    description:
      "Rainy Sundays, burnt pancakes, road trips with no map. The small moments quietly became the greatest story I have ever lived.",
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
