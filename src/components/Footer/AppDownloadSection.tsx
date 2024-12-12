import { FaGooglePlay, FaApple } from "react-icons/fa";

const AppDownloadSection = () => {
  return (
    <div className="flex flex-col items-end gap-3">
      <h3 className="text-sm font-medium text-slate-200">Dodam Dodam Mobile</h3>
      <div className="flex gap-2">
        <a
          href="https://play.google.com/store/apps/details?id=com.b1nd.dodam"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-white transition-colors"
        >
          <FaGooglePlay />
          Google Play
        </a>
        <a
          href="https://apps.apple.com/app/dodam/id1234567890"
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
