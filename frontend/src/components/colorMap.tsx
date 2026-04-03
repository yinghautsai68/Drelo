import type { CardType } from "../types/types";

export const colorMap: Record<CardType['color'], { list: string, card: string }> = {
    "black": { list: "bg-black", card: "bg-gray-500" },
    "red": { list: "bg-rose-700", card: "bg-rose-500" },
    "yellow": { list: "bg-yellow-600", card: "bg-yellow-500" },
    "orange": { list: "bg-orange-600", card: "bg-amber-600" },
    "blue": { list: "bg-blue-700", card: "bg-blue-500" },
    "violet": { list: "bg-violet-800", card: "bg-violet-500" },
    "green": { list: "bg-emerald-800", card: "bg-emerald-600" },
}
