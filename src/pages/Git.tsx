import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTokenStore } from "../stores/token";
import axios from "axios";
import {
  FiGithub,
  FiGitPullRequest,
  FiStar,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiX,
} from "react-icons/fi";
import dayjs from "dayjs";
import { Toaster } from "react-hot-toast";
import "dayjs/locale/ko";

dayjs.locale("ko");

type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

type GitUser = {
  githubId: string;
  name: string;
  contributions: number;
  userImage: string;
  bio: string | null;
  pullRequest?: number;
};

type Repository = {
  repositoryId: number;
  repositoryName: string;
  totalStars: number;
  githubId: string;
  githubUserImage: string;
};

type WeeklyTop = {
  githubId: string;
  name: string;
  winCount: number;
  userImage: string;
  bio: string | null;
};

type WeeklyRank = {
  rankedDate: string;
  githubId: string;
  name: string;
  contributions: number;
  userImage: string;
  bio: string | null;
};

type Tab = "commit" | "repository" | "pr" | "weekly";

type RankStyle = {
  bg: string;
  text: string;
  border?: string;
};

type TabInfo = {
  id: Tab;
  label: string;
  icon: React.ReactNode;
  mobileLabel: string;
};

const GITHUB_BASE_URL = "https://github.com/";

const TABS: readonly TabInfo[] = [
  {
    id: "commit",
    label: "커밋 랭킹",
    icon: <FiGithub size={18} />,
    mobileLabel: "커밋",
  },
  {
    id: "repository",
    label: "레포지토리",
    icon: <FiStar size={18} />,
    mobileLabel: "레포",
  },
  {
    id: "pr",
    label: "PR 랭킹",
    icon: <FiGitPullRequest size={18} />,
    mobileLabel: "PR",
  },
  {
    id: "weekly",
    label: "주간 기록",
    icon: <FiCalendar size={18} />,
    mobileLabel: "주간",
  },
] as const;

const getRankStyle = (index: number): RankStyle => {
  switch (index) {
    case 0:
      return {
        bg: "bg-gradient-to-r from-yellow-400 to-amber-400",
        text: "text-amber-700",
        border: "border-amber-200",
      };
    case 1:
      return {
        bg: "bg-gradient-to-r from-slate-300 to-slate-400",
        text: "text-slate-700",
        border: "border-slate-200",
      };
    case 2:
      return {
        bg: "bg-gradient-to-r from-orange-300 to-orange-400",
        text: "text-orange-700",
        border: "border-orange-200",
      };
    default:
      return {
        bg: "bg-gradient-to-r from-slate-100 to-slate-200",
        text: "text-slate-600",
        border: "border-slate-200",
      };
  }
};

