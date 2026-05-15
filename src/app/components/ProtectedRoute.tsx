import { Navigate, useLocation } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const loggedIn = !!localStorage.getItem("accessToken");

  if (!loggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, message: "로그인이 필요한 페이지입니다." }}
      />
    );
  }

  return <>{children}</>;
}
