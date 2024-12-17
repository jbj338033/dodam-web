import { memo } from "react";
import { GRADE_COLORS } from "./types";

interface LegendItem {
  grade: string;
  color: string;
}

interface LegendItemProps {
  item: LegendItem;
}

const LEGEND_ITEMS: LegendItem[] = [
  { grade: "1학년", color: GRADE_COLORS.GRADE_1.dot },
  { grade: "2학년", color: GRADE_COLORS.GRADE_2.dot },
  { grade: "3학년", color: GRADE_COLORS.GRADE_3.dot },
  { grade: "전교생", color: GRADE_COLORS.GRADE_ALL.dot },
  { grade: "기타", color: GRADE_COLORS.GRADE_ETC.dot },
];

const LegendDot = memo(({ item }: LegendItemProps) => (
  <div className="flex items-center text-sm text-slate-600">
    <div
      className={`w-3 h-3 rounded-full ${item.color} mr-1`}
      role="presentation"
      aria-hidden="true"
    />
    {item.grade}
  </div>
));

LegendDot.displayName = "LegendDot";

const GradeLegend = memo(() => {
  return (
    <div className="flex gap-3">
      {LEGEND_ITEMS.map((item) => (
        <LegendDot key={item.grade} item={item} />
      ))}
    </div>
  );
});

GradeLegend.displayName = "GradeLegend";

export default GradeLegend;
