import { ReactNode } from "react";

export type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type GitUser = {
  githubId: string;
  name: string;
  contributions: number;
  userImage: string;
  bio: string | null;
  pullRequest?: number;
};

export type Repository = {
  repositoryId: number;
  repositoryName: string;
  totalStars: number;
  githubId: string;
  githubUserImage: string;
};

export type WeeklyTop = {
  githubId: string;
  name: string;
  winCount: number;
  userImage: string;
  bio: string | null;
};

export type WeeklyRank = {
  rankedDate: string;
  githubId: string;
  name: string;
  contributions: number;
  userImage: string;
  bio: string | null;
};

export type Tab = "commit" | "repository" | "pr" | "weekly";

export type RankStyle = {
  bg: string;
  text: string;
  border?: string;
};

export type TabInfo = {
  id: Tab;
  label: string;
  icon: ReactNode;
  mobileLabel: string;
};
