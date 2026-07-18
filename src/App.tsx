import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import { AdminProvider } from "./context/AdminContext";
import { FunnelProvider } from "./context/FunnelContext";
import WhatsAppButton from "./components/ui/WhatsAppButton";
import usePageTracking from "./hooks/usePageTracking";
import ErrorBoundary from "./ErrorBoundary";

// Core Pages
import Index from "./pages/Index";
import Inscription from "./pages/Inscription";
import Formation from "./pages/Formation";
import Tarifs from "./pages/Tarifs";
import Partenaires from "./pages/Partenaires";
import Programme from "./pages/Programme";
import Actualites from "./pages/Actualites";
import Projets from "./pages/Projets";
import ProjectDetails from "./pages/ProjectDetails";
import Angelo from "./pages/Angelo";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminForgotPassword from "./pages/admin/ForgotPassword";
import AdminResetPassword from "./pages/admin/ResetPassword";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRegistrations from "./pages/admin/Registrations";
import AdminNews from "./pages/admin/News";
import AdminGallery from "./pages/admin/Gallery";
import AdminPartners from "./pages/admin/Partners";
import AdminPartnershipRequests from "./pages/admin/PartnershipRequests";
import AdminTeams from "./pages/admin/Teams";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import AdminFunnel from "./pages/admin/Funnel";
import ProtectedRoute from "./components/layout/ProtectedRoute";

const queryClient = new QueryClient();

// Component to handle page tracking inside the secure error boundary
const PageTracker = () => {
  usePageTracking();
  return null;
};

const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <PageTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/formation" element={<Formation />} />
          <Route path="/tarifs" element={<Tarifs />} />
          <Route path="/partenaires" element={<Partenaires />} />
          <Route path="/programme" element={<Programme />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/projets" element={<Projets />} />
          <Route path="/projets/:id" element={<ProjectDetails />} />
          <Route path="/angelo" element={<Angelo />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="registrations" element={<AdminRegistrations />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="partners" element={<AdminPartners />} />
            <Route path="partnership-requests" element={<AdminPartnershipRequests />} />
            <Route path="teams" element={<AdminTeams />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="funnel" element={<AdminFunnel />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
      {!isAdminPage && <WhatsAppButton />}
    </TooltipProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminProvider>
      <FunnelProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </FunnelProvider>
    </AdminProvider>
  </QueryClientProvider>
);

export default App;
