import { memo } from "react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./constants";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

interface NavLinkItemProps {
  path: string;
  label: string;
  onClose: () => void;
}

const NavLinkItem = memo(({ path, label, onClose }: NavLinkItemProps) => (
  <NavLink
    to={path}
    onClick={onClose}
    className={({ isActive }) =>
      `block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? "text-blue-500 bg-blue-50"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
      }`
    }
  >
    {label}
  </NavLink>
));

NavLinkItem.displayName = "NavLinkItem";

interface LogoutButtonProps {
  onClose: () => void;
  onLogout: () => void;
}

const LogoutButton = memo(({ onClose, onLogout }: LogoutButtonProps) => (
  <button
    onClick={() => {
      onClose();
      onLogout();
    }}
    type="button"
    className="w-full px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
  >
    로그아웃
  </button>
));

LogoutButton.displayName = "LogoutButton";

const MobileNavigation = memo(({ isOpen, onClose, onLogout }: Props) => {
  return (
    <div
      className={`absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg md:hidden transition-all duration-200 ${
        isOpen
          ? "transform translate-y-0 opacity-100"
          : "transform -translate-y-2 opacity-0 pointer-events-none"
      }`}
    >
      <nav
        className="container mx-auto px-4 py-2"
        aria-label="Mobile Navigation"
      >
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLinkItem
              key={item.path}
              path={item.path}
              label={item.label}
              onClose={onClose}
            />
          ))}
          <LogoutButton onClose={onClose} onLogout={onLogout} />
        </div>
      </nav>
    </div>
  );
});

MobileNavigation.displayName = "MobileNavigation";

export default MobileNavigation;
