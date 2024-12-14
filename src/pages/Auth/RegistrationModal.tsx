import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiX } from "react-icons/fi";
import { RegisterData } from "./types";
import toast from "react-hot-toast";
import { useState } from "react";
import { dauthAxios } from "../../libs/axios";

interface Props {
  onClose: () => void;
}

const RegistrationModal = ({ onClose }: Props) => {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">서비스 등록</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            registerMutation.mutate(formData);
          }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="서비스 이름"
            value={formData.clientName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, clientName: e.target.value }))
            }
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
            required
          />
          <input
            type="url"
            placeholder="서비스 URL"
            value={formData.clientUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, clientUrl: e.target.value }))
            }
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
            required
          />
          <input
            type="url"
            placeholder="리다이렉트 URL"
            value={formData.redirectUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, redirectUrl: e.target.value }))
            }
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={formData.frontEnd}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, frontEnd: e.target.value }))
              }
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
            >
              <option value="1">React</option>
              <option value="2">Vue</option>
              <option value="3">Angular</option>
            </select>
            <select
              value={formData.backEnd}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, backEnd: e.target.value }))
              }
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
            >
              <option value="1">Spring</option>
              <option value="2">Node.js</option>
              <option value="3">Django</option>
            </select>
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
};

export default RegistrationModal;
