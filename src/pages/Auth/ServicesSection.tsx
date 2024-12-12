import { useQuery } from "@tanstack/react-query";
import { useTokenStore } from "../../stores/token";
import { ApiResponse } from "../../types/api";
import { Client } from "./types";
import axios from "axios";

const ServicesSection = () => {
  const { accessToken } = useTokenStore();

  const { data: clients } = useQuery<ApiResponse<Client[]>>({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_AUTH_URL}/client`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return data;
    },
    staleTime: 30 * 1000,
  });

  if (!clients?.data?.length) {
    return <p className="text-slate-500 text-sm">등록된 서비스가 없습니다</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {clients.data.map((client) => (
        <a
          key={client.clientId}
          href={client.clientUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col p-3 bg-slate-50 rounded hover:bg-slate-100 transition-colors"
        >
          <h3 className="font-medium mb-1">{client.clientName}</h3>
          <p className="text-sm text-slate-500 truncate">{client.clientUrl}</p>
        </a>
      ))}
    </div>
  );
};

export default ServicesSection;
