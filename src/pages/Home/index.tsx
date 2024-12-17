import React, { memo } from "react";
import dayjs from "dayjs";
import { Toaster } from "react-hot-toast";
import "dayjs/locale/ko";

import MealSection from "./MealSection";
import BannerSection from "./BannerSection";
import OutgoingSection from "./OutgoingSection";
import ScheduleSection from "./ScheduleSection";
import ProfileSection from "./ProfileSection";
import WakeupSongSection from "./WakeupSongSection";
import BusSection from "./BusSection";
import ConferenceSection from "./ConferenceSection";

dayjs.locale("ko");

interface GridSectionProps {
  children: React.ReactNode;
  columns: "1" | "2" | "3";
}

const GridSection = memo(({ children, columns }: GridSectionProps) => (
  <div
    className={`grid grid-cols-1 ${
      columns === "2"
        ? "md:grid-cols-2"
        : columns === "3"
          ? "md:grid-cols-3"
          : ""
    } gap-4`}
  >
    {children}
  </div>
));

GridSection.displayName = "GridSection";

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent = memo(({ children }: MainContentProps) => (
  <main className="container mx-auto px-4 py-6">
    <div className="max-w-6xl mx-auto space-y-6">{children}</div>
  </main>
));

MainContent.displayName = "MainContent";

const MainPage = memo(() => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <BannerSection />

      <MainContent>
        <GridSection columns="3">
          <ProfileSection />
          <ScheduleSection />
          <OutgoingSection />
        </GridSection>

        <MealSection />

        <GridSection columns="2">
          <WakeupSongSection />
          <BusSection />
        </GridSection>

        <ConferenceSection />
      </MainContent>

      <Toaster />
    </div>
  );
});

MainPage.displayName = "MainPage";

export default MainPage;
