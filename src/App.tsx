import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import SearchPage from "./pages/SearchPage";
import ExplorePage from "./pages/ExplorePage";
import CreatePage from "./pages/CreatePage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import TravelPlanPage from "./pages/TravelPlanPage";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import NotificationsPage from "./pages/NotificationsPage";
import MyTripsPage from "./pages/MyTripsPage";
import PlaceDetailsPage from "./pages/PlaceDetailsPage";
import PlaceTripsPage from "./pages/PlaceTripsPage";
import ItineraryDetailsPage from "./pages/ItineraryDetailsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/my-trips" element={<MyTripsPage />} />
            <Route path="/place/:id" element={<PlaceDetailsPage />} />
            <Route path="/place/:id/trips" element={<PlaceTripsPage />} />
            <Route path="/itinerary/:id" element={<ItineraryDetailsPage />} />
            <Route path="/plan/:id" element={<TravelPlanPage />} />
            <Route path="/plan/generated" element={<TravelPlanPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
