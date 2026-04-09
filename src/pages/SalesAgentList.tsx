import React, { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  getSalesAgentsApi,
  createSalesAgentApi,
  updateSalesAgentApi,
  deleteSalesAgentApi,
  updateSalesAgentStatusApi,
  getCountriesApi,
  getStatesApi,
  getCitiesApi,
} from '@/services/api';

interface SalesAgent {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: number | string;
  state: number | string;
  city: number | string;
  country_name?: string;
  state_name?: string;
  city_name?: string;
  zip: string;
  address?: string;
  description: string;
  status: 'active' | 'inactive';
  created_at: string;
}

interface DropdownItem {
  id: number;
  name: string;
  country_id?: number | string;
  state_id?: number | string;
}

const PER_PAGE = 10;
const emptyForm: Omit<SalesAgent, 'id' | 'created_at' | 'country_name' | 'state_name' | 'city_name'> = { 
  name: '', 
  email: '', 
  phone: '', 
  country: '', 
  state: '', 
  city: '', 
  zip: '', 
  address: '',
  description: '', 
  status: 'active' 
};

const formatDate = (d: string) => {
  if (!d) return '—';
  const parts = d.split('-');
  if (parts.length === 3 && parts[0].length === 2) return `${parts[0]}/${parts[1]}/${parts[2]}`;
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? d : parsed.toLocaleDateString();
};

