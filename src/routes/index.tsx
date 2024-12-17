import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Schedule from "../pages/Schedule";
import Profile from "../pages/Profile";
import NightStudy from "../pages/NightStudy";
import WakeupSong from "../pages/WakeupSong";
import Auth from "../pages/Auth";
import Git from "../pages/Git";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "schedule",
        element: <Schedule />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "night-study",
        element: <NightStudy />,
      },
      {
        path: "wakeup-song",
        element: <WakeupSong />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "git",
        element: <Git />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);
