import React from "react";
import { Tab } from "./types";
import { TABS } from "./constants";

interface SidebarProps {
  activeTab: Tab;
  handleTabChange: (tab: Tab) => void;
  isMobileMenuOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  handleTabChange,
  isMobileMenuOpen,
}) => (
  <aside
    className={`
    w-64 bg-slate-50/50 border-r border-slate-200 shrink-0
    md:block
    ${isMobileMenuOpen ? "fixed inset-y-0 left-0 z-40" : "hidden"}
  `}
  >
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 bg-white border-b border-slate-200 sticky top-0">
        <h3 className="text-sm font-medium text-slate-500">Git</h3>
      </div>

      <div className="p-3 space-y-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`
            w-full flex items-center gap-3 px-3 py-2.5 
            rounded-lg text-sm font-medium transition-colors
            ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                : "text-slate-600 hover:bg-white/60"
            }
          `}
          >
            <span
              className={`${activeTab === tab.id ? "text-blue-600" : "text-slate-500"}`}
            >
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  </aside>
);

export default Sidebar;
