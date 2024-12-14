import { useState } from "react";
import StatsSection from "./StatsSection";
import MyServicesSection from "./MyServicesSection";
import RegistrationModal from "./RegistrationModal";
import { Toaster } from "react-hot-toast";
import { FiKey } from "react-icons/fi";
import ServicesSection from "./ServicesSection";

type Tab = "overview" | "my" | "stats";

const TABS = [
  { id: "overview" as const, label: "서비스 현황" },
  { id: "my" as const, label: "내 서비스" },
  { id: "stats" as const, label: "통계" },
] as const;

const Auth = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <FiKey className="text-blue-500" />
                  인증 서비스
                </h1>
                <p className="text-slate-500 mt-1">
                  도담도담 계정 기반의 통합 로그인을 이용해보세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold">DAuth 시작하기</h2>
                <p className="text-sm text-slate-500 mt-1">
                  도담도담 계정으로 서비스를 등록하고 이용해보세요
                </p>
              </div>
              <button
                onClick={() => setIsRegistering(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                서비스 등록
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

          {activeTab === "overview" && (
            <div className="bg-white border border-slate-200 p-4">
              <h2 className="font-bold mb-4">DAuth 사용 서비스</h2>
              <ServicesSection />
            </div>
          )}
          {activeTab === "my" && <MyServicesSection />}
          {activeTab === "stats" && <StatsSection />}
        </div>
      </div>

      {isRegistering && (
        <RegistrationModal onClose={() => setIsRegistering(false)} />
      )}
      <Toaster position="top-right" />
    </div>
  );
};

export default Auth;
