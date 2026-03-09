import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Grid3x3, List, ArrowUpDown, FileText, Calendar, DollarSign, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const quotes = [
  { id: 1, quotationNumber: 'QT-2024-001', customer: 'Acme Corp', date: '2024-03-09', expiryDate: '2024-04-08', amount: '$45,000', status: 'Draft', statusColor: 'text-gray-500' },
  { id: 2, quotationNumber: 'QT-2024-002', customer: 'BlueLine Ltd', date: '2024-03-08', expiryDate: '2024-04-07', amount: '$82,000', status: 'Sent', statusColor: 'text-blue-500' },
  { id: 3, quotationNumber: 'QT-2024-003', customer: 'Pacific Freight', date: '2024-03-07', expiryDate: '2024-04-06', amount: '$120,000', status: 'Approved', statusColor: 'text-green-500' },
];

const Quotes = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { label: 'TOTAL QUOTES', value: '3', icon: FileText, iconColor: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'TOTAL VALUE', value: '$247K', icon: DollarSign, iconColor: 'text-green-500', bg: 'bg-green-50' },
    { label: 'PENDING', value: '1', icon: Calendar, iconColor: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'APPROVED', value: '1', icon: User, iconColor: 'text-cyan-500', bg: 'bg-cyan-50' },
  ];

  const filteredQuotes = quotes.filter(quote => 
    quote.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Quotes</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track your quotations</p>
        </div>
        <Button className="gap-2 material-button material-elevation-2 hover:material-elevation-3" onClick={() => navigate('/sales/quotes/new')}>
          <Plus className="w-4 h-4" />
          New Quote
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
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by quotation number or customer..."
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

      <div className="material-card material-elevation-1">
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">QUOTATION NUMBER</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">CUSTOMER</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">DATE</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">EXPIRY DATE</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">AMOUNT</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer">
                    <td className="p-4 font-medium text-foreground">{quote.quotationNumber}</td>
                    <td className="p-4 text-muted-foreground">{quote.customer}</td>
                    <td className="p-4 text-muted-foreground">{quote.date}</td>
                    <td className="p-4 text-muted-foreground">{quote.expiryDate}</td>
                    <td className="p-4 font-semibold text-foreground">{quote.amount}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${quote.statusColor} bg-current/10`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {quote.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredQuotes.map((quote) => (
              <div key={quote.id} className="bg-card rounded-xl p-5 border border-border hover:material-elevation-2 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Quotation Number</p>
                    <p className="font-semibold text-foreground">{quote.quotationNumber}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${quote.statusColor} bg-current/10`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {quote.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="text-sm font-medium">{quote.customer}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm">{quote.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Expiry</p>
                      <p className="text-sm">{quote.expiryDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-lg font-bold text-foreground">{quote.amount}</p>
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

export default Quotes;
