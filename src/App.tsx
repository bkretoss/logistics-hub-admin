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
import EditLead from "@/pages/EditLead";
import ViewOpportunity from "@/pages/ViewOpportunity";
import Opportunity from "@/pages/Opportunity";
import NewOpportunity from "@/pages/NewOpportunity";
import Quotes from "@/pages/Quotes";
import NewQuote from "@/pages/NewQuote";
import Operations from "@/pages/Operations";
import NewOperation from "@/pages/NewOperation";
import ViewOperation from "@/pages/ViewOperation";
import { OperationsProvider } from "@/pages/OperationsContext";
import BranchMasterList from "@/pages/BranchMasterList";
import NewBranch from "@/pages/NewBranch";
import ViewBranch from "@/pages/ViewBranch";
import EmployeeMasterList from "@/pages/EmployeeMasterList";
import NewEmployee from "@/pages/NewEmployee";
import UserMasterList from "@/pages/UserMasterList";
import NewUser from "@/pages/NewUser";
import CustomerMasterList from "@/pages/CustomerMasterList";
import NewCustomer from "@/pages/NewCustomer";
import RateRequests from "@/pages/RateRequests";
import NewRateRequest from "@/pages/NewRateRequest";
import ViewRateRequest from "@/pages/ViewRateRequest";
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
            <Route path="/sales/leads/edit/:id" element={<ProtectedRoute><AppLayout><EditLead /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/opportunity" element={<ProtectedRoute><AppLayout><Opportunity /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/opportunity/new" element={<ProtectedRoute><AppLayout><NewOpportunity /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/opportunity/view/:id" element={<ProtectedRoute><AppLayout><ViewOpportunity /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/opportunity/edit/:id" element={<ProtectedRoute><AppLayout><NewRateRequest /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/rate-requests" element={<ProtectedRoute><AppLayout><RateRequests /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/rate-requests/new" element={<ProtectedRoute><AppLayout><NewRateRequest /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/rate-requests/edit/:id" element={<ProtectedRoute><AppLayout><NewRateRequest /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/rate-requests/view/:id" element={<ProtectedRoute><AppLayout><ViewRateRequest /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/quotes" element={<ProtectedRoute><AppLayout><Quotes /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/quotes/new" element={<ProtectedRoute><AppLayout><NewQuote /></AppLayout></ProtectedRoute>} />
            <Route path="/sales/reports" element={<ProtectedPage title="Reports" description="Sales reports and analytics" />} />
            <Route path="/sales/configurations" element={<ProtectedPage title="Configurations" description="Sales module configurations" />} />
            <Route path="/operations" element={<ProtectedRoute><AppLayout><Operations /></AppLayout></ProtectedRoute>} />
            <Route path="/operations/new" element={<ProtectedRoute><AppLayout><NewOperation /></AppLayout></ProtectedRoute>} />
            <Route path="/operations/edit/:id" element={<ProtectedRoute><AppLayout><NewOperation /></AppLayout></ProtectedRoute>} />
            <Route path="/operations/view/:id" element={<ProtectedRoute><AppLayout><ViewOperation /></AppLayout></ProtectedRoute>} />
            <Route path="/rms" element={<ProtectedPage title="RMS" description="Revenue Management System" />} />
            <Route path="/procurement" element={<ProtectedPage title="Procurement" description="Procurement management" />} />
            <Route path="/schedules" element={<ProtectedPage title="Schedules" description="Manage schedules and timelines" />} />
            <Route path="/accounting" element={<ProtectedPage title="Accounting" description="Financial management and accounting" />} />
            <Route path="/admin/branch-master" element={<ProtectedRoute><AppLayout><BranchMasterList /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/branch-master/new" element={<ProtectedRoute><AppLayout><NewBranch /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/branch-master/view/:id" element={<ProtectedRoute><AppLayout><ViewBranch /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/branch-master/edit/:id" element={<ProtectedRoute><AppLayout><NewBranch /></AppLayout></ProtectedRoute>} />
            <Route path="/hr/employee-master" element={<ProtectedRoute><AppLayout><EmployeeMasterList /></AppLayout></ProtectedRoute>} />
            <Route path="/hr/employee-master/new" element={<ProtectedRoute><AppLayout><NewEmployee /></AppLayout></ProtectedRoute>} />
            <Route path="/hr/employee-master/edit/:id" element={<ProtectedRoute><AppLayout><NewEmployee /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/user-master" element={<ProtectedRoute><AppLayout><UserMasterList /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/user-master/new" element={<ProtectedRoute><AppLayout><NewUser /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/user-master/edit/:id" element={<ProtectedRoute><AppLayout><NewUser /></AppLayout></ProtectedRoute>} />
            <Route path="/setting/customer-master" element={<ProtectedRoute><AppLayout><CustomerMasterList /></AppLayout></ProtectedRoute>} />
            <Route path="/setting/customer-master/new" element={<ProtectedRoute><AppLayout><NewCustomer /></AppLayout></ProtectedRoute>} />
            <Route path="/setting/customer-master/edit/:id" element={<ProtectedRoute><AppLayout><NewCustomer /></AppLayout></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </OperationsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
