import { useQuery } from "@tanstack/react-query";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { dodamAxios } from "../../libs/axios";

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
  const [pointType, setPointType] = useState<"DORMITORY" | "SCHOOL">(
    "DORMITORY"
  );

  const { data: memberData } = useQuery<ApiResponse<Member>>({
    queryKey: ["member-info"],
    queryFn: async () => {
      const { data } = await dodamAxios.get(`member/my`);
      return data;
    },
  });
  const { data: points } = useQuery<{
    DORMITORY: ApiResponse<Point>;
    SCHOOL: ApiResponse<Point>;
  }>({
    queryKey: ["points-all"],
    queryFn: async () => {
      const [dormitoryData, schoolData] = await Promise.all([
        dodamAxios.get(`point/score/my?type=DORMITORY`),
        dodamAxios.get(`point/score/my?type=SCHOOL`),
      ]);

      return {
        DORMITORY: dormitoryData.data,
        SCHOOL: schoolData.data,
      };
    },
  });

  const currentPoints = points?.[pointType];

  return (
    <div className="bg-white border border-slate-200 p-6">
      <div className="flex items-center gap-4">
        {memberData?.data?.profileImage ? (
          <img
            src={memberData.data.profileImage}
            alt="Profile"
            className="w-16 h-16 rounded object-cover"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center text-slate-400">
            <FaUserCircle size={64} />
          </div>
        )}
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
          <span className="font-medium">{currentPoints?.data.bonus}점</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-slate-600">벌점</span>
          <span className="font-medium text-red-500">
            {currentPoints?.data.minus}점
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
