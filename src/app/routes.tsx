import { createBrowserRouter } from "react-router";
import MainLayout from "./components/MainLayout";
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
import MediationInputPage from "./components/MediationInputPage";
import MediationWaitingPage from "./components/MediationWaitingPage";
import MediationAnalyzingPage from "./components/MediationAnalyzingPage";
import MediationResultPage from "./components/MediationResultPage";
import MediationCompletePage from "./components/MediationCompletePage";

export const router = createBrowserRouter([
  // ── Navbar가 표시되는 페이지 (MainLayout)
  {
    Component: MainLayout,
    children: [
      { path: "/",                       Component: LandingPage },
      { path: "/mypage/profile",         Component: ProfilePage },
      { path: "/mypage/statistics",      Component: StatisticsPage },
      { path: "/mypage/records",         Component: RecordsPage },
      { path: "/mypage/our-space",       Component: FriendsPage },
      { path: "/mypage/settings",        Component: SettingsPage },
      { path: "/mediation/start",        Component: MediationStartPage },
      { path: "/mediation/input",        Component: MediationInputPage },
      { path: "/mediation/waiting",      Component: MediationWaitingPage },
      { path: "/mediation/analyzing",    Component: MediationAnalyzingPage },
      { path: "/mediation/result",       Component: MediationResultPage },
      { path: "/mediation/complete",     Component: MediationCompletePage },
    ],
  },
  // ── Navbar 없는 페이지 (로그인 / 회원가입 / 온보딩)
  { path: "/login",                    Component: LoginPage },
  { path: "/signup",                   Component: SignupPage },
  { path: "/signup/attachment-survey", Component: AttachmentSurveyPage },
]);
