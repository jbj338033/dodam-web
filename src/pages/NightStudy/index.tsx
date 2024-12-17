import { useState, memo, useCallback } from "react";
import { FiPlus, FiClock } from "react-icons/fi";
import { Toaster } from "react-hot-toast";
import ApplicationFormSection from "./ApplicationFormSection";
import MyApplicationsSection from "./MyApplicationsSection";

interface PageHeaderProps {
  title: string;
  description: string;
  timeInfo: string;
}

const PageHeader = memo(({ title, description, timeInfo }: PageHeaderProps) => (
  <div className="border-b border-slate-200 bg-white">
    <div className="container mx-auto px-4">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="text-slate-500 mt-1">{description}</p>
          </div>
          <div className="px-4 py-2 bg-slate-100 rounded-lg">
            <div className="flex items-center gap-2 text-slate-600">
              <FiClock className="w-4 h-4" aria-hidden="true" />
              <span>{timeInfo}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));

PageHeader.displayName = "PageHeader";

interface NewApplicationButtonProps {
  onClick: () => void;
}

const NewApplicationButton = memo(({ onClick }: NewApplicationButtonProps) => (
  <button
    onClick={onClick}
    type="button"
    className="w-full px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded text-slate-900 font-medium transition-colors flex items-center justify-center gap-2"
  >
    <FiPlus className="text-slate-400" aria-hidden="true" />
    새로운 심야자습 신청하기
  </button>
));

NewApplicationButton.displayName = "NewApplicationButton";

interface MainContentProps {
  isApplying: boolean;
  onStartApplying: () => void;
  onCancelApplying: () => void;
}

const MainContent = memo(
  ({ isApplying, onStartApplying, onCancelApplying }: MainContentProps) => (
    <main className="container mx-auto px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <MyApplicationsSection />

        {isApplying ? (
          <ApplicationFormSection
            isOpen={isApplying}
            onClose={onCancelApplying}
          />
        ) : (
          <NewApplicationButton onClick={onStartApplying} />
        )}
      </div>
    </main>
  )
);

MainContent.displayName = "MainContent";

const NightStudy = memo(() => {
  const [isApplying, setIsApplying] = useState(false);

  const handleStartApplying = useCallback(() => {
    setIsApplying(true);
  }, []);

  const handleCancelApplying = useCallback(() => {
    setIsApplying(false);
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <PageHeader
        title="심야자습"
        description="심야자습 신청 및 신청 내역을 확인할 수 있습니다"
        timeInfo="22:50 ~ 23:50"
      />

      <MainContent
        isApplying={isApplying}
        onStartApplying={handleStartApplying}
        onCancelApplying={handleCancelApplying}
      />

      <Toaster position="top-right" />
    </div>
  );
});

NightStudy.displayName = "NightStudy";

export default NightStudy;
