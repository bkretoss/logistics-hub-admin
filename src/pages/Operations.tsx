import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Grid3x3, List,
  Truck, Clock, CheckCircle, AlertCircle, RotateCcw,
  ChevronDown, Eye, Trash2, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useOperations, type Operation } from './OperationsContext';

const PAGE_SIZE = 10;

const statusOptions = [
  { label: 'Created',   color: 'text-blue-500',   bgColor: 'bg-blue-500/10'   },
  { label: 'Process',   color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  { label: 'Closed',    color: 'text-green-500',  bgColor: 'bg-green-500/10'  },
  { label: 'Cancelled', color: 'text-red-500',    bgColor: 'bg-red-500/10'    },
  { label: 'Reopened',  color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
];

const fmt = (d: string) => {
  if (!d) return '—';
  if (d.includes('-')) {
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  }
  return d;
};

const Operations = () => {
  const navigate = useNavigate();
  const { operations, updateOperation, deleteOperation } = useOperations();

  const [viewMode, setViewMode]         = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm]     = useState('');
  const [fromDate, setFromDate]         = useState('');
  const [toDate, setToDate]             = useState('');
  const [docFilter, setDocFilter]       = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage]                 = useState(1);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selected, setSelected]         = useState<Operation | null>(null);
  const [deleteId, setDeleteId]         = useState<number | null>(null);

  const handleView = (op: Operation) => { setSelected(op); setViewDialogOpen(true); };
  const handleDeleteConfirm = () => { if (deleteId !== null) { deleteOperation(deleteId); setDeleteId(null); } };

  const handleStatusChange = (id: number, label: string, color: string, bgColor: string) =>
    updateOperation(id, { status: label, statusColor: color, statusBgColor: bgColor });

  const stats = [
    { label: 'TOTAL',     value: operations.length,                                          icon: Truck,       iconColor: 'text-blue-500',   bg: 'bg-blue-50'   },
    { label: 'CREATED',   value: operations.filter(o => o.status === 'Created').length,    icon: AlertCircle, iconColor: 'text-blue-500',   bg: 'bg-blue-50'   },
    { label: 'PROCESS',   value: operations.filter(o => o.status === 'Process').length,    icon: Clock,       iconColor: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'CLOSED',    value: operations.filter(o => o.status === 'Closed').length,     icon: CheckCircle, iconColor: 'text-green-500',  bg: 'bg-green-50'  },
    { label: 'CANCELLED', value: operations.filter(o => o.status === 'Cancelled').length,  icon: Trash2,      iconColor: 'text-red-500',    bg: 'bg-red-50'    },
    { label: 'REOPENED',  value: operations.filter(o => o.status === 'Reopened').length,   icon: RotateCcw,   iconColor: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const DOC_TYPES     = ['Air Export','Air Import','FCL Export','FCL Import','Land Export','Land Import','LCL Export','LCL Import'];
  const STATUS_TYPES  = ['Created','Process','Closed','Cancelled','Reopened'];
  const customerList  = [...new Set(operations.map(o => o.customer).filter(Boolean))];

  const filtered = operations.filter(op => {
    const matchDoc      = !docFilter     || op.document === docFilter;
    const matchCustomer = !customerFilter || op.customer === customerFilter;
    const matchStatus   = !statusFilter  || op.status === statusFilter;
    const matchFrom     = !fromDate      || op.jobDate >= fromDate;
    const matchTo       = !toDate        || op.jobDate <= toDate;
    const q = searchTerm.toLowerCase();
    const matchSearch   = !q ||
      op.jobNo.toLowerCase().includes(q) ||
      op.branch.toLowerCase().includes(q) ||
      op.pol.toLowerCase().includes(q) ||
      op.pod.toLowerCase().includes(q) ||
      op.customer.toLowerCase().includes(q) ||
      op.carrier.toLowerCase().includes(q) ||
      op.blNo.toLowerCase().includes(q) ||
      op.mblNo.toLowerCase().includes(q) ||
      op.salesPerson.toLowerCase().includes(q);
    return matchDoc && matchCustomer && matchStatus && matchFrom && matchTo && matchSearch;
  });

  const resetFilters = () => { setFromDate(''); setToDate(''); setDocFilter(''); setCustomerFilter(''); setStatusFilter(''); setSearchTerm(''); setPage(1); };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
              {STATUS_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {/* Search + Reset */}
          <div className="flex gap-2">
            <button onClick={resetFilters} title="Reset filters"
              className="px-3 py-2 border border-input rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">
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
          {paginated.map(op => (
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
                  ['Document', op.document],
                  ['Freight', op.freightPpCc],
                  ['POL ETD', fmt(op.polEtd)],
                  ['POD ETA', fmt(op.podEta)],
                  ['Carrier', op.carrier || '—'],
                  ['Service', op.serviceType || '—'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{k}:</span>
                    <span className="font-medium truncate ml-2 max-w-[60%] text-right">{v}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <StatusBadge op={op} />
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" onClick={() => handleView(op)}>
                    <Eye className="w-4 h-4 text-blue-500" />
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
                  {['JOB No#','DATE','STATUS','PP/CC','CUSTOMER','PLACE OF RECEIPT','POL','POD','PLACE OF DELIVERY',
                    'ETD','ETA','VESSEL/FLIGHT NAME','VESSEL/FLIGHT NO','BL SERVICE TYPE','BL NO','MBL NO',
                    'SALES PERSON','SHIPPER','CONSIGNEE','CARRIER','DELIVERY AGENT NAME','NOTIFY1',
                    'DELIVERY AGENT','DELIVERY STATUS','DELIVERY DATE','NOTES','ACTIONS'].map(h => (
                    <th key={h} className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map(op => (
                  <tr key={op.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-foreground whitespace-nowrap">{op.jobNo || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{fmt(op.jobDate)}</td>
                    <td className="p-4 whitespace-nowrap"><StatusBadge op={op} /></td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.freightPpCc}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap max-w-[140px] truncate">{op.customer || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.placeOfReceipt || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.pol || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.pod || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.placeOfDelivery || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{fmt(op.polEtd)}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{fmt(op.podEta)}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.flightName || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.flightNumber || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.blServiceType || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.blNo || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.mblNo || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.salesPerson || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.shipper || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap max-w-[140px] truncate">{op.consignee || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap max-w-[140px] truncate">{op.carrier || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.deliveryAgentName || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.notify1 || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.deliveryAgent || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{op.deliveryStatus || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{fmt(op.deliveryDate)}</td>
                    <td className="p-4 text-sm text-muted-foreground max-w-[120px] truncate">{op.note || '—'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="View" onClick={() => handleView(op)}>
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Delete" onClick={() => setDeleteId(op.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={27} className="p-8 text-center text-muted-foreground text-sm">No operations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records
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
                <h3 className="text-sm font-bold text-primary mb-3 pb-1 border-b border-border">Job List Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    ['JOB No#', selected.jobNo || '—'],
                    ['DATE', fmt(selected.jobDate)],
                    ['PP/CC', selected.freightPpCc],
                    ['PLACE OF RECEIPT', selected.placeOfReceipt || '—'],
                    ['PLACE OF DELIVERY', selected.placeOfDelivery || '—'],
                    ['POL', selected.pol || '—'],
                    ['POD', selected.pod || '—'],
                    ['ETD', fmt(selected.polEtd)],
                    ['ETA', fmt(selected.podEta)],
                    ['VESSEL/FLIGHT NAME', selected.flightName || '—'],
                    ['VESSEL/FLIGHT NO', selected.flightNumber || '—'],
                    ['BL SERVICE TYPE', selected.blServiceType || '—'],
                    ['BL NO', selected.blNo || '—'],
                    ['MBL NO', selected.mblNo || '—'],
                    ['SALES PERSON', selected.salesPerson || '—'],
                    ['DELIVERY AGENT NAME', selected.deliveryAgentName || '—'],
                    ['NOTIFY1', selected.notify1 || '—'],
                    ['DELIVERY AGENT', selected.deliveryAgent || '—'],
                    ['DELIVERY STATUS', selected.deliveryStatus || '—'],
                    ['DELIVERY DATE', fmt(selected.deliveryDate)],
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
                    ['CUSTOMER', selected.customer, selected.customerAddress],
                    ['SHIPPER', selected.shipper, selected.shipperAddress],
                    ['CARRIER / AIRLINE', selected.carrier, selected.carrierAddress],
                    ['CONSIGNEE', selected.consignee, selected.consigneeAddress],
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
                    {selected.status}
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
