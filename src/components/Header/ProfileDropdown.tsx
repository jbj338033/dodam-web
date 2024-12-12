import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useTokenStore } from "../../stores/token";
import { UserProfile } from "./types";
import axios from "axios";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { clearTokens, accessToken } = useTokenStore();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axios.get<{ data: UserProfile }>(
        `${import.meta.env.VITE_API_URL}/member/my`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return data.data;
    },
    enabled: !!accessToken,
  });

  const handleLogout = () => {
    clearTokens();
    window.location.href = "/login";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        {profile?.profileImage ? (
          <img
            src={profile.profileImage}
            alt={profile.name}
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
            <FiUser className="w-4 h-4 text-slate-400" />
          </div>
        )}
        <span className="text-slate-700">{profile?.name}</span>
        <FiChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
          <div className="px-4 py-2 border-b border-slate-200">
            <p className="text-sm font-medium text-slate-900">
              {profile?.name}
            </p>
            <p className="text-xs text-slate-500">
              {profile?.student.grade}학년 {profile?.student.room}반{" "}
              {profile?.student.number}번
            </p>
          </div>
          <NavLink
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => setIsOpen(false)}
          >
            <FiUser className="w-4 h-4" />내 프로필
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
          >
            <FiLogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
