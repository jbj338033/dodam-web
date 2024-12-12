import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NightStudyRequest, PLACES } from "./types";
import { useTokenStore } from "../../stores/token";
import { FiX } from "react-icons/fi";
import dayjs from "dayjs";
import axios from "axios";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationFormSection = ({ isOpen, onClose }: Props) => {
  const { accessToken } = useTokenStore();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<NightStudyRequest>({
    content: "",
    startAt: dayjs().format("YYYY-MM-DD"),
    endAt: dayjs().add(2, "week").format("YYYY-MM-DD"),
    doNeedPhone: false,
    place: PLACES[0],
    reasonForPhone: "",
  });

  const applyMutation = useMutation({
    mutationFn: async (data: NightStudyRequest) => {
      await axios.post(`${import.meta.env.VITE_API_URL}/night-study`, data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    },
    onSuccess: () => {
      toast.success("심야자습 신청이 완료되었습니다");
      queryClient.invalidateQueries({ queryKey: ["night-study"] });
      onClose();
    },
    onError: (error: unknown) => {
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.code === "APPLICATION_DURATION_PASSED"
      ) {
        toast.error("심야자습 신청 기간이 아닙니다");
      } else {
        toast.error("심야자습 신청에 실패했습니다");
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="bg-white border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold">새로운 신청</h2>
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyMutation.mutate(form);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            신청 내용
          </label>
          <input
            type="text"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
            placeholder="학습 내용을 입력하세요"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              시작일
            </label>
            <input
              type="date"
              value={form.startAt}
              onChange={(e) => setForm({ ...form, startAt: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              종료일
            </label>
            <input
              type="date"
              value={form.endAt}
              onChange={(e) => setForm({ ...form, endAt: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            학습 장소
          </label>
          <select
            value={form.place}
            onChange={(e) => setForm({ ...form, place: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
          >
            {PLACES.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={applyMutation.isPending}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {applyMutation.isPending ? "신청중..." : "신청하기"}
        </button>
      </form>
    </div>
  );
};

export default ApplicationFormSection;
