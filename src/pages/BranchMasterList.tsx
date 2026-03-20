import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BranchViewModal from './BranchViewModal';

export interface Branch {
  id: number;
  code: string;
  name: string;
  address: string;
  position: string;
  notes: string;
  currency: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
}

export const INITIAL_BRANCHES: Branch[] = [
  { id: 1, code: 'HQ',  name: 'Head Office',  address: 'Dubai Airport Free Zone, Dubai', position: 'Headquarters', notes: 'Main HQ',         currency: 'AED', city: 'Dubai',  country: 'UAE',   phone: '+97140000000', email: 'hq@relaylogistics.com',    status: 'Active'   },
  { id: 2, code: 'BOM', name: 'Mumbai Branch', address: '22 Relay Park, Andheri East',    position: 'Regional',     notes: 'West India hub',  currency: 'INR', city: 'Mumbai', country: 'India', phone: '+91220000000', email: 'mumbai@relaylogistics.com', status: 'Active'   },
  { id: 3, code: 'DEL', name: 'Delhi Branch',  address: 'Plot 5, Okhla Industrial Area',  position: 'Regional',     notes: 'North India hub', currency: 'INR', city: 'Delhi',  country: 'India', phone: '+91110000000', email: 'delhi@relaylogistics.com',  status: 'Active'   },
  { id: 4, code: 'LHR', name: 'London Branch', address: '12 Commerce Road, London EC1A',  position: 'International',notes: 'UK operations',   currency: 'GBP', city: 'London', country: 'UK',    phone: '+44200000000', email: 'london@relaylogistics.com', status: 'Inactive' },
];

// Module-level store — single source of truth shared with NewBranch
export const branchStore = {
  data: [...INITIAL_BRANCHES] as Branch[],
  listeners: new Set<() => void>(),
  set(next: Branch[]) {
    this.data = next;
    this.listeners.forEach(fn => fn());
  },
};

const BranchMasterList = () => {
  const navigate = useNavigate();
  const [branches, setBranches]     = useState<Branch[]>(() => branchStore.data);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage]             = useState(1);
  const [pageSize, setPageSize]     = useState(5);
  const [deleteId, setDeleteId]     = useState<number | null>(null);
  const [viewBranch, setViewBranch] = useState<Branch | null>(null);

  useEffect(() => {
    const refresh = () => setBranches([...branchStore.data]);
    branchStore.listeners.add(refresh);
    refresh();
    return () => { branchStore.listeners.delete(refresh); };
  }, []);

  const openView = (b: Branch) => setViewBranch(b);

  const filtered = branches.filter(b => {
    const q = searchTerm.toLowerCase();
    return !q ||
      b.code.toLowerCase().includes(q) ||
      b.name.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      b.country.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = () => {
    if (deleteId !== null) {
      const updated = branches.filter(b => b.id !== deleteId);
      branchStore.set(updated);
      setBranches(updated);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Branch Master List</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and configure your branch locations</p>
        </div>
        <Button
          className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black"
          onClick={() => navigate('/admin/branch-master/new')}
        >
          <Plus className="w-4 h-4" /> Add Branch
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL',     value: branches.length,                                       color: 'text-blue-500',   bg: 'bg-blue-50'   },
          { label: 'ACTIVE',    value: branches.filter(b => b.status === 'Active').length,   color: 'text-green-500',  bg: 'bg-green-50'  },
          { label: 'INACTIVE',  value: branches.filter(b => b.status === 'Inactive').length, color: 'text-red-500',    bg: 'bg-red-50'    },
          { label: 'COUNTRIES', value: new Set(branches.map(b => b.country)).size,           color: 'text-purple-500', bg: 'bg-purple-50' },
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
            <input
              type="text"
              placeholder="Search by code, name, city, country..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-2.5 border border-input rounded-xl text-sm bg-background"
            />
          </div>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground border border-input rounded-xl px-3 py-1.5">
            Rows
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="bg-transparent font-semibold text-foreground outline-none cursor-pointer"
            >
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
                {['BRANCH NAME', 'CODE', 'ADDRESS', 'POSITION', 'NOTES', 'BRANCH CURRENCY', 'ACTIONS'].map((h, i) => (
                  <th
                    key={h}
                    className={`p-4 text-xs font-semibold text-muted-foreground tracking-wide whitespace-nowrap ${i === 6 ? 'text-right' : 'text-left'}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(b => (
                <tr key={b.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground whitespace-nowrap">{b.name}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{b.code}</td>
                  <td className="p-4 text-sm text-muted-foreground max-w-[180px] truncate" title={b.address}>{b.address || '—'}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{b.position || '—'}</td>
                  <td className="p-4 text-sm text-muted-foreground max-w-[160px] truncate" title={b.notes}>{b.notes || '—'}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{b.currency || '—'}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="View" onClick={() => openView(b)}>
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Edit" onClick={() => navigate(`/admin/branch-master/edit/${b.id}`)}>
                        <Pencil className="w-4 h-4 text-green-500" />
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Delete" onClick={() => setDeleteId(b.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground text-sm">No branches found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} records
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${n === page ? 'bg-primary text-black' : 'hover:bg-muted text-muted-foreground'}`}>
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

      {viewBranch && (
        <BranchViewModal
          branch={viewBranch}
          onClose={() => setViewBranch(null)}
          onEdit={() => { setViewBranch(null); navigate(`/admin/branch-master/edit/${viewBranch.id}`); }}
        />
      )}

      {/* Delete Confirmation */}
      <Dialog open={deleteId !== null} onOpenChange={open => { if (!open) setDeleteId(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Branch</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this branch? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default BranchMasterList;
