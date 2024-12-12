import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./types";

const Navigation = () => {
  return (
    <nav className="flex items-center">
      <div className="flex items-center gap-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                isActive
                  ? "text-blue-500"
                  : "text-slate-600 hover:text-slate-900"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
