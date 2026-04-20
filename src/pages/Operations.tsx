import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Grid3x3, List,
  Truck, Clock, CheckCircle, AlertCircle, RotateCcw,
  ChevronDown, Eye, Trash2, ChevronLeft, ChevronRight, Pencil,
  Columns3, Filter, Database, Palette, BarChart2, Rows3,
  BookOpen, Download, Mail, HelpCircle, TableProperties,
  ArrowUpDown, Sigma, Calculator, History,
  SplitSquareVertical, Highlighter, LayoutList,
  FileText, FileBarChart, FilePieChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useOperations, type Operation } from './OperationsContext';
import { useToast } from '@/hooks/use-toast';

// API returns dates as DD-MM-YYYY; normalise to DD/MM/YYYY for display
const fmt = (d: string) => {
  if (!d) return '—';
  return d.replace(/-/g, '/');
};

const Operations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { operations, total, loading, deleteOperation } = useOperations();

  const [viewMode, setViewMode]         = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm]     = useState('');
  const [fromDate, setFromDate]         = useState('');
  const [toDate, setToDate]             = useState('');
  const [docFilter, setDocFilter]       = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pageSize, setPageSize]         = useState(10);
  const [page, setPage]                 = useState(1);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selected, setSelected]         = useState<Operation | null>(null);
  const [deleteId, setDeleteId]         = useState<number | null>(null);
  const [filterOpen, setFilterOpen]     = useState(false);
  const [filterType, setFilterType]     = useState<'column' | 'row'>('column');
  const [filterCol, setFilterCol]       = useState('document');
  const [filterOp, setFilterOp]         = useState('=');
  const [filterExpr, setFilterExpr]     = useState('');
  const [activeFilter, setActiveFilter] = useState<{ col: string; op: string; expr: string } | null>(null);

  const handleView = (op: Operation) => { setSelected(op); setViewDialogOpen(true); };

  const handleDeleteConfirm = async () => {
    if (deleteId === null) return;
    try {
      await deleteOperation(deleteId);
      toast({ title: 'Deleted', description: 'Operation deleted successfully.', variant: 'success' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete operation.', variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  };

  const stats = [
    { label: 'TOTAL',    value: total,                                              icon: Truck,       iconColor: 'text-blue-500',   bg: 'bg-blue-50'   },
    { label: 'ACTIVE',   value: operations.filter(o => o.status === 1).length,     icon: CheckCircle, iconColor: 'text-green-500',  bg: 'bg-green-50'  },
    { label: 'INACTIVE', value: operations.filter(o => o.status === 0).length,     icon: AlertCircle, iconColor: 'text-red-500',    bg: 'bg-red-50'    },
    { label: 'AIR',      value: operations.filter(o => o.document?.toLowerCase().includes('air')).length,   icon: Clock,       iconColor: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'FCL',      value: operations.filter(o => o.document?.toLowerCase().includes('fcl')).length,   icon: RotateCcw,   iconColor: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'LCL',      value: operations.filter(o => o.document?.toLowerCase().includes('lcl')).length,   icon: Truck,       iconColor: 'text-blue-500',   bg: 'bg-blue-50'   },
  ];

  const FILTER_COLUMNS = [
    { label: 'Document',          key: 'document' },
    { label: 'Branch',            key: 'branch' },
    { label: 'Date',              key: 'job_date' },
    { label: 'PP/CC',             key: 'freight_pp_cc' },
    { label: 'Customer',          key: 'customer' },
    { label: 'Place of Receipt',  key: 'place_of_receipt' },
    { label: 'POL',               key: 'pol' },
    { label: 'POD',               key: 'pod' },
    { label: 'Place of Delivery', key: 'place_of_delivery' },
    { label: 'ETD',               key: 'pol_etd' },
    { label: 'ETA',               key: 'pod_eta' },
    { label: 'Flight Name',       key: 'flight_name' },
    { label: 'Flight Number',     key: 'flight_number' },
    { label: 'Service Type',      key: 'service_type' },
    { label: 'Shipper',           key: 'shipper' },
    { label: 'Consignee',         key: 'consignee' },
    { label: 'Carrier',           key: 'carrier' },
    { label: 'Notes',             key: 'note' },
  ];
  const OPERATORS = ['=', '!=', 'contains', 'not contains', 'starts with', 'ends with', '>', '<', '>=', '<='];

  const applyColumnFilter = (op: typeof operations, f: typeof activeFilter) => {
    if (!f || !f.expr.trim()) return op;
    return op.filter(row => {
      const val = String((row as Record<string, unknown>)[f.col] ?? '').toLowerCase();
      const expr = f.expr.toLowerCase();
      switch (f.op) {
        case '=':            return val === expr;
        case '!=':           return val !== expr;
        case 'contains':     return val.includes(expr);
        case 'not contains': return !val.includes(expr);
        case 'starts with':  return val.startsWith(expr);
        case 'ends with':    return val.endsWith(expr);
        case '>':            return val > expr;
        case '<':            return val < expr;
        case '>=':           return val >= expr;
        case '<=':           return val <= expr;
        default:             return true;
      }
    });
  };

  const DOC_TYPES    = ['Air Export','Air Import','FCL Export','FCL Import','Land Export','Land Import','LCL Export','LCL Import'];
  const STATUS_TYPES = [{ label: 'Active', value: '1' }, { label: 'Inactive', value: '0' }];
  const customerList = [...new Set(operations.map(o => o.customer).filter(Boolean))];

  const filtered = operations.filter(op => {
    const matchDoc      = !docFilter      || op.document === docFilter;
    const matchCustomer = !customerFilter || op.customer === customerFilter;
    const matchStatus   = !statusFilter   || String(op.status) === statusFilter;
    const matchFrom     = !fromDate       || op.job_date >= fromDate;
    const matchTo       = !toDate         || op.job_date <= toDate;
    const q = searchTerm.toLowerCase();
    const matchSearch   = !q ||
      op.document.toLowerCase().includes(q) ||
      op.branch.toLowerCase().includes(q) ||
      op.pol.toLowerCase().includes(q) ||
      op.pod.toLowerCase().includes(q) ||
      op.customer.toLowerCase().includes(q) ||
      op.carrier.toLowerCase().includes(q) ||
      op.shipper.toLowerCase().includes(q) ||
      op.consignee.toLowerCase().includes(q);
    return matchDoc && matchCustomer && matchStatus && matchFrom && matchTo && matchSearch;
  });

  const fullyFiltered = applyColumnFilter(filtered, activeFilter);

  const resetFilters = () => { setFromDate(''); setToDate(''); setDocFilter(''); setCustomerFilter(''); setStatusFilter(''); setSearchTerm(''); setActiveFilter(null); setPage(1); };

  const effectivePageSize = pageSize === 0 ? fullyFiltered.length || 1 : pageSize;
  const totalPages = Math.max(1, Math.ceil(fullyFiltered.length / effectivePageSize));
  const paginated  = fullyFiltered.slice((page - 1) * effectivePageSize, page * effectivePageSize);

  const handleSearch = (v: string) => { setSearchTerm(v); setPage(1); };

  const StatusBadge = ({ op }: { op: Operation }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${op.statusColor} ${op.statusBgColor} hover:opacity-80 transition-opacity`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {op.status}
          <ChevronDown className="w-3 h-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {statusOptions.map(opt => (
          <DropdownMenuItem key={opt.label} onClick={() => handleStatusChange(op.id, opt.label, opt.color, opt.bgColor)}>
            <span className={`inline-flex items-center gap-1.5 ${opt.color}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {opt.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Operations</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track your logistics operations</p>
        </div>
        <Button className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black"
          onClick={() => navigate('/operations/new')}>
          <Plus className="w-4 h-4" /> New Operation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-card rounded-xl p-5 material-elevation-1 hover:material-elevation-2 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className={`${s.bg} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${s.iconColor}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 tracking-wide">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="material-card material-elevation-1 p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
          {/* From Date */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">From Date</label>
            <input type="date" value={fromDate} onChange={e => { setFromDate(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background" />
          </div>
          {/* To Date */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">To Date</label>
            <input type="date" value={toDate} onChange={e => { setToDate(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background" />
          </div>
          {/* Document */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Document</label>
            <select value={docFilter} onChange={e => { setDocFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background">
              <option value="">All</option>
              {DOC_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          {/* Customer */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Customer</label>
            <select value={customerFilter} onChange={e => { setCustomerFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background">
              <option value="">All</option>
              {customerList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {/* Job Status */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Job Status</label>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background">
              <option value="">All</option>
              {STATUS_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          {/* Actions + Reset */}
          <div className="flex items-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 px-4 h-[38px] rounded-lg">
                  Actions <ChevronDown className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem className="gap-2"><Columns3 className="w-4 h-4" /> Columns</DropdownMenuItem>
                <DropdownMenuItem className="gap-2" onClick={() => setFilterOpen(true)}><Filter className="w-4 h-4" /> Filter</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-2"><Database className="w-4 h-4" /> Data</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem className="gap-2"><ArrowUpDown className="w-4 h-4" /> Sort</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2"><Sigma className="w-4 h-4" /> Aggregate</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2"><Calculator className="w-4 h-4" /> Compute</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2"><History className="w-4 h-4" /> Flashback</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-2"><Palette className="w-4 h-4" /> Format</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem className="gap-2"><SplitSquareVertical className="w-4 h-4" /> Control Break</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2"><Highlighter className="w-4 h-4" /> Highlight</DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="gap-2"><LayoutList className="w-4 h-4" /> Rows Per Page</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {[1, 5, 10, 15, 20, 25, 50, 100, 1000].map(n => (
                          <DropdownMenuItem key={n} className="gap-2 justify-between"
                            onClick={() => { setPageSize(n); setPage(1); }}>
                            {n}
                            {pageSize === n && <span className="w-2 h-2 rounded-full bg-primary" />}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem className="gap-2 justify-between"
                          onClick={() => { setPageSize(0); setPage(1); }}>
                          All
                          {pageSize === 0 && <span className="w-2 h-2 rounded-full bg-primary" />}
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem className="gap-2"><BarChart2 className="w-4 h-4" /> Chart</DropdownMenuItem>
                <DropdownMenuItem className="gap-2"><Rows3 className="w-4 h-4" /> Group By</DropdownMenuItem>
                <DropdownMenuItem className="gap-2"><TableProperties className="w-4 h-4" /> Pivot</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-2"><BookOpen className="w-4 h-4" /> Report</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem className="gap-2"><FileText className="w-4 h-4" /> Summary</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2"><FileBarChart className="w-4 h-4" /> Detailed</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2"><FilePieChart className="w-4 h-4" /> Analytics</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem className="gap-2"><Download className="w-4 h-4" /> Download</DropdownMenuItem>
                <DropdownMenuItem className="gap-2"><Mail className="w-4 h-4" /> Subscription</DropdownMenuItem>
                <DropdownMenuItem className="gap-2"><HelpCircle className="w-4 h-4" /> Help</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button onClick={resetFilters} title="Reset filters"
              className="px-3 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors h-[38px]">
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="material-card material-elevation-1 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search by customer, carrier, POL, POD..."
              value={searchTerm} onChange={e => handleSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-input rounded-xl text-sm bg-background" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 rounded-xl px-4">
              <span className="text-base">↕</span> Sort
            </Button>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground border border-input rounded-xl px-3 py-1.5">
              Rows
              <select value={pageSize === 0 ? 'All' : pageSize}
                onChange={e => { setPageSize(e.target.value === 'All' ? 0 : Number(e.target.value)); setPage(1); }}
                className="bg-transparent font-semibold text-foreground outline-none cursor-pointer">
                {[1,5,10,15,20,25,50,100,1000].map(n => <option key={n} value={n}>{n}</option>)}
                <option value="All">All</option>
              </select>
            </span>
            <div className="flex bg-muted rounded-xl p-1">
              <button onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-background'}`}>
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-background'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <div className="col-span-3 p-8 text-center text-muted-foreground text-sm">Loading...</div>
          ) : paginated.length === 0 ? (
            <div className="col-span-3 p-8 text-center text-muted-foreground text-sm">No operations found.</div>
          ) : paginated.map(op => (
            <div key={op.id} className="material-card p-6 cursor-pointer">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-foreground text-base truncate">{op.customer || '—'}</h3>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">{op.branch}</span>
                </div>
                <p className="text-sm text-muted-foreground">{op.pol} → {op.pod}</p>
              </div>
              <div className="space-y-1.5 mb-4 text-sm">
                {[
                  ['Document',  op.document],
                  ['Freight',   op.freight_pp_cc],
                  ['POL ETD',   fmt(op.pol_etd)],
                  ['POD ETA',   fmt(op.pod_eta)],
                  ['Carrier',   op.carrier   || '—'],
                  ['Service',   op.service_type || '—'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{k}:</span>
                    <span className="font-medium truncate ml-2 max-w-[60%] text-right">{v}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${op.statusColor} ${op.statusBgColor}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {op.statusLabel}
                </span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" onClick={() => handleView(op)}>
                    <Eye className="w-4 h-4 text-blue-500" />
                  </button>
                  <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" onClick={() => navigate(`/operations/edit/${op.id}`)}>
                    <Pencil className="w-4 h-4 text-green-500" />
                  </button>
                  <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" onClick={() => setDeleteId(op.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="material-card material-elevation-1">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  {['DOCUMENT','DATE','STATUS','PP/CC','CUSTOMER','PLACE OF RECEIPT','POL','POD',
                    'PLACE OF DELIVERY','ETD','ETA','SERVICE TYPE',
                    'NOTE','ACTIONS'].map(h => (
                    <th key={h} className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={14} className="p-8 text-center text-muted-foreground text-sm">Loading...</td></tr>
                ) : paginated.map(op => (
                  <tr key={op.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-foreground whitespace-nowrap">{op.document || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{fmt(op.job_date)}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${op.statusColor} ${op.statusBgColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {op.statusLabel}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.freight_pp_cc || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap max-w-[140px] truncate">{op.customer || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.place_of_receipt || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.pol || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.pod || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.place_of_delivery || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{fmt(op.pol_etd)}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{fmt(op.pod_eta)}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.service_type || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground max-w-[120px] truncate">{op.note || '—'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="View" onClick={() => handleView(op)}>
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Edit" onClick={() => navigate(`/operations/edit/${op.id}`)}>
                          <Pencil className="w-4 h-4 text-green-500" />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Delete" onClick={() => setDeleteId(op.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && paginated.length === 0 && (
                  <tr>
                    <td colSpan={14} className="p-8 text-center text-muted-foreground text-sm">No operations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {fullyFiltered.length === 0 ? 0 : (page - 1) * effectivePageSize + 1}–{Math.min(page * effectivePageSize, fullyFiltered.length)} of {fullyFiltered.length} records
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    n === page ? 'bg-primary text-black' : 'hover:bg-muted text-muted-foreground'
                  }`}>
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Dialog */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <DialogHeader className="bg-[#00BCD4] px-6 py-4 flex flex-row items-center justify-between">
            <DialogTitle className="text-white text-lg font-semibold">Filter</DialogTitle>
            <div className="w-8 h-8 rounded-full bg-white" />
          </DialogHeader>
          <div className="p-6 space-y-6">
            {/* Filter Type */}
            <div className="flex items-center gap-6">
              <span className="text-sm font-semibold w-24">Filter Type</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="filterType" checked={filterType === 'column'}
                  onChange={() => setFilterType('column')}
                  className="accent-[#00BCD4]" />
                <span className="text-sm">Column</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="filterType" checked={filterType === 'row'}
                  onChange={() => setFilterType('row')}
                  className="accent-[#00BCD4]" />
                <span className="text-sm">Row</span>
              </label>
            </div>

            {/* Column / Operator / Expression */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Column</label>
                <select value={filterCol} onChange={e => setFilterCol(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background">
                  {FILTER_COLUMNS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Operator</label>
                <select value={filterOp} onChange={e => setFilterOp(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background">
                  {OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Expression</label>
                <div className="relative">
                  <input value={filterExpr} onChange={e => setFilterExpr(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { setActiveFilter({ col: filterCol, op: filterOp, expr: filterExpr }); setPage(1); setFilterOpen(false); } }}
                    className="w-full px-3 py-2 pr-8 border border-input rounded-lg text-sm bg-background" />
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
            <Button variant="outline" onClick={() => { setFilterOpen(false); setFilterExpr(''); setActiveFilter(null); setPage(1); }}>Cancel</Button>
            <Button className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white" onClick={() => { setActiveFilter({ col: filterCol, op: filterOp, expr: filterExpr }); setPage(1); setFilterOpen(false); }}>Apply</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={open => { if (!open) setDeleteId(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Operation</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this operation? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDeleteConfirm}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Operation Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-primary mb-3 pb-1 border-b border-border">Job Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    ['DOCUMENT',          selected.document],
                    ['DATE',              fmt(selected.job_date)],
                    ['PP/CC',             selected.freight_pp_cc],
                    ['PLACE OF RECEIPT',  selected.place_of_receipt  || '—'],
                    ['PLACE OF DELIVERY', selected.place_of_delivery || '—'],
                    ['POL',               selected.pol               || '—'],
                    ['POD',               selected.pod               || '—'],
                    ['ETD',               fmt(selected.pol_etd)],
                    ['ETA',               fmt(selected.pod_eta)],
                    ['FLIGHT NAME',       selected.flight_name       || '—'],
                    ['FLIGHT NUMBER',     selected.flight_number     || '—'],
                    ['SERVICE TYPE',      selected.service_type      || '—'],
                    ['BRANCH',            selected.branch            || '—'],
                    ['CUSTOMER BRANCH',   selected.customer_branch   || '—'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
                      <p className="text-sm font-medium mt-1">{value}</p>
                    </div>
                  ))}
                  <div className="col-span-3">
                    <label className="text-xs font-semibold text-muted-foreground">NOTES</label>
                    <p className="text-sm font-medium mt-1 whitespace-pre-line">{selected.note || '—'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-primary mb-3 pb-1 border-b border-border">Parties</h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    ['CUSTOMER',          selected.customer,  selected.customer_address],
                    ['SHIPPER',           selected.shipper,   selected.shipper_address],
                    ['CARRIER / AIRLINE', selected.carrier,   selected.carrier_address],
                    ['CONSIGNEE',         selected.consignee, selected.consignee_address],
                  ].map(([label, name, addr]) => (
                    <div key={label}>
                      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
                      <p className="text-sm font-medium mt-1">{name || '—'}</p>
                      {addr && <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{addr}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">STATUS</label>
                <p className="mt-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${selected.statusColor} ${selected.statusBgColor}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {selected.statusLabel}
                  </span>
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Operations;
