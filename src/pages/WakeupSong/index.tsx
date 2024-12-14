import { useState } from "react";
import { SubmitSection } from "./SubmitSection";
import { TodaySection } from "./TodaySection";
import { PendingSection } from "./PendingSection";
import { MySongSection } from "./MySongSection";
import { ChartSection } from "./ChartSection";
import { Toaster } from "react-hot-toast";
import { FiMusic } from "react-icons/fi";

type Tab = "today" | "pending" | "my" | "chart";

const TABS = [
  { id: "today" as const, label: "오늘의 기상송" },
  { id: "pending" as const, label: "신청 현황" },
  { id: "my" as const, label: "내 기상송" },
  { id: "chart" as const, label: "멜론 차트" },
] as const;

const WakeupSongPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("today");

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <FiMusic className="text-blue-500" />
                  기상송
                </h1>
                <p className="text-slate-500 mt-1">
                  매일 아침을 새로운 음악과 함께 시작하세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <SubmitSection />
          </div>

          <div className="flex items-center gap-2 mb-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "today" && <TodaySection />}
          {activeTab === "pending" && <PendingSection />}
          {activeTab === "my" && <MySongSection />}
          {activeTab === "chart" && (
            <div className="bg-white border border-slate-200 rounded-lg">
              <ChartSection />
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default WakeupSongPage;
