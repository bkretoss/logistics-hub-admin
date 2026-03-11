import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Grid3x3,
  List,
  ArrowUpDown,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const leads = [
  {
    id: 1,
    customer: "Acme Corporation",
    target: "John Smith",
    source: "Website",
    date: "08/12/2024",
    owner: "Sarah Johnson",
    company: "Relay Logistics",
    team: "Sales Team A",
    status: "Unqualified",
    statusColor: "text-gray-500",
    statusBgColor: "bg-gray-500/10",
    shipmentType: "FCL",
    transportMode: "Sea",
    originPort: "New York",
    targetDate: "15/01/2025",
    businessService: "Import",
    destinationPort: "Mumbai",
    expectedAnnualRevenue: "500000",
    expectedAnnualVolume: "1000 TEU",
    natureOfBusiness: "Manufacturing and Export",
    companyTurnover: "2000000",
    remarks: "High potential client",
    address: "123 Business St, New York, NY 10001",
    country: "USA",
    state: "New York",
    city: "New York",
    zip: "10001",
    contactPerson: "John Smith",
    email: "john@acme.com",
    telephoneNo: "+1-555-0101",
    mobileNo: "+1-555-0102",
    designation: "Logistics Manager",
    department: "Operations",
    notes: "Interested in long-term partnership",
  },
  {
    id: 2,
    customer: "Global Shipping Ltd",
    target: "Emily Davis",
    source: "Referral",
    date: "07/12/2024",
    owner: "Mike Chen",
    company: "Relay Logistics",
    team: "Sales Team B",
    status: "Qualified",
    statusColor: "text-green-500",
    statusBgColor: "bg-green-500/10",
    shipmentType: "LCL",
    transportMode: "Air",
    originPort: "Los Angeles",
    targetDate: "20/01/2025",
    businessService: "Export",
    destinationPort: "Shanghai",
    expectedAnnualRevenue: "750000",
    expectedAnnualVolume: "500 TEU",
    natureOfBusiness: "Trading",
    companyTurnover: "3000000",
    remarks: "Quick turnaround required",
    address: "456 Commerce Ave, Los Angeles, CA 90001",
    country: "USA",
    state: "California",
    city: "Los Angeles",
    zip: "90001",
    contactPerson: "Emily Davis",
    email: "emily@globalshipping.com",
    telephoneNo: "+1-555-0201",
    mobileNo: "+1-555-0202",
    designation: "Supply Chain Director",
    department: "Logistics",
    notes: "Prefers air freight for urgent shipments",
  },
  {
    id: 3,
    customer: "Pacific Freight Co",
    target: "Robert Wilson",
    source: "Cold Call",
    date: "06/12/2024",
    owner: "Lisa Wang",
    company: "Relay Logistics",
    team: "Sales Team A",
    status: "Open",
    statusColor: "text-blue-500",
    statusBgColor: "bg-blue-500/10",
    shipmentType: "FCL",
    transportMode: "Sea",
    originPort: "Seattle",
    targetDate: "10/02/2025",
    businessService: "Import/Export",
    destinationPort: "Tokyo",
    expectedAnnualRevenue: "1000000",
    expectedAnnualVolume: "2000 TEU",
    natureOfBusiness: "Distribution",
    companyTurnover: "5000000",
    remarks: "Looking for competitive rates",
    address: "789 Harbor Blvd, Seattle, WA 98101",
    country: "USA",
    state: "Washington",
    city: "Seattle",
    zip: "98101",
    contactPerson: "Robert Wilson",
    email: "robert@pacificfreight.com",
    telephoneNo: "+1-555-0301",
    mobileNo: "+1-555-0302",
    designation: "Operations Manager",
    department: "Freight",
    notes: "Requires regular weekly shipments",
  },
];

