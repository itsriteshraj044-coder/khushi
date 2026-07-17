import { Smile, Eye, HandHeart, Flower2, LifeBuoy, Infinity } from "lucide-react";
import type { Reason } from "@/types";

/** "Why I Love You" — six luminous reasons. */
export const REASONS: Reason[] = [
  {
    id: "r1",
    title: "Your Smile",
    text: "It rewrites my worst days into something worth keeping.",
    icon: Smile,
    gradient: "from-pink-blush to-rose",
  },
  {
    id: "r2",
    title: "Your Eyes",
    text: "Two quiet galaxies I happily lose myself inside.",
    icon: Eye,
    gradient: "from-lavender to-lavender-deep",
  },
  {
    id: "r3",
    title: "Your Care",
    text: "You love in small, constant ways the world forgets to notice.",
    icon: HandHeart,
    gradient: "from-rose to-rose-gold",
  },
  {
    id: "r4",
    title: "Your Nature",
    text: "Gentle as morning light, warm as the last of summer.",
    icon: Flower2,
    gradient: "from-peach to-rose-gold",
  },
  {
    id: "r5",
    title: "Your Support",
    text: "You believed in me first, and taught me how to believe too.",
    icon: LifeBuoy,
    gradient: "from-lavender-deep to-rose",
  },
  {
    id: "r6",
    title: "Forever",
    text: "Because a lifetime with you still feels far too short.",
    icon: Infinity,
    gradient: "from-rose-gold to-lavender",
  },
];
