import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Eye, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import CustomerViewModal from "./CustomerViewModal";
import { getMasterCompaniesApi, deleteMasterCompanyApi, updateMasterCompanyStatusApi, API_BASE } from "@/services/api";

export interface Customer {
  id: number;
  name: string;
  actualName: string;
  logo: string;
  scacCode: string;
  iecCode: string;
  categories: string;
  userName: string;
  interestCalculation: string;
  iataCode: string;
  position: string;
  website: string;
  password: string;
  notes: string;
  bond: string;
  expireBondDate: string;
  status: "Active" | "Inactive";
}

const mapApiToCustomer = (r: any): Customer => ({
  id: r.id,
  name: r.name ?? "",
  actualName: r.actual_name ?? "",
  logo: r.logo ?? "",
  scacCode: r.scac_code ?? "",
  iecCode: r.iec_code ?? "",
  categories: r.categories ?? "",
  userName: r.username ?? "",
  interestCalculation: r.interest_calculation ?? "No",
  iataCode: r.iata_code ?? "",
  position: r.position ?? "",
  website: r.website ?? "",
  password: r.password ?? "",
  notes: r.notes ?? "",
  bond: r.bond ?? "",
  expireBondDate: r.expire_bond_date ?? "",
  status: r.status === 1 || r.status === "1" || r.status === "Active" ? "Active" : "Inactive",
});

const CustomerMasterList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getMasterCompaniesApi();
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setCustomers(raw.map(mapApiToCustomer));
    } catch {
      toast({ title: "Error", description: "Failed to load companies.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = customers.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.actualName.toLowerCase().includes(q) ||
      c.categories.toLowerCase().includes(q) ||
      c.scacCode.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleStatusChange = async (c: Customer, newStatus: Customer["status"]) => {
    if (newStatus === c.status) { setOpenDropdown(null); return; }
    setOpenDropdown(null);
    setUpdatingId(c.id);
    const previous = [...customers];
    setCustomers(prev => prev.map(x => x.id === c.id ? { ...x, status: newStatus } : x));
    try {
      await updateMasterCompanyStatusApi(c.id, newStatus === "Active" ? 1 : 0);
      toast({ title: "Status Updated", description: `${c.name} is now ${newStatus}.`, variant: "success" });
    } catch {
      setCustomers(previous);
      toast({ title: "Update Failed", description: "Failed to update status.", variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  const StatusDropdown = ({ c }: { c: Customer }) => {
    const isActive = c.status === "Active";
    const isLoading = updatingId === c.id;
    const isOpen = openDropdown === c.id;
    const dotColor = isActive ? "bg-green-500" : "bg-orange-400";
    const textColor = isActive ? "text-green-700" : "text-orange-600";
    const bgColor = isActive ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200";
    return (
      <div className="relative inline-block" ref={isOpen ? dropdownRef : undefined}>
        <button
          disabled={isLoading}
          onClick={() => setOpenDropdown(isOpen ? null : c.id)}
          className={`inline-flex items-center gap-1.5 pl-2.5 pr-2 py-1 rounded-full border text-xs font-semibold transition-all duration-150 cursor-pointer select-none ${bgColor} ${textColor} hover:shadow-sm active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          )}
          {c.status}
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
        {isOpen && (
          <div className="absolute left-0 top-full mt-1.5 z-50 min-w-[130px] bg-white border border-border rounded-xl shadow-lg overflow-hidden">
            {(["Active", "Inactive"] as Customer["status"][]).map((opt) => {
              const optActive = opt === "Active";
              return (
                <button
                  key={opt}
                  onClick={() => handleStatusChange(c, opt)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-muted/60 ${opt === c.status ? "bg-muted/40" : ""} ${optActive ? "text-green-700" : "text-orange-600"}`}
                >
                  <span className={`w-2 h-2 rounded-full ${optActive ? "bg-green-500" : "bg-orange-400"}`} />
                  {opt}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteMasterCompanyApi(deleteId);
      toast({ title: "Deleted", description: "Company record deleted.", variant: "success" });
      setDeleteId(null);
      load();
    } catch {
      toast({ title: "Error", description: "Failed to delete company.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Company Master List</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage company records and information</p>
        </div>
        <Button
          className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black"
          onClick={() => navigate("/setting/company-master/new")}
        >
          <Plus className="w-4 h-4" /> Add Company
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "TOTAL", value: customers.length, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "ACTIVE", value: customers.filter((c) => c.status === "Active").length, color: "text-green-500", bg: "bg-green-50" },
          { label: "INACTIVE", value: customers.filter((c) => c.status === "Inactive").length, color: "text-red-500", bg: "bg-red-50" },
          { label: "CATEGORIES", value: new Set(customers.map((c) => c.categories)).size, color: "text-purple-500", bg: "bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl p-5 material-elevation-1 hover:material-elevation-2 transition-all duration-300">
            <div className={`${s.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="material-card material-elevation-1 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, category, SCAC code..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-2.5 border border-input rounded-xl text-sm bg-background"
            />
          </div>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground border border-input rounded-xl px-3 py-1.5">
            Rows
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="bg-transparent font-semibold text-foreground outline-none cursor-pointer"
            >
              {[5, 10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </span>
        </div>
      </div>

      <div className="material-card material-elevation-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                {["LOGO", "NAME", "ACTUAL NAME", "CATEGORIES", "SCAC CODE", "POSITION", "STATUS", "ACTIONS"].map((h, i) => (
                  <th key={h} className={`p-4 text-xs font-semibold text-muted-foreground tracking-wide whitespace-nowrap ${i === 7 ? "text-right" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground text-sm">Loading...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground text-sm">No companies found.</td></tr>
              ) : paginated.map((c) => (
                <tr key={c.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    {c.logo
                      ? <img src={`${c.logo}`} alt={c.name} className="w-10 h-10 rounded-lg object-cover border border-border" onError={(e) => { (e.currentTarget as HTMLImageElement).src = ''; (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                      : <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">{c.name.charAt(0).toUpperCase()}</div>
                    }
                  </td>
                  <td className="p-4 text-sm font-medium text-foreground whitespace-nowrap">{c.name}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{c.actualName}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{c.categories}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{c.scacCode || "—"}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{c.position}</td>
                  <td className="p-4"><StatusDropdown c={c} /></td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="View" onClick={() => setViewCustomer(c)}>
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Edit" onClick={() => navigate(`/setting/company-master/edit/${c.id}`)}>
                        <Pencil className="w-4 h-4 text-green-500" />
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Delete" onClick={() => setDeleteId(c.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} records
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${n === page ? "bg-primary text-black" : "hover:bg-muted text-muted-foreground"}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewCustomer && (
        <CustomerViewModal
          customer={viewCustomer}
          onClose={() => setViewCustomer(null)}
          onEdit={() => { setViewCustomer(null); navigate(`/setting/company-master/edit/${viewCustomer.id}`); }}
        />
      )}

      <Dialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this company? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerMasterList;
