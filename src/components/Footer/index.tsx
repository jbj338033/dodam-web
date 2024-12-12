import LogoSection from "./LogoSection";
import MenuSection from "./MenuSection";
import AppDownloadSection from "./AppDownloadSection";

const Footer = () => {
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
            <div className="text-sm text-slate-400">
              v 6.0.0 Copyright By B1ND team. All rights reserved. Since 2017
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
