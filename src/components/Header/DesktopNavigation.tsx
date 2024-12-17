import { memo } from "react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS, NavItem } from "./types";

interface NavLinkItemProps {
  item: NavItem;
}

const NavLinkItem = memo(({ item }: NavLinkItemProps) => (
  <NavLink
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
));

NavLinkItem.displayName = "NavLinkItem";

const DesktopNavigation = memo(() => {
  return (
    <nav
      className="hidden md:flex items-center gap-1"
      aria-label="Main Navigation"
    >
      {NAV_ITEMS.map((item) => (
        <NavLinkItem key={item.path} item={item} />
      ))}
    </nav>
  );
});

DesktopNavigation.displayName = "DesktopNavigation";

export default DesktopNavigation;
