import { useQuery } from "@tanstack/react-query";
import { FiMusic, FiExternalLink } from "react-icons/fi";
import dayjs from "dayjs";
import { ApiResponse } from "../../types/api";
import { dodamAxios } from "../../libs/axios";

type WakeupSong = {
  id: number;
  thumbnail: string;
  videoTitle: string;
  videoId: string;
  videoUrl: string;
  channelTitle: string;
  status: "PENDING" | "ALLOWED" | "REJECTED";
  createdAt: string;
};

const WakeupSongSection = () => {
  const today = dayjs();

  const { data: wakeupSongData } = useQuery<ApiResponse<WakeupSong[]>>({
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

  if (!wakeupSongData?.data?.length) {
    return (
      <div className="bg-white border border-slate-200 p-4">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <FiMusic className="text-blue-500" />
          기상송
        </h3>
        <p className="text-slate-500 text-sm">기상송이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 p-4">
      <h3 className="font-bold mb-3 flex items-center gap-2">
        <FiMusic className="text-blue-500" />
        기상송
      </h3>
      <div className="space-y-3">
        {wakeupSongData.data.map((song) => (
          <a
            key={song.id}
            href={song.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-3 hover:bg-slate-50 p-2 rounded transition-colors"
          >
            <img
              src={song.thumbnail}
              alt={song.videoTitle}
              className="w-16 h-16 rounded object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-1.5 mb-0.5">
                <p className="font-medium truncate text-slate-900 group-hover:text-blue-500 transition-colors">
                  {song.videoTitle}
                </p>
                <FiExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 group-hover:text-blue-500 transition-colors mt-1" />
              </div>
              <p className="text-sm text-slate-500 truncate">
                {song.channelTitle}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default WakeupSongSection;
