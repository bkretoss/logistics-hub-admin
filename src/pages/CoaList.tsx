import React, { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getCoasApi, createCoaApi, updateCoaApi, deleteCoaApi } from '@/services/api';

interface Coa {
  id: number;
  name: string;
  type: string;
  description: string;
  status: 'active' | 'inactive';
  created_at: string;
}

const PER_PAGE = 10;
const TYPE_OPTIONS = ['Asset', 'Liability', 'Income', 'Expense', 'Equity'];
const emptyForm = { name: '', type: '', description: '', status: 'active' as 'active' | 'inactive' };

const formatDate = (d: string) => {
  if (!d) return '—';
  const parts = d.split('-');
  if (parts.length === 3 && parts[0].length === 2) return `${parts[0]}/${parts[1]}/${parts[2]}`;
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? d : parsed.toLocaleDateString();
};

const CoaList = () => {
  const { toast } = useToast();
  const [allItems,     setAllItems]     = useState<Coa[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [search,       setSearch]       = useState('');
  const [typeFilter,   setTypeFilter]   = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page,         setPage]         = useState(1);
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editing,      setEditing]      = useState<Coa | null>(null);
  const [viewItem,     setViewItem]     = useState<Coa | null>(null);
  const [form,         setForm]         = useState(emptyForm);
  const [errors,       setErrors]       = useState<Record<string, string>>({});
  const [saving,       setSaving]       = useState(false);
  const [deleteId,     setDeleteId]     = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getCoasApi();
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setAllItems(raw.map(r => ({
        id: r.id,
        name: r.name,
        type: r.type ?? '',
        description: r.description ?? '',
        status: r.status === 1 || r.status === '1' ? 'active' : 'inactive',
        created_at: r.created_at ?? '',
      })));
    } catch {
      toast({ title: 'Error', description: 'Failed to load COA.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = allItems.filter(i => {
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeFilter === 'all' || i.type.toLowerCase() === typeFilter.toLowerCase();
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const fromRecord = filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1;
  const toRecord   = Math.min(page * PER_PAGE, filtered.length);
  const goToPage   = (p: number) => { if (p < 1 || p > totalPages) return; setPage(p); };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setErrors({}); setModalOpen(true); };
  const openEdit   = (item: Coa) => {
    setEditing(item);
    setForm({ name: item.name, type: item.type, description: item.description, status: item.status });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.type)        e.type = 'Type is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        type: form.type,
        description: form.description,
        status: form.status === 'active' ? 1 : 0,
      };
      if (editing) {
        await updateCoaApi(editing.id, payload);
        toast({ title: 'Success', description: 'COA updated successfully.', variant: 'success' });
      } else {
        await createCoaApi(payload);
        toast({ title: 'Success', description: 'COA created successfully.', variant: 'success' });
      }
      setModalOpen(false);
      load();
    } catch (err: any) {
      const res = err?.response?.data;
      if (err?.response?.status === 422 && res?.errors) {
        const mapped: Record<string, string> = {};
        Object.entries(res.errors).forEach(([k, v]) => { mapped[k] = Array.isArray(v) ? (v as string[])[0] : String(v); });
        setErrors(mapped);
      } else {
        toast({ title: 'Error', description: res?.message ?? 'Failed to save COA.', variant: 'destructive' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteCoaApi(deleteId);
      toast({ title: 'Success', description: 'COA deleted successfully.', variant: 'success' });
      setDeleteId(null);
      load();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete COA.', variant: 'destructive' });
    }
  };

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

  const TypeBadge = ({ type }: { type: string }) => {
    const map: Record<string, string> = {
      asset:     'bg-blue-100 text-blue-700',
      liability: 'bg-red-100 text-red-700',
      income:    'bg-green-100 text-green-700',
      expense:   'bg-orange-100 text-orange-700',
      equity:    'bg-purple-100 text-purple-700',
    };
    const cls = map[type.toLowerCase()] ?? 'bg-slate-100 text-slate-700';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${cls}`}>
        {type || '—'}
      </span>
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Chart of Accounts</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage COA configurations</p>
        </div>
        <Button className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add COA
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'TOTAL',    value: allItems.length,                                       color: 'text-blue-500',  bg: 'bg-blue-50'  },
          { label: 'ACTIVE',   value: allItems.filter(i => i.status === 'active').length,   color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'INACTIVE', value: allItems.filter(i => i.status === 'inactive').length, color: 'text-red-500',   bg: 'bg-red-50'   },
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
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2.5 border border-input rounded-xl text-sm bg-background"
            />
          </div>
          <select
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
            className="w-40 px-3 py-2.5 border border-input rounded-xl text-sm bg-background"
          >
            <option value="all">All Types</option>
            {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value as any); setPage(1); }}
            className="w-36 px-3 py-2.5 border border-input rounded-xl text-sm bg-background"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="material-card material-elevation-1">
        <div className="px-4 pt-4 pb-2">
          <span className="text-sm font-semibold text-foreground">
            Total Records: <span className="text-primary">{allItems.length}</span>
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                {['SR NO', 'NAME', 'TYPE', 'DESCRIPTION', 'STATUS', 'CREATED DATE', 'ACTIONS'].map((h, i) => (
                  <th key={h} className={`p-4 text-xs font-semibold text-muted-foreground tracking-wide whitespace-nowrap ${i === 6 ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground text-sm">Loading...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground text-sm">No COA records found.</td></tr>
              ) : paginated.map((item, idx) => (
                <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm text-muted-foreground">{(page - 1) * PER_PAGE + idx + 1}</td>
                  <td className="p-4 text-sm font-medium text-foreground whitespace-nowrap">{item.name}</td>
                  <td className="p-4"><TypeBadge type={item.type} /></td>
                  <td className="p-4 text-sm text-muted-foreground max-w-[220px] truncate" title={item.description}>{item.description || '—'}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{formatDate(item.created_at)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors" title="View" onClick={() => setViewItem(item)}>
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
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
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{fromRecord}</span> to{' '}
            <span className="font-medium text-foreground">{toRecord}</span> of{' '}
            <span className="font-medium text-foreground">{filtered.length}</span> entries
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => goToPage(page - 1)} disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-input hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex items-center gap-1 mx-1">
              {getPageNumbers().map((n, i) =>
                n === '...' ? (
                  <span key={`e-${i}`} className="w-8 h-8 flex items-center justify-center text-sm text-muted-foreground">…</span>
                ) : (
                  <button key={n} onClick={() => goToPage(n as number)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      n === page ? 'bg-primary text-black' : 'border border-input hover:bg-muted text-muted-foreground'
                    }`}>
                    {n}
                  </button>
                )
              )}
            </div>
            <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-input hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
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
              <h3 className="text-lg font-bold text-primary">{editing ? 'Edit COA' : 'Add COA'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-5">
              <div className="space-y-4">

                {/* Name */}
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-semibold text-right w-32 shrink-0">
                    <span className="text-destructive mr-1">*</span>Name
                  </Label>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })); }}
                      placeholder="Enter COA name"
                      className={`w-full px-3 py-2 border rounded-lg text-sm bg-background ${errors.name ? 'border-destructive' : 'border-input'}`}
                    />
                    {errors.name && <p className="text-xs text-destructive mt-1">⚠ {errors.name}</p>}
                  </div>
                </div>

                {/* Type */}
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-semibold text-right w-32 shrink-0">
                    <span className="text-destructive mr-1">*</span>Type
                  </Label>
                  <div className="flex-1">
                    <select
                      value={form.type}
                      onChange={e => { setForm(f => ({ ...f, type: e.target.value })); setErrors(er => ({ ...er, type: '' })); }}
                      className={`w-full px-3 py-2 border rounded-lg text-sm bg-background ${errors.type ? 'border-destructive' : 'border-input'}`}
                    >
                      <option value="">Select Type</option>
                      {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.type && <p className="text-xs text-destructive mt-1">⚠ {errors.type}</p>}
                  </div>
                </div>

                {/* Description */}
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

                {/* Status */}
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

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewItem(null)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">View COA</h3>
              <button onClick={() => setViewItem(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-5">
              <div className="space-y-4">
                {[
                  { label: 'Name',         value: viewItem.name },
                  { label: 'Description',  value: viewItem.description || '—' },
                  { label: 'Created Date', value: formatDate(viewItem.created_at) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Label className="text-sm font-semibold text-right w-32 shrink-0 pt-0.5">{label}</Label>
                    <span className="flex-1 text-sm text-foreground">{value}</span>
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-semibold text-right w-32 shrink-0">Type</Label>
                  <TypeBadge type={viewItem.type} />
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-semibold text-right w-32 shrink-0">Status</Label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    viewItem.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {viewItem.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end px-6 py-4 border-t border-border shrink-0">
              <Button variant="outline" onClick={() => setViewItem(null)}>Close</Button>
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
              <h3 className="text-lg font-bold text-primary">Delete COA</h3>
              <button onClick={() => setDeleteId(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this COA record? This action cannot be undone.</p>
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

export default CoaList;
