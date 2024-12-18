import { memo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiMapPin, FiClock } from "react-icons/fi";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { ApiResponse } from "../../types/api";
import { dodamAxios } from "../../libs/axios";

interface Bus {
  id: number;
  busName: string;
  description: string;
  peopleLimit: number;
  applyCount: number;
  leaveTime: string;
  timeRequired: string;
}

interface BusSectionWrapperProps {
  children: React.ReactNode;
}

const BusSectionWrapper = memo(({ children }: BusSectionWrapperProps) => (
  <div className="bg-white border border-slate-200 p-4">
    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
      <FiMapPin className="text-blue-500" />
      하교 버스
    </h3>
    {children}
  </div>
));

BusSectionWrapper.displayName = "BusSectionWrapper";

const LoadingState = memo(() => (
  <div className="text-slate-500 text-sm">버스 정보를 불러오는 중...</div>
));

LoadingState.displayName = "LoadingState";

const EmptyState = memo(() => (
  <div className="text-slate-500 text-sm">현재 운행 중인 버스가 없습니다.</div>
));

EmptyState.displayName = "EmptyState";

interface BusCardProps {
  bus: Bus;
  isApplied: boolean;
  onApply: (bus: Bus) => void;
}

const BusCard = memo(({ bus, isApplied, onApply }: BusCardProps) => {
  const isFull = bus.applyCount >= bus.peopleLimit;

  const getButtonStyle = useCallback(() => {
    if (isApplied) return "bg-blue-100 text-blue-700 cursor-default";
    if (isFull) return "bg-slate-200 text-slate-500 cursor-not-allowed";
    return "bg-blue-500 text-white hover:bg-blue-600";
  }, [isApplied, isFull]);

  const getButtonText = useCallback(() => {
    if (isApplied) return "신청됨";
    if (isFull) return "만석";
    return "신청";
  }, [isApplied, isFull]);

  const formatTimeRequired = useCallback((timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    if (hours > 0 && minutes > 0) return `${hours}시간 ${minutes}분`;
    if (hours > 0) return `${hours}시간`;
    if (minutes > 0) return `${minutes}분`;
    return "0분";
  }, []);

  return (
    <div
      className={`p-3 rounded ${isApplied ? "bg-blue-50" : "bg-slate-50 hover:bg-slate-100"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{bus.busName}</span>
            {isApplied && (
              <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded">
                신청됨
              </span>
            )}
          </div>
          <div className="text-sm text-slate-500 flex items-center gap-2 mt-0.5">
            <span>{bus.description}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <FiClock className="w-3 h-3" />
              {dayjs(bus.leaveTime).format("HH:mm")}
            </span>
            <span>·</span>
            <span>{formatTimeRequired(bus.timeRequired)} 소요</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">
            <span className={isFull ? "text-red-500" : "text-blue-500"}>
              {bus.applyCount}
            </span>
            <span className="text-slate-400">/{bus.peopleLimit}</span>
          </span>
          <button
            onClick={() => onApply(bus)}
            disabled={isFull && !isApplied}
            className={`text-sm px-3 py-1 rounded ${getButtonStyle()}`}
            type="button"
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
});

BusCard.displayName = "BusCard";

const BusSection = memo(() => {
  const queryClient = useQueryClient();

  const { data: busData, isLoading } = useQuery<ApiResponse<Bus[]>>({
    queryKey: ["bus"],
    queryFn: async () => {
      const { data } = await dodamAxios.get(`bus`);
      return data;
    },
  });

  const { data: myBusData } = useQuery<ApiResponse<Bus>>({
    queryKey: ["bus", "apply"],
    queryFn: async () => {
      const { data } = await dodamAxios.get(`bus/apply`);
      return data;
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (busId: number) => {
      await dodamAxios.post(`bus/apply/${busId}`);
    },
    onSuccess: () => {
      toast.success("버스 신청이 완료되었습니다");
      queryClient.invalidateQueries({ queryKey: ["bus"] });
      queryClient.invalidateQueries({ queryKey: ["bus", "apply"] });
    },
    onError: () => {
      toast.error("버스 신청에 실패했습니다");
    },
  });

  const handleApply = useCallback(
    (bus: Bus) => {
      if (!myBusData?.data) {
        applyMutation.mutate(bus.id);
        return;
      }

      if (myBusData.data.id === bus.id) return;

      if (
        window.confirm(
          `현재 ${myBusData.data.busName}에서 ${bus.busName}으로 변경하시겠습니까?`
        )
      ) {
        applyMutation.mutate(bus.id);
      }
    },
    [myBusData?.data, applyMutation]
  );

  if (isLoading) {
    return (
      <BusSectionWrapper>
        <LoadingState />
      </BusSectionWrapper>
    );
  }

  if (!busData?.data?.length) {
    return (
      <BusSectionWrapper>
        <EmptyState />
      </BusSectionWrapper>
    );
  }

  return (
    <BusSectionWrapper>
      <div className="space-y-2">
        {busData.data.map((bus) => (
          <BusCard
            key={bus.id}
            bus={bus}
            isApplied={myBusData?.data?.id === bus.id}
            onApply={handleApply}
          />
        ))}
      </div>
    </BusSectionWrapper>
  );
});

BusSection.displayName = "BusSection";

export default BusSection;
