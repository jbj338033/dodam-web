import { NavLink } from "react-router-dom";
import Navigation from "./Navigation";
import ProfileDropdown from "./ProfileDropdown";

const Header = () => {
  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-16 grid grid-cols-3">
            <div className="flex items-center">
              <NavLink
                to="/"
                className="text-lg font-bold text-slate-900 hover:text-blue-500 transition-colors"
              >
                도담도담
              </NavLink>
            </div>

            <div className="flex items-center justify-center">
              <Navigation />
            </div>

            <div className="flex items-center justify-end">
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
