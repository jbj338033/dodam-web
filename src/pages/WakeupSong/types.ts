export interface StudentInfo {
  id: number;
  name: string;
  grade: number;
  room: number;
  number: number;
}

export interface WakeupSong {
  id: number;
  thumbnail: string;
  videoTitle: string;
  videoId: string;
  videoUrl: string;
  channelTitle: string;
  status: "PENDING" | "ALLOWED" | "REJECTED";
  createdAt: string;
}

export interface AllowedSong extends WakeupSong {
  student?: StudentInfo;
}

export interface Chart {
  rank: number;
  name: string;
  artist: string;
  album: string;
  thumbnail: string;
}

export interface KeywordRequest {
  artist: string;
  title: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const DATE_OPTIONS = [
  { label: "어제", value: -1 },
  { label: "오늘", value: 0 },
  { label: "내일", value: 1 },
] as const;
