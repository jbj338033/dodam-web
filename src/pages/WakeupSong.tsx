import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../stores/token";
import axios from "axios";
import dayjs from "dayjs";
import { FiCalendar, FiClock } from "react-icons/fi";
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
  student?: {
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

const DATE_OPTIONS = [
  { label: "어제", value: -1 },
  { label: "오늘", value: 0 },
  { label: "내일", value: 1 },
] as const;

const WakeupSongPage = () => {
  const queryClient = useQueryClient();
  const { accessToken } = useTokenStore();
  const [activeTab, setActiveTab] = React.useState<Tab>("today");
  const [url, setUrl] = React.useState("");
  const [dateOffset, setDateOffset] = React.useState<number>(0);

  const selectedDate = React.useMemo(
    () => dayjs().add(dateOffset, "day"),
    [dateOffset],
  );

  const { data: allowedSongs } = useQuery({
    queryKey: ["wakeup-songs", "allowed", selectedDate.format("YYYY-MM-DD")],
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
        },
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
        },
      );
      return data;
    },
    enabled: activeTab === "pending",
  });

  const { data: mySongs } = useQuery({
    queryKey: ["wakeup-songs", "my"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<WakeupSong[]>>(
        `${import.meta.env.VITE_API_URL}/wakeup-song/my`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return data;
    },
    enabled: activeTab === "my",
  });

  const { data: chart } = useQuery({
    queryKey: ["wakeup-songs", "chart"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<Chart[]>>(
        `${import.meta.env.VITE_API_URL}/wakeup-song/chart`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return data;
    },
    enabled: activeTab === "chart",
  });

  const urlMutation = useMutation({
    mutationFn: async (url: string) => {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/wakeup-song`,
        { videoUrl: url },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
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
          error.response?.data?.message ?? "기상송 신청에 실패했습니다",
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
        },
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
          error.response?.data?.message ?? "기상송 신청에 실패했습니다",
        );
      }
    },
  });

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-50">
      <main className="h-full container mx-auto px-4 py-8 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Submit Form */}
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">기상송 신청하기</h2>
                <p className="text-indigo-100 mt-1">
                  좋아하는 노래로 하루를 시작하세요
                </p>
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                urlMutation.mutate(url);
              }}
              className="flex gap-3"
            >
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="YouTube URL을 입력하세요"
                className="flex-1 h-12 px-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:border-white/40 text-white placeholder:text-white/60"
                disabled={urlMutation.isPending}
              />
              <button
                type="submit"
                disabled={urlMutation.isPending}
                className="px-8 h-12 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-white/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {urlMutation.isPending ? "신청중..." : "신청하기"}
              </button>
            </form>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center border-b border-slate-200">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium transition-colors relative ${
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

            {/* Date Selector - Only for Today tab */}
            {activeTab === "today" && (
              <div className="p-4 border-b border-slate-200 flex items-center justify-center gap-2">
                {DATE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDateOffset(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      dateOffset === option.value
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {option.label}
                    {option.value === 0 && (
                      <span className="ml-1 text-xs">
                        ({selectedDate.format("MM.DD")})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Today's Songs */}
              {activeTab === "today" && (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {allowedSongs?.data.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500">
                      해당 날짜의 기상송이 없습니다
                    </div>
                  ) : (
                    allowedSongs?.data.map((song) => (
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
                            {song.student && (
                              <div className="text-sm text-slate-600">
                                {`${song.student.grade}학년 ${song.student.room}반 ${song.student.number}번`}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Pending Songs */}
              {activeTab === "pending" && (
                <div className="space-y-4">
                  {pendingSongs?.data.map((song) => (
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

              {/* My Songs */}
              {activeTab === "my" && (
                <div className="space-y-4">
                  {mySongs?.data.map((song) => (
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

              {/* Chart */}
              {activeTab === "chart" && (
                <div className="divide-y divide-slate-200">
                  {chart?.data.map((song) => (
                    <div
                      key={song.rank}
                      className="flex items-center gap-4 py-4 px-2 hover:bg-slate-50 transition-colors first:pt-0 last:pb-0"
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
                          keywordMutation.mutate({
                            artist: song.artist,
                            title: song.name,
                          })
                        }
                        disabled={keywordMutation.isPending}
                        className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
