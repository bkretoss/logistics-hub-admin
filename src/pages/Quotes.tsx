import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Grid3x3, List, ArrowUpDown, FileText, Calendar, DollarSign, User, ChevronDown, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const quotes = [
  { 
    id: 1, 
    quotationNumber: 'QT-2024-001', 
    customer: 'Acme Corp', 
    date: '2024-03-09', 
    expiryDate: '2024-04-08', 
    amount: '$45,000', 
    status: 'Draft', 
    statusColor: 'text-gray-500', 
    statusBgColor: 'bg-gray-500/10',
    address: '123 Main St, New York, NY',
    quoteApprover: 'Approver 1',
    salesAgent: 'Agent 1',
    courierShipment: 'Disabled',
    company: 'Relay Logistics Private Limited',
    multiCarrier: 'Disabled',
    salesTeam: 'Team A',
    quoteFor: 'Shipment',
    shipmentCount: 'Single',
    transportMode: 'Sea',
    shipmentType: 'FCL',
    cargoType: 'General',
    shipper: 'Acme Corp',
    shipperAddress: '123 Main St, New York, NY',
    consignee: 'BlueLine Ltd',
    consigneeAddress: '456 Commerce Ave, Los Angeles, CA',
    serviceMode: 'Door to Door',
    referenceNumber: 'REF-001',
    estimatedPickup: '2024-03-15',
    expectedDelivery: '2024-04-15',
    originCountry: 'United States',
    destinationCountry: 'China',
    transitTime: '30 days',
    incoterms: 'FOB',
    additionalServices: 'Insurance',
    freeDay: '5',
    agent: 'Agent XYZ',
    agentAddress: '789 Agent St',
    coLoader: 'CoLoader ABC',
    coLoaderAddress: '321 CoLoader Ave',
    haz: 'No',
    goodsValue: '45000 INR',
    insuranceValue: '2000 INR',
    packs: '10 Pallets',
    volumetricWeight: '500 kg',
    grossWeight: '1000 kg',
    chargeable: '1000 kg',
    netWeight: '950 kg',
    volume: '50 m³',
  },
  { 
    id: 2, 
    quotationNumber: 'QT-2024-002', 
    customer: 'BlueLine Ltd', 
    date: '2024-03-08', 
    expiryDate: '2024-04-07', 
    amount: '$82,000', 
    status: 'Sent', 
    statusColor: 'text-blue-500', 
    statusBgColor: 'bg-blue-500/10',
    address: '456 Commerce Ave, Los Angeles, CA',
    quoteApprover: 'Approver 2',
    salesAgent: 'Agent 2',
    courierShipment: 'Enabled',
    company: 'Relay Logistics Private Limited',
    multiCarrier: 'Enabled',
    salesTeam: 'Team B',
    quoteFor: 'Service Job',
    shipmentCount: 'Multiple',
    transportMode: 'Air',
    shipmentType: 'Air Freight',
    cargoType: 'Hazardous',
    shipper: 'BlueLine Ltd',
    shipperAddress: '456 Commerce Ave, Los Angeles, CA',
    consignee: 'Pacific Freight',
    consigneeAddress: '789 Harbor Blvd, Seattle, WA',
    serviceMode: 'Port to Port',
    referenceNumber: 'REF-002',
    estimatedPickup: '2024-03-10',
    expectedDelivery: '2024-03-20',
    originCountry: 'United States',
    destinationCountry: 'India',
    transitTime: '10 days',
    incoterms: 'CIF',
    additionalServices: 'Customs Clearance',
    freeDay: '3',
    agent: 'Agent DEF',
    agentAddress: '456 Agent Rd',
    coLoader: 'CoLoader XYZ',
    coLoaderAddress: '654 CoLoader Blvd',
    haz: 'Yes',
    goodsValue: '82000 INR',
    insuranceValue: '4000 INR',
    packs: '20 Boxes',
    volumetricWeight: '800 kg',
    grossWeight: '1500 kg',
    chargeable: '1500 kg',
    netWeight: '1450 kg',
    volume: '75 m³',
  },
  { 
    id: 3, 
    quotationNumber: 'QT-2024-003', 
    customer: 'Pacific Freight', 
    date: '2024-03-07', 
    expiryDate: '2024-04-06', 
    amount: '$120,000', 
    status: 'Approved', 
    statusColor: 'text-green-500', 
    statusBgColor: 'bg-green-500/10',
    address: '789 Harbor Blvd, Seattle, WA',
    quoteApprover: 'Approver 1',
    salesAgent: 'Agent 1',
    courierShipment: 'Disabled',
    company: 'Relay Logistics Private Limited',
    multiCarrier: 'Disabled',
    salesTeam: 'Team A',
    quoteFor: 'Shipment',
    shipmentCount: 'Single',
    transportMode: 'Sea',
    shipmentType: 'LCL',
    cargoType: 'General',
    shipper: 'Pacific Freight',
    shipperAddress: '789 Harbor Blvd, Seattle, WA',
    consignee: 'Acme Corp',
    consigneeAddress: '123 Main St, New York, NY',
    serviceMode: 'Door to Port',
    referenceNumber: 'REF-003',
    estimatedPickup: '2024-03-12',
    expectedDelivery: '2024-05-12',
    originCountry: 'United States',
    destinationCountry: 'Japan',
    transitTime: '60 days',
    incoterms: 'EXW',
    additionalServices: 'Packaging',
    freeDay: '7',
    agent: 'Agent GHI',
    agentAddress: '123 Agent Ln',
    coLoader: 'CoLoader PQR',
    coLoaderAddress: '987 CoLoader St',
    haz: 'No',
    goodsValue: '120000 INR',
    insuranceValue: '6000 INR',
    packs: '30 Containers',
    volumetricWeight: '1200 kg',
    grossWeight: '2500 kg',
    chargeable: '2500 kg',
    netWeight: '2400 kg',
    volume: '120 m³',
  },
];