const SalesAgentList = () => {
  const { toast } = useToast();
  const [allItems, setAllItems]         = useState<SalesAgent[]>([]);
  const [loading, setLoading]           = useState(false);
  
  // Dropdown lists
  const [countries, setCountries] = useState<DropdownItem[]>([]);
  const [allStates, setAllStates] = useState<DropdownItem[]>([]);
  const [allCities, setAllCities] = useState<DropdownItem[]>([]);

  // Filters
  const [search, setSearch]             = useState('');
  const [filterCountry, setFilterCountry] = useState<string | number>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  const [page, setPage]                 = useState(1);
  const [modalOpen, setModalOpen]       = useState(false);
  const [editing, setEditing]           = useState<SalesAgent | null>(null);
  const [viewItem, setViewItem]         = useState<SalesAgent | null>(null);
  const [form, setForm]                 = useState(emptyForm);
  const [errors, setErrors]             = useState<{ [key: string]: string }>({});
  const [saving, setSaving]             = useState(false);
  const [deleteId, setDeleteId]         = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [saRes, cRes, sRes, ciRes] = await Promise.all([
        getSalesAgentsApi(1, 9999),
        getCountriesApi(),
        getStatesApi(1, 9999),
        getCitiesApi(),
      ]);
      const raw: any[] = saRes.data?.data ?? saRes.data ?? [];
      setAllItems(raw.map(r => ({ ...r, status: r.status === 1 || r.status === '1' ? 'active' : 'inactive' })));
      const rawCountries: any[] = cRes.data?.data ?? cRes.data ?? [];
      setCountries(rawCountries.filter(r => r.status === 1 || r.status === '1').map(r => ({ id: r.id, name: r.country_name ?? r.name })));
      setAllStates(sRes.data?.data ?? sRes.data ?? []);
      setAllCities(ciRes.data?.data ?? ciRes.data ?? []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load data.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Filter lists based on dependent selection
  const filteredStates = allStates.filter(s => Number(s.country_id) === Number(form.country));
  const filteredCities = allCities.filter(c => Number(c.state_id) === Number(form.state));

  // Client-side filter
  const filtered = allItems.filter(i => {
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    const matchCountry = !filterCountry || Number(i.country) === Number(filterCountry);
    return matchSearch && matchStatus && matchCountry;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const fromRecord = filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1;
  const toRecord   = Math.min(page * PER_PAGE, filtered.length);

  const goToPage = (p: number) => { if (p < 1 || p > totalPages) return; setPage(p); };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setErrors({}); setModalOpen(true); };
  const openEdit   = (item: SalesAgent) => {
    setEditing(item);
    setForm({ 
      name: item.name, 
      email: item.email || '', 
      phone: item.phone || '', 
      country: item.country || '', 
      state: item.state || '', 
      city: item.city || '', 
      zip: item.zip || '', 
      address: item.address || '',
      description: item.description || '', 
      status: item.status 
    });
    setErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.email.trim()) newErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format.';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required.';
    if (!form.country) newErrors.country = 'Country is required.';
    if (!form.state) newErrors.state = 'State is required.';
    if (!form.city) newErrors.city = 'City is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      const payload = { 
        name: form.name,
        email: form.email,
        phone: form.phone,
        country: form.country,
        state: form.state,
        city: form.city,
        zip: form.zip,
        address: form.address,
        description: form.description,
        status: form.status === 'active' ? 1 : 0,
      };
      if (editing) {
        await updateSalesAgentApi(editing.id, payload);
        toast({ title: 'Success', description: 'Sales Agent updated successfully.', variant: 'success' });
      } else {
        await createSalesAgentApi(payload);
        toast({ title: 'Success', description: 'Sales Agent created successfully.', variant: 'success' });
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.message || 'Failed to save sales agent.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteSalesAgentApi(deleteId);
      toast({ title: 'Success', description: 'Sales Agent deleted successfully.', variant: 'success' });
      setDeleteId(null);
      loadData();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete sales agent.', variant: 'destructive' });
    }
  };

  const toggleStatus = async (item: SalesAgent) => {
    try {
      const newStatus = item.status === 'active' ? 0 : 1;
      await updateSalesAgentStatusApi(item.id, newStatus);
      toast({ title: 'Success', description: 'Status updated successfully.', variant: 'success' });
      loadData();
    } catch {
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
    }
  }

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

  const getCountryName = (id: number | string) => countries.find(c => c.id === Number(id))?.name || '—';
  const getStateName = (id: number | string) => allStates.find(s => s.id === Number(id))?.name || '—';
  const getCityName = (id: number | string) => allCities.find(c => c.id === Number(id))?.name || '—';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Sales Agent</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage sales agents and assignments</p>
        </div>
        <Button className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add Sales Agent
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
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by sales agent name..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-2.5 border border-input rounded-xl text-sm bg-background"
            />
          </div>
          <select
            value={filterCountry}
            onChange={e => { setFilterCountry(e.target.value); setPage(1); }}
            className="px-4 py-2.5 border border-input rounded-xl text-sm bg-background w-full sm:w-48"
          >
            <option value="">All Countries</option>
            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value as any); setPage(1); }}
            className="px-4 py-2.5 border border-input rounded-xl text-sm bg-background w-full sm:w-40"
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
                {['NAME', 'EMAIL', 'PHONE', 'COUNTRY', 'STATE', 'CITY', 'STATUS', 'CREATED', 'ACTIONS'].map((h, i) => (
                  <th key={h} className={`p-4 text-xs font-semibold text-muted-foreground tracking-wide whitespace-nowrap ${i === 8 ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="p-8 text-center text-muted-foreground text-sm">Loading...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={9} className="p-8 text-center text-muted-foreground text-sm">No sales agents found.</td></tr>
              ) : paginated.map((item, idx) => (
                <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground whitespace-nowrap">{item.name}</td>
                  <td className="p-4 text-sm text-foreground whitespace-nowrap">{item.email}</td>
                  <td className="p-4 text-sm text-foreground whitespace-nowrap">{item.phone}</td>
                  <td className="p-4 text-sm text-foreground whitespace-nowrap">{item.country_name || getCountryName(item.country)}</td>
                  <td className="p-4 text-sm text-foreground whitespace-nowrap">{item.state_name || getStateName(item.state)}</td>
                  <td className="p-4 text-sm text-foreground whitespace-nowrap">{item.city_name || getCityName(item.city)}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleStatus(item)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity ${
                        item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
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
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">{editing ? 'Edit Sales Agent' : 'Add Sales Agent'}</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info */}
                <div className="md:col-span-2 text-sm font-semibold text-muted-foreground mb-1">Basic Information</div>
                
                <div>
                  <Label className="text-sm font-semibold mb-1 block">Name <span className="text-destructive">*</span></Label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(e => ({ ...e, name: '' })); }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-background ${errors.name ? 'border-destructive' : 'border-input'}`}
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <Label className="text-sm font-semibold mb-1 block">Email <span className="text-destructive">*</span></Label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(e => ({ ...e, email: '' })); }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-background ${errors.email ? 'border-destructive' : 'border-input'}`}
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <Label className="text-sm font-semibold mb-1 block">Phone <span className="text-destructive">*</span></Label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(e => ({ ...e, phone: '' })); }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-background ${errors.phone ? 'border-destructive' : 'border-input'}`}
                  />
                  {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                </div>
                
                {/* Address Info */}
                <div className="md:col-span-2 text-sm font-semibold text-muted-foreground mt-4 mb-1">Address Information</div>

                <div>
                  <Label className="text-sm font-semibold mb-1 block">Country <span className="text-destructive">*</span></Label>
                  <select
                    value={form.country}
                    onChange={e => { 
                      const val = e.target.value ? Number(e.target.value) : '';
                      setForm(f => ({ ...f, country: val, state: '', city: '' })); 
                      setErrors(e => ({ ...e, country: '' })); 
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-background ${errors.country ? 'border-destructive' : 'border-input'}`}
                  >
                    <option value="">Select Country</option>
                    {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {errors.country && <p className="text-xs text-destructive mt-1">{errors.country}</p>}
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-1 block">State <span className="text-destructive">*</span></Label>
                  <select
                    value={form.state}
                    onChange={e => { 
                      const val = e.target.value ? Number(e.target.value) : '';
                      setForm(f => ({ ...f, state: val, city: '' })); 
                      setErrors(e => ({ ...e, state: '' }));
                    }}
                    disabled={!form.country}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-background ${errors.state ? 'border-destructive' : 'border-input'}`}
                  >
                    <option value="">Select State</option>
                    {filteredStates.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-1 block">City <span className="text-destructive">*</span></Label>
                  <select
                    value={form.city}
                    onChange={e => { 
                      const val = e.target.value ? Number(e.target.value) : '';
                      setForm(f => ({ ...f, city: val })); 
                      setErrors(e => ({ ...e, city: '' })); 
                    }}
                    disabled={!form.state}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-background ${errors.city ? 'border-destructive' : 'border-input'}`}
                  >
                    <option value="">Select City</option>
                    {filteredCities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-1 block">Zip Code</Label>
                  <input
                    type="text"
                    value={form.zip}
                    onChange={e => setForm(f => ({ ...f, zip: e.target.value }))}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label className="text-sm font-semibold mb-1 block">Address</Label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                  />
                </div>

                {/* Other Fields */}
                <div className="md:col-span-2 text-sm font-semibold text-muted-foreground mt-4 mb-1">Other Fields</div>

                <div className="md:col-span-2">
                  <Label className="text-sm font-semibold mb-1 block">Description</Label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background resize-none"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-1 block">Status</Label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="text-black bg-primary hover:bg-primary/90">
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
              <h3 className="text-lg font-bold text-primary">View Sales Agent</h3>
              <button onClick={() => setViewItem(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-5">
              <div className="space-y-4">
                {[
                  { label: 'Name',         value: viewItem.name },
                  { label: 'Email',        value: viewItem.email },
                  { label: 'Phone',        value: viewItem.phone },
                  { label: 'Country',      value: viewItem.country_name || getCountryName(viewItem.country) },
                  { label: 'State',        value: viewItem.state_name || getStateName(viewItem.state) },
                  { label: 'City',         value: viewItem.city_name || getCityName(viewItem.city) },
                  { label: 'Zip Code',     value: viewItem.zip || '—' },
                  { label: 'Address',      value: viewItem.address || '—' },
                  { label: 'Description',  value: viewItem.description || '—' },
                  { label: 'Created Date', value: formatDate(viewItem.created_at) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-3 border-b border-border pb-2 last:border-0 last:pb-0">
                    <Label className="text-sm font-semibold text-right w-32 shrink-0">{label}</Label>
                    <span className="flex-1 text-sm text-foreground">{value}</span>
                  </div>
                ))}
                <div className="flex items-center gap-3 pt-2">
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
              <h3 className="text-lg font-bold text-primary">Delete Sales Agent</h3>
              <button onClick={() => setDeleteId(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this sales agent? This action cannot be undone.</p>
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

export default SalesAgentList;
