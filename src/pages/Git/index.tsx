import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTokenStore } from "../../stores/token";
import axios from "axios";
import { FiMenu, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import dayjs from "dayjs";
import { Toaster } from "react-hot-toast";
import "dayjs/locale/ko";

import MobileNav from "./MobileNav";
import Rankings from "./Rankings";
import {
  ApiResponse,
  GitUser,
  Repository,
  WeeklyTop,
  WeeklyRank,
  Tab,
} from "./types";
import { GITHUB_BASE_URL, TABS } from "./constants";

dayjs.locale("ko");

const GitPage = () => {
  const { accessToken } = useTokenStore();
  const [activeTab, setActiveTab] = React.useState<Tab>("commit");
  const [page, setPage] = React.useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const { data: commits } = useQuery<ApiResponse<GitUser[]>, Error>({
    queryKey: ["git-users", "total"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<GitUser[]>>(
        `${import.meta.env.VITE_GIT_URL}/github-user/total`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return data;
    },
  });

  const { data: weeklyCommits } = useQuery<ApiResponse<GitUser[]>, Error>({
    queryKey: ["git-week"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<GitUser[]>>(
        `${import.meta.env.VITE_GIT_URL}/github-week`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return data;
    },
  });

  const { data: repositories } = useQuery<ApiResponse<Repository[]>, Error>({
    queryKey: ["git-repositories"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<Repository[]>>(
        `${import.meta.env.VITE_GIT_URL}/github-repository`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return data;
    },
  });

  const { data: pullRequests } = useQuery<ApiResponse<GitUser[]>, Error>({
    queryKey: ["git-pull-requests"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<GitUser[]>>(
        `${import.meta.env.VITE_GIT_URL}/github-user/pull-request`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return data;
    },
  });

  const { data: weeklyTop } = useQuery<ApiResponse<WeeklyTop[]>, Error>({
    queryKey: ["git-weekly-top"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<WeeklyTop[]>>(
        `${import.meta.env.VITE_GIT_URL}/github-week/top`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return data;
    },
  });

  const { data: weeklyRanks } = useQuery<ApiResponse<WeeklyRank[]>, Error>({
    queryKey: ["git-weekly-ranks", page],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<WeeklyRank[]>>(
        `${import.meta.env.VITE_GIT_URL}/github-week/rank`,
        {
          params: { page, limit: 10 },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return data;
    },
  });

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = (githubId: string) => {
    window.open(
      `${GITHUB_BASE_URL}${githubId}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const MobileOverlay = () => (
    <div
      className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300 ${
        isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setIsMobileMenuOpen(false)}
    />
  );

  return (
    <div className="h-[calc(100vh-64px)] flex bg-slate-50">
      <MobileOverlay />

      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed right-4 top-4 md:hidden z-50 p-2 bg-white rounded-full shadow-lg"
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <aside
        className={`
    w-64 bg-slate-50/50 border-r border-slate-200 shrink-0
    md:block
    ${isMobileMenuOpen ? "fixed inset-y-0 left-0 z-40" : "hidden"}
  `}
      >
        <div className="flex flex-col h-full">
          <div className="px-4 py-3 bg-white border-b border-slate-200 sticky top-0">
            <h3 className="text-sm font-medium text-slate-500">Git</h3>
          </div>

          <div className="p-3 space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
            w-full flex items-center gap-3 px-3 py-2.5 
            rounded-lg text-sm font-medium transition-colors
            ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                : "text-slate-600 hover:bg-white/60"
            }
          `}
              >
                <span
                  className={`${activeTab === tab.id ? "text-blue-600" : "text-slate-500"}`}
                >
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 h-full flex flex-col">
        <MobileNav activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === "weekly" ? (
          <div className="flex-1 flex flex-col bg-white">
            <div className="flex-1 overflow-auto pb-16">
              {weeklyTop?.data && (
                <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                  <h3 className="text-sm font-medium text-slate-500 mb-3 px-2">
                    역대 우승자
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {weeklyTop.data.map((user, index) => {
                      const medals = ["🥇", "🥈", "🥉"];
                      const bgColors = [
                        "bg-gradient-to-b from-amber-50 to-white border-amber-100",
                        "bg-gradient-to-b from-slate-50 to-white border-slate-100",
                        "bg-gradient-to-b from-orange-50 to-white border-orange-100",
                      ];

                      return (
                        <div
                          key={user.githubId}
                          onClick={() => handleProfileClick(user.githubId)}
                          className={`
                    p-3 rounded-xl cursor-pointer transition-transform
                    hover:scale-[1.02] border ${bgColors[index]}
                    flex items-center gap-3
                  `}
                        >
                          <div className="relative">
                            <img
                              src={user.userImage}
                              alt={user.name}
                              className="w-12 h-12 rounded-lg border-2 border-white shadow-sm"
                            />
                            <span className="absolute -top-2 -right-2 text-lg">
                              {medals[index]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-slate-500">
                              {user.winCount}회 우승
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="divide-y divide-slate-100">
                <div className="px-4 py-3 bg-white border-b border-slate-200 sticky top-0 backdrop-blur-sm z-10">
                  <h3 className="text-sm font-medium text-slate-500">
                    주간 우승 기록
                  </h3>
                </div>
                {weeklyRanks?.data?.map((rank) => (
                  <div
                    key={`${rank.githubId}-${rank.rankedDate}`}
                    onClick={() => handleProfileClick(rank.githubId)}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="text-sm font-medium text-slate-600 w-24">
                      {dayjs(rank.rankedDate).format("M월 D일")}
                    </div>
                    <img
                      src={rank.userImage}
                      alt={rank.name}
                      className="w-10 h-10 rounded-lg border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-900">
                          {rank.name}
                        </h3>
                        <span className="text-sm text-slate-500">
                          @{rank.githubId}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 truncate">
                        {rank.bio || "소개가 없습니다"}
                      </p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-blue-600">
                        {rank.contributions.toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-500">커밋</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-lg shadow-sm border border-slate-200 w-fit z-20">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <FiChevronLeft size={18} />
              </button>
              <span className="px-2 font-medium text-sm text-slate-600">
                {page} 페이지
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-md hover:bg-slate-100"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto bg-white">
            <Rankings
              activeTab={activeTab}
              commits={commits?.data}
              weeklyCommits={weeklyCommits?.data}
              repositories={repositories?.data}
              pullRequests={pullRequests?.data}
              onProfileClick={handleProfileClick}
            />
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
};

export default GitPage;
