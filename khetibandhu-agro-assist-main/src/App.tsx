import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import FloatingLanguageSwitcher from "@/components/Translate/FloatingLanguageSwitcher";
import { ChatBot } from "@/components/Chatbot/ChatWidget";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Predictions from "./pages/Predictions";
import Quests from "./pages/Quests";
import Badges from "./pages/Badges";
import Leaderboard from "./pages/Leaderboard";
import Rewards from "./pages/Rewards";
import NotFound from "./pages/NotFound";
import QuestDetails from "./pages/QuestDetails";
import AdminSubmissions from "./pages/AdminSubmissions";
import { useAuth } from "@/context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen w-full">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/quests" element={<Quests />} />
              <Route path="/quests/:id" element={<QuestDetails />} />
              <Route path="/badges" element={<Badges />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/admin/submissions" element={<AdminRoute />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <FloatingLanguageSwitcher />
            <ChatBot />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

const AdminRoute = () => {
  const { user } = useAuth();
  if (!user?.is_staff) {
    return <NotFound />;
  }
  return <AdminSubmissions />;
};
