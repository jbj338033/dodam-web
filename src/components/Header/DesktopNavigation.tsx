import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./types";

const DesktopNavigation = () => {
  return (
    <nav className="hidden md:flex items-center gap-1">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? "text-blue-500"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default DesktopNavigation;