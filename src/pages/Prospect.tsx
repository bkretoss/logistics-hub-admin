import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Grid3x3, List, ArrowUpDown, Mail, Phone, MapPin, DollarSign, Clock, ChevronDown, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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

const prospects = [
  {
    id: 1,
    company: "Atlas Freight Inc.",
    contact: "John Miller",
    email: "john@atlasfreight.com",
    phone: "+1 555-0101",
    location: "New York, NY",
    score: 72,
    scoreColor: "bg-orange-500",
    status: "New",
    statusColor: "text-blue-500",
    statusBgColor: "bg-blue-500/10",
    value: "$45,000",
    time: "2 days ago",
    avatar: "AF",
    avatarBg: "bg-blue-100",
    avatarText: "text-blue-600",
    contactName: "John Miller",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",
    designation: "Logistics Manager",
    department: "Operations",
    mobile: "+1 555-0199",
    website: "www.atlasfreight.com",
    industry: "Freight",
    employees: "50-100",
    revenue: "$5M",
    notes: "High potential client",
  },
  {
    id: 2,
    company: "BlueLine Shipping",
    contact: "Sarah Chen",
    email: "sarah@blueline.com",
    phone: "+1 555-0102",
    location: "Los Angeles, CA",
    score: 85,
    scoreColor: "bg-green-500",
    status: "Contacted",
    statusColor: "text-orange-500",
    statusBgColor: "bg-orange-500/10",
    value: "$82,000",
    time: "3 days ago",
    avatar: "BL",
    avatarBg: "bg-orange-100",
    avatarText: "text-orange-600",
    contactName: "Sarah Chen",
    street: "456 Commerce Ave",
    city: "Los Angeles",
    state: "CA",
    zip: "90001",
    country: "United States",
    designation: "Supply Chain Director",
    department: "Logistics",
    mobile: "+1 555-0299",
    website: "www.blueline.com",
    industry: "Shipping",
    employees: "100-200",
    revenue: "$10M",
    notes: "Interested in long-term partnership",
  },
  {
    id: 3,
    company: "CargoMax Solutions",
    contact: "David Park",
    email: "david@cargomax.com",
    phone: "+1 555-0103",
    location: "Chicago, IL",
    score: 91,
    scoreColor: "bg-green-500",
    status: "Qualified",
    statusColor: "text-green-500",
    statusBgColor: "bg-green-500/10",
    value: "$120,000",
    time: "1 week ago",
    avatar: "CM",
    avatarBg: "bg-green-100",
    avatarText: "text-green-600",
    contactName: "David Park",
    street: "789 Industrial Blvd",
    city: "Chicago",
    state: "IL",
    zip: "60601",
    country: "United States",
    designation: "Operations Manager",
    department: "Freight",
    mobile: "+1 555-0399",
    website: "www.cargomax.com",
    industry: "Logistics",
    employees: "200-500",
    revenue: "$20M",
    notes: "Ready to sign contract",
  },
  {
    id: 4,
    company: "Express Haulers",
    contact: "Maria Garcia",
    email: "maria@expresshaulers.com",
    phone: "+1 555-0104",
    location: "Houston, TX",
    score: 68,
    scoreColor: "bg-orange-500",
    status: "Proposal",
    statusColor: "text-cyan-500",
    statusBgColor: "bg-cyan-500/10",
    value: "$67,000",
    time: "1 week ago",
    avatar: "EH",
    avatarBg: "bg-cyan-100",
    avatarText: "text-cyan-600",
    contactName: "Maria Garcia",
    street: "321 Transport Way",
    city: "Houston",
    state: "TX",
    zip: "77001",
    country: "United States",
    designation: "Procurement Manager",
    department: "Purchasing",
    mobile: "+1 555-0499",
    website: "www.expresshaulers.com",
    industry: "Transportation",
    employees: "50-100",
    revenue: "$8M",
    notes: "Reviewing proposal",
  },
  {
    id: 5,
    company: "FastTrack Logistics",
    contact: "James Wilson",
    email: "james@fasttrack.com",
    phone: "+1 555-0105",
    location: "Seattle, WA",
    score: 54,
    scoreColor: "bg-gray-400",
    status: "New",
    statusColor: "text-blue-500",
    statusBgColor: "bg-blue-500/10",
    value: "$33,000",
    time: "3 days ago",
    avatar: "FT",
    avatarBg: "bg-blue-100",
    avatarText: "text-blue-600",
    contactName: "James Wilson",
    street: "654 Logistics Ln",
    city: "Seattle",
    state: "WA",
    zip: "98101",
    country: "United States",
    designation: "Director",
    department: "Operations",
    mobile: "+1 555-0599",
    website: "www.fasttrack.com",
    industry: "Logistics",
    employees: "20-50",
    revenue: "$3M",
    notes: "Initial contact made",
  },
  {
    id: 6,
    company: "Harbor Transport",
    contact: "Lisa Wang",
    email: "lisa@harbor.com",
    phone: "+1 555-0106",
    location: "Miami, FL",
    score: 88,
    scoreColor: "bg-green-500",
    status: "Qualified",
    statusColor: "text-green-500",
    statusBgColor: "bg-green-500/10",
    value: "$95,000",
    time: "5 days ago",
    avatar: "HT",
    avatarBg: "bg-green-100",
    avatarText: "text-green-600",
    contactName: "Lisa Wang",
    street: "987 Harbor Dr",
    city: "Miami",
    state: "FL",
    zip: "33101",
    country: "United States",
    designation: "VP Operations",
    department: "Executive",
    mobile: "+1 555-0699",
    website: "www.harbor.com",
    industry: "Maritime",
    employees: "100-200",
    revenue: "$15M",
    notes: "Strong interest in services",
  },
];

