import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Grid3x3, List, ArrowUpDown, Mail, Phone, MapPin, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const prospects = [
  { id: 1, company: 'Atlas Freight Inc.', contact: 'John Miller', email: 'john@atlasfreight.com', phone: '+1 555-0101', location: 'New York, NY', score: 72, scoreColor: 'bg-orange-500', status: 'New', statusColor: 'text-blue-500', value: '$45,000', time: '2 days ago', avatar: 'AF', avatarBg: 'bg-blue-100', avatarText: 'text-blue-600' },
  { id: 2, company: 'BlueLine Shipping', contact: 'Sarah Chen', email: 'sarah@blueline.com', phone: '+1 555-0102', location: 'Los Angeles, CA', score: 85, scoreColor: 'bg-green-500', status: 'Contacted', statusColor: 'text-orange-500', value: '$82,000', time: '3 days ago', avatar: 'BL', avatarBg: 'bg-orange-100', avatarText: 'text-orange-600' },
  { id: 3, company: 'CargoMax Solutions', contact: 'David Park', email: 'david@cargomax.com', phone: '+1 555-0103', location: 'Chicago, IL', score: 91, scoreColor: 'bg-green-500', status: 'Qualified', statusColor: 'text-green-500', value: '$120,000', time: '1 week ago', avatar: 'CM', avatarBg: 'bg-green-100', avatarText: 'text-green-600' },
  { id: 4, company: 'Express Haulers', contact: 'Maria Garcia', email: 'maria@expresshaulers.com', phone: '+1 555-0104', location: 'Houston, TX', score: 68, scoreColor: 'bg-orange-500', status: 'Proposal', statusColor: 'text-cyan-500', value: '$67,000', time: '1 week ago', avatar: 'EH', avatarBg: 'bg-cyan-100', avatarText: 'text-cyan-600' },
  { id: 5, company: 'FastTrack Logistics', contact: 'James Wilson', email: 'james@fasttrack.com', phone: '+1 555-0105', location: 'Seattle, WA', score: 54, scoreColor: 'bg-gray-400', status: 'New', statusColor: 'text-blue-500', value: '$33,000', time: '3 days ago', avatar: 'FT', avatarBg: 'bg-blue-100', avatarText: 'text-blue-600' },
  { id: 6, company: 'Harbor Transport', contact: 'Lisa Wang', email: 'lisa@harbor.com', phone: '+1 555-0106', location: 'Miami, FL', score: 88, scoreColor: 'bg-green-500', status: 'Qualified', statusColor: 'text-green-500', value: '$95,000', time: '5 days ago', avatar: 'HT', avatarBg: 'bg-green-100', avatarText: 'text-green-600' },
];

const Prospect = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const stats = [
    { label: 'TOTAL PROSPECTS', value: '6', icon: '👥', bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'PIPELINE VALUE', value: '$442K', icon: '💵', bg: 'bg-green-50', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { label: 'QUALIFIED', value: '2', icon: '⭐', bg: 'bg-yellow-50', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { label: 'AVG SCORE', value: '76', icon: '📈', bg: 'bg-cyan-50', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-600' },
  ];

  const filters = [
    { label: 'All', count: 5 },
    { label: 'New', count: 2 },
    { label: 'Contacted', count: 1 },
    { label: 'Qualified', count: 2 },
    { label: 'Proposal', count: 1 },
  ];

  const filteredProspects = prospects.filter(prospect => {
    const matchesFilter = activeFilter === 'All' || prospect.status === activeFilter;
    const matchesSearch = prospect.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         prospect.contact.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Prospects</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track your sales pipeline</p>
        </div>
        <Button className="gap-2 material-button material-elevation-2 hover:material-elevation-3" onClick={() => navigate('/sales/prospect/new')}>
          <Plus className="w-4 h-4" />
          Add Prospect
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.bg} rounded-2xl p-6 material-elevation-1 hover:material-elevation-2 transition-all duration-300`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 tracking-wide">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`${stat.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl material-elevation-1`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
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
              placeholder="Search by company or contact..."
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
          filteredProspects.map((prospect) => (
            <div key={prospect.id} className="material-card p-6 cursor-pointer">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`${prospect.avatarBg} w-14 h-14 rounded-2xl flex items-center justify-center ${prospect.avatarText} font-bold text-base material-elevation-1`}>
                    {prospect.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base">{prospect.company}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{prospect.contact}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{prospect.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{prospect.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{prospect.location}</span>
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-2">
                  <span className="tracking-wide">LEAD SCORE</span>
                  <span className="text-foreground text-sm">{prospect.score}%</span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${prospect.scoreColor} transition-all duration-500 rounded-full`} 
                    style={{ width: `${prospect.score}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-border/50">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${prospect.statusColor} bg-current/10`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {prospect.status}
                </span>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  {prospect.value}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-4">
                <Clock className="w-3.5 h-3.5" />
                <span>Added {prospect.time}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full space-y-3">
            {filteredProspects.map((prospect) => (
              <div key={prospect.id} className="material-card p-5 cursor-pointer flex items-center gap-6">
                <div className={`${prospect.avatarBg} w-12 h-12 rounded-2xl flex items-center justify-center ${prospect.avatarText} font-bold text-sm material-elevation-1 flex-shrink-0`}>
                  {prospect.avatar}
                </div>
                <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                  <div>
                    <h3 className="font-semibold text-foreground">{prospect.company}</h3>
                    <p className="text-sm text-muted-foreground">{prospect.contact}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{prospect.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{prospect.phone}</span>
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${prospect.statusColor} bg-current/10`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {prospect.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-4">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">Score</div>
                      <div className="font-semibold">{prospect.score}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">Value</div>
                      <div className="font-semibold">{prospect.value}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Prospect;
