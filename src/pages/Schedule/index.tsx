import { memo } from "react";
import { FiCalendar } from "react-icons/fi";
import CalendarSection from "./CalendarSection";

interface PageHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PageHeader = memo(({ title, description, icon }: PageHeaderProps) => (
  <div className="border-b border-slate-200 bg-white">
    <div className="container mx-auto px-4">
      <div className="max-w-7xl mx-auto py-8">
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
));

PageHeader.displayName = "PageHeader";

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent = memo(({ children }: MainContentProps) => (
  <div className="container mx-auto px-4 py-6">
    <div className="max-w-7xl mx-auto space-y-6">{children}</div>
  </div>
));

MainContent.displayName = "MainContent";

const Schedule = memo(() => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <PageHeader
        title="학사 일정"
        description="학교의 주요 일정을 확인할 수 있습니다"
        icon={<FiCalendar className="text-blue-500" aria-hidden="true" />}
      />

      <MainContent>
        <CalendarSection />
      </MainContent>
    </div>
  );
});

Schedule.displayName = "Schedule";

export default Schedule;
