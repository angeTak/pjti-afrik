import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";
import WhatsAppButton from "./components/ui/WhatsAppButton";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
          <WhatsAppButton />
        </BrowserRouter>
      </TooltipProvider>
    </AdminProvider>
  </QueryClientProvider>
);

export default App;
