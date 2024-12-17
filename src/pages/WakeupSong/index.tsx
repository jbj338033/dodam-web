import { useState, memo, useCallback } from "react";
import { FiMusic } from "react-icons/fi";
import { Toaster } from "react-hot-toast";
import SubmitSection from "./SubmitSection";
import TodaySection from "./TodaySection";
import PendingSection from "./PendingSection";
import MySongSection from "./MySongSection";
import ChartSection from "./ChartSection";

type Tab = "today" | "pending" | "my" | "chart";

interface TabDefinition {
  id: Tab;
  label: string;
}

const TABS: readonly TabDefinition[] = [
  { id: "today", label: "오늘의 기상송" },
  { id: "pending", label: "신청 현황" },
  { id: "my", label: "내 기상송" },
  { id: "chart", label: "멜론 차트" },
] as const;

interface PageHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PageHeader = memo(({ title, description, icon }: PageHeaderProps) => (
  <div className="border-b border-slate-200 bg-white">
    <div className="container mx-auto px-4">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              {icon}
              {title}
            </h1>
            <p className="text-slate-500 mt-1">{description}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
));

PageHeader.displayName = "PageHeader";

interface TabButtonProps {
  tab: TabDefinition;
  isActive: boolean;
  onClick: (id: Tab) => void;
}

const TabButton = memo(({ tab, isActive, onClick }: TabButtonProps) => (
  <button
    onClick={() => onClick(tab.id)}
    type="button"
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-slate-600 hover:bg-slate-100"
    }`}
  >
    {tab.label}
  </button>
));

TabButton.displayName = "TabButton";

interface TabContentProps {
  activeTab: Tab;
}

const TabContent = memo(({ activeTab }: TabContentProps) => {
  switch (activeTab) {
    case "today":
      return <TodaySection />;
    case "pending":
      return <PendingSection />;
    case "my":
      return <MySongSection />;
    case "chart":
      return (
        <div className="bg-white border border-slate-200 rounded-lg">
          <ChartSection />
        </div>
      );
    default:
      return null;
  }
});

TabContent.displayName = "TabContent";

interface MainContentProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const MainContent = memo(({ activeTab, onTabChange }: MainContentProps) => (
  <div className="container mx-auto px-4 py-6">
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <SubmitSection />
      </div>

      <div className="flex items-center gap-2 mb-4">
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={onTabChange}
          />
        ))}
      </div>

      <TabContent activeTab={activeTab} />
    </div>
  </div>
));

MainContent.displayName = "MainContent";

const WakeupSong = memo(() => {
  const [activeTab, setActiveTab] = useState<Tab>("today");

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <PageHeader
        title="기상송"
        description="매일 아침을 새로운 음악과 함께 시작하세요"
        icon={<FiMusic className="text-blue-500" aria-hidden="true" />}
      />

      <MainContent activeTab={activeTab} onTabChange={handleTabChange} />

      <Toaster position="top-right" />
    </div>
  );
});

WakeupSong.displayName = "WakeupSong";

export default WakeupSong;
