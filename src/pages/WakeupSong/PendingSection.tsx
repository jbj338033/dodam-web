import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiCalendar, FiClock } from "react-icons/fi";
import dayjs from "dayjs";
import { WakeupSong, ApiResponse } from "./types";
import { dodamAxios } from "../../libs/axios";

interface TimeInfoProps {
  date: string;
}

const TimeInfo = memo(({ date }: TimeInfoProps) => (
  <div className="flex gap-3 mt-1 text-xs text-slate-400">
    <span className="flex items-center gap-1">
      <FiCalendar className="w-3 h-3" aria-hidden="true" />
      {dayjs(date).format("YYYY.MM.DD")}
    </span>
    <span className="flex items-center gap-1">
      <FiClock className="w-3 h-3" aria-hidden="true" />
      {dayjs(date).format("HH:mm")}
    </span>
  </div>
));

TimeInfo.displayName = "TimeInfo";

interface SongCardProps {
  song: WakeupSong;
}

const SongCard = memo(({ song }: SongCardProps) => (
  <div className="flex gap-3 p-3 bg-slate-50 rounded">
    <img
      src={song.thumbnail}
      alt=""
      className="w-16 h-16 rounded object-cover"
    />
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2 mb-1">
        <p className="font-medium truncate">{song.videoTitle}</p>
        <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800">
          대기중
        </span>
      </div>
      <p className="text-sm text-slate-500 truncate">{song.channelTitle}</p>
      <TimeInfo date={song.createdAt} />
    </div>
  </div>
));

SongCard.displayName = "SongCard";

interface EmptySectionProps {
  title: string;
  message: string;
}

const EmptySection = memo(({ title, message }: EmptySectionProps) => (
  <div className="bg-white border border-slate-200 p-4">
    <h2 className="font-bold mb-3">{title}</h2>
    <p className="text-slate-500 text-sm">{message}</p>
  </div>
));

EmptySection.displayName = "EmptySection";

const usePendingSongs = () => {
  return useQuery({
    queryKey: ["wakeup-songs", "pending"],
    queryFn: async () => {
      const { data } =
        await dodamAxios.get<ApiResponse<WakeupSong[]>>(`wakeup-song/pending`);
      return data;
    },
  });
};

const PendingSection = memo(() => {
  const { data: pendingSongs } = usePendingSongs();

  if (!pendingSongs?.data?.length) {
    return (
      <EmptySection
        title="대기 중인 신청"
        message="대기 중인 기상송이 없습니다"
      />
    );
  }

  return (
    <section className="bg-white border border-slate-200 p-4">
      <h2 className="font-bold mb-3">대기 중인 신청</h2>
      <div className="space-y-2">
        {pendingSongs.data.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </section>
  );
});

PendingSection.displayName = "PendingSection";

export default PendingSection;
