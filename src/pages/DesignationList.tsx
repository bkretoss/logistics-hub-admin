import React, { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  getDesignationsApi,
  createDesignationApi,
  updateDesignationApi,
  deleteDesignationApi,
} from '@/services/api';

interface Designation {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  created_at: string;
}

const PER_PAGE = 10;
const emptyForm = { name: '', description: '', status: 'active' as 'active' | 'inactive' };

const DesignationList = () => {
  const { toast } = useToast();
  const [items, setItems]               = useState<Designation[]>([]);
  const [loading, setLoading]           = useState(false);
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage]                 = useState(1);
  const [total, setTotal]               = useState(0);
  const [totalAll, setTotalAll]         = useState(0);
  const [totalActive, setTotalActive]   = useState(0);
  const [totalInactive, setTotalInactive] = useState(0);
  const [totalPages, setTotalPages]     = useState(1);
  const [modalOpen, setModalOpen]       = useState(false);
  const [editing, setEditing]           = useState<Designation | null>(null);
  const [form, setForm]                 = useState(emptyForm);
  const [nameError, setNameError]       = useState('');
  const [saving, setSaving]             = useState(false);
  const [deleteId, setDeleteId]         = useState<number | null>(null);

  const load = async (p: number, q: string, st: string) => {
    setLoading(true);
    try {
      const res = await getDesignationsApi(p, PER_PAGE, q, st === 'all' ? '' : st);
      const raw: any[]   = res.data?.data ?? [];
      const pagination   = res.data?.pagination ?? {};
      setItems(raw.map(r => ({ ...r, status: r.status === 1 || r.status === '1' ? 'active' : 'inactive' })));
      setTotal(pagination.total ?? raw.length);
      setTotalPages(pagination.total_pages ?? 1);
      // Only update the unfiltered total when no search/filter is active
      if (!q && st === 'all') {
        setTotalAll(pagination.total ?? raw.length);
        // Fetch all records to get accurate active/inactive counts
        const allRes = await getDesignationsApi(1, pagination.total ?? 9999, '', '');
        const allRaw: any[] = allRes.data?.data ?? [];
        setTotalActive(allRaw.filter(r => r.status === 1 || r.status === '1').length);
        setTotalInactive(allRaw.filter(r => r.status === 0 || r.status === '0').length);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load designations.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Debounce search — wait 400ms after user stops typing before calling API
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      load(1, search, statusFilter);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Status filter change — immediate API call, reset to page 1
  useEffect(() => {
    setPage(1);
    load(1, search, statusFilter);
  }, [statusFilter]);

  // Page change — fetch with current search & filter
  useEffect(() => {
    load(page, search, statusFilter);
  }, [page]);

  const filtered = items;

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setNameError('');
    setModalOpen(true);
  };

  const openEdit = (item: Designation) => {
    setEditing(item);
    setForm({ name: item.name, description: item.description, status: item.status });
    setNameError('');
    setModalOpen(true);
  };

  const isDuplicate = (name: string, excludeId?: number) =>
    items.some(i => i.name.trim().toLowerCase() === name.trim().toLowerCase() && i.id !== excludeId);

  const handleSave = async () => {
    const trimmedName = form.name.trim();
    if (!trimmedName) { setNameError('Designation Name is required.'); return; }
    if (isDuplicate(trimmedName, editing?.id)) {
      setNameError('Designation Name already exists. Please enter a unique name.');
      return;
    }
    setSaving(true);
    try {
      const payload = { name: trimmedName, description: form.description, status: form.status === 'active' ? '1' : '0' };
      if (editing) {
        await updateDesignationApi(editing.id, payload);
        toast({ title: 'Success', description: 'Designation updated successfully.', variant: 'success' });
      } else {
        await createDesignationApi(payload);
        toast({ title: 'Success', description: 'Designation created successfully.', variant: 'success' });
      }
      setModalOpen(false);
      load(page, search, statusFilter);
    } catch (err: any) {
      const msg: string = err?.response?.data?.message ?? '';
      if (/duplicate|unique|already exists/i.test(msg)) {
        setNameError('Designation Name already exists. Please enter a unique name.');
      } else {
        toast({ title: 'Error', description: 'Failed to save designation.', variant: 'destructive' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteDesignationApi(deleteId);
      toast({ title: 'Success', description: 'Designation deleted successfully.', variant: 'success' });
      setDeleteId(null);
      // If last item on page, go back one page
      const newPage = items.length === 1 && page > 1 ? page - 1 : page;
      setPage(newPage);
      load(newPage, search, statusFilter);
    } catch {
      toast({ title: 'Error', description: 'Failed to delete designation.', variant: 'destructive' });
    }
  };

  // Windowed page numbers
  const getPageNumbers = (): (number | '...')[] => {
    const delta = 2;
    const start = Math.max(1, Math.min(page - delta, totalPages - delta * 2));
    const end   = Math.min(totalPages, Math.max(page + delta, delta * 2 + 1));
    const pages: (number | '...')[] = [];
    if (start > 1) { pages.push(1); if (start > 2) pages.push('...'); }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) { if (end < totalPages - 1) pages.push('...'); pages.push(totalPages); }
    return pages;
  };

  const fromRecord = total === 0 ? 0 : (page - 1) * PER_PAGE + 1;
  const toRecord   = Math.min(page * PER_PAGE, total);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Designation</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage designation configurations</p>
        </div>
        <Button className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add Designation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'TOTAL',    value: totalAll,                        color: 'text-blue-500',  bg: 'bg-blue-50'  },
          { label: 'ACTIVE',   value: totalActive,                     color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'INACTIVE', value: totalInactive,                   color: 'text-red-500',   bg: 'bg-red-50'   },
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
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by designation name..."
              value={search}
              onChange={e => { setSearch(e.target.value); }}
              className="w-full pl-11 pr-4 py-2.5 border border-input rounded-xl text-sm bg-background"
            />
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="material-card material-elevation-1">

        {/* Total Records */}
        <div className="px-4 pt-4 pb-2">
          <span className="text-sm font-semibold text-foreground">
            Total Records: <span className="text-primary">{totalAll}</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                {['SR NO', 'NAME', 'DESCRIPTION', 'STATUS', 'ACTIONS'].map((h, i) => (
                  <th key={h} className={`p-4 text-xs font-semibold text-muted-foreground tracking-wide whitespace-nowrap ${i === 4 ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">No designations found.</td></tr>
              ) : filtered.map((item, idx) => (
                <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm text-muted-foreground">{(page - 1) * PER_PAGE + idx + 1}</td>
                  <td className="p-4 text-sm font-medium text-foreground whitespace-nowrap">{item.name}</td>
                  <td className="p-4 text-sm text-muted-foreground max-w-[220px] truncate" title={item.description}>{item.description || '—'}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-green-50 rounded-lg transition-colors" title="Edit" onClick={() => openEdit(item)}>
                        <Pencil className="w-4 h-4 text-green-500" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Delete" onClick={() => setDeleteId(item.id)}>
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
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-border gap-3">
          {/* Showing X to Y of Z entries */}
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{fromRecord}</span> to{' '}
            <span className="font-medium text-foreground">{toRecord}</span> of{' '}
            <span className="font-medium text-foreground">{total}</span> entries
          </p>

          {/* Controls */}
          <div className="flex items-center gap-1">
            {/* Previous */}
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-input hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1 mx-1">
              {getPageNumbers().map((n, i) =>
                n === '...' ? (
                  <span key={`e-${i}`} className="w-8 h-8 flex items-center justify-center text-sm text-muted-foreground">…</span>
                ) : (
                  <button
                    key={n}
                    onClick={() => goToPage(n as number)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      n === page
                        ? 'bg-primary text-black'
                        : 'border border-input hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {n}
                  </button>
                )
              )}
            </div>

            {/* Next */}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-input hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">{editing ? 'Edit Designation' : 'Add Designation'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-5">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-semibold text-right w-32 shrink-0">
                    <span className="text-destructive mr-1">*</span>Name
                  </Label>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setNameError(''); }}
                      placeholder="Enter designation name"
                      className={`w-full px-3 py-2 border rounded-lg text-sm bg-background ${nameError ? 'border-destructive' : 'border-input'}`}
                    />
                    {nameError && <p className="text-xs text-destructive mt-1">⚠ {nameError}</p>}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Label className="text-sm font-semibold text-right w-32 shrink-0 pt-2">Description</Label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Enter description (optional)"
                    rows={3}
                    className="flex-1 px-3 py-2 border border-input rounded-lg text-sm bg-background resize-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-semibold text-right w-32 shrink-0">Status</Label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                    className="flex-1 px-3 py-2 border border-input rounded-lg text-sm bg-background"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="text-black">
                {saving ? 'Saving...' : editing ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-sm mx-4 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">Delete Designation</h3>
              <button onClick={() => setDeleteId(null)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this designation? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignationList;
