import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Eye, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import UserViewModal from "./UserViewModal";

export interface User {
  id: number;
  userName: string;
  password: string;
  branch: string;
  title: string;
  displayName: string;
  sex: string;
  designation: string;
  // Rights
  rightAdmin: boolean;
  rightMarketing: boolean;
  rightAccounts: boolean;
  rightQuotation: boolean;
  rightHR: boolean;
  rightManagement: boolean;
  rightDocumentation: boolean;
  rightSettings: boolean;
  // Job Status
  jobCreated: boolean;
  jobProcess: boolean;
  jobProcessCompleted: boolean;
  jobClosed: boolean;
  jobCancelled: boolean;
  jobReOpened: boolean;
  // Voucher Status
  voucherCreated: boolean;
  voucherApproved: boolean;
  voucherConfirmed: boolean;
  voucherCancelled: boolean;
  voucherDispute: boolean;
  status: "Active" | "Inactive";
}

const INITIAL_USERS: User[] = [
  {
    id: 1,
    userName: "John Admin",
    password: "hashed",
    branch: "Head Office",
    title: "Mr",
    displayName: "John A.",
    sex: "Male",
    designation: "System Administrator",
    rightAdmin: true,
    rightMarketing: true,
    rightAccounts: true,
    rightQuotation: true,
    rightHR: true,
    rightManagement: true,
    rightDocumentation: true,
    rightSettings: true,
    jobCreated: true,
    jobProcess: true,
    jobProcessCompleted: true,
    jobClosed: true,
    jobCancelled: true,
    jobReOpened: true,
    voucherCreated: true,
    voucherApproved: true,
    voucherConfirmed: true,
    voucherCancelled: true,
    voucherDispute: true,
    status: "Active",
  },
  {
    id: 2,
    userName: "Sara Manager",
    password: "hashed",
    branch: "Mumbai Branch",
    title: "Ms",
    displayName: "Sara M.",
    sex: "Female",
    designation: "Operations Manager",
    rightAdmin: false,
    rightMarketing: true,
    rightAccounts: true,
    rightQuotation: true,
    rightHR: false,
    rightManagement: true,
    rightDocumentation: true,
    rightSettings: false,
    jobCreated: true,
    jobProcess: true,
    jobProcessCompleted: true,
    jobClosed: false,
    jobCancelled: false,
    jobReOpened: false,
    voucherCreated: true,
    voucherApproved: true,
    voucherConfirmed: false,
    voucherCancelled: false,
    voucherDispute: false,
    status: "Active",
  },
  {
    id: 3,
    userName: "Tom Ops",
    password: "hashed",
    branch: "Delhi Branch",
    title: "Mr",
    displayName: "Tom O.",
    sex: "Male",
    designation: "Operator",
    rightAdmin: false,
    rightMarketing: false,
    rightAccounts: false,
    rightQuotation: true,
    rightHR: false,
    rightManagement: false,
    rightDocumentation: true,
    rightSettings: false,
    jobCreated: true,
    jobProcess: true,
    jobProcessCompleted: false,
    jobClosed: false,
    jobCancelled: false,
    jobReOpened: false,
    voucherCreated: true,
    voucherApproved: false,
    voucherConfirmed: false,
    voucherCancelled: false,
    voucherDispute: false,
    status: "Inactive",
  },
];

export const userStore = {
  data: [...INITIAL_USERS] as User[],
  listeners: new Set<() => void>(),
  set(next: User[]) {
    this.data = next;
    this.listeners.forEach((fn) => fn());
  },
};

/**
 * ─── REAL API CALL ────────────────────────────────────────────────────────────
 * Replace fakeUpdateStatusApi with a real fetch() when your backend is ready.
 *
 * Example PHP endpoint: POST /api/user/update-status.php
 * Request body : { id: number, status: 'Active' | 'Inactive' }
 * Response     : { success: boolean, message: string }
 *
 * async function updateStatusApi(id: number, status: User['status']) {
 *   const res  = await fetch('/api/user/update-status.php', {
 *     method : 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body   : JSON.stringify({ id, status }),
 *   });
 *   const json = await res.json();
 *   if (!res.ok || !json.success) throw new Error(json.message || 'Update failed');
 * }
 * ──────────────────────────────────────────────────────────────────────────────
 */
const fakeUpdateStatusApi = (_id: number, _status: User["status"]): Promise<void> =>
  new Promise((resolve, reject) =>
    setTimeout(() => (Math.random() > 0.05 ? resolve() : reject(new Error("Network error — please try again."))), 500),
  );

