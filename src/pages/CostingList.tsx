import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllCostingsApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const CostingList = () => {
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async (p: number, q: string) => {
    setLoading(true);
    try {
      const res = await getAllCostingsApi(p, pageSize, q);
      const d = res.data;
      setData(d.data ?? []);
      setTotal(d.pagination?.total ?? 0);
      setTotalPages(d.pagination?.total_pages ?? 1);
    } catch {
      toast({ title: 'Error', description: 'Failed to load costing records.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [pageSize, toast]);

  useEffect(() => { load(page, search); }, [page, search, load]);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  const HEADERS = [
    '#', 'Charge', 'PP/CC', 'Description', 'Unit', 'No of Unit', 'SAC Code',
    'Sale Customer', 'Sale Dr/Cr', 'Sale Currency', 'Sale Ex Rate', 'Sale/Unit',
    'Sale Crcy Amt', 'Sale Local Amt', 'Sale Tax%', 'Sale Tax Amt',
    'Cost Vendor', 'Cost Dr/Cr', 'Cost Currency', 'Cost Ex Rate', 'Cost/Unit',
    'Cost Crcy Amt', 'Cost Local Amt', 'Cost Tax%', 'Cost Tax Amt',
    'Status', 'Created At',
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Operation Costing</h1>
          <p className="text-muted-foreground text-sm mt-1">View all operation costing records</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="material-card material-elevation-1 p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by charge, customer, vendor..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-input rounded-xl text-sm bg-background"
            />
          </div>
          <span className="text-sm text-muted-foreground">
            Total: <strong>{total}</strong>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="material-card material-elevation-1">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                {HEADERS.map(h => (
                  <th key={h} className="px-3 py-2.5 text-left font-semibold text-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={HEADERS.length} className="p-8 text-center text-muted-foreground text-sm">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={HEADERS.length} className="p-8 text-center text-muted-foreground text-sm">No costing records found.</td></tr>
              ) : data.map((row, i) => (
                <tr key={row.id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-3 py-2 text-muted-foreground">{(page - 1) * pageSize + i + 1}</td>
                  <td className="px-3 py-2 font-medium whitespace-nowrap">{row.charge}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.freight_pp_cc}</td>
                  <td className="px-3 py-2 max-w-[120px] truncate" title={row.description}>{row.description || '—'}</td>
                  <td className="px-3 py-2">{row.unit}</td>
                  <td className="px-3 py-2">{row.no_of_unit}</td>
                  <td className="px-3 py-2">{row.sac_code}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.sale_customer || '—'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.sale_dr_cr}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.sale_currency}</td>
                  <td className="px-3 py-2">{row.sale_ex_rate}</td>
                  <td className="px-3 py-2">{row.sale_per_unit}</td>
                  <td className="px-3 py-2">{row.sale_crcy_amount}</td>
                  <td className="px-3 py-2">{row.sale_local_amount}</td>
                  <td className="px-3 py-2">{row.sale_tax_percent}</td>
                  <td className="px-3 py-2">{row.sale_total_tax_amount}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.cost_vendor || '—'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.cost_dr_cr}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.cost_currency}</td>
                  <td className="px-3 py-2">{row.cost_ex_rate}</td>
                  <td className="px-3 py-2">{row.cost_per_unit}</td>
                  <td className="px-3 py-2">{row.cost_crcy_amount}</td>
                  <td className="px-3 py-2">{row.cost_local_amount}</td>
                  <td className="px-3 py-2">{row.cost_tax_percent}</td>
                  <td className="px-3 py-2">{row.cost_total_tax_amount}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${row.status === 1 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {row.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {data.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total} records
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
    </div>
  );
};

export default CostingList;
