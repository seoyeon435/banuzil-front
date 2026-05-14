import { createBrowserRouter } from "react-router";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import AttachmentSurveyPage from "./components/AttachmentSurveyPage";
import ProfilePage from "./components/ProfilePage";
import StatisticsPage from "./components/StatisticsPage";
import RecordsPage from "./components/RecordsPage";
import FriendsPage from "./components/FriendsPage";
import SettingsPage from "./components/SettingsPage";
import MediationStartPage from "./components/MediationStartPage";
import MediationJoinPage from "./components/MediationJoinPage";
import MediationRoomWaitingPage from "./components/MediationRoomWaitingPage";
import MediationInputPage from "./components/MediationInputPage";
import MediationWaitingPage from "./components/MediationWaitingPage";
import MediationAnalyzingPage from "./components/MediationAnalyzingPage";
import MediationResultPage from "./components/MediationResultPage";
import MediationCompletePage from "./components/MediationCompletePage";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/",                         Component: LandingPage },
  { path: "/login",                    Component: LoginPage },
  { path: "/signup",                   Component: SignupPage },
  { path: "/signup/attachment-survey", Component: AttachmentSurveyPage },

  // 마이페이지 — 로그인 필요
  {
    path: "/mypage/profile",
    element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
  },
  {
    path: "/mypage/statistics",
    element: <ProtectedRoute><StatisticsPage /></ProtectedRoute>,
  },
  {
    path: "/mypage/records",
    element: <ProtectedRoute><RecordsPage /></ProtectedRoute>,
  },
  {
    path: "/mypage/our-space",
    element: <ProtectedRoute><FriendsPage /></ProtectedRoute>,
  },
  {
    path: "/mypage/settings",
    element: <ProtectedRoute><SettingsPage /></ProtectedRoute>,
  },

  // 중재 — 로그인 필요
  {
    path: "/mediation/start",
    element: <ProtectedRoute><MediationStartPage /></ProtectedRoute>,
  },
  {
    path: "/mediation/join",
    element: <ProtectedRoute><MediationJoinPage /></ProtectedRoute>,
  },
  {
    path: "/mediation/room",
    element: <ProtectedRoute><MediationRoomWaitingPage /></ProtectedRoute>,
  },
  {
    path: "/mediation/input",
    element: <ProtectedRoute><MediationInputPage /></ProtectedRoute>,
  },
  { path: "/mediation/waiting",   Component: MediationWaitingPage },
  { path: "/mediation/analyzing", Component: MediationAnalyzingPage },
  { path: "/mediation/result",    Component: MediationResultPage },
  { path: "/mediation/complete",  Component: MediationCompletePage },
]);
