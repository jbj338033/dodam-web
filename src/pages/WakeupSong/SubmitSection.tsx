import { useState, memo, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { dodamAxios } from "../../libs/axios";

interface SubmitFormProps {
  url: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const SubmitForm = memo(
  ({ url, onChange, onSubmit, isLoading }: SubmitFormProps) => (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="text"
        value={url}
        onChange={(e) => onChange(e.target.value)}
        placeholder="YouTube URL을 입력하세요"
        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
        disabled={isLoading}
        aria-label="YouTube URL 입력"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
      >
        {isLoading ? "신청중..." : "신청"}
      </button>
    </form>
  )
);

SubmitForm.displayName = "SubmitForm";

const useUrlMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (url: string) => {
      await dodamAxios.post(`wakeup-song`, {
        videoUrl: url,
      });
    },
    onSuccess: () => {
      toast.success("기상송이 신청되었습니다");
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
};

const SubmitSection = memo(() => {
  const [url, setUrl] = useState("");
  const urlMutation = useUrlMutation();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      urlMutation.mutate(url, {
        onSuccess: () => setUrl(""),
      });
    },
    [url, urlMutation]
  );

  const handleUrlChange = useCallback((value: string) => {
    setUrl(value);
  }, []);

  return (
    <section className="bg-white border border-slate-200 p-4">
      <h2 className="font-bold mb-4">기상송 신청</h2>
      <SubmitForm
        url={url}
        onChange={handleUrlChange}
        onSubmit={handleSubmit}
        isLoading={urlMutation.isPending}
      />
    </section>
  );
});

SubmitSection.displayName = "SubmitSection";

export default SubmitSection;
