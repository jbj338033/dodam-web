import { useQuery } from "@tanstack/react-query";
import { useTokenStore } from "../../stores/token";
import axios from "axios";
import { FiClock } from "react-icons/fi";
import dayjs from "dayjs";

type Student = {
  id: number;
  name: string;
  grade: number;
  room: number;
  number: number;
  parentPhone: string;
};

type OutGoing = {
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
};

type ApiResponse<T> = {
  data: T;
};

const OutgoingSection = () => {
  const { accessToken } = useTokenStore();

  const { data: outgoingData } = useQuery<ApiResponse<OutGoing[]>>({
    queryKey: ["outgoing"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/out-going/my`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return data;
    },
  });

  return (
    <div className="bg-white border border-slate-200 p-6">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <FiClock className="text-blue-500" />
        외출/외박 현황
      </h3>
      {outgoingData?.data?.map((outgoing) => (
        <div key={outgoing.id} className="p-3 bg-slate-50 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">
              {outgoing.status === "PENDING" ? "승인 대기중" : "승인됨"}
            </span>
            <span
              className={`text-sm ${
                outgoing.status === "PENDING"
                  ? "text-amber-500"
                  : "text-green-500"
              }`}
            >
              {outgoing.status}
            </span>
          </div>
          <div className="text-sm text-slate-500">
            {dayjs(outgoing.startAt).format("HH:mm")} ~
            {dayjs(outgoing.endAt).format("HH:mm")}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OutgoingSection;
