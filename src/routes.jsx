import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashBoardGym from "./pages/dashboard-gym.jsx";
import { LoginPage } from "./pages/login-page.jsx";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to='/login' replace />;
  return children;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <DashBoardGym />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
