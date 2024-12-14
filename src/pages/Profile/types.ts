export interface StudentInfo {
  id: number;
  name: string;
  grade: number;
  room: number;
  number: number;
  parentPhone: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  profileImage: string | null;
  phone: string;
  student: StudentInfo;
  createdAt: string;
  modifiedAt: string;
}

export interface UpdateProfileDto {
  email: string;
  phone: string;
  profileImage?: string;
  grade: number;
  room: number;
  number: number;
}
