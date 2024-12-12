import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useTokenStore } from "../../stores/token";
import { Chart, KeywordRequest } from "./types";
import toast from "react-hot-toast";
import { ApiResponse } from "../../types/api";

export const ChartSection = () => {
  const { accessToken } = useTokenStore();
  const queryClient = useQueryClient();

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

  return (
    <div className="bg-white border border-slate-200 p-4">
      <h2 className="font-bold mb-4">멜론 차트</h2>
      <div className="space-y-3">
        {chart?.data.map((song) => (
          <div
            key={song.rank}
            className="flex items-center gap-3 p-3 bg-slate-50 rounded"
          >
            <span className="w-6 text-center font-medium text-slate-500">
              {song.rank}
            </span>
            <img
              src={song.thumbnail}
              alt={song.name}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{song.name}</p>
              <p className="text-sm text-slate-500 truncate">{song.artist}</p>
            </div>
            <button
              onClick={() =>
                keywordMutation.mutate({
                  artist: song.artist,
                  title: song.name,
                })
              }
              disabled={keywordMutation.isPending}
              className="px-3 py-1.5 text-sm bg-slate-200 hover:bg-slate-300 rounded transition-colors"
            >
              신청
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
