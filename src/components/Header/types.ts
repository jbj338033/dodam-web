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