const Prospect = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [prospectsList, setProspectsList] = useState(prospects);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<typeof prospects[0] | null>(null);

  const handleViewProspect = (prospect: typeof prospects[0]) => {
    setSelectedProspect(prospect);
    setViewDialogOpen(true);
  };

  const statusOptions = [
    { label: "New", color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { label: "Contacted", color: "text-orange-500", bgColor: "bg-orange-500/10" },
    { label: "Qualified", color: "text-green-500", bgColor: "bg-green-500/10" },
    { label: "Proposal", color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
  ];

  const handleStatusChange = (prospectId: number, newStatus: string, newColor: string, newBgColor: string) => {
    setProspectsList(prospectsList.map(p => 
      p.id === prospectId 
        ? { ...p, status: newStatus, statusColor: newColor, statusBgColor: newBgColor }
        : p
    ));
  };

  const stats = [
    {
      label: "TOTAL PROSPECTS",
      value: "6",
      icon: "👥",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "PIPELINE VALUE",
      value: "$442K",
      icon: "💵",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "QUALIFIED",
      value: "2",
      icon: "⭐",
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      label: "AVG SCORE",
      value: "76",
      icon: "📈",
      bg: "bg-cyan-50",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
  ];

  const filters = [
    { label: "All", count: 6 },
    { label: "New", count: 2 },
    { label: "Contacted", count: 1 },
    { label: "Qualified", count: 2 },
    { label: "Proposal", count: 1 },
  ];

  const filteredProspects = prospectsList.filter((prospect) => {
    const matchesFilter = activeFilter === "All" || prospect.status === activeFilter;
    const matchesSearch =
      prospect.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.contact.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProspects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProspects = filteredProspects.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Prospects</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track your sales pipeline</p>
        </div>
        <Button
          className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black"
          onClick={() => navigate("/sales/prospect/new")}
        >
          <Plus className="w-4 h-4" />
          Add Prospect
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`${stat.bg} rounded-2xl p-6 material-elevation-1 hover:material-elevation-2 transition-all duration-300`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 tracking-wide">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div
                className={`${stat.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl material-elevation-1`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="material-card material-elevation-1 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFilter(filter.label)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
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
                placeholder="Search by company or contact..."
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
          paginatedProspects.map((prospect) => (
            <div key={prospect.id} className="material-card p-6 cursor-pointer">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`${prospect.avatarBg} w-14 h-14 rounded-2xl flex items-center justify-center ${prospect.avatarText} font-bold text-base material-elevation-1`}
                  >
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${prospect.statusColor} ${prospect.statusBgColor} hover:opacity-80 transition-opacity`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {prospect.status}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {statusOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.label}
                        onClick={() => handleStatusChange(prospect.id, option.label, option.color, option.bgColor)}
                      >
                        <span className={`inline-flex items-center gap-1.5 ${option.color}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {option.label}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
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
            {paginatedProspects.map((prospect) => (
              <div key={prospect.id} className="material-card p-5 cursor-pointer flex items-center gap-6">
                <div
                  className={`${prospect.avatarBg} w-12 h-12 rounded-2xl flex items-center justify-center ${prospect.avatarText} font-bold text-sm material-elevation-1 flex-shrink-0`}
                >
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${prospect.statusColor} ${prospect.statusBgColor} hover:opacity-80 transition-opacity`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {prospect.status}
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {statusOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.label}
                            onClick={() => handleStatusChange(prospect.id, option.label, option.color, option.bgColor)}
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
                  <div className="flex items-center justify-end gap-4">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">Score</div>
                      <div className="font-semibold">{prospect.score}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">Value</div>
                      <div className="font-semibold">{prospect.value}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors" 
                        title="View"
                        onClick={() => handleViewProspect(prospect)}
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prospect Details</DialogTitle>
          </DialogHeader>
          {selectedProspect && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Contact Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">CONTACT NAME</label>
                    <p className="text-sm font-medium mt-1">{selectedProspect.contactName}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">COMPANY</label>
                    <p className="text-sm font-medium mt-1">{selectedProspect.company}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">EMAIL</label>
                    <p className="text-sm font-medium mt-1">{selectedProspect.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">TELEPHONE NO</label>
                    <p className="text-sm font-medium mt-1">{selectedProspect.phone}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">MOBILE</label>
                    <p className="text-sm font-medium mt-1">{selectedProspect.mobile}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">DESIGNATION</label>
                    <p className="text-sm font-medium mt-1">{selectedProspect.designation}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">DEPARTMENT</label>
                    <p className="text-sm font-medium mt-1">{selectedProspect.department}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Address</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">STREET</label>
                    <p className="text-sm font-medium mt-1">{selectedProspect.street}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">CITY</label>
                    <p className="text-sm font-medium mt-1">{selectedProspect.city}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">STATE</label>
                    <p className="text-sm font-medium mt-1">{selectedProspect.state}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">ZIP</label>
                    <p className="text-sm font-medium mt-1">{selectedProspect.zip}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">COUNTRY</label>
                    <p className="text-sm font-medium mt-1">{selectedProspect.country}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Prospect Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">LEAD SCORE</label>
                    <p className="text-sm font-medium mt-1">{selectedProspect.score}%</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">VALUE</label>
                    <p className="text-sm font-medium mt-1">{selectedProspect.value}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">STATUS</label>
                    <p className="text-sm font-medium mt-1">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${selectedProspect.statusColor} ${selectedProspect.statusBgColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {selectedProspect.status}
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

export default Prospect;
