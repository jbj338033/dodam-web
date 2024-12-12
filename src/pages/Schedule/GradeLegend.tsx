import { GRADE_COLORS } from "./types";

const GradeLegend = () => {
  return (
    <div className="flex gap-3">
      {[
        { grade: "1학년", color: GRADE_COLORS.GRADE_1.dot },
        { grade: "2학년", color: GRADE_COLORS.GRADE_2.dot },
        { grade: "3학년", color: GRADE_COLORS.GRADE_3.dot },
        { grade: "전교생", color: GRADE_COLORS.GRADE_ALL.dot },
      ].map(({ grade, color }) => (
        <div key={grade} className="flex items-center text-sm">
          <div className={`w-3 h-3 rounded-full ${color} mr-1`} />
          {grade}
        </div>
      ))}
    </div>
  );
};

export default GradeLegend;
