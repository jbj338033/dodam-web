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

export type GradeColorType = {
  bg: string;
  text: string;
  dot: string;
};

export type GradeColorsType = {
  [key in
    | "GRADE_ALL"
    | "GRADE_1"
    | "GRADE_2"
    | "GRADE_3"
    | "GRADE_ETC"]: GradeColorType;
};

export const GRADE_COLORS: GradeColorsType = {
  GRADE_ALL: { bg: "bg-blue-100", text: "text-blue-900", dot: "bg-blue-500" },
  GRADE_1: { bg: "bg-green-100", text: "text-green-900", dot: "bg-green-500" },
  GRADE_2: {
    bg: "bg-yellow-100",
    text: "text-yellow-900",
    dot: "bg-yellow-500",
  },
  GRADE_3: { bg: "bg-red-100", text: "text-red-900", dot: "bg-red-500" },
  GRADE_ETC: {
    bg: "bg-purple-100",
    text: "text-purple-900",
    dot: "bg-purple-500",
  },
} as const;
