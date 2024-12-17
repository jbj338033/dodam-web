import React, { useState, memo, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { RegisterData } from "./types";
import { dauthAxios } from "../../libs/axios";

interface Props {
  onClose: () => void;
}

interface InputFieldProps {
  type: "text" | "url";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const InputField = memo(
  ({ type, placeholder, value, onChange, required }: InputFieldProps) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
      required={required}
    />
  )
);

InputField.displayName = "InputField";

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

const SelectField = memo(({ value, onChange, options }: SelectFieldProps) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
));

SelectField.displayName = "SelectField";

const FRONTEND_OPTIONS = [
  { value: "1", label: "React" },
  { value: "2", label: "Vue" },
  { value: "3", label: "Angular" },
];

const BACKEND_OPTIONS = [
  { value: "1", label: "Spring" },
  { value: "2", label: "Node.js" },
  { value: "3", label: "Django" },
];

const RegistrationModal = memo(({ onClose }: Props) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<RegisterData>({
    clientName: "",
    clientUrl: "",
    redirectUrl: "",
    frontEnd: "1",
    backEnd: "1",
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      await dauthAxios.post(`client/register`, data);
    },
    onSuccess: () => {
      toast.success("서비스가 등록되었습니다");
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
      onClose();
    },
    onError: () => {
      toast.error("서비스 등록에 실패했습니다");
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      registerMutation.mutate(formData);
    },
    [formData, registerMutation]
  );

  const handleInputChange = useCallback(
    (field: keyof RegisterData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 id="modal-title" className="font-bold">
            서비스 등록
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 hover:bg-slate-100 rounded-full"
            aria-label="닫기"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            type="text"
            placeholder="서비스 이름"
            value={formData.clientName}
            onChange={handleInputChange("clientName")}
            required
          />
          <InputField
            type="url"
            placeholder="서비스 URL"
            value={formData.clientUrl}
            onChange={handleInputChange("clientUrl")}
            required
          />
          <InputField
            type="url"
            placeholder="리다이렉트 URL"
            value={formData.redirectUrl}
            onChange={handleInputChange("redirectUrl")}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <SelectField
              value={formData.frontEnd}
              onChange={handleInputChange("frontEnd")}
              options={FRONTEND_OPTIONS}
            />
            <SelectField
              value={formData.backEnd}
              onChange={handleInputChange("backEnd")}
              options={BACKEND_OPTIONS}
            />
          </div>
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {registerMutation.isPending ? "등록중..." : "등록하기"}
          </button>
        </form>
      </div>
    </div>
  );
});

RegistrationModal.displayName = "RegistrationModal";

export default RegistrationModal;
