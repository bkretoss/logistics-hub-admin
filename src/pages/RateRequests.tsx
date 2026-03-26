import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Grid3x3, List, ArrowUpDown, FileText, Calendar, DollarSign, User, ChevronDown, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getOpportunitiesApi, deleteOpportunityApi } from '@/services/api';

interface RateRequest {
  id: number;
  date: string;
  location: string;
  lead: string;
  sales_team: string;
  opportunity_source: string;
  opportunity_type: string;
  type: string;
  sales_agent: string;
  company: string;
  pricing_team: string;
  shipping_providers: string;
  status: string;
  shipment_details?: {
    transport_mode: string;
    shipment_type: string;
    origin_country: string;
    destination_country: string;
    estimated_shipment_date: string;
  };
  party_details?: {
    customer: string;
    email: string;
  };
  vendor_rates?: Array<{ vendor_agent: string; rate_total: number; currency: string }>;
}

const RateRequests = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [rateRequests, setRateRequests] = useState<RateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchRateRequests();
  }, []);

  const fetchRateRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getOpportunitiesApi();
      const raw = res.data;
      const list = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : Array.isArray(raw?.data?.data) ? raw.data.data : [];
      setRateRequests(list);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Failed to load rate requests.';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this rate request?')) return;
    setDeleting(id);
    try {
      await deleteOpportunityApi(id);
      setRateRequests(prev => prev.filter(r => r.id !== id));
      toast({ title: 'Success', description: 'Rate request deleted successfully', variant: 'success' });
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Failed to delete rate request.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setDeleting(null);
    }
  };

  const statusOptions = [
    { label: 'Pending', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    { label: 'Approved', color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { label: 'Rejected', color: 'text-red-500', bgColor: 'bg-red-500/10' },
  ];

  const getStatusColor = (status: string) => {
    const opt = statusOptions.find(s => s.label === status);
    return opt || { color: 'text-gray-500', bgColor: 'bg-gray-500/10' };
  };

  const stats = [
    { label: 'TOTAL REQUESTS', value: rateRequests.length.toString(), icon: FileText, iconColor: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'TOTAL VALUE', value: `₹${rateRequests.reduce((sum, r) => sum + (r.vendor_rates?.[0]?.rate_total ?? 0), 0).toFixed(2)}`, icon: DollarSign, iconColor: 'text-green-500', bg: 'bg-green-50' },
    { label: 'PENDING', value: rateRequests.filter(r => r.status === 'Pending').length.toString(), icon: Calendar, iconColor: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'APPROVED', value: rateRequests.filter(r => r.status === 'Approved').length.toString(), icon: User, iconColor: 'text-cyan-500', bg: 'bg-cyan-50' },
  ];

  const filters = [
    { label: 'All', count: rateRequests.length },
    { label: 'Pending', count: rateRequests.filter(r => r.status === 'Pending').length },
    { label: 'Approved', count: rateRequests.filter(r => r.status === 'Approved').length },
    { label: 'Rejected', count: rateRequests.filter(r => r.status === 'Rejected').length },
  ];

  const filteredRequests = rateRequests.filter(request => {
    const matchesFilter = activeFilter === 'All' || request.status === activeFilter;
    const matchesSearch =
      request.lead.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.party_details?.customer ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.sales_agent.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Rate Requests</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage and track your rate requests</p>
          </div>
          <Button className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black" onClick={() => navigate('/sales/rate-requests/new')}>
            <Plus className="w-4 h-4" />
            New Rate Request
          </Button>
        </div>
        <div className="text-center py-12 text-muted-foreground">Loading rate requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Rate Requests</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track your rate requests</p>
        </div>
        <Button className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black" onClick={() => navigate('/sales/rate-requests/new')}>
          <Plus className="w-4 h-4" />
          New Rate Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} className="bg-card rounded-xl p-5 material-elevation-1 hover:material-elevation-2 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className={`${stat.bg} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1 tracking-wide">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="material-card material-elevation-1 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFilter(filter.label)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter.label
                    ? 'bg-primary text-black material-elevation-2 scale-105'
                    : 'bg-muted text-black hover:bg-muted/80 hover:scale-105'
                }`}
              >
                {filter.label} <span className="ml-1.5 opacity-80">{filter.count}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by lead, customer, or agent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 pl-12 pr-4 py-3 material-input text-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2 material-button">
              <ArrowUpDown className="w-4 h-4" />
              Sort
            </Button>
            <div className="flex bg-muted rounded-xl p-1 material-elevation-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' ? 'bg-primary text-white material-elevation-2' : 'hover:bg-background'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' ? 'bg-primary text-white material-elevation-2' : 'hover:bg-background'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="material-card material-elevation-1 p-4 bg-red-50 border border-red-200">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="material-card material-elevation-1">
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">LEAD</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">CUSTOMER</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">DATE</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">AGENT</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">STATUS</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-muted-foreground">
                      No rate requests found
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => {
                    const statusColor = getStatusColor(request.status);
                    return (
                      <tr key={request.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-medium text-foreground">{request.lead}</td>
                        <td className="p-4 text-muted-foreground">{request.party_details?.customer || 'N/A'}</td>
                        <td className="p-4 text-muted-foreground">{request.date}</td>
                        <td className="p-4 text-muted-foreground">{request.sales_agent}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusColor.color} ${statusColor.bgColor}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {request.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                              title="View"
                              onClick={() => navigate(`/sales/rate-requests/view/${request.id}`)}
                            >
                              <Eye className="w-4 h-4 text-blue-500" />
                            </button>
                            <button
                              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                              title="Edit"
                              onClick={() => navigate(`/sales/rate-requests/edit/${request.id}`)}
                            >
                              <Edit className="w-4 h-4 text-green-500" />
                            </button>
                            <button
                              className="p-1.5 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                              disabled={deleting === request.id}
                              onClick={() => handleDelete(request.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredRequests.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">No rate requests found</div>
            ) : (
              filteredRequests.map((request) => {
                const statusColor = getStatusColor(request.status);
                return (
                  <div key={request.id} className="bg-card rounded-xl p-5 border border-border hover:material-elevation-2 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Lead</p>
                        <p className="font-semibold text-foreground">{request.lead}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor.color} ${statusColor.bgColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {request.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Customer</p>
                        <p className="text-sm font-medium">{request.party_details?.customer || 'N/A'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="text-sm">{request.date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Agent</p>
                          <p className="text-sm">{request.sales_agent}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => navigate(`/sales/rate-requests/view/${request.id}`)} className="flex-1 p-2 text-blue-500 hover:bg-blue-50 rounded text-sm">View</button>
                      <button onClick={() => navigate(`/sales/rate-requests/edit/${request.id}`)} className="flex-1 p-2 text-green-500 hover:bg-green-50 rounded text-sm">Edit</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RateRequests;
