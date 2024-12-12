export interface StudentInfo {
  id: number;
  name: string;
  grade: number;
  room: number;
  number: number;
  parentPhone: string;
}

export interface NightStudyRequest {
  content: string;
  startAt: string;
  endAt: string;
  doNeedPhone: boolean;
  place: string;
  reasonForPhone: string;
}

export interface NightStudy {
  id: number;
  content: string;
  status: "ALLOWED" | "REJECTED" | "PENDING";
  doNeedPhone: boolean;
  reasonForPhone: string;
  student: StudentInfo;
  place: string;
  rejectReason: string | null;
  startAt: string;
  endAt: string;
  createdAt: string;
  modifiedAt: string;
}

export const PLACES = [
  "프로그래밍1실",
  "프로그래밍2실",
  "프로그래밍3실",
  "수학실",
  "사회실",
  "과학실",
] as const;

export const STATUS_MAP = {
  ALLOWED: { text: "승인됨", className: "bg-green-100 text-green-800" },
  REJECTED: { text: "거부됨", className: "bg-red-100 text-red-800" },
  PENDING: { text: "대기중", className: "bg-amber-100 text-amber-800" },
} as const;
