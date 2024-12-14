import React from "react";
import { Tab } from "./types";
import { TABS } from "./constants";

interface MobileNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => (
  <div className="md:hidden flex items-center gap-2 p-4 bg-white border-b overflow-x-auto sticky top-0 z-20">
    {TABS.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap
          ${activeTab === tab.id ? "bg-blue-50 text-blue-600" : "text-slate-600"}
        `}
      >
        {tab.icon}
        {tab.mobileLabel}
      </button>
    ))}
  </div>
);

export default MobileNav;
