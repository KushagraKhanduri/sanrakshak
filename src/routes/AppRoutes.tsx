
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import AuthRoute from "./AuthRoute";
import ResourceRouteRedirect from "./ResourceRouteRedirect";

import Index from "../pages/Index";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import VolunteerResources from "../pages/VolunteerResources";
import VictimResources from "../pages/VictimResources";
import Map from "../pages/Map";
import Alerts from "../pages/Alerts";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import ForgotPassword from "../pages/ForgotPassword";
import EmergencyPlan from "../pages/EmergencyPlan";
import ShelterMap from "../pages/ShelterMap";
import ChatSection from "../pages/ChatSection";
import ResourceDetails from "../pages/ResourceDetails";
import StatusDetails from "../pages/StatusDetails";
import LandingPage from "../pages/LandingPage";
import VolunteerTasks from "../pages/VolunteerTasks";
import VolunteerTaskDetails from "../pages/VolunteerTaskDetails";
import VolunteerStats from "../pages/VolunteerStats";
import AdminDashboard from "../pages/AdminDashboard";
import Reports from "../pages/Reports";
import RecoveryPlan from "../pages/RecoveryPlan";
import CommandCenter from "../pages/CommandCenter";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        
        <Route path="/admin-dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        
        <Route path="/admin/*" element={
          <Navigate to="/admin-dashboard" replace />
        } />
        
        <Route path="/login" element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } />
        <Route path="/signup" element={
          <AuthRoute>
            <Signup />
          </AuthRoute>
        } />
        <Route path="/forgot-password" element={
          <AuthRoute>
            <ForgotPassword />
          </AuthRoute>
        } />
        
        <Route path="/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />
        
        <Route path="/resources" element={<ResourceRouteRedirect />} />
        
        <Route path="/volunteer-resources" element={
          <ProtectedRoute>
            <VolunteerResources />
          </ProtectedRoute>
        } />
        <Route path="/victim-resources" element={
          <ProtectedRoute>
            <VictimResources />
          </ProtectedRoute>
        } />
        
        <Route path="/resources/:id" element={
          <ProtectedRoute>
            <ResourceDetails />
          </ProtectedRoute>
        } />
        <Route path="/map" element={
          <ProtectedRoute>
            <Map />
          </ProtectedRoute>
        } />
        <Route path="/alerts" element={
          <ProtectedRoute>
            <Alerts />
          </ProtectedRoute>
        } />
        <Route path="/status/:id" element={
          <ProtectedRoute>
            <StatusDetails />
          </ProtectedRoute>
        } />
        <Route path="/emergency-plan" element={<EmergencyPlan />} />
        <Route path="/shelter-map" element={
          <ProtectedRoute>
            <ShelterMap />
          </ProtectedRoute>
        } />
        <Route path="/chat/:contactId" element={
          <ProtectedRoute>
            <ChatSection />
          </ProtectedRoute>
        } />
        <Route path="/volunteer-tasks" element={
          <ProtectedRoute>
            <VolunteerTasks />
          </ProtectedRoute>
        } />
        <Route path="/volunteer-tasks/:id" element={
          <ProtectedRoute>
            <VolunteerTaskDetails />
          </ProtectedRoute>
        } />
        <Route path="/volunteer-stats" element={
          <ProtectedRoute>
            <VolunteerStats />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        
        <Route path="/recovery-plan" element={
          <ProtectedRoute>
            <RecoveryPlan />
          </ProtectedRoute>
        } />
        <Route path="/command-center" element={
          <ProtectedRoute>
            <CommandCenter />
          </ProtectedRoute>
        } />
        
        {/* Add a catch-all route at the end */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
