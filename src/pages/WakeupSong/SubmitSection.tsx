import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { dodamAxios } from "../../libs/axios";

export const SubmitSection = () => {
  const queryClient = useQueryClient();
  const [url, setUrl] = useState("");

  const urlMutation = useMutation({
    mutationFn: async (url: string) => {
      await dodamAxios.post(`wakeup-song`, {
        videoUrl: url,
      });
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
          error.response?.data?.message ?? "기상송 신청에 실패했습니다"
        );
      }
    },
  });

  return (
    <div className="bg-white border border-slate-200 p-4">
      <h2 className="font-bold mb-4">기상송 신청</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          urlMutation.mutate(url);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="YouTube URL을 입력하세요"
          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
          disabled={urlMutation.isPending}
        />
        <button
          type="submit"
          disabled={urlMutation.isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {urlMutation.isPending ? "신청중..." : "신청"}
        </button>
      </form>
    </div>
  );
};
