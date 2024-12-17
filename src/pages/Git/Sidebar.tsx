import { memo } from "react";
import { Tab } from "./types";
import { TABS } from "./constants";

interface SidebarProps {
  activeTab: Tab;
  handleTabChange: (tab: Tab) => void;
  isMobileMenuOpen: boolean;
}

interface TabButtonProps {
  tab: (typeof TABS)[number];
  isActive: boolean;
  onClick: () => void;
}

const TabButton = memo(({ tab, isActive, onClick }: TabButtonProps) => (
  <button
    onClick={onClick}
    type="button"
    className={`
      w-full flex items-center gap-3 px-3 py-2.5 
      rounded-lg text-sm font-medium transition-colors
      ${
        isActive
          ? "bg-white text-blue-600 shadow-sm border border-slate-200"
          : "text-slate-600 hover:bg-white/60"
      }
    `}
    aria-current={isActive ? "page" : undefined}
  >
    <span
      className={`${isActive ? "text-blue-600" : "text-slate-500"}`}
      aria-hidden="true"
    >
      {tab.icon}
    </span>
    {tab.label}
  </button>
));

TabButton.displayName = "TabButton";

const Sidebar = memo(
  ({ activeTab, handleTabChange, isMobileMenuOpen }: SidebarProps) => (
    <aside
      className={`
      w-64 bg-slate-50/50 border-r border-slate-200 shrink-0
      md:block
      ${isMobileMenuOpen ? "fixed inset-y-0 left-0 z-40" : "hidden"}
    `}
      aria-label="사이드바 네비게이션"
    >
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 bg-white border-b border-slate-200 sticky top-0">
          <h3 className="text-sm font-medium text-slate-500">Git</h3>
        </div>

        <nav className="p-3 space-y-1">
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => handleTabChange(tab.id)}
            />
          ))}
        </nav>
      </div>
    </aside>
  )
);

Sidebar.displayName = "Sidebar";

export default Sidebar;
