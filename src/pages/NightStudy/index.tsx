import { useState } from "react";
import { FiPlus, FiClock } from "react-icons/fi";
import ApplicationFormSection from "./ApplicationFormSection";
import MyApplicationsSection from "./MyApplicationsSection";
import { Toaster } from "react-hot-toast";

const NightStudyPage = () => {
  const [isApplying, setIsApplying] = useState(false);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">심야자습</h1>
                <p className="text-slate-500 mt-1">
                  심야자습 신청 및 신청 내역을 확인할 수 있습니다
                </p>
              </div>
              <div className="px-4 py-2 bg-slate-100 rounded-lg">
                <div className="flex items-center gap-2 text-slate-600">
                  <FiClock className="w-4 h-4" />
                  <span>22:50 ~ 23:50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <MyApplicationsSection />

          {isApplying ? (
            <ApplicationFormSection
              isOpen={isApplying}
              onClose={() => setIsApplying(false)}
            />
          ) : (
            <button
              onClick={() => setIsApplying(true)}
              className="w-full px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded text-slate-900 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FiPlus className="text-slate-400" />
              새로운 심야자습 신청하기
            </button>
          )}
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
};

export default NightStudyPage;
