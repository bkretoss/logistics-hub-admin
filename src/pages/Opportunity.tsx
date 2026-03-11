import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Grid3x3,
  List,
  ArrowUpDown,
  DollarSign,
  Calendar,
  Target,
  TrendingUp,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
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

const opportunities = [
  {
    id: 1,
    name: "Global Shipping Contract",
    account: "Acme Corp",
    stage: "Proposal",
    amount: "$250,000",
    closeDate: "30/12/2024",
    probability: "75%",
    owner: "Sarah Johnson",
    stageColor: "text-blue-500",
    stageBgColor: "bg-blue-500/10",
    date: "09/03/2024",
    opportunitySource: "Online",
    location: "New York",
    opportunityType: "New Client",
    lead: "Lead 1",
    type: "Shipment",
    salesTeam: "Team A",
    salesAgent: "Agent 1",
    company: "Relay Logistics Private Limited",
    pricingTeam: "Pricing Team 1",
    shippingProviders: "Provider 1",
    transportMode: "Sea",
    shipmentType: "FCL",
    cargoType: "General",
    incoterms: "FOB",
    commodity: "Electronics",
    serviceMode: "Door to Door",
    estimatedShipmentDate: "15/01/2025",
    cargoStatus: "Ready to Ship",
    originCountry: "United States",
    destinationCountry: "China",
    cargoDescription: "Electronic components for manufacturing",
    customer: "Acme Corp",
    contactPerson: "John Doe",
    customerType: "Shipper",
    designation: "Logistics Manager",
    prospect: "Customer A",
    department: "Operations",
    address: "123 Main St, New York, NY 10001, United States",
    email: "john@acmecorp.com",
    telephoneNo: "+1-555-0101",
    mobileNo: "+1-555-0102",
    vendorAgent: "Agent XYZ",
    currency: "USD",
    rateTotal: "25000",
  },
  {
    id: 2,
    name: "Freight Services Deal",
    account: "BlueLine Ltd",
    stage: "Negotiation",
    amount: "$180,000",
    closeDate: "25/08/2024",
    probability: "60%",
    owner: "Mike Chen",
    stageColor: "text-orange-500",
    stageBgColor: "bg-orange-500/10",
    date: "08/03/2024",
    opportunitySource: "Offline",
    location: "Los Angeles",
    opportunityType: "Existing Client",
    lead: "Lead 2",
    type: "Service Job",
    salesTeam: "Team B",
    salesAgent: "Agent 2",
    company: "Relay Logistics Private Limited",
    pricingTeam: "Pricing Team 2",
    shippingProviders: "Provider 2",
    transportMode: "Air",
    shipmentType: "Air Freight",
    cargoType: "Perishable",
    incoterms: "CIF",
    commodity: "Textiles",
    serviceMode: "Port to Port",
    estimatedShipmentDate: "20/01/2025",
    cargoStatus: "Ship Later",
    originCountry: "India",
    destinationCountry: "United States",
    cargoDescription: "Textile goods for retail distribution",
    customer: "BlueLine Ltd",
    contactPerson: "Jane Smith",
    customerType: "Consignee",
    designation: "Supply Chain Director",
    prospect: "Customer B",
    department: "Logistics",
    address: "456 Commerce Ave, Los Angeles, CA 90001, United States",
    email: "jane@blueline.com",
    telephoneNo: "+1-555-0201",
    mobileNo: "+1-555-0202",
    vendorAgent: "Agent ABC",
    currency: "USD",
    rateTotal: "18000",
  },
  {
    id: 3,
    name: "Logistics Partnership",
    account: "Pacific Freight",
    stage: "Qualification",
    amount: "$320,000",
    closeDate: "15/09/2025",
    probability: "40%",
    owner: "Lisa Wang",
    stageColor: "text-green-500",
    stageBgColor: "bg-green-500/10",
    date: "07/03/2024",
    opportunitySource: "Online",
    location: "Chicago",
    opportunityType: "New Client",
    lead: "Lead 1",
    type: "Shipment",
    salesTeam: "Team A",
    salesAgent: "Agent 1",
    company: "Relay Logistics Private Limited",
    pricingTeam: "Pricing Team 1",
    shippingProviders: "Provider 1",
    transportMode: "Road",
    shipmentType: "LCL",
    cargoType: "Hazardous",
    incoterms: "EXW",
    commodity: "Machinery",
    serviceMode: "Door to Port",
    estimatedShipmentDate: "10/02/2025",
    cargoStatus: "Ready to Ship",
    originCountry: "China",
    destinationCountry: "India",
    cargoDescription: "Industrial machinery parts",
    customer: "Pacific Freight",
    contactPerson: "Robert Lee",
    customerType: "Agent",
    designation: "Operations Manager",
    prospect: "Customer A",
    department: "Freight",
    address: "789 Harbor Blvd, Chicago, IL 60601, United States",
    email: "robert@pacificfreight.com",
    telephoneNo: "+1-555-0301",
    mobileNo: "+1-555-0302",
    vendorAgent: "Agent DEF",
    currency: "USD",
    rateTotal: "32000",
  },
];

