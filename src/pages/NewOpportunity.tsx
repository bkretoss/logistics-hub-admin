import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createRateRequestApi, getLeadsApi } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const NewOpportunity = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<{ id: number }[]>([]);
  const [showVisitDialog, setShowVisitDialog] = useState(false);

  useEffect(() => {
    getLeadsApi().then((res) => {
      const raw = res.data;
      const list = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : Array.isArray(raw?.data?.data) ? raw.data.data : [];
      setLeads(list);
    }).catch(() => {});
  }, []);
  const [hasNextVisit, setHasNextVisit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serviceLines, setServiceLines] = useState([{ id: 1, service: "", containerType: "", containerQuantity: 1 }]);
  const [vendorRates, setVendorRates] = useState([{ id: 1, vendor_agent: "", currency: "USD", rate_total: "" }]);
  const [customerVisits, setCustomerVisits] = useState<any[]>([]);
  const [visitFormData, setVisitFormData] = useState({
    visit_date: "",
    visit_time: "00:00",
    next_visit: "",
    next_followup_date: "",
    assign_to: "",
    mode_of_communication: "",
    visited_by: "",
    purpose: "",
    visit_notes: "",
  });
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    location: "",
    lead: "",
    sales_team: "",
    opportunitySource: "Online",
    opportunityType: "New Client",
    type: "Shipment",
    sales_agent: "",
    company: "Relay Logistics Private Limited",
    pricing_team: "",
    shipping_providers: "",
    status: "Open",
    // Shipment Details
    transport_mode: "",
    shipment_type: "",
    cargo_type: "",
    incoterms: "",
    commodity: "",
    service_mode: "",
    estimated_shipment_date: "",
    cargo_status: "Ready to Ship",
    origin_country: "",
    destination_country: "",
    cargo_description: "",
    // Party Details
    customer: "",
    contact_person: "",
    designation: "",
    customer_type: "Shipper",
    prospect: "",
    department: "",
    address_street1: "",
    address_street2: "",
    address_state: "",
    address_city: "",
    address_zip: "",
    address_country: "",
    email: "",
    telephone_no: "",
    mobile_no: "",

  });

  const addServiceLine = () => {
    setServiceLines([...serviceLines, { id: Date.now(), service: "", containerType: "", containerQuantity: 1 }]);
  };

  const removeServiceLine = (id: number) => {
    setServiceLines(serviceLines.filter(line => line.id !== id));
  };

  const resetVisitForm = () => {
    setVisitFormData({ visit_date: "", visit_time: "00:00", next_visit: "", next_followup_date: "", assign_to: "", mode_of_communication: "", visited_by: "", purpose: "", visit_notes: "" });
    setHasNextVisit(false);
  };

  const handleAddVisit = () => {
    if (!visitFormData.visit_date || !visitFormData.mode_of_communication || !visitFormData.visited_by || !visitFormData.purpose) {
      toast({ title: "Error", description: "Please fill all required visit fields", variant: "destructive" });
      return;
    }
    const visitTime = visitFormData.visit_time.length === 5 ? visitFormData.visit_time + ":00" : visitFormData.visit_time;
    const nextVisitDate = hasNextVisit ? visitFormData.next_visit : "";
    const nextFollowupDate = hasNextVisit ? visitFormData.next_followup_date : "";
    setCustomerVisits([...customerVisits, { ...visitFormData, visit_time: visitTime, next_visit: nextVisitDate, next_followup_date: nextFollowupDate, id: Date.now() }]);
    resetVisitForm();
    setShowVisitDialog(false);
  };

  const handleAddVisitAndMore = () => {
    if (!visitFormData.visit_date || !visitFormData.mode_of_communication || !visitFormData.visited_by || !visitFormData.purpose) {
      toast({ title: "Error", description: "Please fill all required visit fields", variant: "destructive" });
      return;
    }
    const visitTime = visitFormData.visit_time.length === 5 ? visitFormData.visit_time + ":00" : visitFormData.visit_time;
    const nextVisitDate = hasNextVisit ? visitFormData.next_visit : "";
    const nextFollowupDate = hasNextVisit ? visitFormData.next_followup_date : "";
    setCustomerVisits(prev => [...prev, { ...visitFormData, visit_time: visitTime, next_visit: nextVisitDate, next_followup_date: nextFollowupDate, id: Date.now() }]);
    resetVisitForm();
  };

  const removeVisit = (id: number) => {
    setCustomerVisits(customerVisits.filter(v => v.id !== id));
  };

  const buildPayload = () => ({
    date: formData.date,
    location: formData.location,
    lead: formData.lead,
    sales_team: formData.sales_team,
    opportunity_source: formData.opportunitySource,
    opportunity_type: formData.opportunityType,
    type: formData.type,
    sales_agent: formData.sales_agent,
    company: formData.company,
    pricing_team: formData.pricing_team,
    shipping_providers: formData.shipping_providers,
    status: formData.status,
    shipment_details: {
      transport_mode: formData.transport_mode,
      shipment_type: formData.shipment_type,
      cargo_type: formData.cargo_type,
      incoterms: formData.incoterms,
      commodity: formData.commodity,
      service_mode: formData.service_mode,
      estimated_shipment_date: formData.estimated_shipment_date,
      cargo_status: formData.cargo_status,
      origin_country: formData.origin_country,
      destination_country: formData.destination_country,
      cargo_description: formData.cargo_description,
    },
    party_details: {
      customer: formData.customer,
      contact_person: formData.contact_person,
      designation: formData.designation,
      customer_type: formData.customer_type,
      prospect: formData.prospect,
      department: formData.department,
      address_street1: formData.address_street1,
      address_street2: formData.address_street2,
      address_state: formData.address_state,
      address_city: formData.address_city,
      address_zip: formData.address_zip,
      address_country: formData.address_country,
      email: formData.email,
      telephone_no: formData.telephone_no,
      mobile_no: formData.mobile_no,
    },
    vendor_rates: vendorRates.filter(v => v.vendor_agent).map(v => ({
      vendor_agent: v.vendor_agent,
      currency: v.currency,
      rate_total: parseFloat(v.rate_total) || 0,
    })),
    additional_services: serviceLines.filter(s => s.service && s.containerType).map(s => ({
      additional_service: s.service,
      container_type: s.containerType,
      container_quantity: parseInt(s.containerQuantity.toString()) || 1,
    })),
    customer_visits: customerVisits.map(({ id: _id, ...v }) => v),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.date) newErrors.date = "Date is required.";
    if (!formData.estimated_shipment_date) newErrors.estimated_shipment_date = "Estimated Shipment Date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = buildPayload();
      console.log("Submitting payload:", payload);
      await createRateRequestApi(payload);
      setSubmitted(true);
      toast({ title: "Success", description: "Opportunity created successfully", variant: "success" });
      setTimeout(() => {
        navigate("/sales/opportunity");
        window.scrollTo(0, 0);
      }, 1500);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to create opportunity";
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVisitChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setVisitFormData({ ...visitFormData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/sales/opportunity")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">New Rate Request</h1>
          <p className="text-muted-foreground text-sm mt-1">Create a new rate request entry</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="material-card material-elevation-1 p-6 space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value) setErrors(prev => ({ ...prev, date: "" }));
                }}
                className={errors.date ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-semibold">
                Location
              </Label>
              <select id="location" name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                <option value="">Select</option>
                <option>New York</option>
                <option>Los Angeles</option>
                <option>Chicago</option>
                <option>Dubai</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead" className="text-sm font-semibold">
                Lead
              </Label>
              <select id="lead" name="lead" value={formData.lead} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                <option value="">Select</option>
                {leads.map((lead) => {
                  const formatted = `LEAD-${String(lead.id).padStart(3, "0")}`;
                  return <option key={lead.id} value={formatted}>{formatted}</option>;
                })}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salesTeam" className="text-sm font-semibold">
                Sales Team
              </Label>
              <select id="salesTeam" name="sales_team" value={formData.sales_team} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                <option value="">Select</option>
                <option>Team Alpha</option>
                <option>Team Beta</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Rate Request Source</Label>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="opportunitySource" value="Online" checked={formData.opportunitySource === "Online"} onChange={handleChange} />
                  <span className="text-sm">Online</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="opportunitySource" value="Offline" checked={formData.opportunitySource === "Offline"} onChange={handleChange} />
                  <span className="text-sm">Offline</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Rate Request Type</Label>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="opportunityType" value="New Client" checked={formData.opportunityType === "New Client"} onChange={handleChange} />
                  <span className="text-sm">New Client</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="opportunityType" value="Existing Client" checked={formData.opportunityType === "Existing Client"} onChange={handleChange} />
                  <span className="text-sm">Existing Client</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Type</Label>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="type" value="Shipment" checked={formData.type === "Shipment"} onChange={handleChange} />
                  <span className="text-sm">Shipment</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="type" value="Service Job" checked={formData.type === "Service Job"} onChange={handleChange} />
                  <span className="text-sm">Service Job</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salesAgent" className="text-sm font-semibold">
                Sales Agent
              </Label>
              <select id="salesAgent" name="sales_agent" value={formData.sales_agent} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                <option value="">Select</option>
                <option>John Doe</option>
                <option>Jane Smith</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-semibold">
                Company
              </Label>
              <select id="company" name="company" value={formData.company} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                <option>Relay Logistics Private Limited</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricingTeam" className="text-sm font-semibold">
                Pricing Team
              </Label>
              <select id="pricingTeam" name="pricing_team" value={formData.pricing_team} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                <option value="">Select</option>
                <option>Pricing Team A</option>
                <option>Pricing Team B</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingProviders" className="text-sm font-semibold">
                Shipping Providers
              </Label>
              <select id="shippingProviders" name="shipping_providers" value={formData.shipping_providers} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                <option value="">Select</option>
                <option>Maersk</option>
                <option>MSC</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-semibold">
                Status
              </Label>
              <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                <option value="Open">Open</option>
                <option value="Active">Active</option>
                <option value="Created">Created</option>
                <option value="Closed">Closed</option>
                <option value="On Hold">On Hold</option>
                <option value="Pending">Pending</option>
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
                  name="transport_mode"
                  value={formData.transport_mode}
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
                  name="shipment_type"
                  value={formData.shipment_type}
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
                  name="cargo_type"
                  value={formData.cargo_type}
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
                <select id="incoterms" name="incoterms" value={formData.incoterms} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
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
                <select id="commodity" name="commodity" value={formData.commodity} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
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
                <select id="serviceMode" name="service_mode" value={formData.service_mode} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  <option>Door to Door</option>
                  <option>Port to Port</option>
                  <option>Door to Port</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedShipmentDate" className="text-sm font-semibold">
                  Estimated Shipment Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="estimatedShipmentDate"
                  name="estimated_shipment_date"
                  type="date"
                  value={formData.estimated_shipment_date}
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value) setErrors(prev => ({ ...prev, estimated_shipment_date: "" }));
                  }}
                  className={errors.estimated_shipment_date ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.estimated_shipment_date && (
                  <p className="text-red-500 text-xs">{errors.estimated_shipment_date}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Cargo Status</Label>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="cargo_status" value="Ready to Ship" checked={formData.cargo_status === "Ready to Ship"} onChange={handleChange} />
                    <span className="text-sm">Ready to Ship</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="cargo_status" value="Ship Later" checked={formData.cargo_status === "Ship Later"} onChange={handleChange} />
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
                  name="origin_country"
                  value={formData.origin_country}
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
                  name="destination_country"
                  value={formData.destination_country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg"
                >
                  <option value="">Select</option>
                  <option>United States</option>
                  <option>China</option>
                  <option>India</option>
                  <option>UAE</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cargoDescription" className="text-sm font-semibold">
                  Cargo Description
                </Label>
                <Textarea
                  id="cargoDescription"
                  name="cargo_description"
                  value={formData.cargo_description}
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
                <select id="customer" name="customer" value={formData.customer} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  <option>XYZ Trading</option>
                  <option>ABC Corp</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson" className="text-sm font-semibold">
                  Contact Person
                </Label>
                <Input id="contactPerson" name="contact_person" value={formData.contact_person} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation" className="text-sm font-semibold">
                  Designation
                </Label>
                <Input id="designation" name="designation" value={formData.designation} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Customer Type</Label>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="customer_type" value="Corporate" checked={formData.customer_type === "Corporate"} onChange={handleChange} />
                    <span className="text-sm">Corporate</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="customer_type" value="Individual" checked={formData.customer_type === "Individual"} onChange={handleChange} />
                    <span className="text-sm">Individual</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prospect" className="text-sm font-semibold">
                  Prospect
                </Label>
                <select id="prospect" name="prospect" value={formData.prospect} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  <option>Hot</option>
                  <option>Warm</option>
                  <option>Cold</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-semibold">
                  Department
                </Label>
                <Input id="department" name="department" value={formData.department} onChange={handleChange} />
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="addressStreet1" className="text-sm font-semibold">
                  Address
                </Label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Input id="addressStreet1" name="address_street1" placeholder="Street 1..." value={formData.address_street1} onChange={handleChange} />
                  <Input id="addressStreet2" name="address_street2" placeholder="Street 2..." value={formData.address_street2} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <Input placeholder="State" name="address_state" value={formData.address_state} onChange={handleChange} />
                  <Input placeholder="City" name="address_city" value={formData.address_city} onChange={handleChange} />
                  <Input placeholder="ZIP" name="address_zip" value={formData.address_zip} onChange={handleChange} />
                  <select name="address_country" value={formData.address_country} onChange={handleChange} className="px-3 py-2 border border-input rounded-lg">
                    <option value="">Country</option>
                    <option>United States</option>
                    <option>India</option>
                    <option>UAE</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email
                </Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephoneNo" className="text-sm font-semibold">
                  Telephone No
                </Label>
                <Input id="telephoneNo" name="telephone_no" value={formData.telephone_no} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNo" className="text-sm font-semibold">
                  Mobile No
                </Label>
                <Input id="mobileNo" name="mobile_no" value={formData.mobile_no} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Vendor Rate Comparison */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Vendor Rate Comparison</h2>
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-3 gap-4 font-semibold text-sm">
                <div>Agent</div>
                <div>Currency</div>
                <div>Rate Total</div>
              </div>
              {vendorRates.map((vr) => (
                <div key={vr.id} className="grid grid-cols-3 gap-4 items-center">
                  <Input
                    placeholder="Vendor Agent"
                    value={vr.vendor_agent}
                    onChange={(e) => setVendorRates(vendorRates.map(r => r.id === vr.id ? { ...r, vendor_agent: e.target.value } : r))}
                  />
                  <select
                    value={vr.currency}
                    onChange={(e) => setVendorRates(vendorRates.map(r => r.id === vr.id ? { ...r, currency: e.target.value } : r))}
                    className="w-full px-3 py-2 border border-input rounded-lg"
                  >
                    <option>USD</option>
                    <option>INR</option>
                    <option>EUR</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={vr.rate_total}
                      onChange={(e) => setVendorRates(vendorRates.map(r => r.id === vr.id ? { ...r, rate_total: e.target.value } : r))}
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => setVendorRates(vendorRates.filter(r => r.id !== vr.id))}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setVendorRates([...vendorRates, { id: Date.now(), vendor_agent: "", currency: "USD", rate_total: "" }])}
                className="text-primary text-sm font-medium hover:underline"
              >
                Add a line
              </button>
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
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">DATE</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">TIME</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">MODE OF COMMUNICATION</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">VISITED BY</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">PURPOSE</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">NOTES</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerVisits.length === 0 ? (
                      <tr><td colSpan={7} className="p-4 text-center text-muted-foreground text-sm">No visits added yet</td></tr>
                    ) : (
                      customerVisits.map((visit) => (
                        <tr key={visit.id} className="border-t border-border">
                          <td className="p-3 text-sm">{visit.visit_date}</td>
                          <td className="p-3 text-sm">{visit.visit_time}</td>
                          <td className="p-3 text-sm">{visit.mode_of_communication}</td>
                          <td className="p-3 text-sm">{visit.visited_by}</td>
                          <td className="p-3 text-sm">{visit.purpose}</td>
                          <td className="p-3 text-sm">{visit.visit_notes}</td>
                          <td className="p-3 text-sm">
                            <button
                              type="button"
                              onClick={() => removeVisit(visit.id)}
                              className="text-destructive hover:bg-destructive/10 p-1 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
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
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-3 gap-4 font-semibold text-sm">
                <div>Service</div>
                <div>Container Type</div>
                <div>Container Quantity</div>
              </div>
              {serviceLines.map((line) => (
                <div key={line.id} className="grid grid-cols-3 gap-4 items-center">
                  <select
                    value={line.service}
                    onChange={(e) => setServiceLines(serviceLines.map(s => s.id === line.id ? { ...s, service: e.target.value } : s))}
                    className="w-full px-3 py-2 border border-input rounded-lg"
                  >
                    <option value="">Select Service</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Custom Clearance">Custom Clearance</option>
                    <option value="Packaging">Packaging</option>
                  </select>
                  <select
                    value={line.containerType}
                    onChange={(e) => setServiceLines(serviceLines.map(s => s.id === line.id ? { ...s, containerType: e.target.value } : s))}
                    className="w-full px-3 py-2 border border-input rounded-lg"
                  >
                    <option value="">Select</option>
                    <option value="20GP">20ft Container (20GP)</option>
                    <option value="40HC">40ft HC Container (40HC)</option>
                    <option value="40FT">40ft Container (40FT)</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={line.containerQuantity}
                      onChange={(e) => setServiceLines(serviceLines.map(s => s.id === line.id ? { ...s, containerQuantity: parseInt(e.target.value) || 1 } : s))}
                      className="flex-1"
                    />
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
              <button
                type="button"
                onClick={addServiceLine}
                className="text-primary text-sm font-medium hover:underline"
              >
                Add a line
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" className="bg-red-400 text-black hover:bg-red-350" onClick={() => navigate("/sales/opportunity")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || submitted} className="material-button text-black">
              {loading ? "Saving..." : "Save Rate Request"}
            </Button>
          </div>
        </div>
      </form>

      {/* Visit Dialog - outside form to prevent accidental submission */}
      {showVisitDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl material-elevation-4 w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-primary">Create Customer Visit Information</h2>
              <button onClick={() => setShowVisitDialog(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Visit Date</Label>
                  <Input type="date" name="visit_date" value={visitFormData.visit_date} onChange={handleVisitChange} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Visit Time</Label>
                  <Input type="time" name="visit_time" value={visitFormData.visit_time} onChange={handleVisitChange} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Mode of Communication</Label>
                  <select name="mode_of_communication" value={visitFormData.mode_of_communication} onChange={handleVisitChange} className="w-full px-3 py-2 border border-input rounded-lg h-10">
                    <option value="">Select</option>
                    <option>Phone</option>
                    <option>Email</option>
                    <option>In-Person</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Visited By</Label>
                  <select name="visited_by" value={visitFormData.visited_by} onChange={handleVisitChange} className="w-full px-3 py-2 border border-input rounded-lg h-10">
                    <option value="">Select</option>
                    <option>John Doe</option>
                    <option>Jane Smith</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Purpose</Label>
                  <Input name="purpose" value={visitFormData.purpose} onChange={handleVisitChange} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Next Visit</Label>
                  <select value={hasNextVisit ? "Yes" : "No"} onChange={(e) => setHasNextVisit(e.target.value === "Yes")} className="w-full px-3 py-2 border border-input rounded-lg h-10">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                {hasNextVisit && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Next Visit Date</Label>
                      <Input type="date" name="next_visit" value={visitFormData.next_visit} onChange={handleVisitChange} className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Next Followup Date</Label>
                      <Input type="date" name="next_followup_date" value={visitFormData.next_followup_date} onChange={handleVisitChange} className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Assign To</Label>
                      <select name="assign_to" value={visitFormData.assign_to} onChange={handleVisitChange} className="w-full px-3 py-2 border border-input rounded-lg h-10">
                        <option value="">Select</option>
                        <option>John Doe</option>
                        <option>Jane Smith</option>
                      </select>
                    </div>
                  </>
                )}
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-semibold">Notes</Label>
                  <Textarea name="visit_notes" value={visitFormData.visit_notes} onChange={handleVisitChange} rows={3} className="w-full" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-start gap-3 p-6 border-t border-border">
              <Button type="button" className="bg-primary text-black" onClick={handleAddVisit}>Save</Button>
              <Button type="button" variant="outline" className="gap-2" onClick={handleAddVisitAndMore}>
                <Plus className="w-4 h-4" /> Add More
              </Button>
              <Button type="button" variant="outline" onClick={() => { resetVisitForm(); setShowVisitDialog(false); }}>Discard</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewOpportunity;
