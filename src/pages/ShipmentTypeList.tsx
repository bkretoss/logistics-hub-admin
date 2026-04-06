import React, { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  getShipmentTypesApi,
  createShipmentTypeApi,
  updateShipmentTypeApi,
  deleteShipmentTypeApi,
} from '@/services/api';

export interface ShipmentType {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}

const normalizeStatus = (s: number | string): 'Active' | 'Inactive' =>
  s === 1 || s === 'Active' ? 'Active' : 'Inactive';

const formatDate = (d: string) => {
  if (!d) return '—';
  // Handle DD-MM-YYYY
  const parts = d.split('-');
  if (parts.length === 3 && parts[0].length === 2) {
    return `${parts[0]}/${parts[1]}/${parts[2]}`;
  }
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? d : parsed.toLocaleDateString();
};

const PAGE_SIZE = 10;

const emptyForm = { name: '', description: '', status: 'Active' as 'Active' | 'Inactive' };

const ShipmentTypeList = () => {
  const { toast } = useToast();
  const [items, setItems]           = useState<ShipmentType[]>([]);
  const [loading, setLoading]       = useState(false);
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(1);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<ShipmentType | null>(null);
  const [form, setForm]             = useState(emptyForm);
  const [formError, setFormError]   = useState('');
  const [saving, setSaving]         = useState(false);
  const [deleteId, setDeleteId]     = useState<number | null>(null);
  const [viewItem, setViewItem]     = useState<ShipmentType | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getShipmentTypesApi();
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setItems(raw.map(r => ({ ...r, status: normalizeStatus(r.status) })));
    } catch {
      toast({ title: 'Error', description: 'Failed to load shipment types.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (item: ShipmentType) => {
    setEditing(item);
    setForm({ name: item.name, description: item.description, status: item.status });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError('Shipment Type Name is required.'); return; }
    const duplicate = items.some(i =>
      i.name.toLowerCase() === form.name.trim().toLowerCase() && i.id !== editing?.id
    );
    if (duplicate) { setFormError('Shipment Type Name already exists.'); return; }

    setSaving(true);
    try {
      const payload = { ...form, status: form.status === 'Active' ? 1 : 0 };
      if (editing) {
        await updateShipmentTypeApi(editing.id, payload);
        toast({ title: 'Success', description: 'Shipment type updated successfully.', variant: 'success' });
      } else {
        await createShipmentTypeApi(payload);
        toast({ title: 'Success', description: 'Shipment type created successfully.', variant: 'success' });
      }
      setModalOpen(false);
      load();
    } catch {
      toast({ title: 'Error', description: 'Failed to save shipment type.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteShipmentTypeApi(deleteId);
      toast({ title: 'Success', description: 'Shipment type deleted successfully.', variant: 'success' });
      setDeleteId(null);
      load();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete shipment type.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Shipment Type</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage shipment type configurations</p>
        </div>
        <Button className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add Shipment Type
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'TOTAL',    value: items.length,                                       color: 'text-blue-500',  bg: 'bg-blue-50'  },
          { label: 'ACTIVE',   value: items.filter(i => i.status === 'Active').length,   color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'INACTIVE', value: items.filter(i => i.status === 'Inactive').length, color: 'text-red-500',   bg: 'bg-red-50'   },
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
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by shipment type name..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-2.5 border border-input rounded-xl text-sm bg-background"
          />
        </div>
      </div>

      {/* Table */}
      <div className="material-card material-elevation-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                {['ID', 'SHIPMENT TYPE NAME', 'DESCRIPTION', 'STATUS', 'CREATED DATE', 'ACTIONS'].map((h, i) => (
                  <th key={h} className={`p-4 text-xs font-semibold text-muted-foreground tracking-wide whitespace-nowrap ${i === 5 ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">Loading...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">No shipment types found.</td></tr>
              ) : paginated.map(item => (
                <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm text-muted-foreground">{item.id}</td>
                  <td className="p-4 text-sm font-medium text-foreground whitespace-nowrap">{item.name}</td>
                  <td className="p-4 text-sm text-muted-foreground max-w-[220px] truncate" title={item.description}>{item.description || '—'}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(item.created_at)}
                  </td>
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
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records
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

      {/* Create / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={open => { if (!open) setModalOpen(false); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Shipment Type' : 'Add Shipment Type'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Shipment Type Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setFormError(''); }}
                placeholder="Enter shipment type name"
                className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Enter description (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as 'Active' | 'Inactive' }))}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            {formError && <p className="text-sm text-red-500">{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="text-black">
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={viewItem !== null} onOpenChange={open => { if (!open) setViewItem(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Shipment Type Details</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-4 mt-2 text-sm">
              {[
                { label: 'ID',                 value: String(viewItem.id) },
                { label: 'Shipment Type Name', value: viewItem.name },
                { label: 'Description',        value: viewItem.description || '—' },
                { label: 'Created Date',       value: formatDate(viewItem.created_at) },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</span>
                <span className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  viewItem.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>{viewItem.status}</span>
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => setViewItem(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteId !== null} onOpenChange={open => { if (!open) setDeleteId(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Shipment Type</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this shipment type? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShipmentTypeList;
