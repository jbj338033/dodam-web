import { memo, useCallback } from "react";
import { Tab } from "./types";
import { TABS } from "./constants";

interface MobileNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

interface NavButtonProps {
  tab: (typeof TABS)[number];
  isActive: boolean;
  onClick: () => void;
}

const NavButton = memo(({ tab, isActive, onClick }: NavButtonProps) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap
      ${isActive ? "bg-blue-50 text-blue-600" : "text-slate-600"}
    `}
    type="button"
    aria-current={isActive ? "page" : undefined}
  >
    {tab.icon}
    {tab.mobileLabel}
  </button>
));

NavButton.displayName = "NavButton";

const MobileNav = memo(({ activeTab, onTabChange }: MobileNavProps) => {
  const handleTabChange = useCallback(
    (tabId: Tab) => {
      onTabChange(tabId);
    },
    [onTabChange]
  );

  return (
    <nav
      className="md:hidden flex items-center gap-2 p-4 bg-white border-b overflow-x-auto sticky top-0 z-20"
      aria-label="모바일 네비게이션"
    >
      {TABS.map((tab) => (
        <NavButton
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.id}
          onClick={() => handleTabChange(tab.id)}
        />
      ))}
    </nav>
  );
});

MobileNav.displayName = "MobileNav";

export default MobileNav;
