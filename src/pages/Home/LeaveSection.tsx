import { memo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiClock,
  FiMapPin,
  FiPlusCircle,
  FiX,
  FiCalendar,
} from "react-icons/fi";
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

interface OutSleeping {
  id: number;
  reason: string;
  status: "PENDING" | "ALLOWED" | "REJECTED";
  startAt: string;
  endAt: string;
  student: Student;
  rejectReason: string | null;
  createdAt: string;
  modifiedAt: string;
}

interface ApiResponse<T> {
  data: T;
}

const StatusBadge = memo(
  ({ status }: { status: OutGoing["status"] | OutSleeping["status"] }) => (
    <span
      className={`text-xs px-1.5 py-0.5 rounded ${
        status === "PENDING"
          ? "bg-amber-50 text-amber-600"
          : status === "ALLOWED"
            ? "bg-green-50 text-green-600"
            : "bg-red-50 text-red-600"
      }`}
    >
      {status === "PENDING"
        ? "승인 대기"
        : status === "ALLOWED"
          ? "승인됨"
          : "거절됨"}
    </span>
  )
);

StatusBadge.displayName = "StatusBadge";

const TimeInfo = memo(
  ({
    startAt,
    endAt,
    type,
  }: {
    startAt: string;
    endAt: string;
    type: "outgoing" | "sleeping";
  }) => (
    <span className="text-slate-500 flex items-center gap-1 text-sm">
      <FiClock className="w-3 h-3" aria-hidden="true" />
      {type === "outgoing"
        ? `${dayjs(startAt).format("HH:mm")} ~ ${dayjs(endAt).format("HH:mm")}`
        : `${dayjs(startAt).format("MM.DD")} ~ ${dayjs(endAt).format("MM.DD")}`}
    </span>
  )
);

TimeInfo.displayName = "TimeInfo";

interface LeaveCardProps {
  data: OutGoing | OutSleeping;
  type: "outgoing" | "sleeping";
  onDelete: (id: number) => void;
}

const LeaveCard = memo(({ data, type, onDelete }: LeaveCardProps) => (
  <div className="p-3 bg-slate-50 rounded">
    <div className="flex items-start gap-2">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">
            {type === "outgoing" ? "외출" : "외박"}
          </span>
          <StatusBadge status={data.status} />
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
          <TimeInfo startAt={data.startAt} endAt={data.endAt} type={type} />
          {data.reason && (
            <span className="text-slate-500 flex items-center gap-1">
              <FiMapPin className="w-3 h-3" aria-hidden="true" />
              {data.reason}
            </span>
          )}
        </div>
        {data.rejectReason && (
          <div className="text-sm text-red-500 mt-1">
            거절 사유: {data.rejectReason}
          </div>
        )}
      </div>
      {data.status === "PENDING" && (
        <button
          onClick={() => onDelete(data.id)}
          className="text-slate-400 hover:text-slate-600 p-1"
          aria-label="취소"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
));

LeaveCard.displayName = "LeaveCard";

interface LeaveFormProps {
  type: "outgoing" | "sleeping";
  onClose: () => void;
}

const LeaveForm = memo(({ type, onClose }: LeaveFormProps) => {
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [dinnerOrNot, setDinnerOrNot] = useState(false);

  const { mutate: submitLeave } = useMutation({
    mutationFn: async () => {
      const endpoint = type === "outgoing" ? "out-going" : "out-sleeping";
      const payload =
        type === "outgoing"
          ? {
              reason,
              startAt: dayjs(startAt).format("YYYY-MM-DDTHH:mm:00"),
              endAt: dayjs(endAt).format("YYYY-MM-DDTHH:mm:00"),
              dinnerOrNot,
            }
          : {
              reason,
              startAt: dayjs(startAt).format("YYYY-MM-DD"),
              endAt: dayjs(endAt).format("YYYY-MM-DD"),
            };

      await dodamAxios.post(endpoint, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] });
      onClose();
    },
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium">
          {type === "outgoing" ? "외출" : "외박"} 신청
        </h4>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1"
          aria-label="닫기"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="사유"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type={type === "outgoing" ? "datetime-local" : "date"}
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            className="p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type={type === "outgoing" ? "datetime-local" : "date"}
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            className="p-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {type === "outgoing" && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dinnerOrNot}
              onChange={(e) => setDinnerOrNot(e.target.checked)}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600">저녁 식사 포함</span>
          </label>
        )}
        <button
          onClick={() => submitLeave()}
          className="w-full bg-blue-500 text-white py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          신청하기
        </button>
      </div>
    </div>
  );
});

LeaveForm.displayName = "LeaveForm";

const EmptyState = memo(() => (
  <p className="text-slate-500 text-sm">외출/외박 신청 내역이 없습니다</p>
));

EmptyState.displayName = "EmptyState";

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  onAddOutgoing: () => void;
  onAddSleeping: () => void;
}

const SectionHeader = memo(
  ({ icon, title, onAddOutgoing, onAddSleeping }: SectionHeaderProps) => (
    <div className="flex justify-between items-center mb-3">
      <h3 className="font-bold flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="flex gap-2">
        <button
          onClick={onAddOutgoing}
          className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
        >
          <FiPlusCircle className="w-4 h-4" />
          외출
        </button>
        <button
          onClick={onAddSleeping}
          className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
        >
          <FiPlusCircle className="w-4 h-4" />
          외박
        </button>
      </div>
    </div>
  )
);

SectionHeader.displayName = "SectionHeader";

const LeaveSection = memo(() => {
  const [activeForm, setActiveForm] = useState<"outgoing" | "sleeping" | null>(
    null
  );
  const queryClient = useQueryClient();

  const { data: outgoingData } = useQuery<ApiResponse<OutGoing[]>>({
    queryKey: ["outgoing"],
    queryFn: async () => {
      const { data } = await dodamAxios.get("out-going/my");
      return data;
    },
  });

  const { data: sleepingData } = useQuery<ApiResponse<OutSleeping[]>>({
    queryKey: ["sleeping"],
    queryFn: async () => {
      const { data } = await dodamAxios.get("out-sleeping/my");
      return data;
    },
  });

  const { mutate: deleteOutgoing } = useMutation({
    mutationFn: async (id: number) => {
      await dodamAxios.delete(`out-going/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoing"] });
    },
  });

  const { mutate: deleteSleeping } = useMutation({
    mutationFn: async (id: number) => {
      await dodamAxios.delete(`out-sleeping/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sleeping"] });
    },
  });

  return (
    <section className="bg-white border border-slate-200 p-4">
      <SectionHeader
        icon={<FiCalendar className="text-blue-500" />}
        title="외출/외박 현황"
        onAddOutgoing={() => setActiveForm("outgoing")}
        onAddSleeping={() => setActiveForm("sleeping")}
      />

      {activeForm && (
        <LeaveForm type={activeForm} onClose={() => setActiveForm(null)} />
      )}

      {!outgoingData?.data?.length && !sleepingData?.data?.length ? (
        <EmptyState />
      ) : (
        <div className="space-y-2">
          {outgoingData?.data?.map((outgoing) => (
            <LeaveCard
              key={outgoing.id}
              data={outgoing}
              type="outgoing"
              onDelete={deleteOutgoing}
            />
          ))}
          {sleepingData?.data?.map((sleeping) => (
            <LeaveCard
              key={sleeping.id}
              data={sleeping}
              type="sleeping"
              onDelete={deleteSleeping}
            />
          ))}
        </div>
      )}
    </section>
  );
});

LeaveSection.displayName = "LeaveSection";

export default LeaveSection;
