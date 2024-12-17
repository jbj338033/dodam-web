import { useMemo, useState, memo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { DATE_OPTIONS, AllowedSong } from "./types";
import { ApiResponse } from "../../types/api";
import { dodamAxios } from "../../libs/axios";

interface DateOptionButtonProps {
  option: (typeof DATE_OPTIONS)[number];
  isSelected: boolean;
  onClick: () => void;
}

const DateOptionButton = memo(
  ({ option, isSelected, onClick }: DateOptionButtonProps) => (
    <button
      onClick={onClick}
      type="button"
      className={`px-3 py-1 rounded text-sm ${
        isSelected
          ? "bg-blue-50 text-blue-600"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {option.label}
    </button>
  )
);

DateOptionButton.displayName = "DateOptionButton";

interface SongCardProps {
  song: AllowedSong;
}

const SongCard = memo(({ song }: SongCardProps) => (
  <a
    href={song.videoUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="flex gap-3 p-3 bg-slate-50 rounded hover:bg-slate-100 transition-colors"
  >
    <img
      src={song.thumbnail}
      alt=""
      className="w-16 h-16 rounded object-cover"
    />
    <div className="min-w-0">
      <p className="font-medium truncate hover:text-blue-500 transition-colors">
        {song.videoTitle}
      </p>
      <p className="text-sm text-slate-500 truncate">{song.channelTitle}</p>
      {song.student && (
        <p className="text-xs text-slate-500 mt-1">
          {`${song.student.grade}학년 ${song.student.room}반 ${song.student.number}번`}
        </p>
      )}
    </div>
  </a>
));

SongCard.displayName = "SongCard";

interface DateSelectorProps {
  selectedOffset: number;
  onOffsetChange: (offset: number) => void;
}

const DateSelector = memo(
  ({ selectedOffset, onOffsetChange }: DateSelectorProps) => (
    <div className="flex gap-2">
      {DATE_OPTIONS.map((option) => (
        <DateOptionButton
          key={option.value}
          option={option}
          isSelected={selectedOffset === option.value}
          onClick={() => onOffsetChange(option.value)}
        />
      ))}
    </div>
  )
);

DateSelector.displayName = "DateSelector";

const useAllowedSongs = (selectedDate: dayjs.Dayjs) => {
  return useQuery({
    queryKey: ["wakeup-songs", "allowed", selectedDate.format("YYYY-MM-DD")],
    queryFn: async () => {
      const { data } = await dodamAxios.get<ApiResponse<AllowedSong[]>>(
        `wakeup-song/allowed`,
        {
          params: {
            year: selectedDate.year(),
            month: selectedDate.month() + 1,
            day: selectedDate.date(),
          },
        }
      );
      return data;
    },
  });
};

const EmptyState = memo(() => (
  <p className="text-slate-500 text-sm text-center py-4">
    해당 날짜의 기상송이 없습니다
  </p>
));

EmptyState.displayName = "EmptyState";

const TodaySection = memo(() => {
  const [dateOffset, setDateOffset] = useState(0);

  const selectedDate = useMemo(
    () => dayjs().add(dateOffset, "day"),
    [dateOffset]
  );

  const { data: allowedSongs } = useAllowedSongs(selectedDate);

  const handleOffsetChange = useCallback((offset: number) => {
    setDateOffset(offset);
  }, []);

  return (
    <section className="bg-white border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold">오늘의 기상송</h2>
        <DateSelector
          selectedOffset={dateOffset}
          onOffsetChange={handleOffsetChange}
        />
      </div>
      <div className="space-y-3">
        {!allowedSongs?.data?.length ? (
          <EmptyState />
        ) : (
          allowedSongs.data.map((song) => (
            <SongCard key={song.id} song={song} />
          ))
        )}
      </div>
    </section>
  );
});

TodaySection.displayName = "TodaySection";

export default TodaySection;
