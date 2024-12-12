import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import axios from "axios";
import { useTokenStore } from "../../stores/token";
import { DATE_OPTIONS, AllowedSong } from "./types";
import { useMemo, useState } from "react";
import { ApiResponse } from "../../types/api";

export const TodaySection = () => {
  const { accessToken } = useTokenStore();
  const [dateOffset, setDateOffset] = useState(0);

  const selectedDate = useMemo(
    () => dayjs().add(dateOffset, "day"),
    [dateOffset]
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
        }
      );
      return data;
    },
  });

  return (
    <div className="bg-white border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold">오늘의 기상송</h2>
        <div className="flex gap-2">
          {DATE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setDateOffset(option.value)}
              className={`px-3 py-1 rounded text-sm ${
                dateOffset === option.value
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {!allowedSongs?.data?.length ? (
          <p className="text-slate-500 text-sm text-center py-4">
            해당 날짜의 기상송이 없습니다
          </p>
        ) : (
          allowedSongs.data.map((song) => (
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
              <div className="min-w-0">
                <p className="font-medium truncate hover:text-blue-500 transition-colors">
                  {song.videoTitle}
                </p>
                <p className="text-sm text-slate-500 truncate">
                  {song.channelTitle}
                </p>
                {song.student && (
                  <p className="text-xs text-slate-500 mt-1">
                    {`${song.student.grade}학년 ${song.student.room}반 ${song.student.number}번`}
                  </p>
                )}
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
};
