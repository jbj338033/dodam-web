import { useQuery } from "@tanstack/react-query";
import { useTokenStore } from "../../stores/token";
import axios from "axios";
import { useState } from "react";

type Student = {
  id: number;
  name: string;
  grade: number;
  room: number;
  number: number;
  parentPhone: string;
};

type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  profileImage: string;
  phone: string;
  student: Student;
  teacher: null;
  createdAt: string;
  modifiedAt: string;
};

type Point = {
  id: number;
  bonus: number;
  minus: number;
  offset: number;
  type: "DORMITORY" | "SCHOOL";
  student: Student;
};

type ApiResponse<T> = {
  data: T;
};

const ProfileSection = () => {
  const { accessToken } = useTokenStore();
  const [pointType, setPointType] = useState<"DORMITORY" | "SCHOOL">(
    "DORMITORY"
  );

  const { data: memberData } = useQuery<ApiResponse<Member>>({
    queryKey: ["member-info"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/member/my`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return data;
    },
  });

  const { data: pointData } = useQuery<ApiResponse<Point>>({
    queryKey: ["points", pointType],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/point/score/my?type=${pointType}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return data;
    },
  });

  return (
    <div className="bg-white border border-slate-200 p-6">
      <div className="flex items-center gap-4">
        <img
          src={memberData?.data?.profileImage}
          alt="Profile"
          className="w-16 h-16 rounded object-cover"
        />
        <div>
          <h2 className="font-bold text-lg">{memberData?.data?.name}</h2>
          <p className="text-slate-500 text-sm">
            {memberData?.data?.student.grade}학년{" "}
            {memberData?.data?.student.room}반{" "}
            {memberData?.data?.student.number}번
          </p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2 text-sm">
            <button
              onClick={() => setPointType("DORMITORY")}
              className={`px-2 py-1 rounded ${
                pointType === "DORMITORY"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              기숙사
            </button>
            <button
              onClick={() => setPointType("SCHOOL")}
              className={`px-2 py-1 rounded ${
                pointType === "SCHOOL"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              학교
            </button>
          </div>
          <span className="text-sm text-slate-500">
            {pointType === "DORMITORY" ? "기숙사" : "학교"} 상벌점
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">상점</span>
          <span className="font-medium">{pointData?.data?.bonus}점</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-slate-600">벌점</span>
          <span className="font-medium text-red-500">
            {pointData?.data?.minus}점
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
