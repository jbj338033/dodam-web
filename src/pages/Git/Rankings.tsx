import { memo, useState, useCallback } from "react";
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

interface RankNumberProps {
  index: number;
}

const RankNumber = memo(({ index }: RankNumberProps) => (
  <div
    className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${getRankStyle(index).bg}`}
  >
    {index + 1}
  </div>
));

RankNumber.displayName = "RankNumber";

interface TabHeaderProps {
  activeTab: Tab;
  isWeekly: boolean;
  onWeeklyToggle: (isWeekly: boolean) => void;
}

interface TabLabels {
  [key: string]: string;
}

const TabHeader = memo(
  ({ activeTab, isWeekly, onWeeklyToggle }: TabHeaderProps) => {
    const tabLabels: TabLabels = {
      commit: "커밋 랭킹",
      repository: "레포지토리 랭킹",
      pr: "PR 랭킹",
    };

    return (
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-slate-500">
          {tabLabels[activeTab]}
        </h3>
        {activeTab === "commit" && (
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => onWeeklyToggle(false)}
              type="button"
              className={`px-2.5 py-1.5 rounded-md transition-colors ${
                !isWeekly
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => onWeeklyToggle(true)}
              type="button"
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
    );
  }
);

TabHeader.displayName = "TabHeader";

interface CommitRankItemProps {
  user: GitUser;
  index: number;
  onClick: (githubId: string) => void;
}

const CommitRankItem = memo(({ user, index, onClick }: CommitRankItemProps) => (
  <div
    onClick={() => onClick(user.githubId)}
    className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
  >
    <RankNumber index={index} />
    <img
      src={user.userImage}
      alt={user.name}
      className="w-10 h-10 rounded-lg border border-slate-200"
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <h3 className="font-medium text-slate-900">{user.name}</h3>
        <span className="text-sm text-slate-500">@{user.githubId}</span>
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
));

CommitRankItem.displayName = "CommitRankItem";

interface RepositoryRankItemProps {
  repo: Repository;
  index: number;
  onClick: (githubId: string) => void;
}

const RepositoryRankItem = memo(
  ({ repo, index, onClick }: RepositoryRankItemProps) => (
    <div
      onClick={() => onClick(repo.githubId)}
      className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
    >
      <RankNumber index={index} />
      <img
        src={repo.githubUserImage}
        alt={repo.githubId}
        className="w-10 h-10 rounded-lg border border-slate-200"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-slate-900">{repo.repositoryName}</h3>
        <p className="text-sm text-slate-500">@{repo.githubId}</p>
      </div>
      <div className="flex items-center gap-2">
        <FiStar className="text-yellow-500" />
        <span className="text-lg font-bold text-slate-900">
          {repo.totalStars.toLocaleString()}
        </span>
      </div>
    </div>
  )
);

RepositoryRankItem.displayName = "RepositoryRankItem";

interface PullRequestRankItemProps {
  user: GitUser;
  index: number;
  onClick: (githubId: string) => void;
}

const PullRequestRankItem = memo(
  ({ user, index, onClick }: PullRequestRankItemProps) => (
    <div
      onClick={() => onClick(user.githubId)}
      className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
    >
      <RankNumber index={index} />
      <img
        src={user.userImage}
        alt={user.name}
        className="w-10 h-10 rounded-lg border border-slate-200"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-slate-900">{user.name}</h3>
          <span className="text-sm text-slate-500">@{user.githubId}</span>
        </div>
        <p className="text-sm text-slate-500 truncate">{user.bio}</p>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-violet-600">
          {user.pullRequest?.toLocaleString()}
        </span>
        <span className="text-sm text-slate-500">PR</span>
      </div>
    </div>
  )
);

PullRequestRankItem.displayName = "PullRequestRankItem";

const Rankings = memo(
  ({
    activeTab,
    commits,
    weeklyCommits,
    repositories,
    pullRequests,
    onProfileClick,
  }: RankingsProps) => {
    const [isWeekly, setIsWeekly] = useState(false);
    const currentCommits = isWeekly ? weeklyCommits : commits;

    const handleWeeklyToggle = useCallback((weekly: boolean) => {
      setIsWeekly(weekly);
    }, []);

    return (
      <div className="flex-1 overflow-auto pb-16">
        <div className="divide-y divide-slate-100">
          <div className="px-4 py-3 bg-white border-b border-slate-200 sticky top-0 backdrop-blur-sm z-10">
            <TabHeader
              activeTab={activeTab}
              isWeekly={isWeekly}
              onWeeklyToggle={handleWeeklyToggle}
            />
          </div>

          {activeTab === "commit" &&
            currentCommits?.map((user, index) => (
              <CommitRankItem
                key={user.githubId}
                user={user}
                index={index}
                onClick={onProfileClick}
              />
            ))}

          {activeTab === "repository" &&
            repositories?.map((repo, index) => (
              <RepositoryRankItem
                key={repo.repositoryId}
                repo={repo}
                index={index}
                onClick={onProfileClick}
              />
            ))}

          {activeTab === "pr" &&
            pullRequests?.map((user, index) => (
              <PullRequestRankItem
                key={user.githubId}
                user={user}
                index={index}
                onClick={onProfileClick}
              />
            ))}
        </div>
      </div>
    );
  }
);

Rankings.displayName = "Rankings";

export default Rankings;
