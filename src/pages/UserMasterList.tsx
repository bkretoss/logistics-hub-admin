import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getUserMastersApi, deleteUserMasterApi } from "@/services/api";

export interface User {
  id: number;
  username: string;
  branch_id: number;
  title: string;
  display_name: string;
  sex: string;
  designation_id: number;
  rights: string[];
  job_status: string[];
  voucher_status: string[];
  name: string;
  description: string;
  status: number;
  created_at: string;
}

const UserMasterList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers]         = useState<User[]>([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage]           = useState(1);
  const [pageSize, setPageSize]   = useState(10);
  const [deleteId, setDeleteId]   = useState<number | null>(null);
  const [viewUser, setViewUser]   = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUserMastersApi(page, pageSize, searchTerm);
      setUsers(res.data.data ?? []);
      setTotal(res.data.pagination?.total ?? 0);
    } catch {
      toast({ title: "Error", description: "Failed to load users", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchTerm]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteUserMasterApi(deleteId);
      toast({ title: "Deleted", description: "User deleted successfully", variant: "success" });
      setDeleteId(null);
      fetchUsers();
    } catch {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
    }
  };

  const totalPages   = Math.max(1, Math.ceil(total / pageSize));
  const activeCount  = users.filter(u => u.status === 1).length;
  const inactiveCount = users.filter(u => u.status !== 1).length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">User Master List</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage system users and their access rights</p>
        </div>
        <Button className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black"
          onClick={() => navigate("/admin/user-master/new")}>
          <Plus className="w-4 h-4" /> Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "TOTAL",    value: total,         color: "text-blue-500",  bg: "bg-blue-50"  },
          { label: "ACTIVE",   value: activeCount,   color: "text-green-500", bg: "bg-green-50" },
          { label: "INACTIVE", value: inactiveCount, color: "text-red-500",   bg: "bg-red-50"   },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-xl p-5 material-elevation-1 hover:material-elevation-2 transition-all duration-300">
            <div className={`${s.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="material-card material-elevation-1 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search by name, username..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-2.5 border border-input rounded-xl text-sm bg-background" />
          </div>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground border border-input rounded-xl px-3 py-1.5">
            Rows
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="bg-transparent font-semibold text-foreground outline-none cursor-pointer">
              {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="material-card material-elevation-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                {["USERNAME", "DISPLAY NAME", "TITLE", "SEX", "RIGHTS", "JOB STATUS", "STATUS", "ACTIONS"].map((h, i) => (
                  <th key={h} className={`p-4 text-xs font-semibold text-muted-foreground tracking-wide whitespace-nowrap ${i === 7 ? "text-right" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground text-sm">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground text-sm">No users found.</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground whitespace-nowrap">{u.username}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{u.display_name}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{u.title}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{u.sex}</td>
                  <td className="p-4 text-sm text-muted-foreground max-w-[160px] truncate" title={u.rights?.join(", ")}>
                    {u.rights?.join(", ") || "—"}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground max-w-[160px] truncate" title={u.job_status?.join(", ")}>
                    {u.job_status?.join(", ") || "—"}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.status === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {u.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="View" onClick={() => setViewUser(u)}>
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Edit" onClick={() => navigate(`/admin/user-master/edit/${u.id}`)}>
                        <Pencil className="w-4 h-4 text-green-500" />
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Delete" onClick={() => setDeleteId(u.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total} records
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${n === page ? "bg-primary text-black" : "hover:bg-muted text-muted-foreground"}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewUser(null)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">View User</h3>
              <button onClick={() => setViewUser(null)} className="p-2 hover:bg-muted rounded-lg">✕</button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-3">
              {[
                ["Username",     viewUser.username],
                ["Display Name", viewUser.display_name],
                ["Title",        viewUser.title],
                ["Sex",          viewUser.sex],
                ["Description",  viewUser.description || "—"],
                ["Rights",       viewUser.rights?.join(", ") || "—"],
                ["Job Status",   viewUser.job_status?.join(", ") || "—"],
                ["Voucher Status", viewUser.voucher_status?.join(", ") || "—"],
                ["Status",       viewUser.status === 1 ? "Active" : "Inactive"],
                ["Created At",   viewUser.created_at],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3 py-2 border-b border-border/50">
                  <span className="text-sm font-semibold text-muted-foreground w-40 shrink-0">{label}</span>
                  <span className="text-sm text-foreground flex-1">{value}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
              <Button variant="outline" onClick={() => { setViewUser(null); navigate(`/admin/user-master/edit/${viewUser.id}`); }}>
                <Pencil className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button variant="outline" onClick={() => setViewUser(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-sm mx-4">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Delete User</h3>
              <button onClick={() => setDeleteId(null)} className="p-2 hover:bg-muted rounded-lg">✕</button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this user? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserMasterList;
