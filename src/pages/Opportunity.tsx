import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Grid3x3, List, ArrowUpDown, DollarSign, Calendar, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const opportunities = [
  { id: 1, name: 'Global Shipping Contract', account: 'Acme Corp', stage: 'Proposal', amount: '$250,000', closeDate: '2024-12-30', probability: '75%', owner: 'Sarah Johnson' },
  { id: 2, name: 'Freight Services Deal', account: 'BlueLine Ltd', stage: 'Negotiation', amount: '$180,000', closeDate: '2024-12-25', probability: '60%', owner: 'Mike Chen' },
  { id: 3, name: 'Logistics Partnership', account: 'Pacific Freight', stage: 'Qualification', amount: '$320,000', closeDate: '2025-01-15', probability: '40%', owner: 'Lisa Wang' },
];

const Opportunity = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const stats = [
    { label: 'TOTAL OPPORTUNITIES', value: '3', icon: Target, iconColor: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'TOTAL VALUE', value: '$750K', icon: DollarSign, iconColor: 'text-green-500', bg: 'bg-green-50' },
    { label: 'AVG PROBABILITY', value: '58%', icon: TrendingUp, iconColor: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'CLOSING THIS MONTH', value: '2', icon: Calendar, iconColor: 'text-cyan-500', bg: 'bg-cyan-50' },
  ];

  const filters = [
    { label: 'All', count: 3 },
    { label: 'Qualification', count: 1 },
    { label: 'Proposal', count: 1 },
    { label: 'Negotiation', count: 1 },
  ];

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesFilter = activeFilter === 'All' || opp.stage === activeFilter;
    const matchesSearch = opp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         opp.account.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Opportunities</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track your sales opportunities</p>
        </div>
        <Button className="gap-2 material-button material-elevation-2 hover:material-elevation-3" onClick={() => navigate('/sales/opportunity/new')}>
          <Plus className="w-4 h-4" />
          New Opportunity
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
              placeholder="Search by name or account..."
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
          filteredOpportunities.map((opp) => (
            <div key={opp.id} className="material-card p-6 cursor-pointer">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground text-lg mb-1">{opp.name}</h3>
                <p className="text-sm text-muted-foreground">{opp.account}</p>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold text-foreground">{opp.amount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Close Date:</span>
                  <span className="font-medium">{opp.closeDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Probability:</span>
                  <span className="font-medium">{opp.probability}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="font-medium">{opp.owner}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-500 bg-blue-500/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {opp.stage}
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
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">NAME</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">ACCOUNT</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">STAGE</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">AMOUNT</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">CLOSE DATE</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">PROBABILITY</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">OWNER</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOpportunities.map((opp) => (
                    <tr key={opp.id} className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer">
                      <td className="p-4 font-medium text-foreground">{opp.name}</td>
                      <td className="p-4 text-muted-foreground">{opp.account}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-500 bg-blue-500/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {opp.stage}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-foreground">{opp.amount}</td>
                      <td className="p-4 text-muted-foreground">{opp.closeDate}</td>
                      <td className="p-4 text-muted-foreground">{opp.probability}</td>
                      <td className="p-4 text-muted-foreground">{opp.owner}</td>
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

export default Opportunity;