const UserMasterList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(() => userStore.data);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const refresh = () => setUsers([...userStore.data]);
    userStore.listeners.add(refresh);
    refresh();
    return () => {
      userStore.listeners.delete(refresh);
    };
  }, []);

  const filtered = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      !q ||
      u.userName.toLowerCase().includes(q) ||
      u.displayName.toLowerCase().includes(q) ||
      u.branch.toLowerCase().includes(q) ||
      u.designation.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleStatusChange = async (u: User, newStatus: User["status"]) => {
    if (newStatus === u.status) {
      setOpenDropdown(null);
      return;
    }
    setOpenDropdown(null);
    setUpdatingId(u.id);

    // Optimistic update
    const previous = [...userStore.data];
    userStore.set(userStore.data.map((x) => (x.id === u.id ? { ...x, status: newStatus } : x)));

    try {
      // ── API call ──────────────────────────────────────────────────────────
      // Replace the fetch below with your real endpoint when the backend is ready.
      // Expected POST body : { id: number, status: 'Active' | 'Inactive' }
      // Expected response  : { success: boolean, message: string }
      // ─────────────────────────────────────────────────────────────────────
      await fakeUpdateStatusApi(u.id, newStatus); // ← swap with real fetch()
      toast({ title: "Status Updated", description: `${u.userName} is now ${newStatus}.`, variant: "success" });
    } catch (err: unknown) {
      // Revert on failure
      userStore.set(previous);
      const msg = err instanceof Error ? err.message : "Failed to update status.";
      toast({ title: "Update Failed", description: msg, variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      userStore.set(userStore.data.filter((u) => u.id !== deleteId));
      setDeleteId(null);
    }
  };

  // ── Status dropdown component (inline) ──────────────────────────────────
  const StatusDropdown = ({ u }: { u: User }) => {
    const isActive = u.status === "Active";
    const isLoading = updatingId === u.id;
    const isOpen = openDropdown === u.id;

    const dotColor = isActive ? "bg-green-500" : "bg-orange-400";
    const textColor = isActive ? "text-green-700" : "text-orange-600";
    const bgColor = isActive ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200";

    return (
      <div className="relative inline-block" ref={isOpen ? dropdownRef : undefined}>
        {/* Pill trigger */}
        <button
          disabled={isLoading}
          onClick={() => setOpenDropdown(isOpen ? null : u.id)}
          className={`inline-flex items-center gap-1.5 pl-2.5 pr-2 py-1 rounded-full border text-xs font-semibold
            transition-all duration-150 cursor-pointer select-none
            ${bgColor} ${textColor}
            hover:shadow-sm active:scale-95
            disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          )}
          {u.status}
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown panel */}
        {isOpen && (
          <div className="absolute left-0 top-full mt-1.5 z-50 min-w-[130px] bg-white border border-border rounded-xl shadow-lg overflow-hidden">
            {(["Active", "Inactive"] as User["status"][]).map((opt) => {
              const optActive = opt === "Active";
              const optDot = optActive ? "bg-green-500" : "bg-orange-400";
              const optText = optActive ? "text-green-700" : "text-orange-600";
              const isCurrent = opt === u.status;
              return (
                <button
                  key={opt}
                  onClick={() => handleStatusChange(u, opt)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold
                    transition-colors hover:bg-muted/60
                    ${isCurrent ? "bg-muted/40" : ""} ${optText}`}
                >
                  <span className={`w-2 h-2 rounded-full ${optDot}`} />
                  {opt}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const rightsLabel = (u: User) =>
    [
      u.rightAdmin && "Admin",
      u.rightMarketing && "Marketing",
      u.rightAccounts && "Accounts",
      u.rightQuotation && "Quotation",
      u.rightHR && "HR",
      u.rightManagement && "Management",
      u.rightDocumentation && "Documentation",
      u.rightSettings && "Settings",
    ]
      .filter(Boolean)
      .join(", ") || "—";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">User Master List</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage system users and their access rights</p>
        </div>
        <Button
          className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black"
          onClick={() => navigate("/admin/user-master/new")}
        >
          <Plus className="w-4 h-4" /> Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "TOTAL", value: users.length, color: "text-blue-500", bg: "bg-blue-50" },
          {
            label: "ACTIVE",
            value: users.filter((u) => u.status === "Active").length,
            color: "text-green-500",
            bg: "bg-green-50",
          },
          {
            label: "INACTIVE",
            value: users.filter((u) => u.status === "Inactive").length,
            color: "text-red-500",
            bg: "bg-red-50",
          },
          {
            label: "DESIGNATIONS",
            value: new Set(users.map((u) => u.designation)).size,
            color: "text-purple-500",
            bg: "bg-purple-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-card rounded-xl p-5 material-elevation-1 hover:material-elevation-2 transition-all duration-300"
          >
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
            <input
              type="text"
              placeholder="Search by name, display name, branch, designation..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-11 pr-4 py-2.5 border border-input rounded-xl text-sm bg-background"
            />
          </div>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground border border-input rounded-xl px-3 py-1.5">
            Rows
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="bg-transparent font-semibold text-foreground outline-none cursor-pointer"
            >
              {[5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
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
                {[
                  "USER NAME",
                  "DISPLAY NAME",
                  "BRANCH",
                  "TITLE",
                  "SEX",
                  "DESIGNATION",
                  "RIGHTS",
                  "STATUS",
                  "ACTIONS",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`p-4 text-xs font-semibold text-muted-foreground tracking-wide whitespace-nowrap ${i === 8 ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((u) => (
                <tr key={u.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground whitespace-nowrap">{u.userName}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{u.displayName}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{u.branch}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{u.title}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{u.sex}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{u.designation}</td>
                  <td className="p-4 text-sm text-muted-foreground max-w-[180px] truncate" title={rightsLabel(u)}>
                    {rightsLabel(u)}
                  </td>
                  <td className="p-4">
                    <StatusDropdown u={u} />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                        title="View"
                        onClick={() => setViewUser(u)}
                      >
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                        title="Edit"
                        onClick={() => navigate(`/admin/user-master/edit/${u.id}`)}
                      >
                        <Pencil className="w-4 h-4 text-green-500" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                        title="Delete"
                        onClick={() => setDeleteId(u.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-muted-foreground text-sm">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)}{" "}
            of {filtered.length} records
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${n === page ? "bg-primary text-black" : "hover:bg-muted text-muted-foreground"}`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewUser && (
        <UserViewModal
          user={viewUser}
          onClose={() => setViewUser(null)}
          onEdit={() => {
            setViewUser(null);
            navigate(`/admin/user-master/edit/${viewUser.id}`);
          }}
        />
      )}

      {/* Delete Confirmation */}
      <Dialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserMasterList;
