import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  Plus, Search, Grid3x3, List, ArrowUpDown,
  DollarSign, Calendar, Target, TrendingUp,
  ChevronDown, Eye, Edit, Trash2, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { getOpportunitiesApi, deleteOpportunityApi, updateOpportunityStatusApi } from "@/services/api";

interface Opportunity {
  id: number;
  name: string;
  account: string;
  status: string;
  amount: string;
  closeDate: string;
  probability: string;
  owner: string;
  // resolved display fields
  displayDate: string;
  displayCustomer: string;
  displaySalesAgent: string;
  displayTransportMode: string;
  displayOrigin: string;
  displayDestination: string;
  displayEstShipDate: string;
  // detail fields
  lead_ref?: string;
  date?: string;
  opportunitySource?: string;
  location?: string;
  opportunityType?: string;
  lead?: string;
  type?: string;
  salesTeam?: string;
  salesAgent?: string;
  company?: string;
  pricingTeam?: string;
  shippingProviders?: string;
  transportMode?: string;
  shipmentType?: string;
  cargoType?: string;
  incoterms?: string;
  commodity?: string;
  serviceMode?: string;
  estimatedShipmentDate?: string;
  cargoStatus?: string;
  originCountry?: string;
  destinationCountry?: string;
  cargoDescription?: string;
  customer?: string;
  contactPerson?: string;
  customerType?: string;
  designation?: string;
  prospect?: string;
  department?: string;
  address?: string;
  email?: string;
  telephoneNo?: string;
  mobileNo?: string;
  vendorAgent?: string;
  currency?: string;
  rateTotal?: string;
}

const STATUS_MAP: Record<string, { color: string; bg: string; dot: string }> = {
  Open:     { color: "text-blue-600",   bg: "bg-blue-50",   dot: "bg-blue-500"   },
  Active:   { color: "text-teal-600",   bg: "bg-teal-50",   dot: "bg-teal-500"   },
  Created:  { color: "text-gray-600",   bg: "bg-gray-100",  dot: "bg-gray-400"   },
  Closed:   { color: "text-red-500",    bg: "bg-red-50",    dot: "bg-red-400"    },
  "On Hold":{ color: "text-orange-500", bg: "bg-orange-50", dot: "bg-orange-400" },
};
const getStatus = (s: string) => STATUS_MAP[s] ?? STATUS_MAP["Created"];

const STATUS_OPTIONS = ["Open", "Active", "Created", "Closed", "On Hold"];

