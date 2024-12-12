export interface NavItem {
  path: string;
  label: string;
}

export interface UserProfile {
  name: string;
  profileImage: string | null;
  student: {
    grade: number;
    room: number;
    number: number;
  };
}

export const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "홈" },
  { path: "/schedule", label: "일정" },
  { path: "/night-study", label: "심자" },
  { path: "/wakeup-song", label: "기상송" },
  { path: "/auth", label: "인증" },
  { path: "/git", label: "Git" },
];
