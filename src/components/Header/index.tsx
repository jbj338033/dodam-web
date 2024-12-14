import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiMenu, FiX } from "react-icons/fi";
import { useTokenStore } from "../../stores/token";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";
import ProfileDropdown from "./ProfileDropdown";
import { dodamAxios } from "../../libs/axios";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { accessToken, clearTokens } = useTokenStore();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await dodamAxios.get(`member/my`);
      return data.data;
    },
    enabled: !!accessToken,
  });

  const handleLogout = () => {
    clearTokens();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50">
      <div className="h-full container mx-auto px-4">
        <div className="h-full flex items-center justify-between">
          <NavLink
            to="/"
            className="text-lg font-bold text-slate-900 hover:text-blue-500 transition-colors"
          >
            도담도담
          </NavLink>

          <DesktopNavigation />

          <div className="flex items-center gap-2">
            <ProfileDropdown profile={profile} onLogout={handleLogout} />

            <button
              className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="메뉴 열기/닫기"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
};

export default Header;
