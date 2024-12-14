import React from "react";
import { FiStar } from "react-icons/fi";
import { GitUser, Repository, Tab } from "./types";
import { getRankStyle } from "./utils";

interface RankingsProps {
  activeTab: Tab;
  commits?: GitUser[];
  weeklyCommits?: GitUser[];
  repositories?: Repository[];
  pullRequests?: GitUser[];
  onProfileClick: (githubId: string) => void;
}

const Rankings: React.FC<RankingsProps> = ({
  activeTab,
  commits,
  weeklyCommits,
  repositories,
  pullRequests,
  onProfileClick,
}) => {
  const [isWeekly, setIsWeekly] = React.useState(false);

  const tabLabels = {
    commit: "커밋 랭킹",
    repository: "레포지토리 랭킹",
    pr: "PR 랭킹",
  };

  const currentCommits = isWeekly ? weeklyCommits : commits;

  return (
    <div className="flex-1 overflow-auto pb-16">
      <div className="divide-y divide-slate-100">
        <div className="px-4 py-3 bg-white border-b border-slate-200 sticky top-0 backdrop-blur-sm z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-slate-500">
              {tabLabels[activeTab as keyof typeof tabLabels]}
            </h3>
            {activeTab === "commit" && (
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={() => setIsWeekly(false)}
                  className={`px-2.5 py-1.5 rounded-md transition-colors ${
                    !isWeekly
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => setIsWeekly(true)}
                  className={`px-2.5 py-1.5 rounded-md transition-colors ${
                    isWeekly
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  이번 주
                </button>
              </div>
            )}
          </div>
        </div>

        {activeTab === "commit" &&
          currentCommits?.map((user, index) => (
            <div
              key={user.githubId}
              onClick={() => onProfileClick(user.githubId)}
              className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                  getRankStyle(index).bg
                }`}
              >
                {index + 1}
              </div>
              <img
                src={user.userImage}
                alt={user.name}
                className="w-10 h-10 rounded-lg border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-slate-900">{user.name}</h3>
                  <span className="text-sm text-slate-500">
                    @{user.githubId}
                  </span>
                </div>
                <p className="text-sm text-slate-500 truncate">{user.bio}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-blue-600">
                  {user.contributions.toLocaleString()}
                </span>
                <span className="text-sm text-slate-500">커밋</span>
              </div>
            </div>
          ))}

        {activeTab === "repository" &&
          repositories?.map((repo, index) => (
            <div
              key={repo.repositoryId}
              onClick={() => onProfileClick(repo.githubId)}
              className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                  getRankStyle(index).bg
                }`}
              >
                {index + 1}
              </div>
              <img
                src={repo.githubUserImage}
                alt={repo.githubId}
                className="w-10 h-10 rounded-lg border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900">
                  {repo.repositoryName}
                </h3>
                <p className="text-sm text-slate-500">@{repo.githubId}</p>
              </div>
              <div className="flex items-center gap-2">
                <FiStar className="text-yellow-500" />
                <span className="text-lg font-bold text-slate-900">
                  {repo.totalStars.toLocaleString()}
                </span>
              </div>
            </div>
          ))}

        {activeTab === "pr" &&
          pullRequests?.map((user, index) => (
            <div
              key={user.githubId}
              onClick={() => onProfileClick(user.githubId)}
              className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                  getRankStyle(index).bg
                }`}
              >
                {index + 1}
              </div>
              <img
                src={user.userImage}
                alt={user.name}
                className="w-10 h-10 rounded-lg border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-slate-900">{user.name}</h3>
                  <span className="text-sm text-slate-500">
                    @{user.githubId}
                  </span>
                </div>
                <p className="text-sm text-slate-500 truncate">
                  {user.bio || "소개가 없습니다"}
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-violet-600">
                  {user.pullRequest?.toLocaleString()}
                </span>
                <span className="text-sm text-slate-500">PR</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Rankings;
