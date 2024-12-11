import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useTokenStore } from "../stores/token";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface NavItem {
  path: string;
  label: string;
}

interface UserProfile {
  name: string;
  profileImage: string | null;
  student: {
    grade: number;
    room: number;
    number: number;
  };
}

const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "홈" },
  { path: "/schedule", label: "일정" },
  { path: "/night-study", label: "심자" },
];

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-neutral-200/80 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink
            to="/"
            className="relative text-xl font-bold text-neutral-900 hover:text-blue-500 transition-colors"
          >
            <span className="relative">도담도담</span>
          </NavLink>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <nav className="flex items-center">
              <div className="flex items-center bg-neutral-100/80 rounded-full p-1">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                        isActive
                          ? "text-neutral-900 bg-white shadow-sm"
                          : "text-neutral-600 hover:text-neutral-800"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </nav>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
              >
                {profile?.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center">
                    <FiUser size={14} className="text-neutral-500" />
                  </div>
                )}
                <span className="text-neutral-700">{profile?.name}</span>
                <FiChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-neutral-200">
                    <p className="text-sm font-medium text-neutral-900">
                      {profile?.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {profile?.student.grade}학년 {profile?.student.room}반{" "}
                      {profile?.student.number}번
                    </p>
                  </div>
                  <NavLink
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FiUser size={16} />내 프로필
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-neutral-50"
                  >
                    <FiLogOut size={16} />
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
