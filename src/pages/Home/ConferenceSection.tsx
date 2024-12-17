import React, { memo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiCalendar, FiExternalLink } from "react-icons/fi";
import dayjs from "dayjs";
import { ApiResponse } from "../../types/api";
import { dodamAxios } from "../../libs/axios";

interface Conference {
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  eventType: string;
  link: string;
}

interface SectionWrapperProps {
  children: React.ReactNode;
}

const SectionWrapper = memo(({ children }: SectionWrapperProps) => (
  <div className="bg-white border border-slate-200 p-4">
    <h2 className="font-bold mb-3 flex items-center gap-2">
      <FiCalendar className="text-blue-500" />
      개발자 행사
    </h2>
    {children}
  </div>
));

SectionWrapper.displayName = "SectionWrapper";

interface ConferenceCardProps {
  conference: Conference;
}

const ConferenceCard = memo(({ conference }: ConferenceCardProps) => {
  const formatDate = useCallback(() => {
    const start = dayjs(conference.startDate).format("MM.DD");
    if (!conference.endDate || conference.endDate === conference.startDate) {
      return start;
    }
    return `${start} - ${dayjs(conference.endDate).format("MM.DD")}`;
  }, [conference.startDate, conference.endDate]);

  return (
    <a
      href={conference.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-3 rounded bg-slate-50 hover:bg-slate-100 transition-colors"
    >
      <div className="flex items-start gap-2 mb-1">
        <h3 className="font-medium text-slate-900 group-hover:text-blue-500 flex-1 transition-colors">
          {conference.title}
        </h3>
        <FiExternalLink
          className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors mt-1"
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
        <span>{conference.organization}</span>
        <span>{conference.eventType}</span>
        <span>{formatDate()}</span>
      </div>
    </a>
  );
});

ConferenceCard.displayName = "ConferenceCard";

const LoadingState = memo(() => (
  <div className="text-slate-500 text-sm">행사 정보를 불러오는 중...</div>
));

LoadingState.displayName = "LoadingState";

const EmptyState = memo(() => (
  <div className="text-slate-500 text-sm">예정된 개발자 행사가 없습니다.</div>
));

EmptyState.displayName = "EmptyState";

const ConferenceSection = memo(() => {
  const { data: conferenceData, isLoading } = useQuery<
    ApiResponse<Conference[]>
  >({
    queryKey: ["conference"],
    queryFn: async () => {
      const { data } = await dodamAxios.get(`conference`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <SectionWrapper>
        <LoadingState />
      </SectionWrapper>
    );
  }

  if (!conferenceData?.data?.length) {
    return (
      <SectionWrapper>
        <EmptyState />
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <div className="space-y-2">
        {conferenceData.data.map((conference, index) => (
          <ConferenceCard
            key={`${conference.title}-${index}`}
            conference={conference}
          />
        ))}
      </div>
    </SectionWrapper>
  );
});

ConferenceSection.displayName = "ConferenceSection";

export default ConferenceSection;
