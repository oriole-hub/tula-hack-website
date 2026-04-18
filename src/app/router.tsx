import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../widgets/layout/AppShell";
import { ProtectedRoute } from "../widgets/layout/ProtectedRoute";
import { SigninPage } from "../pages/SigninPage";
import { SignupPage } from "../pages/SignupPage";
import { DashboardPage } from "../pages/DashboardPage";
import { TeamsPage } from "../pages/TeamsPage";
import { EmployeesPage } from "../pages/EmployeesPage";
import { EmployeeProfilePage } from "../pages/EmployeeProfilePage";
import { AssessmentsPage } from "../pages/AssessmentsPage";
import { IdealProfilesPage } from "../pages/IdealProfilesPage";
import { CandidatesPage } from "../pages/CandidatesPage";
import { RisksPage } from "../pages/RisksPage";
import { RoleMapPage } from "../pages/RoleMapPage";
import { TalentPoolPage } from "../pages/TalentPoolPage";
import { SuccessionPage } from "../pages/SuccessionPage";
import { NotificationsPage } from "../pages/NotificationsPage";
import { SessionProvider } from "../shared/state/session";
import { PortalProvider } from "../shared/state/portal";

export const RouterProvider = () => (
  <SessionProvider>
    <PortalProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/:employeeId" element={<EmployeeProfilePage />} />
            <Route path="/assessments" element={<AssessmentsPage />} />
            <Route path="/ideal-profiles" element={<IdealProfilesPage />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/risks" element={<RisksPage />} />
            <Route path="/role-map" element={<RoleMapPage />} />
            <Route path="/talent-pool" element={<TalentPoolPage />} />
            <Route path="/succession-planning" element={<SuccessionPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
        </Route>
      </Routes>
    </PortalProvider>
  </SessionProvider>
);
