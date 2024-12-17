import React, { useState, memo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { dgitAxios } from "../../libs/axios";

dayjs.locale("ko");

interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileOverlay = memo(({ isOpen, onClose }: MobileOverlayProps) => (
  <div
    className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300 ${
      isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
    onClick={onClose}
    role="presentation"
  />
));

MobileOverlay.displayName = "MobileOverlay";

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  isOpen: boolean;
}

const Sidebar = memo(({ activeTab, onTabChange, isOpen }: SidebarProps) => (
  <aside
    className={`
      w-64 bg-slate-50/50 border-r border-slate-200 shrink-0
      md:block
      ${isOpen ? "fixed inset-y-0 left-0 z-40" : "hidden"}
    `}
  >
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 bg-white border-b border-slate-200 sticky top-0">
        <h3 className="text-sm font-medium text-slate-500">Git</h3>
      </div>
      <nav className="p-3 space-y-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            type="button"
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
              className={
                activeTab === tab.id ? "text-blue-600" : "text-slate-500"
              }
            >
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  </aside>
));

Sidebar.displayName = "Sidebar";

interface WinnerCardProps {
  user: WeeklyTop;
  index: number;
  onClick: (githubId: string) => void;
}

const WinnerCard = memo(({ user, index, onClick }: WinnerCardProps) => {
  const medals = ["🥇", "🥈", "🥉"];
  const bgColors = [
    "bg-gradient-to-b from-amber-50 to-white border-amber-100",
    "bg-gradient-to-b from-slate-50 to-white border-slate-100",
    "bg-gradient-to-b from-orange-50 to-white border-orange-100",
  ];

  return (
    <div
      onClick={() => onClick(user.githubId)}
      className={`
        p-3 rounded-xl cursor-pointer transition-transform
        hover:scale-[1.02] border ${bgColors[index]}
        flex items-center gap-3
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick(user.githubId);
      }}
    >
      <div className="relative">
        <img
          src={user.userImage}
          alt={user.name}
          className="w-12 h-12 rounded-lg border-2 border-white shadow-sm"
        />
        <span
          className="absolute -top-2 -right-2 text-lg"
          aria-label={`${index + 1}등`}
        >
          {medals[index]}
        </span>
      </div>
      <div>
        <div className="font-medium text-slate-900">{user.name}</div>
        <div className="text-sm text-slate-500">{user.winCount}회 우승</div>
      </div>
    </div>
  );
});

WinnerCard.displayName = "WinnerCard";

interface WeeklyRankItemProps {
  rank: WeeklyRank;
  onClick: (githubId: string) => void;
}

const WeeklyRankItem = memo(({ rank, onClick }: WeeklyRankItemProps) => (
  <div
    onClick={() => onClick(rank.githubId)}
    className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter") onClick(rank.githubId);
    }}
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
        <h3 className="font-medium text-slate-900">{rank.name}</h3>
        <span className="text-sm text-slate-500">@{rank.githubId}</span>
      </div>
      <p className="text-sm text-slate-500 truncate">{rank.bio}</p>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-lg font-bold text-blue-600">
        {rank.contributions.toLocaleString()}
      </span>
      <span className="text-sm text-slate-500">커밋</span>
    </div>
  </div>
));

WeeklyRankItem.displayName = "WeeklyRankItem";

interface PaginationProps {
  page: number;
  onPageChange: (page: number) => void;
}

const Pagination = memo(({ page, onPageChange }: PaginationProps) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-lg shadow-sm border border-slate-200 w-fit z-20">
    <button
      onClick={() => onPageChange(Math.max(1, page - 1))}
      disabled={page === 1}
      className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent"
      aria-label="이전 페이지"
    >
      <FiChevronLeft size={18} />
    </button>
    <span className="px-2 font-medium text-sm text-slate-600">
      {page} 페이지
    </span>
    <button
      onClick={() => onPageChange(page + 1)}
      className="p-1.5 rounded-md hover:bg-slate-100"
      aria-label="다음 페이지"
    >
      <FiChevronRight size={18} />
    </button>
  </div>
));

Pagination.displayName = "Pagination";

const WeeklyView = memo(
  ({
    weeklyTop,
    weeklyRanks,
    page,
    onPageChange,
    onProfileClick,
  }: {
    weeklyTop?: ApiResponse<WeeklyTop[]>;
    weeklyRanks?: ApiResponse<WeeklyRank[]>;
    page: number;
    onPageChange: (page: number) => void;
    onProfileClick: (githubId: string) => void;
  }) => (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex-1 overflow-auto pb-16">
        {weeklyTop?.data && (
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-sm font-medium text-slate-500 mb-3 px-2">
              역대 우승자
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {weeklyTop.data.map((user, index) => (
                <WinnerCard
                  key={user.githubId}
                  user={user}
                  index={index}
                  onClick={onProfileClick}
                />
              ))}
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
            <WeeklyRankItem
              key={`${rank.githubId}-${rank.rankedDate}`}
              rank={rank}
              onClick={onProfileClick}
            />
          ))}
        </div>
      </div>
      <Pagination page={page} onPageChange={onPageChange} />
    </div>
  )
);

WeeklyView.displayName = "WeeklyView";

const GitPage = memo(() => {
  const [activeTab, setActiveTab] = useState<Tab>("commit");
  const [page, setPage] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: commits } = useQuery<ApiResponse<GitUser[]>, Error>({
    queryKey: ["git-users", "total"],
    queryFn: async () => {
      const { data } =
        await dgitAxios.get<ApiResponse<GitUser[]>>(`github-user/total`);
      return data;
    },
  });

  const { data: weeklyCommits } = useQuery<ApiResponse<GitUser[]>, Error>({
    queryKey: ["git-week"],
    queryFn: async () => {
      const { data } =
        await dgitAxios.get<ApiResponse<GitUser[]>>(`github-week`);
      return data;
    },
  });

  const { data: repositories } = useQuery<ApiResponse<Repository[]>, Error>({
    queryKey: ["git-repositories"],
    queryFn: async () => {
      const { data } =
        await dgitAxios.get<ApiResponse<Repository[]>>(`github-repository`);
      return data;
    },
  });

  const { data: pullRequests } = useQuery<ApiResponse<GitUser[]>, Error>({
    queryKey: ["git-pull-requests"],
    queryFn: async () => {
      const { data } = await dgitAxios.get<ApiResponse<GitUser[]>>(
        `github-user/pull-request`
      );
      return data;
    },
  });

  const { data: weeklyTop } = useQuery<ApiResponse<WeeklyTop[]>, Error>({
    queryKey: ["git-weekly-top"],
    queryFn: async () => {
      const { data } =
        await dgitAxios.get<ApiResponse<WeeklyTop[]>>(`github-week/top`);
      return data;
    },
  });

  const { data: weeklyRanks } = useQuery<ApiResponse<WeeklyRank[]>, Error>({
    queryKey: ["git-weekly-ranks", page],
    queryFn: async () => {
      const { data } = await dgitAxios.get<ApiResponse<WeeklyRank[]>>(
        `github-week/rank`,
        {
          params: { page, limit: 10 },
        }
      );
      return data;
    },
  });

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  }, []);

  const handleProfileClick = useCallback((githubId: string) => {
    window.open(
      `${GITHUB_BASE_URL}${githubId}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, []);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] flex bg-slate-50">
      <MobileOverlay
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <button
        onClick={handleMobileMenuToggle}
        className="fixed right-4 top-4 md:hidden z-50 p-2 bg-white rounded-full shadow-lg"
        aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpen={isMobileMenuOpen}
      />

      <main className="flex-1 min-w-0 h-full flex flex-col">
        <MobileNav activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === "weekly" ? (
          <WeeklyView
            weeklyTop={weeklyTop}
            weeklyRanks={weeklyRanks}
            page={page}
            onPageChange={setPage}
            onProfileClick={handleProfileClick}
          />
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
});

GitPage.displayName = "GitPage";

export default GitPage;
