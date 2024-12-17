import React, { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Stats, ApiResponse, Client } from "./types";
import { dauthAxios } from "../../libs/axios";

interface StatsCardProps {
  title: string;
  children: React.ReactNode;
}

const StatsCard = memo(({ title, children }: StatsCardProps) => (
  <div className="bg-slate-50 p-4 rounded">
    <h3 className="text-sm font-medium text-slate-600 mb-4">{title}</h3>
    <div className="text-center">{children}</div>
  </div>
));

StatsCard.displayName = "StatsCard";

interface UserCountProps {
  count: number;
}

const UserCount = memo(({ count }: UserCountProps) => (
  <>
    <span className="text-2xl font-bold text-blue-500">{count}</span>
    <span className="text-sm text-slate-500 ml-1">명</span>
  </>
));

UserCount.displayName = "UserCount";

interface FrameworkStatsProps {
  name: string;
  color: string;
}

const FrameworkStats = memo(({ name, color }: FrameworkStatsProps) => (
  <span className="text-2xl font-bold" style={{ color }}>
    {name}
  </span>
));

FrameworkStats.displayName = "FrameworkStats";

const StatsSection = memo(() => {
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
    <section className="bg-white border border-slate-200 p-4">
      <h2 className="font-bold mb-4">통계</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="DAuth 사용자">
          <UserCount count={randomClients?.data.length ?? 0} />
        </StatsCard>

        {frontendStats?.data.react && (
          <StatsCard title="프론트엔드 프레임워크">
            <FrameworkStats name="React" color={frontendStats.data.react[1]} />
          </StatsCard>
        )}

        {backendStats?.data.spring && (
          <StatsCard title="백엔드 프레임워크">
            <FrameworkStats name="Spring" color={backendStats.data.spring[1]} />
          </StatsCard>
        )}
      </div>
    </section>
  );
});

StatsSection.displayName = "StatsSection";

export default StatsSection;
