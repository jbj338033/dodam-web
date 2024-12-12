import { useQuery } from "@tanstack/react-query";
import { FiCalendar, FiClock } from "react-icons/fi";
import dayjs from "dayjs";
import axios from "axios";
import { useTokenStore } from "../../stores/token";
import { WakeupSong, ApiResponse } from "./types";

const STATUS_MAP = {
  PENDING: {
    text: "대기중",
    className: "bg-amber-100 text-amber-800",
  },
  ALLOWED: {
    text: "승인됨",
    className: "bg-green-100 text-green-800",
  },
  REJECTED: {
    text: "거부됨",
    className: "bg-red-100 text-red-800",
  },
} as const;

export const MySongSection = () => {
  const { accessToken } = useTokenStore();

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

  if (!mySongs?.data?.length) {
    return (
      <div className="bg-white border border-slate-200 p-4">
        <h2 className="font-bold mb-3">내 신청 내역</h2>
        <p className="text-slate-500 text-sm">신청한 기상송이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 p-4">
      <h2 className="font-bold mb-3">내 신청 내역</h2>
      <div className="space-y-2">
        {mySongs.data.map((song) => (
          <a
            key={song.id}
            href={song.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 p-3 bg-slate-50 rounded hover:bg-slate-100 transition-colors"
          >
            <img
              src={song.thumbnail}
              alt={song.videoTitle}
              className="w-16 h-16 rounded object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="font-medium truncate">{song.videoTitle}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${STATUS_MAP[song.status].className}`}
                >
                  {STATUS_MAP[song.status].text}
                </span>
              </div>
              <p className="text-sm text-slate-500 truncate">
                {song.channelTitle}
              </p>
              <div className="flex gap-3 mt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <FiCalendar className="w-3 h-3" />
                  {dayjs(song.createdAt).format("YYYY.MM.DD")}
                </span>
                <span className="flex items-center gap-1">
                  <FiClock className="w-3 h-3" />
                  {dayjs(song.createdAt).format("HH:mm")}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
