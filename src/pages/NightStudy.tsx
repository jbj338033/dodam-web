import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTokenStore } from "../stores/token";
import toast, { Toaster } from "react-hot-toast";
import dayjs from "dayjs";
import { FiCalendar, FiMapPin, FiPlus, FiX } from "react-icons/fi";

interface StudentInfo {
  id: number;
  name: string;
  grade: number;
  room: number;
  number: number;
  parentPhone: string;
}

interface NightStudyRequest {
  content: string;
  startAt: string;
  endAt: string;
  doNeedPhone: boolean;
  place: string;
  reasonForPhone: string;
}

interface NightStudy {
  id: number;
  content: string;
  status: "ALLOWED" | "REJECTED" | "PENDING";
  doNeedPhone: boolean;
  reasonForPhone: string;
  student: StudentInfo;
  place: string;
  rejectReason: string | null;
  startAt: string;
  endAt: string;
  createdAt: string;
  modifiedAt: string;
}

interface NightStudyResponse {
  status: number;
  message: string;
  data: NightStudy[];
}

const PLACES = [
  "프로그래밍1실",
  "프로그래밍2실",
  "프로그래밍3실",
  "수학실",
  "사회실",
  "과학실",
];

const STATUS_MAP = {
  ALLOWED: { text: "승인됨", className: "bg-emerald-100 text-emerald-800" },
  REJECTED: { text: "거부됨", className: "bg-red-100 text-red-800" },
  PENDING: { text: "대기중", className: "bg-amber-100 text-amber-800" },
} as const;

const NightStudyPage = () => {
  const { accessToken } = useTokenStore();
  const [isApplying, setIsApplying] = React.useState(false);
  const [form, setForm] = React.useState<NightStudyRequest>({
    content: "",
    startAt: dayjs().format("YYYY-MM-DD"),
    endAt: dayjs().add(2, "week").format("YYYY-MM-DD"),
    doNeedPhone: false,
    place: PLACES[0],
    reasonForPhone: "",
  });

  const { data: myNightStudy, refetch } = useQuery<NightStudy[]>({
    queryKey: ["night-study"],
    queryFn: async () => {
      const { data } = await axios.get<NightStudyResponse>(
        `${import.meta.env.VITE_API_URL}/night-study/my`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return data.data;
    },
    enabled: !!accessToken,
  });

  const applyMutation = useMutation({
    mutationFn: async (data: NightStudyRequest) => {
      await axios.post(`${import.meta.env.VITE_API_URL}/night-study`, data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    },
    onSuccess: () => {
      toast.success("심야자습 신청이 완료되었습니다");
      setIsApplying(false);
      refetch();
    },
    onError: (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        toast.error("심야자습 신청에 실패했습니다");
        return;
      }

      if (error.response?.data?.code === "APPLICATION_DURATION_PASSED") {
        toast.error("심야자습 신청 기간이 아닙니다");
      } else {
        toast.error("심야자습 신청에 실패했습니다");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyMutation.mutate(form);
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-neutral-50">
      <main className="h-full container mx-auto px-4 py-8 pt-20">
        {/* Header Section */}
        <div className="max-w-5xl mx-auto mb-6">
          <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">심야자습</h1>
                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                  <span className="text-white/90 text-sm">22:50~23:50</span>
                </div>
              </div>
              <p className="text-blue-100">
                심야자습 신청 및 내역을 관리할 수 있습니다
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-5xl mx-auto">
          {/* Current Applications */}
          <div className="space-y-4 mb-6">
            {myNightStudy?.map((study) => (
              <div
                key={study.id}
                className="bg-white rounded-xl shadow-sm border border-neutral-200/60 transition-all hover:border-neutral-300"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-base font-medium text-neutral-900 leading-relaxed">
                      {study.content}
                    </h3>
                    <span
                      className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium ${
                        STATUS_MAP[study.status].className
                      }`}
                    >
                      {STATUS_MAP[study.status].text}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-neutral-600">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="flex-shrink-0" />
                      <span>
                        {dayjs(study.startAt).format("YYYY.MM.DD")} -{" "}
                        {dayjs(study.endAt).format("YYYY.MM.DD")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMapPin className="flex-shrink-0" />
                      <span>{study.place}</span>
                    </div>
                  </div>
                  {study.rejectReason && (
                    <div className="mt-3 p-3 bg-red-50 text-red-800 rounded-lg text-sm">
                      거절 사유: {study.rejectReason}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Application Form */}
          {isApplying ? (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200/60 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-neutral-900">
                  심야자습 신청
                </h2>
                <button
                  onClick={() => setIsApplying(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    신청 내용
                  </label>
                  <input
                    type="text"
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    placeholder="학습 내용을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    신청 기간
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">
                        시작일
                      </label>
                      <input
                        type="date"
                        value={form.startAt}
                        onChange={(e) =>
                          setForm({ ...form, startAt: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">
                        종료일
                      </label>
                      <input
                        type="date"
                        value={form.endAt}
                        onChange={(e) =>
                          setForm({ ...form, endAt: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    학습 장소
                  </label>
                  <select
                    value={form.place}
                    onChange={(e) =>
                      setForm({ ...form, place: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  >
                    {PLACES.map((place) => (
                      <option key={place} value={place}>
                        {place}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={applyMutation.isPending}
                    className="w-full py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium transition-all flex items-center justify-center gap-2"
                  >
                    {applyMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>신청중...</span>
                      </>
                    ) : (
                      "신청하기"
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setIsApplying(true)}
              className="w-full px-6 py-4 bg-white hover:bg-neutral-50 border border-neutral-200/60 rounded-xl text-neutral-900 font-medium transition-all flex items-center justify-center gap-2 group"
            >
              <FiPlus className="text-neutral-400 group-hover:text-neutral-600 transition-colors" />
              새로운 심야자습 신청하기
            </button>
          )}
        </div>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#333333",
            border: "1px solid #e2e8f0",
            padding: "12px 16px",
            fontSize: "14px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
          success: {
            iconTheme: {
              primary: "#4F46E5",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </div>
  );
};

export default NightStudyPage;