const Quotes = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [quotesList, setQuotesList] = useState(quotes);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<typeof quotes[0] | null>(null);

  const handleViewQuote = (quote: typeof quotes[0]) => {
    setSelectedQuote(quote);
    setViewDialogOpen(true);
  };

  const statusOptions = [
    { label: 'Draft', color: 'text-gray-500', bgColor: 'bg-gray-500/10' },
    { label: 'Sent', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Approved', color: 'text-green-500', bgColor: 'bg-green-500/10' },
  ];

  const handleStatusChange = (quoteId: number, newStatus: string, newColor: string, newBgColor: string) => {
    setQuotesList(quotesList.map(q => 
      q.id === quoteId 
        ? { ...q, status: newStatus, statusColor: newColor, statusBgColor: newBgColor }
        : q
    ));
  };

  const stats = [
    { label: 'TOTAL QUOTES', value: '3', icon: FileText, iconColor: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'TOTAL VALUE', value: '$247K', icon: DollarSign, iconColor: 'text-green-500', bg: 'bg-green-50' },
    { label: 'PENDING', value: '1', icon: Calendar, iconColor: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'APPROVED', value: '1', icon: User, iconColor: 'text-cyan-500', bg: 'bg-cyan-50' },
  ];

  const filters = [
    { label: 'All', count: 3 },
    { label: 'Draft', count: 1 },
    { label: 'Sent', count: 1 },
    { label: 'Approved', count: 1 },
  ];

  const filteredQuotes = quotesList.filter(quote => {
    const matchesFilter = activeFilter === 'All' || quote.status === activeFilter;
    const matchesSearch = 
      quote.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Quotes</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track your quotations</p>
        </div>
        <Button className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black" onClick={() => navigate('/sales/quotes/new')}>
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
                placeholder="Search by quotation number or customer..."
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
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">ACTIONS</th>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${quote.statusColor} ${quote.statusBgColor} hover:opacity-80 transition-opacity`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {quote.status}
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {statusOptions.map((option) => (
                            <DropdownMenuItem
                              key={option.label}
                              onClick={() => handleStatusChange(quote.id, option.label, option.color, option.bgColor)}
                            >
                              <span className={`inline-flex items-center gap-1.5 ${option.color}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                {option.label}
                              </span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-1.5 hover:bg-muted rounded-lg transition-colors" 
                          title="View"
                          onClick={() => handleViewQuote(quote)}
                        >
                          <Eye className="w-4 h-4 text-blue-500" />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4 text-green-500" />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${quote.statusColor} ${quote.statusBgColor} hover:opacity-80 transition-opacity`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {quote.status}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {statusOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.label}
                          onClick={() => handleStatusChange(quote.id, option.label, option.color, option.bgColor)}
                        >
                          <span className={`inline-flex items-center gap-1.5 ${option.color}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {option.label}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
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

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quote Details</DialogTitle>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-6">
              {/* Customer Section */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Customer</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">CUSTOMER</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.customer}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">DATE</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.date}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">ADDRESS</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.address}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">QUOTE EXPIRY DATE</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.expiryDate}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">QUOTE APPROVER</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.quoteApprover}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">SALES AGENT</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.salesAgent}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">COURIER SHIPMENT</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.courierShipment}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">COMPANY</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.company}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">MULTI CARRIER QUOTE</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.multiCarrier}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">SALES TEAM</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.salesTeam}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">QUOTE FOR</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.quoteFor}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">SHIPMENT COUNT</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.shipmentCount}</p>
                  </div>
                </div>
              </div>

              {/* Mode of Shipment */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Mode of Shipment</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">TRANSPORT MODE</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.transportMode}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">SHIPMENT TYPE</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.shipmentType}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">CARGO TYPE</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.cargoType}</p>
                  </div>
                </div>
              </div>

              {/* Shipper & Consignee */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Shipper & Consignee</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="mb-3">
                      <label className="text-xs font-semibold text-muted-foreground">SHIPPER</label>
                      <p className="text-sm font-medium mt-1">{selectedQuote.shipper}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">SHIPPER ADDRESS</label>
                      <p className="text-sm font-medium mt-1">{selectedQuote.shipperAddress}</p>
                    </div>
                  </div>
                  <div>
                    <div className="mb-3">
                      <label className="text-xs font-semibold text-muted-foreground">CONSIGNEE</label>
                      <p className="text-sm font-medium mt-1">{selectedQuote.consignee}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">CONSIGNEE ADDRESS</label>
                      <p className="text-sm font-medium mt-1">{selectedQuote.consigneeAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* General Information */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">General Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">SERVICE MODE</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.serviceMode}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">REFERENCE NUMBER</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.referenceNumber}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">ESTIMATED PICKUP</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.estimatedPickup}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">EXPECTED DELIVERY</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.expectedDelivery}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">ORIGIN COUNTRY</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.originCountry}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">DESTINATION COUNTRY</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.destinationCountry}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">TRANSIT TIME</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.transitTime}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">INCOTERMS</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.incoterms}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Additional Info</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">ADDITIONAL SERVICES</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.additionalServices}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">FREE DAY</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.freeDay}</p>
                  </div>
                </div>
              </div>

              {/* Agent & CoLoader */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Agent & CoLoader</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="mb-3">
                      <label className="text-xs font-semibold text-muted-foreground">AGENT</label>
                      <p className="text-sm font-medium mt-1">{selectedQuote.agent}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">AGENT ADDRESS</label>
                      <p className="text-sm font-medium mt-1">{selectedQuote.agentAddress}</p>
                    </div>
                  </div>
                  <div>
                    <div className="mb-3">
                      <label className="text-xs font-semibold text-muted-foreground">COLOADER</label>
                      <p className="text-sm font-medium mt-1">{selectedQuote.coLoader}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">COLOADER ADDRESS</label>
                      <p className="text-sm font-medium mt-1">{selectedQuote.coLoaderAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* HAZ Details */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">HAZ Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">HAZ</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.haz}</p>
                  </div>
                </div>
              </div>

              {/* Monetary Details */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Monetary Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">GOODS VALUE</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.goodsValue}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">INSURANCE VALUE</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.insuranceValue}</p>
                  </div>
                </div>
              </div>

              {/* Declared Weight & Volume */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Declared Weight & Volume</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">PACKS</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.packs}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">VOLUMETRIC WEIGHT</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.volumetricWeight}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">GROSS WEIGHT</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.grossWeight}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">CHARGEABLE</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.chargeable}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">NET WEIGHT</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.netWeight}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">VOLUME</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.volume}</p>
                  </div>
                </div>
              </div>

              {/* Quote Summary */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Quote Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">QUOTATION NUMBER</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.quotationNumber}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">AMOUNT</label>
                    <p className="text-sm font-medium mt-1">{selectedQuote.amount}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">STATUS</label>
                    <p className="text-sm font-medium mt-1">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${selectedQuote.statusColor} ${selectedQuote.statusBgColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {selectedQuote.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Quotes;