const Opportunity = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [opportunitiesList, setOpportunitiesList] = useState(opportunities);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<typeof opportunities[0] | null>(null);

  const handleViewOpportunity = (opp: typeof opportunities[0]) => {
    setSelectedOpportunity(opp);
    setViewDialogOpen(true);
  };

  const stageOptions = [
    { label: "Qualification", color: "text-green-500", bgColor: "bg-green-500/10" },
    { label: "Proposal", color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { label: "Negotiation", color: "text-orange-500", bgColor: "bg-orange-500/10" },
  ];

  const handleStageChange = (oppId: number, newStage: string, newColor: string, newBgColor: string) => {
    setOpportunitiesList(
      opportunitiesList.map((o) =>
        o.id === oppId ? { ...o, stage: newStage, stageColor: newColor, stageBgColor: newBgColor } : o,
      ),
    );
  };

  const stats = [
    { label: "TOTAL OPPORTUNITIES", value: "3", icon: Target, iconColor: "text-blue-500", bg: "bg-blue-50" },
    { label: "TOTAL VALUE", value: "$750K", icon: DollarSign, iconColor: "text-green-500", bg: "bg-green-50" },
    { label: "AVG PROBABILITY", value: "58%", icon: TrendingUp, iconColor: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "CLOSING THIS MONTH", value: "2", icon: Calendar, iconColor: "text-cyan-500", bg: "bg-cyan-50" },
  ];

  const filters = [
    { label: "All", count: 3 },
    { label: "Qualification", count: 1 },
    { label: "Proposal", count: 1 },
    { label: "Negotiation", count: 1 },
  ];

  const filteredOpportunities = opportunitiesList.filter((opp) => {
    const matchesFilter = activeFilter === "All" || opp.stage === activeFilter;
    const matchesSearch =
      opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        <Button
          className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black"
          onClick={() => navigate("/sales/opportunity/new")}
        >
          <Plus className="w-4 h-4" />
          New Opportunity
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
                placeholder="Search by name or account..."
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${opp.stageColor} ${opp.stageBgColor} hover:opacity-80 transition-opacity`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {opp.stage}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {stageOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.label}
                        onClick={() => handleStageChange(opp.id, option.label, option.color, option.bgColor)}
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
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">NAME</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">
                      CLOSE DATE
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">ACCOUNT</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">STAGE</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">AMOUNT</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">
                      PROBABILITY
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">OWNER</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground tracking-wide">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOpportunities.map((opp) => (
                    <tr
                      key={opp.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <td className="p-4 font-medium text-foreground">{opp.name}</td>
                      <td className="p-4 text-muted-foreground">{opp.closeDate}</td>
                      <td className="p-4 text-muted-foreground">{opp.account}</td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${opp.stageColor} ${opp.stageBgColor} hover:opacity-80 transition-opacity`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              {opp.stage}
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {stageOptions.map((option) => (
                              <DropdownMenuItem
                                key={option.label}
                                onClick={() => handleStageChange(opp.id, option.label, option.color, option.bgColor)}
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
                      <td className="p-4 font-semibold text-foreground">{opp.amount}</td>
                      <td className="p-4 text-muted-foreground">{opp.probability}</td>
                      <td className="p-4 text-muted-foreground">{opp.owner}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-1.5 hover:bg-muted rounded-lg transition-colors" 
                            title="View"
                            onClick={() => handleViewOpportunity(opp)}
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
            <DialogTitle>Opportunity Details</DialogTitle>
          </DialogHeader>
          {selectedOpportunity && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Basic Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">DATE</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.date}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">OPPORTUNITY SOURCE</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.opportunitySource}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">LOCATION</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.location}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">OPPORTUNITY TYPE</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.opportunityType}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">LEAD</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.lead}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">TYPE</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.type}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">SALES TEAM</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.salesTeam}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">SALES AGENT</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.salesAgent}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">COMPANY</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.company}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">PRICING TEAM</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.pricingTeam}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">SHIPPING PROVIDERS</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.shippingProviders}</p>
                  </div>
                </div>
              </div>

              {/* Shipment Details */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Shipment Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">TRANSPORT MODE</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.transportMode}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">SHIPMENT TYPE</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.shipmentType}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">CARGO TYPE</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.cargoType}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">INCOTERMS</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.incoterms}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">COMMODITY</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.commodity}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">SERVICE MODE</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.serviceMode}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">ESTIMATED SHIPMENT DATE</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.estimatedShipmentDate}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">CARGO STATUS</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.cargoStatus}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">ORIGIN COUNTRY</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.originCountry}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">DESTINATION COUNTRY</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.destinationCountry}</p>
                  </div>
                  <div className="col-span-3">
                    <label className="text-xs font-semibold text-muted-foreground">CARGO DESCRIPTION</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.cargoDescription}</p>
                  </div>
                </div>
              </div>

              {/* Party Details */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Party Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">CUSTOMER</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.customer}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">CONTACT PERSON</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.contactPerson}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">CUSTOMER TYPE</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.customerType}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">DESIGNATION</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.designation}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">PROSPECT</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.prospect}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">DEPARTMENT</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.department}</p>
                  </div>
                  <div className="col-span-3">
                    <label className="text-xs font-semibold text-muted-foreground">ADDRESS</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.address}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">EMAIL</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">TELEPHONE NO</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.telephoneNo}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">MOBILE NO</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.mobileNo}</p>
                  </div>
                </div>
              </div>

              {/* Vendor Rate Comparison */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Vendor Rate Comparison</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">AGENT</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.vendorAgent}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">CURRENCY</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.currency}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">RATE TOTAL</label>
                    <p className="text-sm font-medium mt-1">${selectedOpportunity.rateTotal}</p>
                  </div>
                </div>
              </div>

              {/* Opportunity Summary */}
              <div>
                <h3 className="text-sm font-bold text-primary mb-3">Opportunity Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">NAME</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">ACCOUNT</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.account}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">CLOSE DATE</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.closeDate}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">AMOUNT</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.amount}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">PROBABILITY</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.probability}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">OWNER</label>
                    <p className="text-sm font-medium mt-1">{selectedOpportunity.owner}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">STAGE</label>
                    <p className="text-sm font-medium mt-1">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${selectedOpportunity.stageColor} ${selectedOpportunity.stageBgColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {selectedOpportunity.stage}
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

export default Opportunity;
