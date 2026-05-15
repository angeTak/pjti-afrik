import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";
import WhatsAppButton from "./components/ui/WhatsAppButton";
import usePageTracking from "./hooks/usePageTracking";
import ErrorBoundary from "./ErrorBoundary";

// Lazy loading pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Inscription = lazy(() => import("./pages/Inscription"));
const Formation = lazy(() => import("./pages/Formation"));
const Tarifs = lazy(() => import("./pages/Tarifs"));
const Partenaires = lazy(() => import("./pages/Partenaires"));
const Programme = lazy(() => import("./pages/Programme"));
const Actualites = lazy(() => import("./pages/Actualites"));
const Projets = lazy(() => import("./pages/Projets"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin Pages
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminRegistrations = lazy(() => import("./pages/admin/Registrations"));
const AdminNews = lazy(() => import("./pages/admin/News"));
const AdminGallery = lazy(() => import("./pages/admin/Gallery"));
const AdminPartners = lazy(() => import("./pages/admin/Partners"));
const AdminPartnershipRequests = lazy(() => import("./pages/admin/PartnershipRequests"));
const AdminTeams = lazy(() => import("./pages/admin/Teams"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
      gcTime: 1000 * 60 * 30, // Keep in garbage collection for 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingFallback = () => (
  <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
    <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mb-4"></div>
    <p className="text-slate-400 font-bold text-sm animate-pulse">Chargement optimisé...</p>
  </div>
);

const AppContent = () => {
  usePageTracking();
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Suspense fallback={<LoadingFallback />}>
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
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/registrations" element={<AdminRegistrations />} />
          <Route path="/admin/news" element={<AdminNews />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/partners" element={<AdminPartners />} />
          <Route path="/admin/partnership-requests" element={<AdminPartnershipRequests />} />
          <Route path="/admin/teams" element={<AdminTeams />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <WhatsAppButton />
    </TooltipProvider>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AdminProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
