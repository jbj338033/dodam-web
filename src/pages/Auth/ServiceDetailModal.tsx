import { useState, useEffect } from "react";
import { FiX, FiEye, FiEyeOff, FiCopy } from "react-icons/fi";
import { ClientDetail } from "./types";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../types/api";
import { dauthAxios } from "../../libs/axios";

interface ServiceDetailProps {
  clientId: string;
  onClose: () => void;
  onUpdate: (updatedService: ClientDetail) => void;
}

const ServiceDetailModal = ({
  clientId,
  onClose,
  onUpdate,
}: ServiceDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [formData, setFormData] = useState<Partial<ClientDetail>>({});

  const { data: clientDetail, isLoading } = useQuery<ApiResponse<ClientDetail>>(
    {
      queryKey: ["client-detail", clientId],
      queryFn: async () => {
        const { data } = await dauthAxios.get<ApiResponse<ClientDetail>>(
          `client/${clientId}`
        );
        return data;
      },
    }
  );

  useEffect(() => {
    if (clientDetail?.data) {
      setFormData({
        clientName: clientDetail.data.clientName,
        clientUrl: clientDetail.data.clientUrl,
        redirectUrl: clientDetail.data.redirectUrl,
      });
    }
  }, [clientDetail]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("클립보드에 복사되었습니다");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientDetail?.data) {
      onUpdate({
        ...clientDetail.data,
        ...formData,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-4 w-full max-w-2xl">
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!clientDetail?.data) {
    return null;
  }

  const client = clientDetail.data;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">서비스 상세 정보</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded">
            <FiX />
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                서비스 이름
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    clientName: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                서비스 URL
              </label>
              <input
                type="url"
                value={formData.clientUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    clientUrl: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                리다이렉트 URL
              </label>
              <input
                type="url"
                value={formData.redirectUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    redirectUrl: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
              />
            </div>
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
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-1">
                  Client ID
                </h4>
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded group">
                  <code className="text-sm font-mono text-slate-800">
                    {client.clientId}
                  </code>
                  <button
                    onClick={() => handleCopy(client.clientId)}
                    className="p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-200 transition-all"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-1">
                  Client Secret
                </h4>
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded group">
                  <code className="text-sm font-mono text-slate-800">
                    {showSecret ? client.clientSecret : "••••••••••••••••"}
                  </code>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => setShowSecret(!showSecret)}
                      className="p-1.5 rounded hover:bg-slate-200"
                    >
                      {showSecret ? (
                        <FiEyeOff className="w-4 h-4" />
                      ) : (
                        <FiEye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleCopy(client.clientSecret)}
                      className="p-1.5 rounded hover:bg-slate-200"
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-1">
                  서비스 정보
                </h4>
                <div className="bg-slate-50 p-3 rounded">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">서비스 이름</p>
                      <p className="mt-0.5">{client.clientName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">도담도담 ID</p>
                      <p className="mt-0.5">{client.dodamId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">서비스 URL</p>
                      <p className="mt-0.5 truncate">{client.clientUrl}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">리다이렉트 URL</p>
                      <p className="mt-0.5 truncate">{client.redirectUrl}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(true)}
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
};

export default ServiceDetailModal;
