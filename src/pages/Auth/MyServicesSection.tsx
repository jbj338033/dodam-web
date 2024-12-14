import { useState } from "react";
import ServiceDetailModal from "./ServiceDetailModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiX } from "react-icons/fi";
import { Client, ClientDetail } from "./types";
import { ApiResponse } from "../../types/api";
import toast from "react-hot-toast";
import { dauthAxios } from "../../libs/axios";

const MyServicesSection = () => {
  const queryClient = useQueryClient();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const { data: myServices } = useQuery<ApiResponse<Client[]>>({
    queryKey: ["my-services"],
    queryFn: async () => {
      const { data } = await dauthAxios.get(`client/id`);
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (service: ClientDetail) => {
      await dauthAxios.put(`client/${service.clientId}`, service);
    },
    onSuccess: () => {
      toast.success("서비스가 수정되었습니다");
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
      setSelectedClientId(null);
    },
    onError: () => {
      toast.error("서비스 수정에 실패했습니다");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (clientId: string) => {
      await dauthAxios.delete(`client/${clientId}`);
    },
    onSuccess: () => {
      toast.success("서비스가 삭제되었습니다");
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
    },
    onError: () => {
      toast.error("서비스 삭제에 실패했습니다");
    },
  });

  return (
    <div className="bg-white border border-slate-200 p-4">
      <h2 className="font-bold mb-4">내 서비스</h2>
      {!myServices?.data?.length ? (
        <p className="text-slate-500 text-sm">등록된 서비스가 없습니다</p>
      ) : (
        <div className="space-y-2">
          {myServices.data.map((service) => (
            <div
              key={service.clientId}
              onClick={() => setSelectedClientId(service.clientId)}
              className="p-3 bg-slate-50 rounded group relative hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMutation.mutate(service.clientId);
                }}
                className="absolute right-3 top-3 p-1.5 rounded-full hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-all"
              >
                <FiX className="w-4 h-4" />
              </button>
              <h3 className="font-medium mb-1">{service.clientName}</h3>
              <p className="text-sm text-slate-500 truncate">
                {service.clientUrl}
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedClientId && (
        <ServiceDetailModal
          clientId={selectedClientId}
          onClose={() => setSelectedClientId(null)}
          onUpdate={updateMutation.mutate}
        />
      )}
    </div>
  );
};

export default MyServicesSection;
