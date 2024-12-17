import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiClock } from "react-icons/fi";
import dayjs from "dayjs";
import { dodamAxios } from "../../libs/axios";

interface Student {
  id: number;
  name: string;
  grade: number;
  room: number;
  number: number;
  parentPhone: string;
}

interface OutGoing {
  id: number;
  reason: string;
  status: "PENDING" | "ALLOWED" | "REJECTED";
  startAt: string;
  endAt: string;
  student: Student;
  rejectReason: string | null;
  dinnerOrNot: boolean;
  createdAt: string;
  modifiedAt: string;
}

interface ApiResponse<T> {
  data: T;
}

interface OutgoingCardProps {
  outgoing: OutGoing;
}

const OutgoingStatusBadge = memo(
  ({ status }: { status: OutGoing["status"] }) => (
    <span
      className={`text-sm ${
        status === "PENDING" ? "text-amber-500" : "text-green-500"
      }`}
    >
      {status}
    </span>
  )
);

OutgoingStatusBadge.displayName = "OutgoingStatusBadge";

const OutgoingTimeRange = memo(
  ({ startAt, endAt }: { startAt: string; endAt: string }) => (
    <div className="text-sm text-slate-500">
      {dayjs(startAt).format("HH:mm")} ~ {dayjs(endAt).format("HH:mm")}
    </div>
  )
);

OutgoingTimeRange.displayName = "OutgoingTimeRange";

const OutgoingCard = memo(({ outgoing }: OutgoingCardProps) => (
  <div className="p-3 bg-slate-50 rounded">
    <div className="flex items-center justify-between mb-2">
      <span className="font-medium">
        {outgoing.status === "PENDING" ? "승인 대기중" : "승인됨"}
      </span>
      <OutgoingStatusBadge status={outgoing.status} />
    </div>
    <OutgoingTimeRange startAt={outgoing.startAt} endAt={outgoing.endAt} />
  </div>
));

OutgoingCard.displayName = "OutgoingCard";

interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
}

const SectionHeader = memo(({ title, icon }: SectionHeaderProps) => (
  <h3 className="font-bold mb-4 flex items-center gap-2">
    {icon}
    {title}
  </h3>
));

SectionHeader.displayName = "SectionHeader";

const EmptyState = memo(() => (
  <div className="text-slate-500 text-sm">외출/외박 신청 내역이 없습니다.</div>
));

EmptyState.displayName = "EmptyState";

const OutgoingSection = memo(() => {
  const { data: outgoingData } = useQuery<ApiResponse<OutGoing[]>>({
    queryKey: ["outgoing"],
    queryFn: async () => {
      const { data } = await dodamAxios.get(`out-going/my`);
      return data;
    },
  });

  return (
    <section className="bg-white border border-slate-200 p-6">
      <SectionHeader
        title="외출/외박 현황"
        icon={<FiClock className="text-blue-500" />}
      />

      {!outgoingData?.data?.length && <EmptyState />}

      {outgoingData?.data?.map((outgoing) => (
        <OutgoingCard key={outgoing.id} outgoing={outgoing} />
      ))}
    </section>
  );
});

OutgoingSection.displayName = "OutgoingSection";

export default OutgoingSection;
