import { memo } from "react";

const LogoSection = memo(() => {
  return (
    <div className="flex items-center gap-2">
      <img src="/b1nd.svg" alt="B1ND Logo" className="h-6" />
      <p className="text-sm text-slate-400">
        도담도담은 현재 대구소프트웨어마이스터고등학교에서 사용 중인 스마트 학생
        생활 관리 시스템입니다.
      </p>
    </div>
  );
});

LogoSection.displayName = "LogoSection";

export default LogoSection;
