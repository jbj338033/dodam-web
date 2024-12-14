import CalendarSection from "./CalendarSection";
import { FiCalendar } from "react-icons/fi";

const SchedulePage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto py-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <FiCalendar className="text-blue-500" />
                학사 일정
              </h1>
              <p className="text-slate-500 mt-1">
                학교의 주요 일정을 확인할 수 있습니다
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <CalendarSection />
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
