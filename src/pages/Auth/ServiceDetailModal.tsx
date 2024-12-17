import React, { useState, useEffect, memo, useCallback } from "react";
import { FiX, FiEye, FiEyeOff, FiCopy } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ClientDetail } from "./types";
import { ApiResponse } from "../../types/api";
import { dauthAxios } from "../../libs/axios";

interface ServiceDetailProps {
  clientId: string;
  onClose: () => void;
  onUpdate: (updatedService: ClientDetail) => void;
}

interface CopyableFieldProps {
  label: string;
  value: string;
  secret?: boolean;
}

const CopyableField = memo(
  ({ label, value, secret = false }: CopyableFieldProps) => {
    const [showSecret, setShowSecret] = useState(false);

    const handleCopy = useCallback(() => {
      navigator.clipboard.writeText(value);
      toast.success("클립보드에 복사되었습니다");
    }, [value]);

    return (
      <div>
        <h4 className="text-sm font-medium text-slate-500 mb-1">{label}</h4>
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded group">
          <code className="text-sm font-mono text-slate-800">
            {secret ? (showSecret ? value : "••••••••••••••••") : value}
          </code>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
            {secret && (
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="p-1.5 rounded hover:bg-slate-200"
                aria-label={showSecret ? "비밀키 숨기기" : "비밀키 보기"}
              >
                {showSecret ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-slate-200"
              aria-label="클립보드에 복사"
            >
              <FiCopy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

CopyableField.displayName = "CopyableField";

interface ServiceInfoFieldProps {
  label: string;
  value: string;
}

const ServiceInfoField = memo(({ label, value }: ServiceInfoFieldProps) => (
  <div>
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-0.5 truncate">{value}</p>
  </div>
));

ServiceInfoField.displayName = "ServiceInfoField";

interface FormInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
}

const FormInput = memo(({ label, type, value, onChange }: FormInputProps) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
    />
  </div>
));

FormInput.displayName = "FormInput";

const LoadingSpinner = memo(() => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-4 w-full max-w-2xl">
      <div className="flex items-center justify-center h-40">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  </div>
));

LoadingSpinner.displayName = "LoadingSpinner";

const ServiceDetailModal = memo(
  ({ clientId, onClose, onUpdate }: ServiceDetailProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<ClientDetail>>({});

    const { data: clientDetail, isLoading } = useQuery<
      ApiResponse<ClientDetail>
    >({
      queryKey: ["client-detail", clientId],
      queryFn: async () => {
        const { data } = await dauthAxios.get<ApiResponse<ClientDetail>>(
          `client/${clientId}`
        );
        return data;
      },
    });

    useEffect(() => {
      if (clientDetail?.data) {
        setFormData({
          clientName: clientDetail.data.clientName,
          clientUrl: clientDetail.data.clientUrl,
          redirectUrl: clientDetail.data.redirectUrl,
        });
      }
    }, [clientDetail]);

    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        if (clientDetail?.data) {
          onUpdate({
            ...clientDetail.data,
            ...formData,
          });
        }
      },
      [clientDetail?.data, formData, onUpdate]
    );

    const handleInputChange = useCallback(
      (field: keyof ClientDetail) => (value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
      },
      []
    );

    if (isLoading) return <LoadingSpinner />;
    if (!clientDetail?.data) return null;

    const client = clientDetail.data;

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-white rounded-lg p-4 w-full max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 id="modal-title" className="font-bold text-lg">
              서비스 상세 정보
            </h3>
            <button
              onClick={onClose}
              type="button"
              className="p-2 hover:bg-slate-100 rounded"
              aria-label="닫기"
            >
              <FiX />
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="서비스 이름"
                type="text"
                value={formData.clientName || ""}
                onChange={handleInputChange("clientName")}
              />
              <FormInput
                label="서비스 URL"
                type="url"
                value={formData.clientUrl || ""}
                onChange={handleInputChange("clientUrl")}
              />
              <FormInput
                label="리다이렉트 URL"
                type="url"
                value={formData.redirectUrl || ""}
                onChange={handleInputChange("redirectUrl")}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  저장
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                <CopyableField label="Client ID" value={client.clientId} />
                <CopyableField
                  label="Client Secret"
                  value={client.clientSecret}
                  secret
                />

                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-1">
                    서비스 정보
                  </h4>
                  <div className="bg-slate-50 p-3 rounded">
                    <div className="grid grid-cols-2 gap-4">
                      <ServiceInfoField
                        label="서비스 이름"
                        value={client.clientName}
                      />
                      <ServiceInfoField
                        label="도담도담 ID"
                        value={client.dodamId}
                      />
                      <ServiceInfoField
                        label="서비스 URL"
                        value={client.clientUrl}
                      />
                      <ServiceInfoField
                        label="리다이렉트 URL"
                        value={client.redirectUrl}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsEditing(true)}
                  type="button"
                  className="px-4 py-2 text-blue-500 hover:bg-blue-50 rounded"
                >
                  수정하기
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
);

ServiceDetailModal.displayName = "ServiceDetailModal";

export default ServiceDetailModal;
