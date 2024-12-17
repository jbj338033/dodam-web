import { useState, useMemo, memo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useTokenStore } from "../../stores/token";
import GradeLegend from "./GradeLegend";
import { dodamAxios } from "../../libs/axios";
import { GRADE_COLORS, Schedule, ScheduleResponse } from "./types";

dayjs.extend(isBetween);

interface ProcessedSchedule extends Schedule {
  weekStartPos: number;
  weekEndPos: number;
  isStart: boolean;
  isEnd: boolean;
}

const Header = memo(
  ({
    currentDate,
    onPrevMonth,
    onNextMonth,
    onToday,
  }: {
    currentDate: dayjs.Dayjs;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onToday: () => void;
  }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <h2 className="font-bold text-slate-900">
          {currentDate.format("YYYY년 M월")}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onPrevMonth}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
            type="button"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onToday}
            className="px-2 py-1 rounded hover:bg-slate-100 text-slate-600 text-sm"
            type="button"
          >
            오늘
          </button>
          <button
            onClick={onNextMonth}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
            type="button"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <GradeLegend />
    </div>
  )
);

Header.displayName = "Header";

const CalendarDay = memo(
  ({
    day,
    isToday,
    isCurrentMonth,
  }: {
    day: dayjs.Dayjs;
    isToday: boolean;
    isCurrentMonth: boolean;
  }) => {
    const isSunday = day.day() === 0;
    const isSaturday = day.day() === 6;

    return (
      <div
        className={`min-h-[140px] p-2 ${
          isCurrentMonth ? "bg-white" : "bg-slate-50"
        }`}
      >
        <div
          className={`text-sm mb-1 flex items-center justify-center w-6 h-6 rounded-full ${
            isToday
              ? "bg-blue-500 text-white"
              : isCurrentMonth
                ? isSunday
                  ? "text-red-500"
                  : isSaturday
                    ? "text-blue-500"
                    : "text-slate-900"
                : isSunday
                  ? "text-red-300"
                  : isSaturday
                    ? "text-blue-300"
                    : "text-slate-400"
          }`}
        >
          {day.format("D")}
        </div>
      </div>
    );
  }
);

CalendarDay.displayName = "CalendarDay";

const ScheduleBar = memo(
  ({
    schedule,
    targetGrades,
    index,
  }: {
    schedule: ProcessedSchedule;
    targetGrades: string[];
    index: number;
  }) => {
    const getGradeColor = (grades: string[]) => {
      if (grades.includes("GRADE_ALL")) {
        return GRADE_COLORS.GRADE_ALL;
      }

      if (grades.includes("GRADE_ETC")) {
        return GRADE_COLORS.GRADE_ETC;
      }

      const firstGrade = grades[0];
      return (
        GRADE_COLORS[firstGrade as keyof typeof GRADE_COLORS] ||
        GRADE_COLORS.GRADE_ALL
      );
    };

    const { bg, text } = getGradeColor(targetGrades);
    const startPercent = (schedule.weekStartPos / 7) * 100;
    const width = ((schedule.weekEndPos - schedule.weekStartPos + 1) / 7) * 100;

    return (
      <div
        className={`absolute h-6 ${bg} ${text} text-xs flex items-center px-2 rounded`}
        style={{
          left: `${startPercent}%`,
          width: `${width}%`,
          top: `${32 + index * 28}px`,
          zIndex: schedule.isStart ? 10 : 5,
        }}
      >
        <div className="truncate">{schedule.name}</div>
      </div>
    );
  }
);

ScheduleBar.displayName = "ScheduleBar";

const useSchedules = (startAt: string, endAt: string) => {
  const { accessToken } = useTokenStore();

  return useQuery({
    queryKey: ["schedules", startAt, endAt],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("No access token");
      }

      const { data } = await dodamAxios.get<ScheduleResponse>(
        `/schedule/search`,
        {
          params: { startAt, endAt },
        }
      );
      return data.data;
    },
    enabled: !!accessToken,
    retry: 1,
  });
};

const CalendarSection = memo(() => {
  const [currentDate, setCurrentDate] = useState(() => dayjs());

  const startAt = currentDate.startOf("month").format("YYYY-MM-DD");
  const endAt = currentDate.endOf("month").format("YYYY-MM-DD");

  const {
    data: schedules = [],
    isLoading,
    error,
  } = useSchedules(startAt, endAt);

  const weeks = useMemo(() => {
    const start = currentDate.startOf("month").startOf("week");
    const end = currentDate.endOf("month").endOf("week");
    const days = [];
    let week = [];

    for (
      let day = start;
      day.isBefore(end.add(1, "day"));
      day = day.add(1, "day")
    ) {
      week.push(day);
      if (week.length === 7) {
        days.push(week);
        week = [];
      }
    }

    return days;
  }, [currentDate]);

  const processSchedules = useCallback(
    (week: dayjs.Dayjs[]): ProcessedSchedule[] => {
      if (!Array.isArray(schedules)) return [];

      return schedules
        .map((schedule) => {
          try {
            const startDate = dayjs(schedule.date[0]);
            const endDate = dayjs(schedule.date[1]);
            const weekStart = week[0];
            const weekEnd = week[6];

            if (!startDate.isValid() || !endDate.isValid()) return null;
            if (endDate.isBefore(weekStart) || startDate.isAfter(weekEnd))
              return null;

            const weekStartPos = Math.max(0, startDate.diff(weekStart, "day"));
            const weekEndPos = Math.min(6, endDate.diff(weekStart, "day"));

            return {
              ...schedule,
              weekStartPos,
              weekEndPos,
              isStart: startDate.isSame(week[weekStartPos], "day"),
              isEnd: endDate.isSame(week[weekEndPos], "day"),
            };
          } catch (e) {
            console.error("Schedule processing error:", e);
            return null;
          }
        })
        .filter((s): s is ProcessedSchedule => s !== null);
    },
    [schedules]
  );

  const handlePrevMonth = useCallback(() => {
    setCurrentDate((prev) => prev.subtract(1, "month"));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prev) => prev.add(1, "month"));
  }, []);

  const handleToday = useCallback(() => {
    setCurrentDate(dayjs());
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 p-4 min-h-[600px] flex items-center justify-center">
        <div className="text-slate-600">캘린더를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-slate-200 p-4 min-h-[600px] flex items-center justify-center">
        <div className="text-red-600">
          캘린더를 불러오는데 실패했습니다.
          <button
            onClick={() => window.location.reload()}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white border border-slate-200 p-4">
      <Header
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      <div className="border border-slate-200 rounded overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-200">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <div
              key={day}
              className="py-3 text-sm font-medium text-slate-600 text-center"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="divide-y divide-slate-200">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="relative">
              <div className="absolute top-8 left-0 right-0 z-10">
                {processSchedules(week).map((schedule, idx) => (
                  <ScheduleBar
                    key={`${schedule.id}-${weekIndex}`}
                    schedule={schedule}
                    targetGrades={schedule.targetGrades}
                    index={idx}
                  />
                ))}
              </div>

              <div className="grid grid-cols-7 divide-x divide-slate-200">
                {week.map((day) => (
                  <CalendarDay
                    key={day.format("YYYY-MM-DD")}
                    day={day}
                    isToday={day.isSame(dayjs(), "day")}
                    isCurrentMonth={day.isSame(currentDate, "month")}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

CalendarSection.displayName = "CalendarSection";

export default CalendarSection;
