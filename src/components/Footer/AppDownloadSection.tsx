import { FaGooglePlay, FaApple } from "react-icons/fa";

const AppDownloadSection = () => {
  return (
    <div className="flex flex-col items-end gap-3">
      <h3 className="text-sm font-medium text-slate-200">Dodam Dodam Mobile</h3>
      <div className="flex gap-2">
        <a
          href="https://play.google.com/store/apps/details?id=com.b1nd.dodam.student"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-white transition-colors"
        >
          <FaGooglePlay />
          Google Play
        </a>
        <a
          href="https://apps.apple.com/kr/app/%EB%8F%84%EB%8B%B4%EB%8F%84%EB%8B%B4-%EC%8A%A4%EB%A7%88%ED%8A%B8-%ED%95%99%EA%B5%90-%EA%B4%80%EB%A6%AC-%EC%84%9C%EB%B9%84%EC%8A%A4/id6482977790"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-white transition-colors"
        >
          <FaApple />
          App Store
        </a>
      </div>
    </div>
  );
};

export default AppDownloadSection;
