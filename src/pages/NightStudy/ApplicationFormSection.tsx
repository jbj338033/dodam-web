import React, { useState, memo, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiX } from "react-icons/fi";
import dayjs from "dayjs";
import axios from "axios";
import toast from "react-hot-toast";
import { dodamAxios } from "../../libs/axios";
import { NightStudyRequest, PLACES } from "./types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface FormInputProps {
  label: string;
  type: "text" | "date";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const FormInput = memo(
  ({ label, type, value, onChange, placeholder }: FormInputProps) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
      />
    </div>
  )
);

FormInput.displayName = "FormInput";

interface FormSelectProps {
  label: string;
  value: string;
  options: typeof PLACES;
  onChange: (value: string) => void;
}

const FormSelect = memo(
  ({ label, value, options, onChange }: FormSelectProps) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
);

FormSelect.displayName = "FormSelect";

interface FormHeaderProps {
  title: string;
  onClose: () => void;
}

const FormHeader = memo(({ title, onClose }: FormHeaderProps) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="font-bold">{title}</h2>
    <button
      onClick={onClose}
      type="button"
      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
      aria-label="닫기"
    >
      <FiX className="w-5 h-5" />
    </button>
  </div>
));

FormHeader.displayName = "FormHeader";

const initialFormState: NightStudyRequest = {
  content: "",
  startAt: dayjs().format("YYYY-MM-DD"),
  endAt: dayjs().add(2, "week").format("YYYY-MM-DD"),
  doNeedPhone: false,
  place: PLACES[0],
  reasonForPhone: "",
};

const ApplicationFormSection = memo(({ isOpen, onClose }: Props) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<NightStudyRequest>(initialFormState);

  const handleInputChange = useCallback(
    (field: keyof NightStudyRequest) => (value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const applyMutation = useMutation({
    mutationFn: async (data: NightStudyRequest) => {
      await dodamAxios.post(`night-study`, data, {});
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

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      applyMutation.mutate(form);
    },
    [applyMutation, form]
  );

  if (!isOpen) return null;

  return (
    <section className="bg-white border border-slate-200 p-4">
      <FormHeader title="새로운 신청" onClose={onClose} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="신청 내용"
          type="text"
          value={form.content}
          onChange={handleInputChange("content")}
          placeholder="학습 내용을 입력하세요"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="시작일"
            type="date"
            value={form.startAt}
            onChange={handleInputChange("startAt")}
          />
          <FormInput
            label="종료일"
            type="date"
            value={form.endAt}
            onChange={handleInputChange("endAt")}
          />
        </div>

        <FormSelect
          label="학습 장소"
          value={form.place}
          options={PLACES}
          onChange={handleInputChange("place")}
        />

        <button
          type="submit"
          disabled={applyMutation.isPending}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {applyMutation.isPending ? "신청중..." : "신청하기"}
        </button>
      </form>
    </section>
  );
});

ApplicationFormSection.displayName = "ApplicationFormSection";

export default ApplicationFormSection;
