import { memo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaUserCircle } from "react-icons/fa";
import { dodamAxios } from "../../libs/axios";

interface Student {
  id: number;
  name: string;
  grade: number;
  room: number;
  number: number;
  parentPhone: string;
}

interface Member {
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
}

interface Point {
  id: number;
  bonus: number;
  minus: number;
  offset: number;
  type: PointType;
  student: Student;
}

type PointType = "DORMITORY" | "SCHOOL";
type ApiResponse<T> = { data: T };

interface ProfileInfoProps {
  member?: Member;
}

const ProfileInfo = memo(({ member }: ProfileInfoProps) => (
  <div className="flex items-center gap-4">
    {member?.profileImage ? (
      <img
        src={member.profileImage}
        alt={`${member.name}의 프로필`}
        className="w-16 h-16 rounded object-cover"
      />
    ) : (
      <div className="w-16 h-16 flex items-center justify-center text-slate-400">
        <FaUserCircle size={64} aria-label="기본 프로필 이미지" />
      </div>
    )}
    <div>
      <h2 className="font-bold text-lg">{member?.name}</h2>
      <p className="text-slate-500 text-sm">
        {member?.student.grade}학년 {member?.student.room}반{" "}
        {member?.student.number}번
      </p>
    </div>
  </div>
));

ProfileInfo.displayName = "ProfileInfo";

interface PointTypeButtonProps {
  type: PointType;
  currentType: PointType;
  onClick: (type: PointType) => void;
  label: string;
}

const PointTypeButton = memo(
  ({ type, currentType, onClick, label }: PointTypeButtonProps) => (
    <button
      onClick={() => onClick(type)}
      type="button"
      className={`px-2 py-1 rounded ${
        currentType === type
          ? "bg-blue-500 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  )
);

PointTypeButton.displayName = "PointTypeButton";

interface PointDisplayProps {
  point?: Point;
  type: PointType;
}

const PointDisplay = memo(({ point, type }: PointDisplayProps) => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <div className="text-sm text-slate-500">
        {type === "DORMITORY" ? "기숙사" : "학교"} 상벌점
      </div>
    </div>
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">상점</span>
      <span className="font-medium">{point?.bonus ?? 0}점</span>
    </div>
    <div className="flex items-center justify-between text-sm mt-2">
      <span className="text-slate-600">벌점</span>
      <span className="font-medium text-red-500">{point?.minus ?? 0}점</span>
    </div>
  </div>
));

PointDisplay.displayName = "PointDisplay";

const ProfileSection = memo(() => {
  const [pointType, setPointType] = useState<PointType>("DORMITORY");

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

  const handlePointTypeChange = useCallback((type: PointType) => {
    setPointType(type);
  }, []);

  const currentPoints = points?.[pointType];

  return (
    <section className="bg-white border border-slate-200 p-6">
      <ProfileInfo member={memberData?.data} />

      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2 text-sm">
            <PointTypeButton
              type="DORMITORY"
              currentType={pointType}
              onClick={handlePointTypeChange}
              label="기숙사"
            />
            <PointTypeButton
              type="SCHOOL"
              currentType={pointType}
              onClick={handlePointTypeChange}
              label="학교"
            />
          </div>
        </div>
        <PointDisplay point={currentPoints?.data} type={pointType} />
      </div>
    </section>
  );
});

ProfileSection.displayName = "ProfileSection";

export default ProfileSection;
