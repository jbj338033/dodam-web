import { FiGithub, FiGitPullRequest, FiStar, FiCalendar } from "react-icons/fi";
import { TabInfo } from "./types";

export const GITHUB_BASE_URL = "https://github.com/";

export const TABS: readonly TabInfo[] = [
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
