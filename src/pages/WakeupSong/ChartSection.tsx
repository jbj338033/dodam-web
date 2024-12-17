import { memo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Chart, KeywordRequest } from "./types";
import { ApiResponse } from "../../types/api";
import { dodamAxios } from "../../libs/axios";

interface SongItemProps {
  song: Chart;
  onRequest: (artist: string, title: string) => void;
  isLoading: boolean;
}

const SongItem = memo(({ song, onRequest, isLoading }: SongItemProps) => (
  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded">
    <span className="w-6 text-center font-medium text-slate-500">
      {song.rank}
    </span>
    <img
      src={song.thumbnail}
      alt=""
      className="w-12 h-12 rounded object-cover"
    />
    <div className="flex-1 min-w-0">
      <p className="font-medium truncate">{song.name}</p>
      <p className="text-sm text-slate-500 truncate">{song.artist}</p>
    </div>
    <button
      onClick={() => onRequest(song.artist, song.name)}
      disabled={isLoading}
      type="button"
      className="px-3 py-1.5 text-sm bg-slate-200 hover:bg-slate-300 rounded transition-colors disabled:opacity-50"
    >
      신청
    </button>
  </div>
));

SongItem.displayName = "SongItem";

const useChartData = () => {
  return useQuery({
    queryKey: ["wakeup-songs", "chart"],
    queryFn: async () => {
      const { data } =
        await dodamAxios.get<ApiResponse<Chart[]>>(`wakeup-song/chart`);
      return data;
    },
  });
};

const useKeywordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: KeywordRequest) => {
      await dodamAxios.post(`wakeup-song/keyword`, data);
    },
    onSuccess: () => {
      toast.success("기상송이 신청되었습니다");
      queryClient.invalidateQueries({ queryKey: ["wakeup-songs"] });
    },
    onError: (error: unknown) => {
      if (
        axios.isAxiosError(error) &&
        error.response?.data.code === "ALREADY_APPLIED"
      ) {
        toast.error("이미 이번주에 기상송을 신청했습니다");
      } else {
        toast.error("기상송 신청에 실패했습니다");
      }
    },
  });
};

const ChartSection = memo(() => {
  const { data: chart } = useChartData();
  const keywordMutation = useKeywordMutation();

  const handleRequest = useCallback(
    (artist: string, title: string) => {
      keywordMutation.mutate({ artist, title });
    },
    [keywordMutation]
  );

  return (
    <section className="bg-white border border-slate-200 p-4">
      <h2 className="font-bold mb-4">멜론 차트</h2>
      <div className="space-y-3">
        {chart?.data.map((song) => (
          <SongItem
            key={song.rank}
            song={song}
            onRequest={handleRequest}
            isLoading={keywordMutation.isPending}
          />
        ))}
      </div>
    </section>
  );
});

ChartSection.displayName = "ChartSection";

export default ChartSection;
