import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Shield,
  TrendingUp,
  Target,
  Users,
  Lightbulb,
  FileText,
  BarChart3,
  Settings,
  Truck,
  Database,
  ShoppingCart,
  Calendar,
  DollarSign,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Bell,
  UserSquare,
  Package,
} from "lucide-react";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Administration", icon: Shield, path: "/administration" },
  {
    title: "Sales & CRM",
    icon: TrendingUp,
    children: [
      { title: "Sales Strategy", icon: Target, path: "/sales/strategy" },
      {
        title: "Sales",
        icon: Users,
        children: [
          { title: "Leads", icon: Users, path: "/sales/leads" },
          { title: "Rate Requests", icon: Target, path: "/sales/opportunity" },
          // { title: "Customer Visits", icon: Calendar, path: "/sales/customer-visits" },
        ],
      },
      { title: "Reports", icon: BarChart3, path: "/sales/reports" },
      { title: "Configurations", icon: Settings, path: "/sales/configurations" },
    ],
  },
  {
    title: "Operations",
    icon: Truck,
    children: [
      { title: "Operations List", icon: Truck, path: "/operations" },
      { title: "Costing", icon: DollarSign, path: "/operations/costing" },
    ],
  },
  { title: "RMS", icon: Database, path: "/rms" },
  { title: "Procurement", icon: ShoppingCart, path: "/procurement" },
  { title: "Schedules", icon: Calendar, path: "/schedules" },
  { title: "Accounting", icon: DollarSign, path: "/accounting" },

  {
    title: "Setting",
    icon: Settings,
    children: [],
  },

  {
    title: "Master",
    icon: Package,
    children: [
      { title: "Company Master", icon: Users, path: "/setting/company-master" },
      // { title: "Branch",              icon: Database,  path: "/master/branch"            },
      // { title: "Cargo Type",          icon: Package,   path: "/master/cargo-type"        }, // const ma thi value levani
      // { title: "City",                icon: Users,     path: "/master/city"              },
      // { title: "COA",                 icon: Users,     path: "/master/coa"               },
      // { title: "Commodity",           icon: Package,   path: "/master/commodity"         },
      // { title: "Company",             icon: Package,   path: "/master/company"           },
      // { title: "Country",             icon: DollarSign, path: "/master/country"          },
      { title: "Department",          icon: Users,     path: "/master/department"        },
      { title: "Designation",         icon: Users,     path: "/master/designation"       },
      // { title: "Incoterm",            icon: FileText,  path: "/master/incoterm"          },
      { title: "Port",               icon: Package,   path: "/master/port"             },
      // { title: "Pricing Team",        icon: Users,     path: "/master/pricing-team"      },
      // { title: "Prospects",           icon: Users,     path: "/master/prospects"         },
      // { title: "Sales Agent",         icon: Users,     path: "/master/sales-agent"       },
      // { title: "Sales Team",          icon: Users,     path: "/hr/employee-master"       },
      { title: "Service Mode",        icon: Truck,     path: "/master/service-mode"      },
      // { title: "Shipment Type",       icon: Package,   path: "/master/shipment-type"     }, // const ma thi value levani
      // { title: "Shipping Provider",   icon: Truck,     path: "/master/shipping-provider" },
      // { title: "State",               icon: Users,     path: "/master/state"             }, 
      // { title: "Transport Mode Type", icon: Truck,     path: "/master/transport-mode"    }, // const ma thi value levani
      // { title: "User Master List",    icon: Users,     path: "/admin/user-master"         },
    ],
  },
];

