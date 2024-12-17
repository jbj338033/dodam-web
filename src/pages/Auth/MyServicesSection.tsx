import React, { useState, memo, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import ServiceDetailModal from "./ServiceDetailModal";
import { Client, ClientDetail } from "./types";
import { ApiResponse } from "../../types/api";
import { dauthAxios } from "../../libs/axios";

interface ServiceItemProps {
  service: Client;
  onSelect: (clientId: string) => void;
  onDelete: (clientId: string) => void;
}

const ServiceItem = memo(
  ({ service, onSelect, onDelete }: ServiceItemProps) => {
    const handleDelete = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(service.clientId);
      },
      [service.clientId, onDelete]
    );

    const handleClick = useCallback(() => {
      onSelect(service.clientId);
    }, [service.clientId, onSelect]);

    return (
      <div
        onClick={handleClick}
        className="p-3 bg-slate-50 rounded group relative hover:bg-slate-100 cursor-pointer transition-colors"
      >
        <button
          onClick={handleDelete}
          type="button"
          className="absolute right-3 top-3 p-1.5 rounded-full hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-all"
          aria-label="서비스 삭제"
        >
          <FiX className="w-4 h-4" />
        </button>
        <h3 className="font-medium mb-1">{service.clientName}</h3>
        <p className="text-sm text-slate-500 truncate">{service.clientUrl}</p>
      </div>
    );
  }
);

ServiceItem.displayName = "ServiceItem";

interface ServiceListProps {
  services: Client[];
  onSelect: (clientId: string) => void;
  onDelete: (clientId: string) => void;
}

const ServiceList = memo(
  ({ services, onSelect, onDelete }: ServiceListProps) => {
    if (!services.length) {
      return <p className="text-slate-500 text-sm">등록된 서비스가 없습니다</p>;
    }

    return (
      <div className="space-y-2">
        {services.map((service) => (
          <ServiceItem
            key={service.clientId}
            service={service}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }
);

ServiceList.displayName = "ServiceList";

const MyServicesSection = memo(() => {
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

  const handleSelect = useCallback((clientId: string) => {
    setSelectedClientId(clientId);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedClientId(null);
  }, []);

  return (
    <section className="bg-white border border-slate-200 p-4">
      <h2 className="font-bold mb-4">내 서비스</h2>
      <ServiceList
        services={myServices?.data ?? []}
        onSelect={handleSelect}
        onDelete={deleteMutation.mutate}
      />

      {selectedClientId && (
        <ServiceDetailModal
          clientId={selectedClientId}
          onClose={handleClose}
          onUpdate={updateMutation.mutate}
        />
      )}
    </section>
  );
});

MyServicesSection.displayName = "MyServicesSection";

export default MyServicesSection;
