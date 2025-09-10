import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import About from "./pages/About";
import Placeholder from "./pages/Placeholder";
import Layout from "./components/site/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/complaint"
              element={
                <Placeholder
                  title="Complaint Form"
                  description="Start a new complaint. We will build this next."
                />
              }
            />
            <Route
              path="/track"
              element={
                <Placeholder
                  title="Track Complaint"
                  description="Enter your reference number to view status."
                />
              }
            />
            <Route
              path="/contact"
              element={
                <Placeholder
                  title="Contact Us"
                  description="Get support or reach our team."
                />
              }
            />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
