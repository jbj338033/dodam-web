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

const MyApplicationsSection = () => {
  const { accessToken } = useTokenStore();

  const { data: myNightStudy } = useQuery<NightStudy[]>({
    queryKey: ["night-study"],
    queryFn: async () => {
      const { data } =
        await dodamAxios.get<NightStudyResponse>(`night-study/my`);
      return data.data;
    },
    enabled: !!accessToken,
  });

  if (!myNightStudy?.length) {
    return (
      <div className="bg-white border border-slate-200 p-4">
        <h2 className="font-bold mb-3">신청 내역</h2>
        <p className="text-slate-500 text-sm">신청한 심야자습이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 p-4">
      <h2 className="font-bold mb-3">신청 내역</h2>
      <div className="space-y-2">
        {myNightStudy.map((study) => (
          <div key={study.id} className="p-3 bg-slate-50 rounded">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-medium">{study.content}</h3>
              <span
                className={`text-xs px-2 py-0.5 rounded ${STATUS_MAP[study.status].className}`}
              >
                {STATUS_MAP[study.status].text}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <FiCalendar className="w-4 h-4" />
                {dayjs(study.startAt).format("MM.DD")} ~{" "}
                {dayjs(study.endAt).format("MM.DD")}
              </span>
              <span className="flex items-center gap-1">
                <FiMapPin className="w-4 h-4" />
                {study.place}
              </span>
            </div>
            {study.rejectReason && (
              <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded">
                {study.rejectReason}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplicationsSection;