const Leads = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [leadsList, setLeadsList] = useState(leads);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<typeof leads[0] | null>(null);

  const handleViewLead = (lead: typeof leads[0]) => {
    setSelectedLead(lead);
    setViewDialogOpen(true);
  };

  const statusOptions = [
    { label: "Unqualified", color: "text-gray-500", bgColor: "bg-gray-500/10" },
    { label: "Qualified", color: "text-green-500", bgColor: "bg-green-500/10" },
    { label: "Open", color: "text-blue-500", bgColor: "bg-blue-500/10" },
  ];

  const handleStatusChange = (leadId: number, newStatus: string, newColor: string, newBgColor: string) => {
    setLeadsList(leadsList.map(l => 
      l.id === leadId 
        ? { ...l, status: newStatus, statusColor: newColor, statusBgColor: newBgColor }
        : l
    ));
  };

  const stats = [
    { label: "TOTAL LEADS", value: "3", icon: Building2, iconColor: "text-blue-500", bg: "bg-blue-50" },
    { label: "QUALIFIED", value: "1", icon: DollarSign, iconColor: "text-green-500", bg: "bg-green-50" },
    { label: "OPEN", value: "1", icon: Clock, iconColor: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "UNQUALIFIED", value: "1", icon: MapPin, iconColor: "text-gray-500", bg: "bg-gray-50" },
  ];

  const filters = [
    { label: "All", count: 3 },
    { label: "Qualified", count: 1 },
    { label: "Open", count: 1 },
    { label: "Unqualified", count: 1 },
  ];

  const filteredLeads = leadsList.filter((lead) => {
    const matchesFilter = activeFilter === "All" || lead.status === activeFilter;
    const matchesSearch =
      lead.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        <Button
          className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black"
          onClick={() => navigate("/sales/leads/new")}
        >
          <Plus className="w-4 h-4" />
          New Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={idx}
              className="bg-card rounded-xl p-5 material-elevation-1 hover:material-elevation-2 transition-all duration-300"
            >
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
                    ? "bg-primary text-black material-elevation-2 scale-105"
                    : "bg-muted text-black hover:bg-muted/80 hover:scale-105"
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
                placeholder="Search by customer or target..."
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
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  viewMode === "grid" ? "bg-primary text-white material-elevation-2" : "hover:bg-background"
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  viewMode === "list" ? "bg-primary text-white material-elevation-2" : "hover:bg-background"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {viewMode === "grid" ? (
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${lead.statusColor} ${lead.statusBgColor} hover:opacity-80 transition-opacity`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {lead.status}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {statusOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.label}
                        onClick={() => handleStatusChange(lead.id, option.label, option.color, option.bgColor)}
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
            </div>
          ))
        ) : (
          <div className="col-span-full material-card material-elevation-1">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">
                      CUSTOMER
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">DATE</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">TARGET</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">
                      LEAD SOURCE
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">
                      LEAD OWNER
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">COMPANY</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">
                      SALES TEAM
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">STATUS</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <td className="p-4 font-medium text-foreground">{lead.customer}</td>
                      <td className="p-4 text-muted-foreground">{lead.date}</td>
                      <td className="p-4 text-muted-foreground">{lead.target}</td>
                      <td className="p-4 text-muted-foreground">{lead.source}</td>
                      <td className="p-4 text-muted-foreground">{lead.owner}</td>
                      <td className="p-4 text-muted-foreground">{lead.company}</td>
                      <td className="p-4 text-muted-foreground">{lead.team}</td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${lead.statusColor} ${lead.statusBgColor} hover:opacity-80 transition-opacity`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              {lead.status}
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {statusOptions.map((option) => (
                              <DropdownMenuItem
                                key={option.label}
                                onClick={() => handleStatusChange(lead.id, option.label, option.color, option.bgColor)}
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
                            onClick={() => handleViewLead(lead)}
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
          </div>
        )}
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Basic Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">CUSTOMER</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.customer}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">DATE</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.date}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">TARGET</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.target}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">LEAD OWNER</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.owner}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">LEAD SOURCE</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.source}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">COMPANY</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.company}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">SALES TEAM</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.team}</p>
                  </div>
                </div>
              </div>

              {/* Business Lead */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Business Lead</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">SHIPMENT TYPE</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.shipmentType}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">TARGET DATE</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.targetDate}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">TRANSPORT MODE</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.transportMode}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">BUSINESS SERVICE</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.businessService}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">ORIGIN PORT</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.originPort}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">DESTINATION PORT</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.destinationPort}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">EXPECTED ANNUAL REVENUE</label>
                    <p className="text-sm font-medium mt-1">${selectedLead.expectedAnnualRevenue}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">EXPECTED ANNUAL VOLUME</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.expectedAnnualVolume}</p>
                  </div>
                </div>
              </div>

              {/* Revenue & Volume */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Revenue & Volume</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">NATURE OF BUSINESS</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.natureOfBusiness}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">COMPANY TURNOVER</label>
                    <p className="text-sm font-medium mt-1">${selectedLead.companyTurnover}</p>
                  </div>
                  <div className="col-span-3">
                    <label className="text-xs font-semibold text-muted-foreground">REMARKS</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.remarks}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Contact Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3">
                    <label className="text-xs font-semibold text-muted-foreground">ADDRESS</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.address}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">CONTACT PERSON</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.contactPerson}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">EMAIL</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">STATE</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.state}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">TELEPHONE NO</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.telephoneNo}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">CITY</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.city}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">MOBILE NO</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.mobileNo}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">ZIP</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.zip}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">DESIGNATION</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.designation}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">DEPARTMENT</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.department}</p>
                  </div>
                  <div className="col-span-3">
                    <label className="text-xs font-semibold text-muted-foreground">NOTES</label>
                    <p className="text-sm font-medium mt-1">{selectedLead.notes}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground">STATUS</label>
                <p className="text-sm font-medium mt-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${selectedLead.statusColor} ${selectedLead.statusBgColor}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {selectedLead.status}
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

export default Leads;
