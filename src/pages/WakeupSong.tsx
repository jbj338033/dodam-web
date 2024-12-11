import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../stores/token";
import axios from "axios";
import dayjs from "dayjs";
import {
  FiCalendar,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

interface WakeupSong {
  id: number;
  thumbnail: string;
  videoTitle: string;
  videoId: string;
  videoUrl: string;
  channelTitle: string;
  status: "PENDING" | "ALLOWED" | "REJECTED";
  createdAt: string;
}

interface AllowedSong extends WakeupSong {
  student: {
    id: number;
    name: string;
    grade: number;
    room: number;
    number: number;
  };
}

interface Chart {
  rank: number;
  name: string;
  artist: string;
  album: string;
  thumbnail: string;
}

interface KeywordRequest {
  artist: string;
  title: string;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

type Tab = "today" | "pending" | "my" | "chart";

const TABS = [
  { id: "today" as const, label: "오늘의 기상송" },
  { id: "pending" as const, label: "신청 현황" },
  { id: "my" as const, label: "내 기상송" },
  { id: "chart" as const, label: "멜론 차트" },
] as const;

const STATUS_MAP: Record<
  WakeupSong["status"],
  { text: string; className: string }
> = {
  PENDING: {
    text: "대기중",
    className: "bg-amber-100 text-amber-800",
  },
  ALLOWED: {
    text: "승인됨",
    className: "bg-emerald-100 text-emerald-800",
  },
  REJECTED: {
    text: "거부됨",
    className: "bg-red-100 text-red-800",
  },
};

const WakeupSongPage = () => {
  const queryClient = useQueryClient();
  const { accessToken } = useTokenStore();
  const [activeTab, setActiveTab] = React.useState<Tab>("today");
  const [url, setUrl] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(dayjs());

  const { data: todaySongs } = useQuery({
    queryKey: ["wakeup-songs", "today", selectedDate.format("YYYY-MM-DD")],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<AllowedSong[]>>(
        `${import.meta.env.VITE_API_URL}/wakeup-song/allowed`,
        {
          params: {
            year: selectedDate.year(),
            month: selectedDate.month() + 1,
            day: selectedDate.date(),
          },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return data;
    },
  });

  const { data: pendingSongs } = useQuery({
    queryKey: ["wakeup-songs", "pending"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<WakeupSong[]>>(
        `${import.meta.env.VITE_API_URL}/wakeup-song/pending`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return data;
    },
  });

  const { data: mySongs } = useQuery({
    queryKey: ["wakeup-songs", "my"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<WakeupSong[]>>(
        `${import.meta.env.VITE_API_URL}/wakeup-song/my`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return data;
    },
  });

  const { data: chart } = useQuery({
    queryKey: ["wakeup-songs", "chart"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<Chart[]>>(
        `${import.meta.env.VITE_API_URL}/wakeup-song/chart`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return data;
    },
  });

  const urlMutation = useMutation({
    mutationFn: async (url: string) => {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/wakeup-song`,
        { url },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    },
    onSuccess: () => {
      toast.success("기상송이 신청되었습니다");
      setUrl("");
      queryClient.invalidateQueries({ queryKey: ["wakeup-songs"] });
    },
    onError: (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        toast.error("기상송 신청에 실패했습니다");
        return;
      }

      if (error.response?.data.code === "ALREADY_APPLIED") {
        toast.error("이미 이번주에 기상송을 신청했습니다");
      } else {
        toast.error(
          error.response?.data?.message ?? "기상송 신청에 실패했습니다"
        );
      }
    },
  });

  const keywordMutation = useMutation({
    mutationFn: async (data: KeywordRequest) => {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/wakeup-song/keyword`,
        data,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    },
    onSuccess: () => {
      toast.success("기상송이 신청되었습니다");
      queryClient.invalidateQueries({ queryKey: ["wakeup-songs"] });
    },
    onError: (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        toast.error("기상송 신청에 실패했습니다");
        return;
      }

      if (error.response?.data.code === "ALREADY_APPLIED") {
        toast.error("이미 이번주에 기상송을 신청했습니다");
      } else {
        toast.error(
          error.response?.data?.message ?? "기상송 신청에 실패했습니다"
        );
      }
    },
  });

  const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim()) return;
    urlMutation.mutate(url);
  };

  const handleChartSubmit = (artist: string, title: string) => {
    keywordMutation.mutate({ artist, title });
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-100">
      <main className="h-full container mx-auto px-4 py-8 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* URL Submit Form */}
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">기상송 신청하기</h2>
                <p className="text-purple-100 mt-1">
                  좋아하는 노래로 하루를 시작하세요
                </p>
              </div>
            </div>
            <form onSubmit={handleUrlSubmit} className="flex gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="YouTube URL을 입력하세요"
                className="flex-1 h-12 px-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:border-white/40 text-white placeholder:text-white/60"
              />
              <button
                type="submit"
                disabled={urlMutation.isPending}
                className="px-8 h-12 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-white/90 transition-colors disabled:opacity-70"
              >
                {urlMutation.isPending ? "신청중..." : "신청하기"}
              </button>
            </form>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-200">
              <div className="flex items-center">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-indigo-600"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "today" && (
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <button
                  onClick={() =>
                    setSelectedDate((prev) => prev.subtract(1, "day"))
                  }
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <FiChevronLeft size={20} />
                </button>
                <div className="text-slate-700 font-medium">
                  {selectedDate.format("YYYY년 M월 D일")}
                  {selectedDate.isSame(dayjs(), "day") && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-indigo-100 text-indigo-600 rounded-full">
                      오늘
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedDate((prev) => prev.add(1, "day"))}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}

            <div className="p-6">
              {activeTab === "today" && todaySongs?.data.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  해당 날짜의 기상송이 없습니다
                </div>
              )}

              {activeTab === "today" && (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {todaySongs?.data.map((song) => (
                    <div
                      key={song.id}
                      className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex gap-4">
                        <img
                          src={song.thumbnail}
                          alt={song.videoTitle}
                          className="w-24 h-24 object-cover rounded-lg shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-900 truncate mb-1">
                            {song.videoTitle}
                          </h3>
                          <p className="text-sm text-slate-500 mb-2">
                            {song.channelTitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(activeTab === "pending" || activeTab === "my") && (
                <div className="space-y-4">
                  {(activeTab === "pending"
                    ? pendingSongs?.data
                    : mySongs?.data
                  )?.map((song) => (
                    <div
                      key={song.id}
                      className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex gap-4">
                        <img
                          src={song.thumbnail}
                          alt={song.videoTitle}
                          className="w-24 h-24 object-cover rounded-lg shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4 mb-1">
                            <h3 className="font-medium text-slate-900 truncate">
                              {song.videoTitle}
                            </h3>
                            <span
                              className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium ${
                                STATUS_MAP[song.status].className
                              }`}
                            >
                              {STATUS_MAP[song.status].text}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mb-2">
                            {song.channelTitle}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <FiCalendar size={14} />
                              {dayjs(song.createdAt).format("YYYY.MM.DD")}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiClock size={14} />
                              {dayjs(song.createdAt).format("HH:mm")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "chart" && (
                <div className="rounded-xl overflow-hidden divide-y divide-slate-200">
                  {chart?.data.map((song) => (
                    <div
                      key={song.rank}
                      className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                    >
                      <span className="w-8 text-center font-medium text-slate-500">
                        {song.rank}
                      </span>
                      <img
                        src={song.thumbnail}
                        alt={song.name}
                        className="w-12 h-12 rounded-md shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 truncate">
                          {song.name}
                        </h3>
                        <p className="text-sm text-slate-500 truncate">
                          {song.artist}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleChartSubmit(song.artist, song.name)
                        }
                        disabled={keywordMutation.isPending}
                        className="ml-4 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {keywordMutation.isPending ? "신청중..." : "신청하기"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default WakeupSongPage;
