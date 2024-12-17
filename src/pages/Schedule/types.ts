export interface Schedule {
  id: number;
  name: string;
  place: string;
  type: string;
  date: [string, string];
  targetGrades: string[];
}

export interface ScheduleResponse {
  status: number;
  message: string;
  data: Schedule[];
}

export const GRADE_COLORS: {
  [key: string]: { bg: string; text: string; dot: string };
} = {
  GRADE_ALL: {
    bg: "bg-neutral-100",
    text: "text-neutral-900",
    dot: "bg-neutral-100",
  },
  GRADE_1: { bg: "bg-amber-100", text: "text-amber-900", dot: "bg-amber-100" },
  GRADE_2: {
    bg: "bg-emerald-100",
    text: "text-emerald-900",
    dot: "bg-emerald-100",
  },
  GRADE_3: { bg: "bg-blue-100", text: "text-blue-900", dot: "bg-blue-100" },
} as const;
