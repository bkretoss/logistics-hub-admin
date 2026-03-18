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
import Prospect from "@/pages/Prospect";
import NewProspect from "@/pages/NewProspect";
import Leads from "@/pages/Leads";
import NewLead from "@/pages/NewLead";
import Opportunity from "@/pages/Opportunity";
import NewOpportunity from "@/pages/NewOpportunity";
import Quotes from "@/pages/Quotes";
import NewQuote from "@/pages/NewQuote";
import Operations from "@/pages/Operations";
import NewOperation from "@/pages/NewOperation";
import { OperationsProvider } from "@/pages/OperationsContext";
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
        <OperationsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<ProtectedPage title="Dashboard" description="Your central hub for logistics operations and analytics." />} />
            <Route path="/administration" element={<ProtectedPage title="Administration" description="System administration and settings" />} />
            <Route path="/sales/strategy" element={<ProtectedPage title="Sales Strategy" description="Define and manage sales strategies" />} />
            <Route path="/sales/prospect" element={<ProtectedRoute><AppLayout><Prospect /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/prospect/new" element={<ProtectedRoute><AppLayout><NewProspect /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/leads" element={<ProtectedRoute><AppLayout><Leads /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/leads/new" element={<ProtectedRoute><AppLayout><NewLead /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/opportunity" element={<ProtectedRoute><AppLayout><Opportunity /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/opportunity/new" element={<ProtectedRoute><AppLayout><NewOpportunity /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/rate-requests" element={<ProtectedPage title="Rate Requests" description="Handle rate request submissions" />} />
            <Route path="/sales/quotes" element={<ProtectedRoute><AppLayout><Quotes /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/quotes/new" element={<ProtectedRoute><AppLayout><NewQuote /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/reports" element={<ProtectedPage title="Reports" description="Sales reports and analytics" />} />
            <Route path="/sales/configurations" element={<ProtectedPage title="Configurations" description="Sales module configurations" />} />
            <Route path="/operations" element={<ProtectedRoute><AppLayout><Operations /></AppLayout></ProtectedRoute>} />
            <Route path="/operations/new" element={<ProtectedRoute><AppLayout><NewOperation /></AppLayout></ProtectedRoute>} />
            <Route path="/operations/edit/:id" element={<ProtectedRoute><AppLayout><NewOperation /></AppLayout></ProtectedRoute>} />
            <Route path="/rms" element={<ProtectedPage title="RMS" description="Revenue Management System" />} />
            <Route path="/procurement" element={<ProtectedPage title="Procurement" description="Procurement management" />} />
            <Route path="/schedules" element={<ProtectedPage title="Schedules" description="Manage schedules and timelines" />} />
            <Route path="/accounting" element={<ProtectedPage title="Accounting" description="Financial management and accounting" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </OperationsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
