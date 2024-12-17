import { memo } from "react";
import LogoSection from "./LogoSection";
import MenuSection from "./MenuSection";
import AppDownloadSection from "./AppDownloadSection";

interface FooterProps {
  version?: string;
  copyrightYear?: string;
}

const Copyright = memo(
  ({ version = "6.0.0", copyrightYear = "2017" }: FooterProps) => (
    <div className="text-sm text-slate-400">
      v {version} Copyright By B1ND team. All rights reserved. Since{" "}
      {copyrightYear}
    </div>
  )
);

Copyright.displayName = "Copyright";

const Footer = memo(({ version, copyrightYear }: FooterProps) => {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <LogoSection />
              <div className="mt-8">
                <MenuSection />
              </div>
            </div>
            <AppDownloadSection />
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700">
            <Copyright version={version} copyrightYear={copyrightYear} />
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
