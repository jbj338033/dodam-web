import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/ko";
import { useTokenStore } from "../stores/token";

dayjs.extend(isBetween);

interface Schedule {
  id: number;
  name: string;
  place: string;
  type: string;
  date: [string, string];
  targetGrades: string[];
}

interface ScheduleResponse {
  status: number;
  message: string;
  data: Schedule[];
}

const SchedulePage = () => {
  const { accessToken } = useTokenStore();
  const [currentDate, setCurrentDate] = React.useState(dayjs());
  const startAt = currentDate.startOf("month").format("YYYY-MM-DD");
  const endAt = currentDate.endOf("month").format("YYYY-MM-DD");

  const { data: scheduleData } = useQuery({
    queryKey: ["schedules", startAt, endAt],
    queryFn: async () => {
      const { data } = await axios.get<ScheduleResponse>(
        `${import.meta.env.VITE_API_URL}/schedule/search`,
        {
          params: { startAt, endAt },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return data.data;
    },
    enabled: !!accessToken,
  });

  const getGradeColor = (grades: string[]) => {
    if (grades.includes("GRADE_ALL")) return "bg-neutral-100 text-neutral-900";
    if (grades.includes("GRADE_1")) return "bg-amber-100 text-amber-900";
    if (grades.includes("GRADE_2")) return "bg-emerald-100 text-emerald-900";
    if (grades.includes("GRADE_3")) return "bg-blue-100 text-blue-900";
    return "bg-purple-100 text-purple-900";
  };

  const weeks = React.useMemo(() => {
    const start = currentDate.startOf("month").startOf("week");
    const end = currentDate.endOf("month").endOf("week");
    const days = [];
    let week = [];

    for (let day = start; day.isBefore(end); day = day.add(1, "day")) {
      week.push(day);
      if (week.length === 7) {
        days.push(week);
        week = [];
      }
    }

    return days;
  }, [currentDate]);

  const getDaySchedules = (date: dayjs.Dayjs) => {
    return scheduleData?.filter((schedule) =>
      date.isBetween(
        dayjs(schedule.date[0]),
        dayjs(schedule.date[1]),
        "day",
        "[]"
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Calendar Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-neutral-900">
            {currentDate.format("YYYY년 M월")}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
              className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600"
            >
              이전 달
            </button>
            <button
              onClick={() => setCurrentDate(dayjs())}
              className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600"
            >
              오늘
            </button>
            <button
              onClick={() => setCurrentDate(currentDate.add(1, "month"))}
              className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600"
            >
              다음 달
            </button>
          </div>
        </div>

        {/* Grade Legend */}
        <div className="flex gap-3">
          <div className="flex items-center text-sm">
            <div className="w-3 h-3 rounded-full bg-amber-100 mr-1"></div>
            1학년
          </div>
          <div className="flex items-center text-sm">
            <div className="w-3 h-3 rounded-full bg-emerald-100 mr-1"></div>
            2학년
          </div>
          <div className="flex items-center text-sm">
            <div className="w-3 h-3 rounded-full bg-blue-100 mr-1"></div>
            3학년
          </div>
          <div className="flex items-center text-sm">
            <div className="w-3 h-3 rounded-full bg-neutral-100 mr-1"></div>
            전교생
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-neutral-200">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <div
              key={day}
              className="py-3 text-sm font-medium text-neutral-600 text-center"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 divide-x divide-y divide-neutral-200">
          {weeks.map((week) =>
            week.map((day) => {
              const isToday = day.isSame(dayjs(), "day");
              const isCurrentMonth = day.isSame(currentDate, "month");
              const daySchedules = getDaySchedules(day);
              const isSunday = day.day() === 0;
              const isSaturday = day.day() === 6;

              return (
                <div
                  key={day.format("YYYY-MM-DD")}
                  className={`min-h-[140px] p-2 ${
                    isCurrentMonth ? "bg-white" : "bg-neutral-50"
                  }`}
                >
                  <div
                    className={`text-sm mb-1 flex items-center justify-center w-6 h-6 rounded-full ${
                      isToday
                        ? "bg-blue-500 text-white"
                        : isCurrentMonth
                        ? `${
                            isSunday
                              ? "text-red-500"
                              : isSaturday
                              ? "text-blue-500"
                              : "text-neutral-900"
                          }`
                        : `${
                            isSunday
                              ? "text-red-300"
                              : isSaturday
                              ? "text-blue-300"
                              : "text-neutral-400"
                          }`
                    }`}
                  >
                    {day.format("D")}
                  </div>
                  <div className="space-y-1">
                    {daySchedules?.map((schedule) => (
                      <div
                        key={schedule.id}
                        className={`text-xs px-2 py-1 rounded-md ${getGradeColor(
                          schedule.targetGrades
                        )}`}
                      >
                        {schedule.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