const SidebarItem: React.FC<{
  item: MenuItem;
  depth?: number;
  openMenu: string | null;
  setOpenMenu: (title: string | null) => void;
}> = ({ item, depth = 0, openMenu, setOpenMenu }) => {
  const location = useLocation();
  const isActive = item.path ? location.pathname.startsWith(item.path) : false;
  const hasChildren = item.children && item.children.length > 0;

  const isTopLevel = depth === 0;

  // For nested items with children, use local state; seed open if current route is under this subtree
  const isNestedRouteActive = (items: MenuItem[]): boolean =>
    items.some((i) => (i.path && location.pathname.startsWith(i.path)) || (i.children ? isNestedRouteActive(i.children) : false));

  const [nestedOpen, setNestedOpen] = useState(() =>
    !isTopLevel && hasChildren ? isNestedRouteActive(item.children!) : false
  );

  const open = isTopLevel ? openMenu === item.title : nestedOpen;

  if (hasChildren) {
    const toggle = () => {
      if (isTopLevel) {
        setOpenMenu(open ? null : item.title);
      } else {
        setNestedOpen((prev) => !prev);
      }
    };
    return (
      <div>
        <button
          onClick={toggle}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          <span className="flex-1 text-left font-medium">{item.title}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "" : "-rotate-90"}`} />
        </button>
        {open && (
          <div className="mt-1 space-y-0.5">
            {item.children!.map((child) => (
              <SidebarItem key={child.title} item={child} depth={depth + 1} openMenu={openMenu} setOpenMenu={setOpenMenu} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.path!}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
        isActive
          ? "bg-sidebar-primary/20 text-sidebar-primary border-l-4 border-sidebar-primary"
          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 border-l-4 border-transparent"
      }`}
      style={{ paddingLeft: `${8 + depth * 16}px` }}
    >
      {depth > 0 && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0"></span>}
      <span className="font-medium">{item.title}</span>
    </Link>
  );
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  // Derive the active top-level menu from the current route
  const getActiveTopMenu = () => {
    const active = menuItems.find((item) => {
      if (item.children) {
        const check = (items: MenuItem[]): boolean =>
          items.some((i) => (i.path && location.pathname.startsWith(i.path)) || (i.children ? check(i.children) : false));
        return check(item.children);
      }
      return false;
    });
    return active?.title ?? null;
  };

  const [openMenu, setOpenMenu] = useState<string | null>(getActiveTopMenu);

  // Sync open menu when route changes (e.g. browser back/forward)
  React.useEffect(() => {
    setOpenMenu(getActiveTopMenu());
  }, [location.pathname]);

  const companies = [
    { id: 1, name: "Relay Logistics LLC", checked: false },
    { id: 2, name: "Relay Lines Canada INC", checked: false },
    { id: 3, name: "Relay Lines UK ltd", checked: false },
    { id: 4, name: "Relay Logistics Private Limited", checked: true },
  ];

  const handleLogout = () => {
    setProfileOpen(false);
    setLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="flex items-center justify-center px-5 h-16 border-b border-sidebar-border">
        <img src="/company_logo.png" alt="Relay Logistics" className="h-22 w-auto max-w-full" />
      </div>
      <div className="px-3 pt-4 pb-3">
        <p className="text-[10px] text-sidebar-foreground/40 font-semibold tracking-wider px-3 mb-3">MAIN MENU</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 scrollbar-hide">
        {menuItems.map((item) => (
          <SidebarItem key={item.title} item={item} openMenu={openMenu} setOpenMenu={setOpenMenu} />
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 relative">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold relative">
            {user?.name?.charAt(0) || "B"}
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-sidebar absolute bottom-0 right-0"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">{user?.name || "bkretoss"}</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex w-full">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="fixed top-0 left-0 w-64 h-full z-30">{sidebarContent}</div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full">{sidebarContent}</div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b border-border flex items-center justify-end px-4 lg:px-6 material-shadow-1 sticky top-0 z-20">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted text-foreground mr-auto"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
            <button className="p-2 rounded-lg hover:bg-muted">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="relative">
              <button
                onClick={() => setCompanyOpen(!companyOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted border border-border"
              >
                <span className="text-sm font-medium">Relay Logistics Private Limited</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {companyOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-card rounded-lg material-shadow-3 border border-border py-2 z-50">
                  <div className="max-h-64 overflow-y-auto">
                    {companies.map((company) => (
                      <label
                        key={company.id}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer"
                      >
                        <input type="checkbox" defaultChecked={company.checked} className="w-4 h-4" />
                        <span className="text-sm">{company.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0) || "B"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-foreground">{user?.name || "bkretoss"}</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
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
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>

      {/* Logout Confirmation */}
      {logoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setLogoutConfirm(false)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-sm mx-4">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Confirm Logout</h3>
              <button onClick={() => setLogoutConfirm(false)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-muted-foreground">Are you sure you want to sign out?</p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setLogoutConfirm(false)} className="px-4 py-2 rounded-lg border border-input text-sm font-medium hover:bg-muted">Cancel</button>
              <button onClick={confirmLogout} className="px-4 py-2 rounded-lg bg-destructive text-white text-sm font-medium hover:bg-destructive/90 flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
