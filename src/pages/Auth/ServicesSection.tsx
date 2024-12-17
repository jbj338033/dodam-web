import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../types/api";
import { Client } from "./types";
import { dauthAxios } from "../../libs/axios";

interface ServiceCardProps {
  client: Client;
}

const ServiceCard = memo(({ client }: ServiceCardProps) => (
  <a
    href={client.clientUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col p-3 bg-slate-50 rounded hover:bg-slate-100 transition-colors"
  >
    <h3 className="font-medium mb-1">{client.clientName}</h3>
    <p className="text-sm text-slate-500 truncate">{client.clientUrl}</p>
  </a>
));

ServiceCard.displayName = "ServiceCard";

interface EmptyStateProps {
  message?: string;
}

const EmptyState = memo(
  ({ message = "등록된 서비스가 없습니다" }: EmptyStateProps) => (
    <p className="text-slate-500 text-sm">{message}</p>
  )
);

EmptyState.displayName = "EmptyState";

const ServicesSection = memo(() => {
  const { data: clients, isError } = useQuery<ApiResponse<Client[]>>({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data } = await dauthAxios.get(`client`);
      return data;
    },
    staleTime: 30 * 1000,
  });

  if (isError) {
    return <EmptyState message="서비스 목록을 불러오는데 실패했습니다" />;
  }

  if (!clients?.data?.length) {
    return <EmptyState />;
  }

  return (
    <section
      aria-label="서비스 목록"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
    >
      {clients.data.map((client) => (
        <ServiceCard key={client.clientId} client={client} />
      ))}
    </section>
  );
});

ServicesSection.displayName = "ServicesSection";

export default ServicesSection;
