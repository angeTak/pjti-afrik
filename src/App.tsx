import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import { AdminProvider } from "./context/AdminContext";
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
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRegistrations from "./pages/admin/Registrations";
import AdminNews from "./pages/admin/News";
import AdminGallery from "./pages/admin/Gallery";
import AdminPartners from "./pages/admin/Partners";
import AdminPartnershipRequests from "./pages/admin/PartnershipRequests";
import AdminTeams from "./pages/admin/Teams";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
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
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/registrations" element={<ProtectedRoute><AdminRegistrations /></ProtectedRoute>} />
          <Route path="/admin/news" element={<ProtectedRoute><AdminNews /></ProtectedRoute>} />
          <Route path="/admin/gallery" element={<ProtectedRoute><AdminGallery /></ProtectedRoute>} />
          <Route path="/admin/partners" element={<ProtectedRoute><AdminPartners /></ProtectedRoute>} />
          <Route path="/admin/partnership-requests" element={<ProtectedRoute><AdminPartnershipRequests /></ProtectedRoute>} />
          <Route path="/admin/teams" element={<ProtectedRoute><AdminTeams /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
          
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
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AdminProvider>
  </QueryClientProvider>
);

export default App;
