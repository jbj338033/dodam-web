import { useQuery } from "@tanstack/react-query";
import { useTokenStore } from "../../stores/token";
import axios from "axios";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import dayjs from "dayjs";

type Schedule = {
  id: number;
  name: string;
  place: string;
  type: string;
  date: string[];
  targetGrades: string[];
};

type ApiResponse<T> = {
  data: T;
};

const ScheduleSection = () => {
  const { accessToken } = useTokenStore();

  const { data: scheduleData } = useQuery<ApiResponse<Schedule[]>>({
    queryKey: ["schedule"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/schedule/today`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return data;
    },
  });

  if (!scheduleData?.data?.length) {
    return (
      <div className="bg-white border border-slate-200 p-4">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <FiCalendar className="text-blue-500" />
          오늘의 일정
        </h3>
        <p className="text-slate-500 text-sm">오늘은 일정이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 p-4">
      <h3 className="font-bold mb-3 flex items-center gap-2">
        <FiCalendar className="text-blue-500" />
        오늘의 일정
      </h3>
      <div className="space-y-2">
        {scheduleData.data.map((schedule) => (
          <div key={schedule.id} className="p-3 bg-slate-50 rounded">
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{schedule.name}</div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm">
                  {schedule.place && (
                    <span className="text-slate-500 flex items-center gap-1">
                      <FiMapPin className="w-3 h-3" />
                      {schedule.place}
                    </span>
                  )}
                  {schedule.targetGrades.length > 0 && (
                    <span className="text-slate-500">
                      {schedule.targetGrades.join(", ")}학년
                    </span>
                  )}
                  <span className="text-slate-400">
                    {schedule.date.length === 1
                      ? dayjs(schedule.date[0]).format("HH:mm")
                      : `${dayjs(schedule.date[0]).format("HH:mm")} ~ ${dayjs(
                          schedule.date[1]
                        ).format("HH:mm")}`}
                  </span>
                </div>
              </div>
              {schedule.type && (
                <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                  {schedule.type}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleSection;
