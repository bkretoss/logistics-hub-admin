import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import BranchViewModal from './BranchViewModal';
import { getBranchesApi, getBranchApi, deleteBranchApi } from '@/services/api';

export interface Branch {
  id: number;
  branch_code: string;
  name: string;
  position: string;
  currency: string;
  billing_state: string;
  gstin_no: string;
  notes: string;
  voucher_identify: string;
  interest_calculation: string;
  debit_note: string;
  incentive_calculation: string;
  incentive_percentage: string;
  time_sheet_enable: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone: string;
  mobile: string;
  fax: string;
  email: string;
  website: string;
  logo_link: string;
  branch_logo: string | null;
  status: number;
  created_at: string;
}

const BranchMasterList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [branches, setBranches]     = useState<Branch[]>([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage]             = useState(1);
  const [pageSize, setPageSize]     = useState(10);
  const [deleteId, setDeleteId]     = useState<number | null>(null);
  const [viewBranch, setViewBranch] = useState<Branch | null>(null);

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBranchesApi(page, pageSize, searchTerm);
      const list = res.data.data ?? [];
      setTotal(res.data.pagination?.total ?? 0);
      // fetch full detail for each branch to get branch_logo
      const detailed = await Promise.all(
        list.map((b: Branch) => getBranchApi(b.id).then(r => r.data.data ?? r.data).catch(() => b))
      );
      setBranches(detailed);
    } catch {
      toast({ title: 'Error', description: 'Failed to load branches', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchTerm]);

  useEffect(() => { fetchBranches(); }, [fetchBranches]);

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteBranchApi(deleteId);
      toast({ title: 'Deleted', description: 'Branch deleted successfully', variant: 'success' });
      setDeleteId(null);
      fetchBranches();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete branch', variant: 'destructive' });
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeCount   = branches.filter(b => b.status === 1).length;
  const inactiveCount = branches.filter(b => b.status !== 1).length;

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
          onClick={() => navigate('/master/branch/new')}
        >
          <Plus className="w-4 h-4" /> Add Branch
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'TOTAL',    value: total,         color: 'text-blue-500',  bg: 'bg-blue-50'  },
          { label: 'ACTIVE',   value: activeCount,   color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'INACTIVE', value: inactiveCount, color: 'text-red-500',   bg: 'bg-red-50'   },
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
              placeholder="Search by code, name..."
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
                {['BRANCH LOGO', 'BRANCH NAME', 'CODE', 'ADDRESS', 'POSITION', 'CURRENCY', 'STATUS', 'ACTIONS'].map((h, i) => (
                  <th
                    key={h}
                    className={`p-4 text-xs font-semibold text-muted-foreground tracking-wide whitespace-nowrap ${i === 7 ? 'text-right' : 'text-left'}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground text-sm">Loading...</td></tr>
              ) : branches.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground text-sm">No branches found.</td></tr>
              ) : branches.map(b => (
                <tr key={b.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    {b.branch_logo
                      ? <img src={b.branch_logo} alt={b.name} className="w-10 h-10 rounded-lg object-cover border border-border" onError={e => { (e.target as HTMLImageElement).style.display='none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }} />
                      : null
                    }
                    <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground font-semibold ${b.branch_logo ? 'hidden' : ''}`}>
                      {b.name?.charAt(0)?.toUpperCase() || 'B'}
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-foreground whitespace-nowrap">{b.name}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{b.branch_code}</td>
                  <td className="p-4 text-sm text-muted-foreground max-w-[180px] truncate" title={b.address}>{b.address || '—'}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{b.position || '—'}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{b.currency || '—'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${b.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {b.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="View" onClick={() => setViewBranch(b)}>
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Edit" onClick={() => navigate(`/master/branch/edit/${b.id}`)}>
                        <Pencil className="w-4 h-4 text-green-500" />
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Delete" onClick={() => setDeleteId(b.id)}>
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
          onEdit={() => { setViewBranch(null); navigate(`/master/branch/edit/${viewBranch.id}`); }}
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
