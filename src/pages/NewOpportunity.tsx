import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const NewOpportunity = () => {
  const navigate = useNavigate();
  const [showVisitDialog, setShowVisitDialog] = useState(false);
  const [nextVisit, setNextVisit] = useState("No");
  const [serviceLines, setServiceLines] = useState([{ id: 1, containerType: "", containerQuantity: 1 }]);
  const [formData, setFormData] = useState({
    name: "",
    account: "",
    type: "",
    leadSource: "",
    // Opportunity Record
    opportunityOwner: "",
    opportunityType: "",
    type2: "",
    nextStep: "",
    probability: "",
    pricingTeam: "",
    shippingPriorities: "",
    // Shipment Details
    shipmentMode: "",
    shipmentType: "",
    cargoType: "",
    operation: "",
    expectedRevenue: "",
    originCountry: "",
    originPort: "",
    destinationCountry: "",
    destinationPort: "",
    cargoDescription: "",
    // Port Details
    equipment: "",
    equipmentType: "",
    address: "",
    // Vendor Rate Comparison
    vendorAgent: "",
    currency: "USD",
    rateLocal: "",
    // Customer Visit Information
    visitBy: "",
    venue: "",
    typeOfVisit: "",
    item: "",
    scheduledBy: "",
    purpose: "",
    expectedBy: "",
    salesPipeline: "",
    department: "",
    freightBy: "",
    // Additional Services
    services: "",
    customerType: "",
    addLine: "",
  });

  const addServiceLine = () => {
    setServiceLines([...serviceLines, { id: Date.now(), containerType: "", containerQuantity: 1 }]);
  };

  const removeServiceLine = (id: number) => {
    setServiceLines(serviceLines.filter(line => line.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    navigate("/sales/quotes/new");
    window.scrollTo(0, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/sales/opportunity")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">New Opportunity</h1>
          <p className="text-muted-foreground text-sm mt-1">Create a new opportunity entry</p>
        </div>
      </div>

      {/* Status Buttons */}
      <div className="flex items-center gap-3">
        <Button className="bg-primary text-black">Change Status</Button>
        <Button className="bg-primary text-black">Create Quote</Button>
        <Button className="bg-primary text-black">Rate Request</Button>
        <div className="flex items-center gap-2 ml-auto">
          <div className="px-4 py-2 bg-primary text-black font-medium rounded-lg">Open</div>
          <div className="px-4 py-2 bg-muted text-black font-medium rounded-lg">Active</div>
          <div className="px-4 py-2 bg-muted text-black font-medium rounded-lg">Created</div>
          <div className="px-4 py-2 bg-muted text-black font-medium rounded-lg">Closed</div>
          <div className="px-4 py-2 bg-muted text-black font-medium rounded-lg">On Hold</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="material-card material-elevation-1 p-6 space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold">
                Date
              </Label>
              <Input id="date" name="date" type="date" defaultValue="2026-03-09" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-semibold">
                Location
              </Label>
              <select id="location" name="location" className="w-full px-3 py-2 border border-input rounded-lg">
                <option value="">Select</option>
                <option>New York</option>
                <option>Los Angeles</option>
                <option>Chicago</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead" className="text-sm font-semibold">
                Lead
              </Label>
              <select id="lead" name="lead" className="w-full px-3 py-2 border border-input rounded-lg">
                <option value="">Select</option>
                <option>Lead 1</option>
                <option>Lead 2</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salesTeam" className="text-sm font-semibold">
                Sales Team
              </Label>
              <select id="salesTeam" name="salesTeam" className="w-full px-3 py-2 border border-input rounded-lg">
                <option value="">Select</option>
                <option>Team A</option>
                <option>Team B</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Opportunity Source</Label>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="opportunitySource" value="Online" defaultChecked />
                  <span className="text-sm">Online</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="opportunitySource" value="Offline" />
                  <span className="text-sm">Offline</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Opportunity Type</Label>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="opportunityType" value="New Client" defaultChecked />
                  <span className="text-sm">New Client</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="opportunityType" value="Existing Client" />
                  <span className="text-sm">Existing Client</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Type</Label>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="type" value="Shipment" defaultChecked />
                  <span className="text-sm">Shipment</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="type" value="Service Job" />
                  <span className="text-sm">Service Job</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salesAgent" className="text-sm font-semibold">
                Sales Agent
              </Label>
              <select id="salesAgent" name="salesAgent" className="w-full px-3 py-2 border border-input rounded-lg">
                <option value="">Select</option>
                <option>Agent 1</option>
                <option>Agent 2</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-semibold">
                Company
              </Label>
              <select id="company" name="company" className="w-full px-3 py-2 border border-input rounded-lg">
                <option>Relay Logistics Private Limited</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricingTeam" className="text-sm font-semibold">
                Pricing Team
              </Label>
              <select id="pricingTeam" name="pricingTeam" className="w-full px-3 py-2 border border-input rounded-lg">
                <option value="">Select</option>
                <option>Pricing Team 1</option>
                <option>Pricing Team 2</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingProviders" className="text-sm font-semibold">
                Shipping Providers
              </Label>
              <select
                id="shippingProviders"
                name="shippingProviders"
                className="w-full px-3 py-2 border border-input rounded-lg"
              >
                <option value="">Select</option>
                <option>Provider 1</option>
                <option>Provider 2</option>
              </select>
            </div>
          </div>

          {/* Shipment Details */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Shipment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="transportMode" className="text-sm font-semibold">
                  Transport Mode
                </Label>
                <select
                  id="transportMode"
                  name="transportMode"
                  value={formData.shipmentMode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg"
                >
                  <option value="">Select</option>
                  <option>Air</option>
                  <option>Sea</option>
                  <option>Road</option>
                  <option>Rail</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipmentType" className="text-sm font-semibold">
                  Shipment Type
                </Label>
                <select
                  id="shipmentType"
                  name="shipmentType"
                  value={formData.shipmentType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg"
                >
                  <option value="">Select</option>
                  <option>FCL</option>
                  <option>LCL</option>
                  <option>Air Freight</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargoType" className="text-sm font-semibold">
                  Cargo Type
                </Label>
                <select
                  id="cargoType"
                  name="cargoType"
                  value={formData.cargoType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg"
                >
                  <option value="">Select</option>
                  <option>General</option>
                  <option>Hazardous</option>
                  <option>Perishable</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="incoterms" className="text-sm font-semibold">
                  Incoterms
                </Label>
                <select id="incoterms" name="incoterms" className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  <option>FOB</option>
                  <option>CIF</option>
                  <option>EXW</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="commodity" className="text-sm font-semibold">
                  Commodity
                </Label>
                <select id="commodity" name="commodity" className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  <option>Electronics</option>
                  <option>Textiles</option>
                  <option>Machinery</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceMode" className="text-sm font-semibold">
                  Service Mode
                </Label>
                <select id="serviceMode" name="serviceMode" className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  <option>Door to Door</option>
                  <option>Port to Port</option>
                  <option>Door to Port</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedShipmentDate" className="text-sm font-semibold">
                  Estimated Shipment Date
                </Label>
                <Input id="estimatedShipmentDate" name="estimatedShipmentDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Cargo Status</Label>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="cargoStatus" value="Ready to Ship" defaultChecked />
                    <span className="text-sm">Ready to Ship</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="cargoStatus" value="Ship Later" />
                    <span className="text-sm">Ship Later</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="originCountry" className="text-sm font-semibold">
                  Origin Country
                </Label>
                <select
                  id="originCountry"
                  name="originCountry"
                  value={formData.originCountry}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg"
                >
                  <option value="">Select</option>
                  <option>United States</option>
                  <option>China</option>
                  <option>India</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinationCountry" className="text-sm font-semibold">
                  Destination Country
                </Label>
                <select
                  id="destinationCountry"
                  name="destinationCountry"
                  value={formData.destinationCountry}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg"
                >
                  <option value="">Select</option>
                  <option>United States</option>
                  <option>China</option>
                  <option>India</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cargoDescription" className="text-sm font-semibold">
                  Cargo Description
                </Label>
                <Textarea
                  id="cargoDescription"
                  name="cargoDescription"
                  value={formData.cargoDescription}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Party Details */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Party Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customer" className="text-sm font-semibold">
                  Customer
                </Label>
                <select id="customer" name="customer" className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  <option>Customer 1</option>
                  <option>Customer 2</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson" className="text-sm font-semibold">
                  Contact Person
                </Label>
                <Input id="contactPerson" name="contactPerson" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation" className="text-sm font-semibold">
                  Designation
                </Label>
                <Input id="designation" name="designation" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Customer Type</Label>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="customerType" value="Shipper" defaultChecked />
                    <span className="text-sm">Shipper</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="customerType" value="Consignee" />
                    <span className="text-sm">Consignee</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="customerType" value="Agent" />
                    <span className="text-sm">Agent</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerSelect" className="text-sm font-semibold">
                  Prospect
                </Label>
                <select
                  id="customerSelect"
                  name="customerSelect"
                  className="w-full px-3 py-2 border border-input rounded-lg"
                >
                  <option value="">Select</option>
                  <option>Customer A</option>
                  <option>Customer B</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-semibold">
                  Department
                </Label>
                <Input id="department" name="department" />
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="addressStreet1" className="text-sm font-semibold">
                  Address
                </Label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Input id="addressStreet1" name="addressStreet1" placeholder="Street 1..." />
                  <Input id="addressStreet2" name="addressStreet2" placeholder="Street 2..." />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <select className="px-3 py-2 border border-input rounded-lg">
                    <option>State</option>
                  </select>
                  <select className="px-3 py-2 border border-input rounded-lg">
                    <option>City</option>
                  </select>
                  <Input placeholder="ZIP" />
                  <select className="px-3 py-2 border border-input rounded-lg">
                    <option>Country</option>
                    <option>United States</option>
                    <option>India</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email
                </Label>
                <Input id="email" name="email" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephoneNo" className="text-sm font-semibold">
                  Telephone No
                </Label>
                <Input id="telephoneNo" name="telephoneNo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNo" className="text-sm font-semibold">
                  Mobile No
                </Label>
                <Input id="mobileNo" name="mobileNo" />
              </div>
            </div>
          </div>

          {/* Vendor Rate Comparison */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Vendor Rate Comparison</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vendorAgent" className="text-sm font-semibold">
                  Agent
                </Label>
                <Input id="vendorAgent" name="vendorAgent" value={formData.vendorAgent} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-semibold">
                  Currency
                </Label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg"
                >
                  <option>USD</option>
                  <option>INR</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rateLocal" className="text-sm font-semibold">
                  Rate Total
                </Label>
                <Input id="rateLocal" name="rateLocal" value={formData.rateLocal} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Customer Visit Information */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Customer Visit Information</h2>
            <div className="space-y-4">
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">DATE & TIME</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">MODE OF COMMUNICATION</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">VISITED BY</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">PURPOSE</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">NEXT VISIT</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">NOTES</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground text-sm">No visits added yet</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Button type="button" variant="outline" className="gap-2" onClick={() => setShowVisitDialog(true)}>
                <Plus className="w-4 h-4" />
                Add Line
              </Button>
            </div>
          </div>

          {/* Additional Services */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Additional Services</h2>
            <div className="space-y-4">
              <div className="space-y-2 md:w-1/3">
                <select className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select Service</option>
                  <option>Packaging</option>
                  <option>Insurance</option>
                  <option>Customs Clearance</option>
                </select>
              </div>
              <div className="border border-border rounded-lg p-4">
                <div className="mb-3">
                  <span className="text-sm font-semibold text-muted-foreground">Packages</span>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 font-semibold text-sm mb-2">
                    <div>Container Type</div>
                    <div>Container Quantity</div>
                  </div>
                  {serviceLines.map((line) => (
                    <div key={line.id} className="grid grid-cols-2 gap-4 items-center">
                      <select className="w-full px-3 py-2 border border-input rounded-lg">
                        <option value="">Select</option>
                        <option>20ft Container</option>
                        <option>40ft Container</option>
                        <option>40ft HC Container</option>
                      </select>
                      <div className="flex items-center gap-2">
                        <Input type="number" defaultValue={line.containerQuantity} className="flex-1" />
                        <button
                          type="button"
                          onClick={() => removeServiceLine(line.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addServiceLine}
                  className="text-primary text-sm font-medium mt-3 hover:underline"
                >
                  Add a line
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" className="bg-red-400 text-black hover:bg-red-350" onClick={() => navigate("/sales/opportunity")}>
              Cancel
            </Button>
            <Button type="submit" className="material-button text-black">
              Save Opportunity
            </Button>
          </div>
        </div>
      </form>

      {/* Visit Dialog */}
      {showVisitDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl material-elevation-4 w-full max-w-3xl mx-4">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-primary">Create Customer Visit Information</h2>
              <button onClick={() => setShowVisitDialog(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Date & Time</Label>
                  <div className="flex gap-2">
                    <Input type="date" className="flex-1" />
                    <Input type="time" defaultValue="0:00" className="w-32" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Next Visit</Label>
                  <select 
                    className="w-full px-3 py-2 border border-input rounded-lg"
                    value={nextVisit}
                    onChange={(e) => setNextVisit(e.target.value)}
                  >
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </div>
                {nextVisit === "Yes" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Next Followup Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Assign To</Label>
                      <select className="w-full px-3 py-2 border border-input rounded-lg">
                        <option value="">Select</option>
                        <option>Sales Rep 1</option>
                        <option>Sales Rep 2</option>
                      </select>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Mode of Communication</Label>
                  <select className="w-full px-3 py-2 border border-input rounded-lg">
                    <option value="">Select</option>
                    <option>Phone</option>
                    <option>Email</option>
                    <option>In-Person</option>
                  </select>
                </div>
                <div className="space-y-2 md:row-span-2">
                  <Label className="text-sm font-semibold">Notes</Label>
                  <Textarea rows={5} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Visited By</Label>
                  <select className="w-full px-3 py-2 border border-input rounded-lg">
                    <option value="">Select</option>
                    <option>Sales Rep 1</option>
                    <option>Sales Rep 2</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Purpose</Label>
                  <Input />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-start gap-3 p-6 border-t border-border">
              <Button type="button" className="bg-primary text-black" onClick={() => setShowVisitDialog(false)}>Save & Close</Button>
              <Button type="button" className="bg-primary text-black" onClick={() => setShowVisitDialog(false)}>Save & New</Button>
              <Button type="button" variant="outline" onClick={() => setShowVisitDialog(false)}>Discard</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewOpportunity;
