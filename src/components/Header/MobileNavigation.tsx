import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const MobileNavigation = ({ isOpen, onClose, onLogout }: Props) => {
  return (
    <div
      className={`absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg md:hidden transition-all duration-200 ${
        isOpen
          ? "transform translate-y-0 opacity-100"
          : "transform -translate-y-2 opacity-0 pointer-events-none"
      }`}
    >
      <nav className="container mx-auto px-4 py-2">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "text-blue-500 bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            로그아웃
          </button>
        </div>
      </nav>
    </div>
  );
};

export default MobileNavigation;
