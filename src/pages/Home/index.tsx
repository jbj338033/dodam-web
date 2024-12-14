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

const MainPage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <BannerSection />

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProfileSection />
            <ScheduleSection />
            <OutgoingSection />
          </div>

          <MealSection />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WakeupSongSection />
            <BusSection />
          </div>

          <ConferenceSection />
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default MainPage;
