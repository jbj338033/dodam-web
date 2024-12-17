import { memo } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const MainContent = memo(() => (
  <main className="flex-1">
    <Outlet />
  </main>
));

MainContent.displayName = "MainContent";

const Layout = memo(() => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
});

Layout.displayName = "Layout";

export default Layout;
