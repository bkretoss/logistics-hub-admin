import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import BlankPage from "@/components/BlankPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedPage = ({ title, description }: { title: string; description?: string }) => (
  <ProtectedRoute>
    <AppLayout>
      <BlankPage title={title} description={description} />
    </AppLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<ProtectedPage title="Dashboard" description="Overview of your logistics operations" />} />
            <Route path="/administration" element={<ProtectedPage title="Administration" description="System administration and settings" />} />
            <Route path="/sales/strategy" element={<ProtectedPage title="Sales Strategy" description="Define and manage sales strategies" />} />
            <Route path="/sales/prospect" element={<ProtectedPage title="Prospect" description="Manage prospective clients" />} />
            <Route path="/sales/leads" element={<ProtectedPage title="Leads" description="Track and manage sales leads" />} />
            <Route path="/sales/opportunity" element={<ProtectedPage title="Opportunity" description="Manage sales opportunities" />} />
            <Route path="/sales/rate-requests" element={<ProtectedPage title="Rate Requests" description="Handle rate request submissions" />} />
            <Route path="/sales/quotes" element={<ProtectedPage title="Quotes" description="Create and manage quotes" />} />
            <Route path="/sales/reports" element={<ProtectedPage title="Reports" description="Sales reports and analytics" />} />
            <Route path="/sales/configurations" element={<ProtectedPage title="Configurations" description="Sales module configurations" />} />
            <Route path="/operations" element={<ProtectedPage title="Operations" description="Manage logistics operations" />} />
            <Route path="/rms" element={<ProtectedPage title="RMS" description="Revenue Management System" />} />
            <Route path="/procurement" element={<ProtectedPage title="Procurement" description="Procurement management" />} />
            <Route path="/schedules" element={<ProtectedPage title="Schedules" description="Manage schedules and timelines" />} />
            <Route path="/accounting" element={<ProtectedPage title="Accounting" description="Financial management and accounting" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
