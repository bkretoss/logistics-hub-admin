import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  Plus, Search, Grid3x3, List, ArrowUpDown,
  MapPin, DollarSign, Clock, Building2,
  Eye, Edit, Trash2, Star, Loader2, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { getLeadsApi, deleteLeadApi, updateLeadStatusApi, updateLeadRatingApi, getEmployeesApi } from "@/services/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Lead {
  id: number;
  customer: string;
  target: string;
  rating: number;
  lead_source: string;
  lead_owner: string;
  company: string;
  sales_team: string;
  date: string;
  status: string;
  // detail fields
  shipment_type?: string; transport_mode?: string; origin_port?: string;
  target_date?: string; business_service?: string; destination_port?: string;
  expected_annual_revenue?: string; expected_annual_volume_commodity?: string;
  nature_of_business?: string; company_turnover?: string; remarks?: string;
  address?: string; state?: string; city?: string; zip?: string;
  contact_person?: string; email?: string; telephone_no?: string;
  mobile_no?: string; designation?: string; department?: string; notes?: string;
  // UI-only
  _new?: boolean;
}

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, { color: string; bg: string; dot: string }> = {
  Open:              { color: "text-blue-600",   bg: "bg-blue-50",    dot: "bg-blue-500"   },
  "Follow-up":       { color: "text-yellow-600", bg: "bg-yellow-50",  dot: "bg-yellow-500" },
  Quote:             { color: "text-indigo-600", bg: "bg-indigo-50",  dot: "bg-indigo-500" },
  Active:            { color: "text-teal-600",   bg: "bg-teal-50",    dot: "bg-teal-500"   },
  Closed:            { color: "text-red-500",    bg: "bg-red-50",     dot: "bg-red-400"    },
  "Future Prospect": { color: "text-purple-600", bg: "bg-purple-50",  dot: "bg-purple-500" },
};
const getStatus = (s: string) => STATUS_MAP[s] ?? STATUS_MAP["Open"];

export const STATUS_OPTIONS = ["Open", "Follow-up", "Quote", "Active", "Closed", "Future Prospect"];
export const SHIPMENT_TYPES = ["FCL", "LCL", "FTL", "LTL"];
export const TRANSPORT_MODES = ["SEA", "AIR", "LAND", "RAIL"];

const SHIPMENT_MAP: Record<string, { color: string; bg: string; dot: string }> = {
  FCL: { color: "text-blue-600",   bg: "bg-blue-50",   dot: "bg-blue-500"   },
  LCL: { color: "text-green-600",  bg: "bg-green-50",  dot: "bg-green-500"  },
  FTL: { color: "text-orange-600", bg: "bg-orange-50", dot: "bg-orange-500" },
  LTL: { color: "text-purple-600", bg: "bg-purple-50", dot: "bg-purple-500" },
};
const getShipment = (s?: string) => (s && SHIPMENT_MAP[s]) ? SHIPMENT_MAP[s] : { color: "text-slate-500", bg: "bg-slate-100", dot: "bg-slate-400" };

