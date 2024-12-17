import React, { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiMusic, FiExternalLink } from "react-icons/fi";
import dayjs from "dayjs";
import { ApiResponse } from "../../types/api";
import { dodamAxios } from "../../libs/axios";

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

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

const SectionHeader = memo(({ icon, title }: SectionHeaderProps) => (
  <h3 className="font-bold mb-3 flex items-center gap-2">
    {icon}
    {title}
  </h3>
));

SectionHeader.displayName = "SectionHeader";

const EmptyState = memo(() => (
  <p className="text-slate-500 text-sm">기상송이 없습니다</p>
));

EmptyState.displayName = "EmptyState";

interface SongCardProps {
  song: WakeupSong;
}

const SongCard = memo(({ song }: SongCardProps) => (
  <a
    href={song.videoUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex gap-3 hover:bg-slate-50 p-2 rounded transition-colors"
  >
    <img
      src={song.thumbnail}
      alt=""
      aria-hidden="true"
      className="w-16 h-16 rounded object-cover"
    />
    <div className="min-w-0 flex-1">
      <div className="flex items-start gap-1.5 mb-0.5">
        <p className="font-medium truncate text-slate-900 group-hover:text-blue-500 transition-colors">
          {song.videoTitle}
        </p>
        <FiExternalLink
          className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 group-hover:text-blue-500 transition-colors mt-1"
          aria-hidden="true"
        />
      </div>
      <p className="text-sm text-slate-500 truncate">{song.channelTitle}</p>
    </div>
  </a>
));

SongCard.displayName = "SongCard";

const useWakeupSongs = () => {
  const today = dayjs();

  return useQuery<ApiResponse<WakeupSong[]>>({
    queryKey: ["wakeup-song", today.format("YYYY-MM-DD")],
    queryFn: async () => {
      const { data } = await dodamAxios.get(`wakeup-song/allowed`, {
        params: {
          year: today.year(),
          month: today.month() + 1,
          day: today.date(),
        },
      });
      return data;
    },
  });
};

const WakeupSongSection = memo(() => {
  const { data: wakeupSongData } = useWakeupSongs();

  return (
    <section className="bg-white border border-slate-200 p-4">
      <SectionHeader
        icon={<FiMusic className="text-blue-500" />}
        title="기상송"
      />

      {!wakeupSongData?.data?.length ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {wakeupSongData.data.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </section>
  );
});

WakeupSongSection.displayName = "WakeupSongSection";

export default WakeupSongSection;
