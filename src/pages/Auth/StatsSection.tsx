import { useQuery } from "@tanstack/react-query";
import { Stats, ApiResponse, Client } from "./types";
import { dauthAxios } from "../../libs/axios";

const StatsSection = () => {
  const { data: randomClients } = useQuery<ApiResponse<Client[]>>({
    queryKey: ["random-clients"],
    queryFn: async () => {
      const { data } = await dauthAxios.get(`client/random`);
      return data;
    },
    staleTime: 30 * 1000,
  });

  const { data: frontendStats } = useQuery<ApiResponse<Stats>>({
    queryKey: ["frontend-stats"],
    queryFn: async () => {
      const { data } = await dauthAxios.get(`front-end`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: backendStats } = useQuery<ApiResponse<Stats>>({
    queryKey: ["backend-stats"],
    queryFn: async () => {
      const { data } = await dauthAxios.get(`back-end`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="bg-white border border-slate-200 p-4">
      <h2 className="font-bold mb-4">통계</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-4 rounded">
          <h3 className="text-sm font-medium text-slate-600 mb-4">
            DAuth 사용자
          </h3>
          <div className="text-center">
            <span className="text-2xl font-bold text-blue-500">
              {randomClients?.data.length ?? 0}
            </span>
            <span className="text-sm text-slate-500 ml-1">명</span>
          </div>
        </div>
        {frontendStats?.data.react && (
          <div className="bg-slate-50 p-4 rounded">
            <h3 className="text-sm font-medium text-slate-600 mb-4">
              프론트엔드 프레임워크
            </h3>
            <div className="text-center">
              <span
                className="text-2xl font-bold"
                style={{ color: frontendStats.data.react[1] }}
              >
                React
              </span>
            </div>
          </div>
        )}
        {backendStats?.data.spring && (
          <div className="bg-slate-50 p-4 rounded">
            <h3 className="text-sm font-medium text-slate-600 mb-4">
              백엔드 프레임워크
            </h3>
            <div className="text-center">
              <span
                className="text-2xl font-bold"
                style={{ color: backendStats.data.spring[1] }}
              >
                Spring
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsSection;
