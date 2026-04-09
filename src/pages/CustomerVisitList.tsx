import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getCustomerVisitsApi, deleteCustomerVisitApi } from '@/services/api';

interface CustomerVisit {
  id: number;
  customer_name: string;
  sales_agent_id?: number;
  sales_agent_name?: string;
  visit_date: string;
  visit_purpose: string;
  location?: string;
  outcome?: string;
  follow_up_date?: string;
  notes?: string;
  status: string;
  created_at?: string;
}

const PER_PAGE = 10;

const formatDate = (d?: string) => {
  if (!d) return '—';
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? d : parsed.toLocaleDateString();
};

const statusColors: Record<string, string> = {
  Scheduled:   'bg-blue-100 text-blue-700',
  Completed:   'bg-green-100 text-green-700',
  Cancelled:   'bg-red-100 text-red-700',
  Rescheduled: 'bg-orange-100 text-orange-700',
};

const CustomerVisitList = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { toast } = useToast();

  const [items, setItems]       = useState<CustomerVisit[]>([]);
  const [loading, setLoading]   = useState(false);
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewItem, setViewItem] = useState<CustomerVisit | null>(null);

  const loadData = async (p = page, q = search) => {
    setLoading(true);
    try {
      const res = await getCustomerVisitsApi(p, PER_PAGE, q);
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setItems(raw);
      if (res.data?.total !== undefined) {
        setTotalRecords(res.data.total);
        setTotalPages(Math.max(1, Math.ceil(res.data.total / PER_PAGE)));
      } else {
        setTotalRecords(raw.length);
        setTotalPages(1);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load customer visits.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.search.includes('success=1')) {
      toast({ title: 'Success', description: 'Customer visit saved successfully.', variant: 'success' });
      navigate('/sales/customer-visits', { replace: true });
    }
    loadData(1, '');
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    loadData(1, e.target.value);
  };

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    loadData(p, search);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteCustomerVisitApi(deleteId);
      toast({ title: 'Deleted', description: 'Customer visit deleted.', variant: 'success' });
      setDeleteId(null);
      loadData(page, search);
    } catch {
      toast({ title: 'Error', description: 'Failed to delete customer visit.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Customer Visits</h1>
          <p className="text-muted-foreground text-sm mt-1">Track and manage customer visit records</p>
        </div>
        <Button
          className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black"
          onClick={() => navigate('/sales/customer-visits/new')}
        >
          <Plus className="w-4 h-4" /> Add Visit
        </Button>
      </div>

      {/* Toolbar */}
      <div className="material-card material-elevation-1 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by customer name or purpose..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-11 pr-4 py-2.5 border border-input rounded-xl text-sm bg-background"
          />
        </div>
      </div>

      {/* Table */}
      <div className="material-card material-elevation-1">
        <div className="px-4 pt-4 pb-2">
          <span className="text-sm font-semibold text-foreground">
            Total Records: <span className="text-primary">{totalRecords}</span>
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                {['CUSTOMER', 'SALES AGENT', 'VISIT DATE', 'PURPOSE', 'LOCATION', 'FOLLOW-UP', 'STATUS', 'ACTIONS'].map((h, i) => (
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
              ) : items.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground text-sm">No customer visits found.</td></tr>
              ) : items.map(item => (
                <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground whitespace-nowrap">{item.customer_name}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{item.sales_agent_name || '—'}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{formatDate(item.visit_date)}</td>
                  <td className="p-4 text-sm text-muted-foreground max-w-[200px] truncate">{item.visit_purpose}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{item.location || '—'}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{formatDate(item.follow_up_date)}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[item.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors" title="View" onClick={() => setViewItem(item)}>
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                      <button className="p-1.5 hover:bg-green-50 rounded-lg transition-colors" title="Edit" onClick={() => navigate(`/sales/customer-visits/edit/${item.id}`)}>
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
            Page <span className="font-medium text-foreground">{page}</span> of{' '}
            <span className="font-medium text-foreground">{totalPages}</span>
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => goToPage(page - 1)} disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-input hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-input hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewItem(null)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">Customer Visit Details</h3>
              <button onClick={() => setViewItem(null)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground">✕</button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-3">
              {[
                { label: 'Customer',     value: viewItem.customer_name },
                { label: 'Sales Agent',  value: viewItem.sales_agent_name || '—' },
                { label: 'Visit Date',   value: formatDate(viewItem.visit_date) },
                { label: 'Purpose',      value: viewItem.visit_purpose },
                { label: 'Location',     value: viewItem.location || '—' },
                { label: 'Follow-up',    value: formatDate(viewItem.follow_up_date) },
                { label: 'Outcome',      value: viewItem.outcome || '—' },
                { label: 'Notes',        value: viewItem.notes || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3 border-b border-border pb-2 last:border-0">
                  <span className="text-sm font-semibold w-28 shrink-0 text-muted-foreground">{label}</span>
                  <span className="text-sm text-foreground">{value}</span>
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <span className="text-sm font-semibold w-28 shrink-0 text-muted-foreground">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[viewItem.status] ?? 'bg-gray-100 text-gray-700'}`}>
                  {viewItem.status}
                </span>
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
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-sm mx-4">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-bold text-primary">Delete Customer Visit</h3>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this visit? This action cannot be undone.</p>
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

export default CustomerVisitList;