// ─── Star rating ───────────────────────────────────────────────────────────────
const StarRating = ({ rating, onRate, updating }: { rating: number; onRate?: (r: number) => void; updating?: boolean }) => {
  const [hovered, setHovered] = React.useState(0);
  return (
    <div className="flex items-center gap-0.5 mt-0.5">
      {[...Array(5)].map((_, i) => {
        const val = i + 1;
        return (
          <button
            key={i}
            type="button"
            disabled={!onRate || updating}
            onClick={() => onRate?.(val)}
            onMouseEnter={() => onRate && setHovered(val)}
            onMouseLeave={() => onRate && setHovered(0)}
            className={onRate ? "cursor-pointer disabled:cursor-default" : "cursor-default"}
          >
            <Star className={`w-3 h-3 transition-colors ${
              (hovered || rating) >= val ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"
            } ${updating ? "opacity-50" : ""}`} />
          </button>
        );
      })}
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────
const Leads = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [leads,         setLeads]         = useState<Lead[]>([]);
  const [employees,     setEmployees]     = useState<Record<number, string>>({});
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [viewMode,      setViewMode]      = useState<"grid" | "list">("list");
  const [searchTerm,    setSearchTerm]    = useState("");
  const [activeFilter,  setActiveFilter]  = useState("All");
  const [viewDialogOpen,  setViewDialogOpen]  = useState(false);
  const [selectedLead,    setSelectedLead]    = useState<Lead | null>(null);
  const [deleteDialogOpen,setDeleteDialogOpen]= useState(false);
  const [leadToDelete,    setLeadToDelete]    = useState<Lead | null>(null);
  const [deleting,        setDeleting]        = useState(false);

  // ── Fetch employees ──────────────────────────────────────────────────────────
  useEffect(() => {
    getEmployeesApi().then(res => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      const map: Record<number, string> = {};
      raw.forEach(r => { map[r.id] = [r.first_name, r.last_name].filter(Boolean).join(' '); });
      setEmployees(map);
    }).catch(() => {});
  }, []);

  // ── Fetch leads ──────────────────────────────────────────────────────────────
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getLeadsApi();
      // Handle all common Laravel response shapes:
      // { data: [...] }  |  { data: { data: [...] } }  |  [...]
      const raw = res.data;
      const list: any[] =
        Array.isArray(raw)             ? raw          :
        Array.isArray(raw?.data)       ? raw.data     :
        Array.isArray(raw?.data?.data) ? raw.data.data :
        [];
      const data: Lead[] = list.map((l: any) => ({
        id:           l.id,
        customer:     l.customer      ?? l.customer_name ?? "",
        target:       l.target        ?? l.target_name   ?? "",
        rating:       Number(l.rating ?? 0),
        lead_source:  l.lead_source   ?? l.source        ?? "",
        lead_owner:   l.lead_owner    ?? l.owner         ?? "",
        company:      l.company       ?? "",
        sales_team:   l.sales_team    ?? l.team          ?? "",
        date:         l.date          ?? l.created_at?.slice(0, 10) ?? "",
        status:       l.status        ?? "Open",
        // detail fields — pass through as-is
        shipment_type: l.shipment_type, transport_mode: l.transport_mode,
        origin_port: l.origin_port, target_date: l.target_date,
        business_service: l.business_service, destination_port: l.destination_port,
        expected_annual_revenue: l.expected_annual_revenue,
        expected_annual_volume_commodity: l.expected_annual_volume_commodity,
        nature_of_business: l.nature_of_business, company_turnover: l.company_turnover,
        remarks: l.remarks, address: l.address, state: l.state, city: l.city,
        zip: l.zip, contact_person: l.contact_person, email: l.email,
        telephone_no: l.telephone_no, mobile_no: l.mobile_no,
        designation: l.designation, department: l.department, notes: l.notes,
      }));
      setLeads(data);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to load leads. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // ── Flash toast after redirect ───────────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("success") === "1") {
      toast({ title: "Success", description: "Lead saved successfully!", variant: "success" });
      navigate("/sales/leads", { replace: true });
      // Re-fetch so the new lead appears immediately
      fetchLeads();
    }
  }, []);

  // ── Rating change ─────────────────────────────────────────────────────────────
  const [updatingRating, setUpdatingRating] = useState<number | null>(null);

  const handleRatingChange = async (id: number, rating: number) => {
    setUpdatingRating(id);
    try {
      await updateLeadRatingApi(id, rating);
      setLeads(prev => prev.map(l => l.id === id ? { ...l, rating } : l));
      toast({ title: 'Success', description: 'Lead rating updated successfully', variant: 'success' });
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Failed to update rating. Please try again.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setUpdatingRating(null);
    }
  };

  // ── Status change ────────────────────────────────────────────────────────────
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  const handleStatusChange = async (id: number, status: string) => {
    setUpdatingStatus(id);
    try {
      await updateLeadStatusApi(id, status);
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      toast({ title: 'Success', description: 'Lead status updated successfully', variant: 'success' });
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Failed to update status. Please try again.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setUpdatingStatus(null);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const openDeleteDialog = (lead: Lead) => { setLeadToDelete(lead); setDeleteDialogOpen(true); };

  const handleDelete = async () => {
    if (!leadToDelete) return;
    setDeleting(true);
    try {
      await deleteLeadApi(leadToDelete.id);
      setLeads(prev => prev.filter(l => l.id !== leadToDelete.id));
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
      toast({ title: 'Success', description: 'Lead deleted successfully!', variant: 'success' });
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Failed to delete lead. Please try again.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  // ── Derived stats ────────────────────────────────────────────────────────────
  const stats = [
    { label: "TOTAL LEADS",      value: leads.length,                                              icon: Building2, iconColor: "text-blue-500",   bg: "bg-blue-50"   },
    { label: "OPEN",             value: leads.filter(l => l.status === "Open").length,             icon: Clock,     iconColor: "text-blue-500",   bg: "bg-blue-50"   },
    { label: "ACTIVE",           value: leads.filter(l => l.status === "Active").length,           icon: MapPin,    iconColor: "text-teal-500",   bg: "bg-teal-50"   },
    { label: "CLOSED",           value: leads.filter(l => l.status === "Closed").length,           icon: Trash2,    iconColor: "text-red-500",    bg: "bg-red-50"    },
    { label: "FUTURE PROSPECT",  value: leads.filter(l => l.status === "Future Prospect").length,  icon: DollarSign,iconColor: "text-purple-500", bg: "bg-purple-50" },
  ];

  // ── Filters ──────────────────────────────────────────────────────────────────
  const filterLabels = ["All", "Open", "Follow-up", "Quote", "Active", "Closed", "Future Prospect"];
  const filteredLeads = leads.filter(l => {
    const matchFilter = activeFilter === "All" || l.status === activeFilter;
    const q = searchTerm.toLowerCase();
    const matchSearch = !q ||
      l.customer?.toLowerCase().includes(q) ||
      l.target?.toLowerCase().includes(q) ||
      l.lead_owner?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Leads</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track your leads</p>
        </div>
        <Button
          className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black"
          onClick={() => navigate("/sales/leads/new")}
        >
          <Plus className="w-4 h-4" /> New Lead
        </Button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-card rounded-xl p-5 material-elevation-1 hover:material-elevation-2 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className={`${s.bg} w-12 h-12 rounded-xl flex items-center justify-center`}>
                <s.icon className={`w-6 h-6 ${s.iconColor}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1 tracking-wide">{s.label}</p>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="material-card material-elevation-1 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            {filterLabels.map(label => (
              <button
                key={label}
                onClick={() => setActiveFilter(label)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === label
                    ? "bg-primary text-black material-elevation-2 scale-105"
                    : "bg-muted text-black hover:bg-muted/80"
                }`}
              >
                {label}
                <span className="ml-1.5 opacity-70">
                  {label === "All" ? leads.length : leads.filter(l => l.status === label).length}
                </span>
              </button>
            ))}
          </div>
          {/* Search + view toggle */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2.5 material-input text-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2 material-button">
              <ArrowUpDown className="w-4 h-4" /> Sort
            </Button>
            <div className="flex bg-muted rounded-xl p-1 material-elevation-1">
              {[{ mode: "grid" as const, Icon: Grid3x3 }, { mode: "list" as const, Icon: List }].map(({ mode, Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === mode ? "bg-primary text-white material-elevation-2" : "hover:bg-background"}`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Loading / Error ── */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading leads...</span>
        </div>
      )}
      {!loading && error && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
          <Button variant="outline" size="sm" onClick={fetchLeads}>Retry</Button>
        </div>
      )}

      {/* ── Table / Grid ── */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {viewMode === "grid" ? (
            filteredLeads.length === 0 ? (
              <div className="col-span-full text-center py-16 text-muted-foreground">No leads found.</div>
            ) : filteredLeads.map(lead => {
              const st = getStatus(lead.status);
              const leadId = `LEAD-${String(lead.id).padStart(3, '0')}`;
              return (
                <div
                  key={lead.id}
                  className={`material-card p-5 cursor-pointer hover:material-elevation-3 transition-all duration-300 ${lead._new ? "animate-fade-in" : ""}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold text-primary mb-1">{leadId}</p>
                      <h3 className="font-semibold text-foreground text-base">{lead.customer}</h3>
                      <p className="text-sm text-amber-500 font-medium mt-0.5">{lead.target}</p>
                      <StarRating rating={lead.rating} onRate={r => handleRatingChange(lead.id, r)} updating={updatingRating === lead.id} />
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${st.color} ${st.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {lead.status}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    {[
                      ["Source",  lead.lead_source, "text-amber-500"],
                      ["Owner",   lead.lead_owner,  ""],
                      ["Company", lead.company,     ""],
                      ["Team",    lead.sales_team,  ""],
                      ["Date",    lead.date,        "text-muted-foreground"],
                    ].map(([label, val, cls]) => val ? (
                      <div key={label as string} className="flex items-center justify-between">
                        <span className="text-muted-foreground">{label}:</span>
                        <span className={`font-medium ${cls}`}>{val}</span>
                      </div>
                    ) : null)}
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                    <button onClick={() => { setSelectedLead(lead); setViewDialogOpen(true); }} className="p-1.5 hover:bg-muted rounded-lg transition-colors"><Eye className="w-4 h-4 text-blue-500" /></button>
                    <button onClick={() => navigate(`/sales/leads/edit/${lead.id}`)} className="p-1.5 hover:bg-muted rounded-lg transition-colors"><Edit className="w-4 h-4 text-green-500" /></button>
                    <button onClick={() => openDeleteDialog(lead)} className="p-1.5 hover:bg-muted rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
                  </div>
                </div>
              );
            })
          ) : (
            /* ── List / Table view ── */
            <div className="col-span-full material-card material-elevation-1 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["DATE","LEAD ID","CUSTOMER","TARGET","LEAD SOURCE","LEAD OWNER","COMPANY","SALES TEAM","SHIPMENT TYPE","STATUS","ACTIONS"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground tracking-widest whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.length === 0 ? (
                      <tr><td colSpan={11} className="text-center py-16 text-muted-foreground">No leads found.</td></tr>
                    ) : filteredLeads.map((lead, idx) => {
                      const st = getStatus(lead.status);
                      const sh = getShipment(lead.shipment_type);
                      const leadId = `LEAD-${String(lead.id).padStart(3, '0')}`;
                      return (
                        <tr
                          key={lead.id}
                          className={`border-b border-border/60 hover:bg-muted/40 transition-colors duration-150 ${lead._new ? "animate-fade-in" : ""}`}
                          style={lead._new ? { animationDelay: `${idx * 40}ms` } : {}}
                        >
                          {/* DATE */}
                          <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">{lead.date}</td>

                          {/* LEAD ID */}
                          <td className="px-4 py-4">
                            <span className="text-sm text-foreground">{leadId}</span>
                          </td>

                          {/* CUSTOMER */}
                          <td className="px-4 py-4">
                            <span className="font-semibold text-foreground text-sm">{lead.customer}</span>
                          </td>

                          {/* TARGET */}
                          <td className="px-4 py-4">
                            <p className="text-sm text-foreground font-medium leading-tight">{lead.target}</p>
                            <StarRating rating={lead.rating} onRate={r => handleRatingChange(lead.id, r)} updating={updatingRating === lead.id} />
                          </td>

                          {/* LEAD SOURCE */}
                          <td className="px-4 py-4">
                            <span className="text-sm text-foreground">{lead.lead_source || '-'}</span>
                          </td>

                          {/* LEAD OWNER */}
                          <td className="px-4 py-4 text-sm text-foreground">{lead.lead_owner || '-'}</td>

                          {/* COMPANY */}
                          <td className="px-4 py-4 text-sm text-foreground">{lead.company || '-'}</td>

                          {/* SALES TEAM */}
                          <td className="px-4 py-4 text-sm text-foreground">
                            {lead.sales_team ? (employees[Number(lead.sales_team)] ?? lead.sales_team) : '-'}
                          </td>

                          {/* SHIPMENT TYPE */}
                          <td className="px-4 py-4">
                            {lead.shipment_type ? (
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${sh.color} ${sh.bg}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${sh.dot}`} />
                                {lead.shipment_type}
                              </span>
                            ) : <span className="text-sm text-muted-foreground">-</span>}
                          </td>

                          

                          {/* STATUS */}
                          <td className="px-4 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  disabled={updatingStatus === lead.id}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${st.color} ${st.bg} hover:opacity-80 transition-opacity disabled:opacity-60`}
                                >
                                  {updatingStatus === lead.id
                                    ? <Loader2 className="w-3 h-3 animate-spin" />
                                    : <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />}
                                  {lead.status}
                                  {updatingStatus !== lead.id && <ChevronDown className="w-3 h-3 ml-0.5" />}
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                {STATUS_OPTIONS.map(opt => {
                                  const s = getStatus(opt);
                                  return (
                                    <DropdownMenuItem key={opt} onClick={() => handleStatusChange(lead.id, opt)}>
                                      <span className={`inline-flex items-center gap-2 text-sm ${s.color}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                        {opt}
                                      </span>
                                    </DropdownMenuItem>
                                  );
                                })}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>

                          {/* ACTIONS */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => { setSelectedLead(lead); setViewDialogOpen(true); }}
                                className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors" title="View"
                              >
                                <Eye className="w-4 h-4 text-blue-500" />
                              </button>
                              <button className="p-1.5 hover:bg-green-50 rounded-lg transition-colors" title="Edit" onClick={() => navigate(`/sales/leads/edit/${lead.id}`)}>
                                <Edit className="w-4 h-4 text-green-500" />
                              </button>
                              <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Delete" onClick={() => openDeleteDialog(lead)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog open={deleteDialogOpen} onOpenChange={open => { if (!deleting) setDeleteDialogOpen(open); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" /> Delete Lead
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-foreground">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{leadToDelete?.customer}</span>?
            </p>
            <p className="text-xs text-muted-foreground mt-1">This action cannot be undone.</p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white gap-2"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── View Dialog ── */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lead Details — {selectedLead && `LEAD-${String(selectedLead.id).padStart(3, '0')}`} — {selectedLead?.customer}</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6 text-sm">
              {[
                { title: "Basic Information", fields: [
                  ["Lead ID",     `LEAD-${String(selectedLead.id).padStart(3, '0')}`],
                  ["Customer",    selectedLead.customer],
                  ["Date",        selectedLead.date],
                  ["Target",      selectedLead.target],
                  ["Lead Owner",  selectedLead.lead_owner],
                  ["Lead Source", selectedLead.lead_source],
                  ["Company",     selectedLead.company],
                  ["Sales Team",  selectedLead.sales_team],
                ]},
                { title: "Business Lead", fields: [
                  ["Shipment Type",       selectedLead.shipment_type],
                  ["Target Date",         selectedLead.target_date],
                  ["Transport Mode",      selectedLead.transport_mode],
                  ["Business Service",    selectedLead.business_service],
                  ["Origin Port",         selectedLead.origin_port],
                  ["Destination Port",    selectedLead.destination_port],
                  ["Expected Revenue",    selectedLead.expected_annual_revenue],
                  ["Expected Volume",     selectedLead.expected_annual_volume_commodity],
                ]},
                { title: "Revenue & Volume", fields: [
                  ["Nature of Business",  selectedLead.nature_of_business],
                  ["Company Turnover",    selectedLead.company_turnover],
                  ["Remarks",             selectedLead.remarks],
                ]},
                { title: "Contact Information", fields: [
                  ["Contact Person",  selectedLead.contact_person],
                  ["Email",           selectedLead.email],
                  ["Telephone",       selectedLead.telephone_no],
                  ["Mobile",          selectedLead.mobile_no],
                  ["Address",         selectedLead.address],
                  ["City",            selectedLead.city],
                  ["State",           selectedLead.state],
                  ["ZIP",             selectedLead.zip],
                  ["Designation",     selectedLead.designation],
                  ["Department",      selectedLead.department],
                  ["Notes",           selectedLead.notes],
                ]},
              ].map(section => (
                <div key={section.title}>
                  <h3 className="text-sm font-bold text-primary mb-3">{section.title}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {section.fields.filter(([, v]) => v).map(([label, value]) => (
                      <div key={label as string}>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
                        <p className="font-medium mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Status</p>
                {(() => { const st = getStatus(selectedLead.status); return (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${st.color} ${st.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{selectedLead.status}
                  </span>
                ); })()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leads;
