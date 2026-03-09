import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Shield, TrendingUp, Target, Users, Lightbulb,
  FileText, BarChart3, Settings, Truck, Database, ShoppingCart,
  Calendar, DollarSign, ChevronDown, ChevronRight, Ship, LogOut,
  Menu, X, UserCircle
} from 'lucide-react';

interface MenuItem {
  title: string;
  icon: React.ElementType;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { title: 'Administration', icon: Shield, path: '/administration' },
  {
    title: 'Sales & CRM', icon: TrendingUp, children: [
      { title: 'Sales Strategy', icon: Target, path: '/sales/strategy' },
      {
        title: 'Sales', icon: Users, children: [
          { title: 'Prospect', icon: Lightbulb, path: '/sales/prospect' },
          { title: 'Leads', icon: Users, path: '/sales/leads' },
          { title: 'Opportunity', icon: Target, path: '/sales/opportunity' },
          { title: 'Rate Requests', icon: FileText, path: '/sales/rate-requests' },
          { title: 'Quotes', icon: FileText, path: '/sales/quotes' },
        ]
      },
      { title: 'Reports', icon: BarChart3, path: '/sales/reports' },
      { title: 'Configurations', icon: Settings, path: '/sales/configurations' },
    ]
  },
  { title: 'Operations', icon: Truck, path: '/operations' },
  { title: 'RMS', icon: Database, path: '/rms' },
  { title: 'Procurement', icon: ShoppingCart, path: '/procurement' },
  { title: 'Schedules', icon: Calendar, path: '/schedules' },
  { title: 'Accounting', icon: DollarSign, path: '/accounting' },
];

const SidebarItem: React.FC<{ item: MenuItem; depth?: number }> = ({ item, depth = 0 }) => {
  const location = useLocation();
  const [open, setOpen] = useState(() => {
    const checkActive = (i: MenuItem): boolean => {
      if (i.path && location.pathname === i.path) return true;
      return i.children?.some(checkActive) ?? false;
    };
    return checkActive(item);
  });

  const isActive = item.path === location.pathname;
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
          style={{ paddingLeft: `${12 + depth * 12}px` }}
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span className="flex-1 text-left">{item.title}</span>
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {open && (
          <div className="mt-0.5">
            {item.children!.map(child => (
              <SidebarItem key={child.title} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.path!}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
        isActive
          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      }`}
      style={{ paddingLeft: `${12 + depth * 12}px` }}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{item.title}</span>
    </Link>
  );
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Ship className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <span className="text-base font-bold text-sidebar-primary-foreground tracking-tight">Relay Logistics</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map(item => (
          <SidebarItem key={item.title} item={item} />
        ))}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen flex w-full">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-0 left-0 w-64 h-full z-30">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 material-shadow-1 sticky top-0 z-20">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1" />
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"
            >
              <UserCircle className="w-7 h-7 text-muted-foreground" />
              <span className="hidden sm:block text-sm font-medium text-foreground">{user?.name || 'User'}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg material-shadow-3 border border-border py-1 z-50">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-medium text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-muted"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
