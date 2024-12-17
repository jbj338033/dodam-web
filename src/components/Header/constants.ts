import { NavItem } from "./types";

export const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "홈" },
  { path: "/schedule", label: "일정" },
  { path: "/night-study", label: "심자" },
  { path: "/wakeup-song", label: "기상송" },
  { path: "/auth", label: "인증" },
  { path: "/git", label: "Git" },
] as const;
