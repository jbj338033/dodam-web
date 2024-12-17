import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { NightStudy, STATUS_MAP } from "./types";
import { useTokenStore } from "../../stores/token";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import dayjs from "dayjs";
import { dodamAxios } from "../../libs/axios";

interface NightStudyResponse {
  status: number;
  message: string;
  data: NightStudy[];
}

interface SectionHeaderProps {
  title: string;
}

const SectionHeader = memo(({ title }: SectionHeaderProps) => (
  <h2 className="font-bold mb-3">{title}</h2>
));

SectionHeader.displayName = "SectionHeader";

interface StudyDateRangeProps {
  startAt: string;
  endAt: string;
}

const StudyDateRange = memo(({ startAt, endAt }: StudyDateRangeProps) => (
  <span className="flex items-center gap-1">
    <FiCalendar className="w-4 h-4" aria-hidden="true" />
    {dayjs(startAt).format("MM.DD")} ~ {dayjs(endAt).format("MM.DD")}
  </span>
));

StudyDateRange.displayName = "StudyDateRange";

interface StudyLocationProps {
  place: string;
}

const StudyLocation = memo(({ place }: StudyLocationProps) => (
  <span className="flex items-center gap-1">
    <FiMapPin className="w-4 h-4" aria-hidden="true" />
    {place}
  </span>
));

StudyLocation.displayName = "StudyLocation";

interface StudyCardProps {
  study: NightStudy;
}

const StudyCard = memo(({ study }: StudyCardProps) => (
  <div className="p-3 bg-slate-50 rounded">
    <div className="flex items-start justify-between gap-2 mb-2">
      <h3 className="font-medium">{study.content}</h3>
      <span
        className={`text-xs px-2 py-0.5 rounded ${STATUS_MAP[study.status].className}`}
      >
        {STATUS_MAP[study.status].text}
      </span>
    </div>
    <div className="flex items-center gap-4 text-sm text-slate-500">
      <StudyDateRange startAt={study.startAt} endAt={study.endAt} />
      <StudyLocation place={study.place} />
    </div>
    {study.rejectReason && (
      <div
        className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded"
        role="alert"
      >
        {study.rejectReason}
      </div>
    )}
  </div>
));

StudyCard.displayName = "StudyCard";

const EmptyState = memo(() => (
  <p className="text-slate-500 text-sm">신청한 심야자습이 없습니다</p>
));

EmptyState.displayName = "EmptyState";

const useNightStudies = () => {
  const { accessToken } = useTokenStore();

  return useQuery<NightStudy[]>({
    queryKey: ["night-study"],
    queryFn: async () => {
      const { data } =
        await dodamAxios.get<NightStudyResponse>(`night-study/my`);
      return data.data;
    },
    enabled: !!accessToken,
  });
};

const MyApplicationsSection = memo(() => {
  const { data: myNightStudy } = useNightStudies();

  return (
    <section className="bg-white border border-slate-200 p-4">
      <SectionHeader title="신청 내역" />

      {!myNightStudy?.length ? (
        <EmptyState />
      ) : (
        <div className="space-y-2">
          {myNightStudy.map((study) => (
            <StudyCard key={study.id} study={study} />
          ))}
        </div>
      )}
    </section>
  );
});

MyApplicationsSection.displayName = "MyApplicationsSection";

export default MyApplicationsSection;