const GitPage = () => {
  const { accessToken } = useTokenStore();
  const [activeTab, setActiveTab] = React.useState<Tab>("commit");
  const [page, setPage] = React.useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

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
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleProfileClick = (githubId: string) => {
    window.open(
      `${GITHUB_BASE_URL}${githubId}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed right-4 top-20 md:hidden z-50 p-2 bg-white rounded-full shadow-lg"
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
      fixed md:block w-64 bg-white h-[calc(100vh-64px)] border-r border-slate-200
      ${isMobileMenuOpen ? "fixed inset-y-0 left-0 z-40" : "hidden md:block"}
    `}
      >
        <div className="sticky top-0 flex flex-col h-full p-4">
          <h2 className="text-lg font-bold px-4 mb-6">Git</h2>

          {/* Navigation */}
          <div className="space-y-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div ref={contentRef} className="flex-1 min-w-0 overflow-x-hidden pl-64">
        {/* Mobile Tabs */}
        <div className="md:hidden flex items-center gap-2 p-4 bg-white border-b overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600"
                }
              `}
            >
              {tab.icon}
              {tab.mobileLabel}
            </button>
          ))}
        </div>

        {/* Weekly Champions */}
        {activeTab === "weekly" && weeklyTop?.data && (
          <div className="p-4 md:p-8 bg-gradient-to-br from-blue-500 to-blue-600">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
                🏆 이번 주 상위권
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {weeklyTop.data.map((user, index) => (
                  <div
                    key={user.githubId}
                    onClick={() => handleProfileClick(user.githubId)}
                    className={`
                      relative cursor-pointer bg-white/10 backdrop-blur-md p-6 rounded-2xl
                      border border-white/20 transition-transform hover:scale-[1.02]
                      ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={user.userImage}
                        alt={user.name}
                        className={`
                          rounded-full border-2 border-white/20
                          ${index === 0 ? "w-20 h-20" : "w-14 h-14"}
                        `}
                      />
                      <div>
                        <div className="text-white/80 text-sm">
                          {index + 1}위
                        </div>
                        <h3
                          className={`font-bold text-white ${
                            index === 0 ? "text-xl" : "text-lg"
                          }`}
                        >
                          {user.name}
                        </h3>
                        <p className="text-blue-100 text-sm">
                          @{user.githubId}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-white/80 text-sm">우승 횟수</div>
                      <div className="text-2xl font-bold text-white">
                        {user.winCount}회
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rankings Content */}
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 space-y-4">
              {/* Commits Ranking */}
              {activeTab === "commit" &&
                commits?.data?.map((user, index) => (
                  <div
                    key={user.githubId}
                    onClick={() => handleProfileClick(user.githubId)}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-slate-50 cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                        getRankStyle(index).bg
                      }`}
                    >
                      {index + 1}
                    </div>
                    <img
                      src={user.userImage}
                      alt={user.name}
                      className={`w-12 h-12 rounded-xl border ${
                        getRankStyle(index).border
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-900">
                          {user.name}
                        </h3>
                        <span className="text-sm text-slate-500">
                          @{user.githubId}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 truncate">
                        {user.bio || "소개가 없습니다"}
                      </p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl md:text-2xl font-bold text-blue-600">
                        {user.contributions.toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-500">커밋</span>
                    </div>
                  </div>
                ))}

              {/* Repository Ranking */}
              {activeTab === "repository" &&
                repositories?.data?.map((repo, index) => (
                  <div
                    key={repo.repositoryId}
                    onClick={() => handleProfileClick(repo.githubId)}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-slate-50 cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                        getRankStyle(index).bg
                      }`}
                    >
                      {index + 1}
                    </div>
                    <img
                      src={repo.githubUserImage}
                      alt={repo.githubId}
                      className={`w-12 h-12 rounded-xl border ${
                        getRankStyle(index).border
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900">
                        {repo.repositoryName}
                      </h3>
                      <p className="text-sm text-slate-500">@{repo.githubId}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiStar className="text-yellow-500" />
                      <span className="text-xl font-bold text-slate-900">
                        {repo.totalStars.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}

              {/* Pull Requests Ranking */}
              {activeTab === "pr" &&
                pullRequests?.data?.map((user, index) => (
                  <div
                    key={user.githubId}
                    onClick={() => handleProfileClick(user.githubId)}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-slate-50 cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                        getRankStyle(index).bg
                      }`}
                    >
                      {index + 1}
                    </div>
                    <img
                      src={user.userImage}
                      alt={user.name}
                      className={`w-12 h-12 rounded-xl border ${
                        getRankStyle(index).border
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-900">
                          {user.name}
                        </h3>
                        <span className="text-sm text-slate-500">
                          @{user.githubId}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 truncate">
                        {user.bio || "소개가 없습니다"}
                      </p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl md:text-2xl font-bold text-violet-600">
                        {user.pullRequest?.toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-500">PR</span>
                    </div>
                  </div>
                ))}

              {/* Weekly Record */}
              {activeTab === "weekly" && weeklyRanks?.data && (
                <>
                  <div className="space-y-4">
                    {weeklyRanks.data.map((rank) => (
                      <div
                        key={`${rank.githubId}-${rank.rankedDate}`}
                        onClick={() => handleProfileClick(rank.githubId)}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="text-sm font-medium text-slate-500 w-24">
                          {dayjs(rank.rankedDate).format("M월 D일")}
                        </div>
                        <img
                          src={rank.userImage}
                          alt={rank.name}
                          className="w-12 h-12 rounded-xl border border-slate-200"
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
                          <span className="text-xl font-bold text-blue-600">
                            {rank.contributions}
                          </span>
                          <span className="text-sm text-slate-500">커밋</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-center gap-4 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    <span className="flex items-center px-4 font-medium">
                      {page} 페이지
                    </span>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="p-2 rounded-lg hover:bg-slate-100"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default GitPage;
