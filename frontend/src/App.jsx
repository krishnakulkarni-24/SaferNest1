import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import AdminPanelPage from "./pages/AdminPanelPage";
import DashboardPage from "./pages/DashboardPage";
import IncidentsPage from "./pages/IncidentsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ReportIncidentPage from "./pages/ReportIncidentPage";
import ResourceRequestsPage from "./pages/ResourceRequestsPage";
import VolunteerTasksPage from "./pages/VolunteerTasksPage";

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route
      element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/report-incident" element={<ReportIncidentPage />} />
      <Route path="/incidents" element={<IncidentsPage />} />
      <Route path="/requests" element={<ResourceRequestsPage />} />
      <Route path="/volunteer-tasks" element={<VolunteerTasksPage />} />
      <Route
        path="/admin"
        element={
          <RoleGuard roles={["ADMIN"]}>
            <AdminPanelPage />
          </RoleGuard>
        }
      />
    </Route>

    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default App;
