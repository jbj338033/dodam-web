import React, { memo } from "react";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import { IconType } from "react-icons";

interface DownloadButtonProps {
  href: string;
  icon: IconType;
  text: string;
}

const DownloadButton = memo(
  ({ href, icon: Icon, text }: DownloadButtonProps) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-white transition-colors"
    >
      <Icon />
      {text}
    </a>
  )
);

DownloadButton.displayName = "DownloadButton";

const AppDownloadSection = memo(() => {
  const buttons: DownloadButtonProps[] = [
    {
      href: "https://play.google.com/store/apps/details?id=com.b1nd.dodam.student",
      icon: FaGooglePlay,
      text: "Google Play",
    },
    {
      href: "https://apps.apple.com/kr/app/%EB%8F%84%EB%8B%B4%EB%8F%84%EB%8B%B4-%EC%8A%A4%EB%A7%88%ED%8A%B8-%ED%95%99%EA%B5%90-%EA%B4%80%EB%A6%AC-%EC%84%9C%EB%B9%84%EC%8A%A4/id6482977790",
      icon: FaApple,
      text: "App Store",
    },
  ];

  return (
    <div className="flex flex-col items-end gap-3">
      <h3 className="text-sm font-medium text-slate-200">Dodam Dodam Mobile</h3>
      <div className="flex gap-2">
        {buttons.map((button) => (
          <DownloadButton
            key={button.text}
            href={button.href}
            icon={button.icon}
            text={button.text}
          />
        ))}
      </div>
    </div>
  );
});

AppDownloadSection.displayName = "AppDownloadSection";

export default AppDownloadSection;
