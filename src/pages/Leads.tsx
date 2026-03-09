import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Grid3x3, List, ArrowUpDown, Mail, Phone, MapPin, DollarSign, Clock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const leads = [
  { id: 1, customer: 'Acme Corporation', target: 'John Smith', source: 'Website', date: '12/08/2024', owner: 'Sarah Johnson', company: 'Relay Logistics', team: 'Sales Team A', status: 'Unqualified', statusColor: 'text-gray-500' },
  { id: 2, customer: 'Global Shipping Ltd', target: 'Emily Davis', source: 'Referral', date: '12/07/2024', owner: 'Mike Chen', company: 'Relay Logistics', team: 'Sales Team B', status: 'Qualified', statusColor: 'text-green-500' },
  { id: 3, customer: 'Pacific Freight Co', target: 'Robert Wilson', source: 'Cold Call', date: '12/06/2024', owner: 'Lisa Wang', company: 'Relay Logistics', team: 'Sales Team A', status: 'Open', statusColor: 'text-blue-500' },
];

const Leads = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const stats = [
    { label: 'TOTAL LEADS', value: '3', icon: Building2, iconColor: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'QUALIFIED', value: '1', icon: DollarSign, iconColor: 'text-green-500', bg: 'bg-green-50' },
    { label: 'OPEN', value: '1', icon: Clock, iconColor: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'UNQUALIFIED', value: '1', icon: MapPin, iconColor: 'text-gray-500', bg: 'bg-gray-50' },
  ];

  const filters = [
    { label: 'All', count: 3 },
    { label: 'Qualified', count: 1 },
    { label: 'Open', count: 1 },
    { label: 'Unqualified', count: 1 },
  ];

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = activeFilter === 'All' || lead.status === activeFilter;
    const matchesSearch = lead.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         lead.target.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Leads</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track your leads</p>
        </div>
        <Button className="gap-2 material-button material-elevation-2 hover:material-elevation-3" onClick={() => navigate('/sales/leads/new')}>
          <Plus className="w-4 h-4" />
          New Lead
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
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFilter(filter.label)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === filter.label
                  ? 'bg-primary text-white material-elevation-2 scale-105'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105'
              }`}
            >
              {filter.label} <span className="ml-1.5 opacity-80">{filter.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="material-card material-elevation-1 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by customer or target..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 material-input text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {viewMode === 'grid' ? (
          filteredLeads.map((lead) => (
            <div key={lead.id} className="material-card p-6 cursor-pointer">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground text-lg mb-1">{lead.customer}</h3>
                <p className="text-sm text-muted-foreground">{lead.target}</p>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Source:</span>
                  <span className="font-medium">{lead.source}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{lead.date}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="font-medium">{lead.owner}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Team:</span>
                  <span className="font-medium">{lead.team}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${lead.statusColor} bg-current/10`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {lead.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full material-card material-elevation-1">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">CUSTOMER</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">TARGET</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">LEAD SOURCE</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">DATE</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">LEAD OWNER</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">COMPANY</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">SALES TEAM</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer">
                      <td className="p-4 font-medium text-foreground">{lead.customer}</td>
                      <td className="p-4 text-muted-foreground">{lead.target}</td>
                      <td className="p-4 text-muted-foreground">{lead.source}</td>
                      <td className="p-4 text-muted-foreground">{lead.date}</td>
                      <td className="p-4 text-muted-foreground">{lead.owner}</td>
                      <td className="p-4 text-muted-foreground">{lead.company}</td>
                      <td className="p-4 text-muted-foreground">{lead.team}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${lead.statusColor} bg-current/10`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;
