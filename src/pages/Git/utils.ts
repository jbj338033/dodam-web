import { RankStyle } from "./types";

export const getRankStyle = (index: number): RankStyle => {
  switch (index) {
    case 0:
      return {
        bg: "bg-gradient-to-r from-yellow-400 to-amber-400",
        text: "text-amber-700",
        border: "border-amber-200",
      };
    case 1:
      return {
        bg: "bg-gradient-to-r from-slate-300 to-slate-400",
        text: "text-slate-700",
        border: "border-slate-200",
      };
    case 2:
      return {
        bg: "bg-gradient-to-r from-orange-300 to-orange-400",
        text: "text-orange-700",
        border: "border-orange-200",
      };
    default:
      return {
        bg: "bg-gradient-to-r from-slate-100 to-slate-200",
        text: "text-slate-600",
        border: "border-slate-200",
      };
  }
};
