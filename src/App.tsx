import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignUp from "./pages/SignUp";
import Schedule from "./pages/Schedule";
import ProfilePage from "./pages/Profile";
import NightStudyPage from "./pages/NightStudy";
import { useTokenStore } from "./stores/token";
import WakeupSongPage from "./pages/WakeupSong";
import AuthServicePage from "./pages/Auth";
import GitPage from "./pages/Git";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {
  const accessToken = useTokenStore.getState().accessToken;

  if (
    !accessToken &&
    window.location.pathname !== "/login" &&
    window.location.pathname !== "/signup"
  ) {
    location.href = "/login";
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="night-study" element={<NightStudyPage />} />
            <Route path="wakeup-song" element={<WakeupSongPage />} />
            <Route path="auth" element={<AuthServicePage />} />
            <Route path="git" element={<GitPage />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>

      {import.meta.env.MODE === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default App;