const Opportunity = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [opportunities,     setOpportunities]     = useState<Opportunity[]>([]);
  const [loading,           setLoading]           = useState(true);
  const [error,             setError]             = useState("");
  const [viewMode,          setViewMode]          = useState<"grid" | "list">("list");
  const [searchTerm,        setSearchTerm]        = useState("");
  const [activeFilter,      setActiveFilter]      = useState("All");
  const [viewDialogOpen,    setViewDialogOpen]    = useState(false);
  const [selectedOpp,       setSelectedOpp]       = useState<Opportunity | null>(null);
  const [deleteDialogOpen,  setDeleteDialogOpen]  = useState(false);
  const [oppToDelete,       setOppToDelete]       = useState<Opportunity | null>(null);
  const [deleting,          setDeleting]          = useState(false);
  const [updatingStatus,    setUpdatingStatus]    = useState<number | null>(null);

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getOpportunitiesApi();
      const raw = res.data;
      const list: any[] =
        Array.isArray(raw)             ? raw           :
        Array.isArray(raw?.data)       ? raw.data      :
        Array.isArray(raw?.data?.data) ? raw.data.data :
        [];
      const data: Opportunity[] = list.map((o: any) => ({
        id:          o.id,
        name:        o.name        ?? o.opportunity_name ?? "",
        account:     o.account     ?? o.customer         ?? "",
        status:      o.status      ?? "Created",
        amount:      o.amount      ?? (o.expected_revenue ? `$${o.expected_revenue}` : "-"),
        closeDate:   o.close_date  ?? o.closing_date     ?? o.closeDate ?? "",
        probability: o.probability ? `${o.probability}%` : "-",
        owner:       o.owner       ?? o.salesperson      ?? o.sales_agent ?? "",
        // resolved display fields — handle both flat and nested API shapes
        displayDate:          o.date ?? "",
        displayCustomer:      o.party_details?.customer      ?? o.customer      ?? "",
        displaySalesAgent:    o.sales_agent                  ?? o.owner         ?? "",
        displayTransportMode: o.shipment_details?.transport_mode  ?? o.transport_mode  ?? "",
        displayOrigin:        o.shipment_details?.origin_country  ?? o.origin_country  ?? "",
        displayDestination:   o.shipment_details?.destination_country ?? o.destination_country ?? "",
        displayEstShipDate:   o.shipment_details?.estimated_shipment_date ?? o.estimated_shipment_date ?? "",
        date:              o.date,
        opportunitySource: o.opportunity_source,
        location:          o.location,
        opportunityType:   o.opportunity_type,
        lead_ref:          o.lead_ref,
        lead:              o.lead,
        type:              o.type,
        salesTeam:         o.sales_team,
        salesAgent:        o.sales_agent,
        company:           o.company,
        pricingTeam:       o.pricing_team,
        shippingProviders: o.shipping_providers,
        transportMode:     o.transport_mode,
        shipmentType:      o.shipment_type,
        cargoType:         o.cargo_type,
        incoterms:         o.incoterms,
        commodity:         o.commodity,
        serviceMode:       o.service_mode,
        estimatedShipmentDate: o.estimated_shipment_date,
        cargoStatus:       o.cargo_status,
        originCountry:     o.origin_country,
        destinationCountry:o.destination_country,
        cargoDescription:  o.cargo_description,
        customer:          o.customer,
        contactPerson:     o.contact_person,
        customerType:      o.customer_type,
        designation:       o.designation,
        prospect:          o.prospect,
        department:        o.department,
        address:           o.address,
        email:             o.email,
        telephoneNo:       o.telephone_no,
        mobileNo:          o.mobile_no,
        vendorAgent:       o.vendor_agent,
        currency:          o.currency,
        rateTotal:         o.rate_total,
      }));
      setOpportunities(data);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to load opportunities. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOpportunities(); }, [fetchOpportunities]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("success") === "1") {
      toast({ title: "Success", description: "Rate request saved successfully!", variant: "success" });
      navigate("/sales/opportunity", { replace: true });
      fetchOpportunities();
    }
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    setUpdatingStatus(id);
    try {
      await updateOpportunityStatusApi(id, status);
      setOpportunities(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      toast({ title: "Success", description: "Status updated successfully", variant: "success" });
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message ?? "Failed to update status.", variant: "destructive" });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const openDeleteDialog = (opp: Opportunity) => { setOppToDelete(opp); setDeleteDialogOpen(true); };

  const handleDelete = async () => {
    if (!oppToDelete) return;
    setDeleting(true);
    try {
      await deleteOpportunityApi(oppToDelete.id);
      setOpportunities(prev => prev.filter(o => o.id !== oppToDelete.id));
      setDeleteDialogOpen(false);
      setOppToDelete(null);
      toast({ title: "Success", description: "Rate request deleted successfully!", variant: "success" });
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message ?? "Failed to delete.", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  const stats = [
    { label: "TOTAL RATE REQUESTS", value: opportunities.length,                                        icon: Target,    iconColor: "text-blue-500",   bg: "bg-blue-50"   },
    { label: "OPEN",                value: opportunities.filter(o => o.status === "Open").length,       icon: DollarSign,iconColor: "text-green-500",  bg: "bg-green-50"  },
    { label: "ACTIVE",              value: opportunities.filter(o => o.status === "Active").length,     icon: TrendingUp,iconColor: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "CLOSING THIS MONTH",  value: opportunities.filter(o => o.status === "Closed").length,     icon: Calendar,  iconColor: "text-cyan-500",   bg: "bg-cyan-50"   },
  ];

  const filterLabels = ["All", "Open", "Active", "Created", "Closed", "On Hold"];

  const filtered = opportunities.filter(o => {
    const matchFilter = activeFilter === "All" || o.status === activeFilter;
    const q = searchTerm.toLowerCase();
    const matchSearch = !q ||
      o.displayCustomer.toLowerCase().includes(q) ||
      o.displaySalesAgent.toLowerCase().includes(q) ||
      o.displayTransportMode.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Rate Requests</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track your rate requests</p>
        </div>
        <Button
          className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black"
          onClick={() => navigate("/sales/opportunity/new")}
        >
          <Plus className="w-4 h-4" /> New Rate Request
        </Button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  {label === "All" ? opportunities.length : opportunities.filter(o => o.status === label).length}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or account..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2.5 material-input text-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2 material-button">
              <ArrowUpDown className="w-4 h-4" /> Sort
            </Button>
            <div className="flex bg-muted rounded-xl p-1 material-elevation-1">
              {([{ mode: "grid" as const, Icon: Grid3x3 }, { mode: "list" as const, Icon: List }]).map(({ mode, Icon }) => (
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
          <span className="ml-3 text-muted-foreground">Loading rate requests...</span>
        </div>
      )}
      {!loading && error && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
          <Button variant="outline" size="sm" onClick={fetchOpportunities}>Retry</Button>
        </div>
      )}

      {/* ── Table / Grid ── */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {viewMode === "grid" ? (
            filtered.length === 0 ? (
              <div className="col-span-full text-center py-16 text-muted-foreground">No rate requests found.</div>
            ) : filtered.map(opp => {
              const st = getStatus(opp.status);
              return (
                <div key={opp.id} className="material-card p-5 cursor-pointer hover:material-elevation-3 transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground text-base">{opp.name}</h3>
                      <p className="text-sm text-amber-500 font-medium mt-0.5">{opp.account}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${st.color} ${st.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {opp.status}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    {[
                      ["Amount",      opp.amount,      "font-semibold"],
                      ["Close Date",  opp.closeDate,   "text-muted-foreground"],
                      ["Probability", opp.probability, ""],
                      ["Owner",       opp.owner,       ""],
                    ].map(([label, val, cls]) => val && val !== "-" ? (
                      <div key={label as string} className="flex items-center justify-between">
                        <span className="text-muted-foreground">{label}:</span>
                        <span className={`font-medium ${cls}`}>{val}</span>
                      </div>
                    ) : null)}
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                    <button onClick={() => { setSelectedOpp(opp); setViewDialogOpen(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4 text-blue-500" /></button>
                    <button onClick={() => navigate(`/sales/opportunity/edit/${opp.id}`)} className="p-1.5 hover:bg-green-50 rounded-lg transition-colors"><Edit className="w-4 h-4 text-green-500" /></button>
                    <button onClick={() => openDeleteDialog(opp)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
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
                      {["DATE", "LEAD REFERENCE", "LOCATION", "COMPANY", "SALES AGENT", "STATUS", "ACTIONS"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground tracking-widest whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-16 text-muted-foreground">No rate requests found.</td></tr>
                    ) : filtered.map(opp => {
                      const st = getStatus(opp.status);
                      return (
                        <tr key={opp.id} className="border-b border-border/60 hover:bg-muted/40 transition-colors duration-150">
                          {/* DATE */}
                          <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">{opp.displayDate || "-"}</td>

                          {/* LEAD REFERENCE */}
                          <td className="px-4 py-4 text-sm text-foreground">{opp.lead_ref || "-"}</td>

                          {/* LOCATION */}
                          <td className="px-4 py-4 text-sm text-muted-foreground">{opp.location || "-"}</td>

                          {/* COMPANY */}
                          <td className="px-4 py-4 text-sm text-muted-foreground">{opp.company || "-"}</td>

                          {/* SALES AGENT */}
                          <td className="px-4 py-4">
                            <span className="text-sm text-amber-500 font-medium">{opp.displaySalesAgent || "-"}</span>
                          </td>

                          {/* STATUS */}
                          <td className="px-4 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  disabled={updatingStatus === opp.id}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${st.color} ${st.bg} hover:opacity-80 transition-opacity disabled:opacity-60`}
                                >
                                  {updatingStatus === opp.id
                                    ? <Loader2 className="w-3 h-3 animate-spin" />
                                    : <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />}
                                  {opp.status}
                                  {updatingStatus !== opp.id && <ChevronDown className="w-3 h-3 ml-0.5" />}
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                {STATUS_OPTIONS.map(opt => {
                                  const s = getStatus(opt);
                                  return (
                                    <DropdownMenuItem key={opt} onClick={() => handleStatusChange(opp.id, opt)}>
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
                                onClick={() => { setSelectedOpp(opp); setViewDialogOpen(true); }}
                                className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors" title="View"
                              >
                                <Eye className="w-4 h-4 text-blue-500" />
                              </button>
                              <button
                                onClick={() => navigate(`/sales/opportunity/edit/${opp.id}`)}
                                className="p-1.5 hover:bg-green-50 rounded-lg transition-colors" title="Edit"
                              >
                                <Edit className="w-4 h-4 text-green-500" />
                              </button>
                              <button
                                onClick={() => openDeleteDialog(opp)}
                                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Delete"
                              >
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
              <Trash2 className="w-5 h-5" /> Delete Rate Request
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{oppToDelete?.name}</span>?
            </p>
            <p className="text-xs text-muted-foreground mt-1">This action cannot be undone.</p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>Cancel</Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white gap-2" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── View Dialog ── */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rate Request Details — {selectedOpp?.name}</DialogTitle>
          </DialogHeader>
          {selectedOpp && (
            <div className="space-y-6 text-sm">
              {[
                { title: "Summary", fields: [
                  ["Name",        selectedOpp.name],
                  ["Account",     selectedOpp.account],
                  ["Close Date",  selectedOpp.closeDate],
                  ["Amount",      selectedOpp.amount],
                  ["Probability", selectedOpp.probability],
                  ["Owner",       selectedOpp.owner],
                ]},
                { title: "Basic Information", fields: [
                  ["Date",               selectedOpp.date],
                  ["Source",             selectedOpp.opportunitySource],
                  ["Location",           selectedOpp.location],
                  ["Type",               selectedOpp.opportunityType],
                  ["Lead",               selectedOpp.lead],
                  ["Sales Team",         selectedOpp.salesTeam],
                  ["Sales Agent",        selectedOpp.salesAgent],
                  ["Company",            selectedOpp.company],
                  ["Pricing Team",       selectedOpp.pricingTeam],
                  ["Shipping Providers", selectedOpp.shippingProviders],
                ]},
                { title: "Shipment Details", fields: [
                  ["Transport Mode",          selectedOpp.transportMode],
                  ["Shipment Type",           selectedOpp.shipmentType],
                  ["Cargo Type",              selectedOpp.cargoType],
                  ["Incoterms",               selectedOpp.incoterms],
                  ["Commodity",               selectedOpp.commodity],
                  ["Service Mode",            selectedOpp.serviceMode],
                  ["Est. Shipment Date",      selectedOpp.estimatedShipmentDate],
                  ["Cargo Status",            selectedOpp.cargoStatus],
                  ["Origin Country",          selectedOpp.originCountry],
                  ["Destination Country",     selectedOpp.destinationCountry],
                  ["Cargo Description",       selectedOpp.cargoDescription],
                ]},
                { title: "Party Details", fields: [
                  ["Customer",      selectedOpp.customer],
                  ["Contact Person",selectedOpp.contactPerson],
                  ["Customer Type", selectedOpp.customerType],
                  ["Designation",   selectedOpp.designation],
                  ["Prospect",      selectedOpp.prospect],
                  ["Department",    selectedOpp.department],
                  ["Address",       selectedOpp.address],
                  ["Email",         selectedOpp.email],
                  ["Telephone",     selectedOpp.telephoneNo],
                  ["Mobile",        selectedOpp.mobileNo],
                ]},
                { title: "Vendor Rate", fields: [
                  ["Agent",      selectedOpp.vendorAgent],
                  ["Currency",   selectedOpp.currency],
                  ["Rate Total", selectedOpp.rateTotal ? `$${selectedOpp.rateTotal}` : undefined],
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
                {(() => { const st = getStatus(selectedOpp.status); return (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${st.color} ${st.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{selectedOpp.status}
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

export default Opportunity;
