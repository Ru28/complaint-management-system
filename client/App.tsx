import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import About from "./pages/About";
import Placeholder from "./pages/Placeholder";
import Layout from "./components/site/Layout";
import Complaint from "./pages/Complaint";
import Track from "./pages/Track";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import CreateAccountModal from "@/components/site/CreateAccountModal";
import AuthenticatedLayout from "./components/site/AuthenticatedLayout";

const queryClient = new QueryClient();

function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  );
}

function AdminOnly() {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CreateAccountModal />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/complaint" element={<Complaint />} />
              <Route path="/track" element={<Track />} />
              <Route
                path="/contact"
                element={
                  <Placeholder
                    title="Contact Us"
                    description="Get support or reach our team."
                  />
                }
              />
              <Route path="/admin" element={<Admin />} />
            </Route>

            {/* Authenticated Dashboard Routes */}
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/complaints" element={<Complaint />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route element={<AdminOnly />}>
                <Route path="/dashboard/admin" element={<Admin />} />
                <Route path="/dashboard/users" element={<Users />} />
              </Route>
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
