import React, { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import dayjs from "dayjs";
import { dodamAxios } from "../../libs/axios";

interface Schedule {
  id: number;
  name: string;
  place: string;
  type: string;
  date: string[];
  targetGrades: string[];
}

interface ApiResponse<T> {
  data: T;
}

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

const SectionHeader = memo(({ icon, title }: SectionHeaderProps) => (
  <h3 className="font-bold mb-3 flex items-center gap-2">
    {icon}
    {title}
  </h3>
));

SectionHeader.displayName = "SectionHeader";

const EmptySchedule = memo(() => (
  <p className="text-slate-500 text-sm">오늘은 일정이 없습니다</p>
));

EmptySchedule.displayName = "EmptySchedule";

interface ScheduleTimeProps {
  dates: string[];
}

const ScheduleTime = memo(({ dates }: ScheduleTimeProps) => (
  <span className="text-slate-400">
    {dates.length === 1
      ? dayjs(dates[0]).format("HH:mm")
      : `${dayjs(dates[0]).format("HH:mm")} ~ ${dayjs(dates[1]).format("HH:mm")}`}
  </span>
));

ScheduleTime.displayName = "ScheduleTime";

interface ScheduleCardProps {
  schedule: Schedule;
}

const ScheduleCard = memo(({ schedule }: ScheduleCardProps) => (
  <div className="p-3 bg-slate-50 rounded">
    <div className="flex items-start gap-2">
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{schedule.name}</div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm">
          {schedule.place && (
            <span className="text-slate-500 flex items-center gap-1">
              <FiMapPin className="w-3 h-3" aria-hidden="true" />
              {schedule.place}
            </span>
          )}
          {schedule.targetGrades.length > 0 && (
            <span className="text-slate-500">
              {schedule.targetGrades.join(", ")}학년
            </span>
          )}
          <ScheduleTime dates={schedule.date} />
        </div>
      </div>
      {schedule.type && (
        <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
          {schedule.type}
        </span>
      )}
    </div>
  </div>
));

ScheduleCard.displayName = "ScheduleCard";

const ScheduleSection = memo(() => {
  const { data: scheduleData } = useQuery<ApiResponse<Schedule[]>>({
    queryKey: ["schedule"],
    queryFn: async () => {
      const { data } = await dodamAxios.get(`schedule/today`);
      return data;
    },
  });

  return (
    <section className="bg-white border border-slate-200 p-4">
      <SectionHeader
        icon={<FiCalendar className="text-blue-500" />}
        title="오늘의 일정"
      />

      {!scheduleData?.data?.length ? (
        <EmptySchedule />
      ) : (
        <div className="space-y-2">
          {scheduleData.data.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
          ))}
        </div>
      )}
    </section>
  );
});

ScheduleSection.displayName = "ScheduleSection";

export default ScheduleSection;
