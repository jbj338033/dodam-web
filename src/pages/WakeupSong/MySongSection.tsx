import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiCalendar, FiClock } from "react-icons/fi";
import dayjs from "dayjs";
import { WakeupSong, ApiResponse } from "./types";
import { dodamAxios } from "../../libs/axios";

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

interface SongStatusProps {
  status: keyof typeof STATUS_MAP;
}

const SongStatus = memo(({ status }: SongStatusProps) => (
  <span
    className={`text-xs px-2 py-0.5 rounded ${STATUS_MAP[status].className}`}
  >
    {STATUS_MAP[status].text}
  </span>
));

SongStatus.displayName = "SongStatus";

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
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2 mb-1">
        <p className="font-medium truncate">{song.videoTitle}</p>
        <SongStatus status={song.status} />
      </div>
      <p className="text-sm text-slate-500 truncate">{song.channelTitle}</p>
      <TimeInfo date={song.createdAt} />
    </div>
  </a>
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

const useMySongs = () => {
  return useQuery({
    queryKey: ["wakeup-songs", "my"],
    queryFn: async () => {
      const { data } =
        await dodamAxios.get<ApiResponse<WakeupSong[]>>(`wakeup-song/my`);
      return data;
    },
  });
};

const MySongSection = memo(() => {
  const { data: mySongs } = useMySongs();

  if (!mySongs?.data?.length) {
    return (
      <EmptySection title="내 신청 내역" message="신청한 기상송이 없습니다" />
    );
  }

  return (
    <section className="bg-white border border-slate-200 p-4">
      <h2 className="font-bold mb-3">내 신청 내역</h2>
      <div className="space-y-2">
        {mySongs.data.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </section>
  );
});

MySongSection.displayName = "MySongSection";

export default MySongSection;
