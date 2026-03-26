import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { createRateRequestApi, updateRateRequestApi, getOpportunityApi } from "@/services/api";

interface VendorRate {
  id: number;
  vendor_agent: string;
  currency: string;
  rate_total: number;
}

interface AdditionalService {
  id: number;
  additional_service: string;
  container_type: string;
  container_quantity: number;
}

interface CustomerVisit {
  id: number;
  visit_date: string;
  visit_time: string;
  next_visit: string;
  next_followup_date: string;
  assign_to: string;
  mode_of_communication: string;
  visited_by: string;
  purpose: string;
  visit_notes: string;
}

interface RateRequestForm {
  date: string;
  location: string;
  lead: string;
  sales_team: string;
  opportunity_source: string;
  opportunity_type: string;
  type: string;
  sales_agent: string;
  company: string;
  pricing_team: string;
  shipping_providers: string;
  status: string;
  shipment_details: {
    transport_mode: string;
    shipment_type: string;
    cargo_type: string;
    incoterms: string;
    commodity: string;
    service_mode: string;
    estimated_shipment_date: string;
    cargo_status: string;
    origin_country: string;
    destination_country: string;
    cargo_description: string;
  };
  party_details: {
    customer: string;
    contact_person: string;
    designation: string;
    customer_type: string;
    prospect: string;
    department: string;
    address_street1: string;
    address_street2: string;
    address_state: string;
    address_city: string;
    address_zip: string;
    address_country: string;
    email: string;
    telephone_no: string;
    mobile_no: string;
  };
  vendor_rates: VendorRate[];
  additional_services: AdditionalService[];
  customer_visits: CustomerVisit[];
}

const initialForm: RateRequestForm = {
  date: "",
  location: "",
  lead: "",
  sales_team: "",
  opportunity_source: "",
  opportunity_type: "",
  type: "",
  sales_agent: "",
  company: "",
  pricing_team: "",
  shipping_providers: "",
  status: "Pending",
  shipment_details: {
    transport_mode: "",
    shipment_type: "",
    cargo_type: "",
    incoterms: "",
    commodity: "",
    service_mode: "",
    estimated_shipment_date: "",
    cargo_status: "",
    origin_country: "",
    destination_country: "",
    cargo_description: "",
  },
  party_details: {
    customer: "",
    contact_person: "",
    designation: "",
    customer_type: "",
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
  },
  vendor_rates: [],
  additional_services: [],
  customer_visits: [],
};

const emptyVendorRate = (): VendorRate => ({ id: Date.now(), vendor_agent: "", currency: "USD", rate_total: 0 });
const emptyAdditionalService = (): AdditionalService => ({ id: Date.now(), additional_service: "", container_type: "", container_quantity: 1 });
const emptyCustomerVisit = (): CustomerVisit => ({
  id: Date.now(),
  visit_date: "",
  visit_time: "",
  next_visit: "",
  next_followup_date: "",
  assign_to: "",
  mode_of_communication: "",
  visited_by: "",
  purpose: "",
  visit_notes: "",
});

const NewRateRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<RateRequestForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Vendor Rate Modal State
  const [vendorRateModal, setVendorRateModal] = useState(false);
  const [vendorRateDraft, setVendorRateDraft] = useState<VendorRate>(emptyVendorRate());
  const [vendorRateMode, setVendorRateMode] = useState<"add" | "edit">("add");

  // Additional Service Modal State
  const [serviceModal, setServiceModal] = useState(false);
  const [serviceDraft, setServiceDraft] = useState<AdditionalService>(emptyAdditionalService());
  const [serviceMode, setServiceMode] = useState<"add" | "edit">("add");

  // Customer Visit Modal State
  const [visitModal, setVisitModal] = useState(false);
  const [visitDraft, setVisitDraft] = useState<CustomerVisit>(emptyCustomerVisit());
  const [visitMode, setVisitMode] = useState<"add" | "edit">("add");

  useEffect(() => {
    if (id) {
      fetchRateRequest();
    }
  }, [id]);

  const fetchRateRequest = async () => {
    try {
      setFetching(true);
      const res = await getOpportunityApi(id!);
      const data = res.data;
      setForm(data);
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to load rate request", variant: "destructive" });
      navigate("/sales/rate-requests");
    } finally {
      setFetching(false);
    }
  };

  if (fetching) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/sales/rate-requests")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-bold text-foreground">Loading...</h2>
        </div>
      </div>
    );
  }

  const handleBasicChange = (field: keyof Omit<RateRequestForm, "shipment_details" | "party_details" | "vendor_rates" | "additional_services" | "customer_visits">, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleShipmentChange = (field: keyof RateRequestForm["shipment_details"], value: string) => {
    setForm((prev) => ({ ...prev, shipment_details: { ...prev.shipment_details, [field]: value } }));
  };

  const handlePartyChange = (field: keyof RateRequestForm["party_details"], value: string) => {
    setForm((prev) => ({ ...prev, party_details: { ...prev.party_details, [field]: value } }));
  };

  // Vendor Rate handlers
  const openVendorRateModal = () => {
    setVendorRateDraft(emptyVendorRate());
    setVendorRateMode("add");
    setVendorRateModal(true);
  };

  const openEditVendorRateModal = (rate: VendorRate) => {
    setVendorRateDraft({ ...rate });
    setVendorRateMode("edit");
    setVendorRateModal(true);
  };

  const saveVendorRate = () => {
    if (!vendorRateDraft.vendor_agent.trim()) {
      toast({ title: "Error", description: "Vendor agent is required", variant: "destructive" });
      return;
    }
    if (vendorRateMode === "add") {
      setForm((prev) => ({ ...prev, vendor_rates: [...prev.vendor_rates, { ...vendorRateDraft, id: Date.now() }] }));
    } else {
      setForm((prev) => ({
        ...prev,
        vendor_rates: prev.vendor_rates.map((r) => (r.id === vendorRateDraft.id ? vendorRateDraft : r)),
      }));
    }
    setVendorRateModal(false);
  };

  const removeVendorRate = (rateId: number) => {
    setForm((prev) => ({ ...prev, vendor_rates: prev.vendor_rates.filter((r) => r.id !== rateId) }));
  };

  // Additional Service handlers
  const openServiceModal = () => {
    setServiceDraft(emptyAdditionalService());
    setServiceMode("add");
    setServiceModal(true);
  };

  const openEditServiceModal = (service: AdditionalService) => {
    setServiceDraft({ ...service });
    setServiceMode("edit");
    setServiceModal(true);
  };

  const saveService = () => {
    if (!serviceDraft.additional_service.trim()) {
      toast({ title: "Error", description: "Service name is required", variant: "destructive" });
      return;
    }
    if (serviceMode === "add") {
      setForm((prev) => ({ ...prev, additional_services: [...prev.additional_services, { ...serviceDraft, id: Date.now() }] }));
    } else {
      setForm((prev) => ({
        ...prev,
        additional_services: prev.additional_services.map((s) => (s.id === serviceDraft.id ? serviceDraft : s)),
      }));
    }
    setServiceModal(false);
  };

  const removeService = (serviceId: number) => {
    setForm((prev) => ({ ...prev, additional_services: prev.additional_services.filter((s) => s.id !== serviceId) }));
  };

  // Customer Visit handlers
  const openVisitModal = () => {
    setVisitDraft(emptyCustomerVisit());
    setVisitMode("add");
    setVisitModal(true);
  };

  const openEditVisitModal = (visit: CustomerVisit) => {
    setVisitDraft({ ...visit });
    setVisitMode("edit");
    setVisitModal(true);
  };

  const saveVisit = () => {
    if (!visitDraft.visit_date.trim()) {
      toast({ title: "Error", description: "Visit date is required", variant: "destructive" });
      return;
    }
    if (visitMode === "add") {
      setForm((prev) => ({ ...prev, customer_visits: [...prev.customer_visits, { ...visitDraft, id: Date.now() }] }));
    } else {
      setForm((prev) => ({
        ...prev,
        customer_visits: prev.customer_visits.map((v) => (v.id === visitDraft.id ? visitDraft : v)),
      }));
    }
    setVisitModal(false);
  };

  const removeVisit = (visitId: number) => {
    setForm((prev) => ({ ...prev, customer_visits: prev.customer_visits.filter((v) => v.id !== visitId) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await updateRateRequestApi(id, form);
        toast({ title: "Success", description: "Rate Request updated successfully", variant: "success" });
      } else {
        await createRateRequestApi(form);
        toast({ title: "Success", description: "Rate Request created successfully", variant: "success" });
      }
      navigate("/sales/rate-requests");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to save rate request";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/sales/rate-requests")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-bold text-foreground">{id ? "Edit Rate Request" : "New Rate Request"}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="material-card material-elevation-1 p-6 space-y-8">
          {/* Basic Details */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">Basic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Date <span className="text-red-500">*</span></Label>
                <Input type="date" value={form.date} onChange={(e) => handleBasicChange("date", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Location</Label>
                <Input placeholder="Location" value={form.location} onChange={(e) => handleBasicChange("location", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Lead <span className="text-red-500">*</span></Label>
                <Input placeholder="Lead number" value={form.lead} onChange={(e) => handleBasicChange("lead", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Sales Team</Label>
                <Input placeholder="Sales Team" value={form.sales_team} onChange={(e) => handleBasicChange("sales_team", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Opportunity Source</Label>
                <Input placeholder="Source" value={form.opportunity_source} onChange={(e) => handleBasicChange("opportunity_source", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Opportunity Type</Label>
                <Input placeholder="Type" value={form.opportunity_type} onChange={(e) => handleBasicChange("opportunity_type", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Type</Label>
                <select value={form.type} onChange={(e) => handleBasicChange("type", e.target.value)} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  <option value="Import">Import</option>
                  <option value="Export">Export</option>
                  <option value="Domestic">Domestic</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Sales Agent</Label>
                <Input placeholder="Agent name" value={form.sales_agent} onChange={(e) => handleBasicChange("sales_agent", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Company</Label>
                <Input placeholder="Company" value={form.company} onChange={(e) => handleBasicChange("company", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Pricing Team</Label>
                <Input placeholder="Pricing team" value={form.pricing_team} onChange={(e) => handleBasicChange("pricing_team", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Shipping Providers</Label>
                <Input placeholder="Provider" value={form.shipping_providers} onChange={(e) => handleBasicChange("shipping_providers", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Status</Label>
                <select value={form.status} onChange={(e) => handleBasicChange("status", e.target.value)} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Shipment Details */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">Shipment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Transport Mode <span className="text-red-500">*</span></Label>
                <select value={form.shipment_details.transport_mode} onChange={(e) => handleShipmentChange("transport_mode", e.target.value)} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  <option value="Air">Air</option>
                  <option value="Sea">Sea</option>
                  <option value="Road">Road</option>
                  <option value="Rail">Rail</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Shipment Type <span className="text-red-500">*</span></Label>
                <select value={form.shipment_details.shipment_type} onChange={(e) => handleShipmentChange("shipment_type", e.target.value)} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  <option value="FCL">FCL</option>
                  <option value="LCL">LCL</option>
                  <option value="Air Freight">Air Freight</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Cargo Type</Label>
                <Input placeholder="General, Hazardous, etc." value={form.shipment_details.cargo_type} onChange={(e) => handleShipmentChange("cargo_type", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Incoterms</Label>
                <Input placeholder="FOB, CIF, EXW, etc." value={form.shipment_details.incoterms} onChange={(e) => handleShipmentChange("incoterms", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Commodity</Label>
                <Input placeholder="Commodity" value={form.shipment_details.commodity} onChange={(e) => handleShipmentChange("commodity", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Service Mode</Label>
                <Input placeholder="Door to Door, Port to Port, etc." value={form.shipment_details.service_mode} onChange={(e) => handleShipmentChange("service_mode", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Estimated Shipment Date</Label>
                <Input type="date" value={form.shipment_details.estimated_shipment_date} onChange={(e) => handleShipmentChange("estimated_shipment_date", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Cargo Status</Label>
                <Input placeholder="Ready, Pending, etc." value={form.shipment_details.cargo_status} onChange={(e) => handleShipmentChange("cargo_status", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Origin Country</Label>
                <Input placeholder="Origin Country" value={form.shipment_details.origin_country} onChange={(e) => handleShipmentChange("origin_country", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Destination Country</Label>
                <Input placeholder="Destination Country" value={form.shipment_details.destination_country} onChange={(e) => handleShipmentChange("destination_country", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-semibold">Cargo Description</Label>
                <textarea className="w-full px-3 py-2 border border-input rounded-lg" placeholder="Cargo description" value={form.shipment_details.cargo_description} onChange={(e) => handleShipmentChange("cargo_description", e.target.value)}></textarea>
              </div>
            </div>
          </div>

          {/* Party Details */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">Party Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Customer <span className="text-red-500">*</span></Label>
                <Input placeholder="Customer name" value={form.party_details.customer} onChange={(e) => handlePartyChange("customer", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Contact Person</Label>
                <Input placeholder="Contact person" value={form.party_details.contact_person} onChange={(e) => handlePartyChange("contact_person", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Designation</Label>
                <Input placeholder="Designation" value={form.party_details.designation} onChange={(e) => handlePartyChange("designation", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Customer Type</Label>
                <Input placeholder="Corporate, Individual, etc." value={form.party_details.customer_type} onChange={(e) => handlePartyChange("customer_type", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Prospect</Label>
                <Input placeholder="Hot, Warm, Cold" value={form.party_details.prospect} onChange={(e) => handlePartyChange("prospect", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Department</Label>
                <Input placeholder="Department" value={form.party_details.department} onChange={(e) => handlePartyChange("department", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-semibold">Address Street 1</Label>
                <Input placeholder="Street address" value={form.party_details.address_street1} onChange={(e) => handlePartyChange("address_street1", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-semibold">Address Street 2</Label>
                <Input placeholder="Suite, building, etc." value={form.party_details.address_street2} onChange={(e) => handlePartyChange("address_street2", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">State</Label>
                <Input placeholder="State" value={form.party_details.address_state} onChange={(e) => handlePartyChange("address_state", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">City</Label>
                <Input placeholder="City" value={form.party_details.address_city} onChange={(e) => handlePartyChange("address_city", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Zip Code</Label>
                <Input placeholder="Zip code" value={form.party_details.address_zip} onChange={(e) => handlePartyChange("address_zip", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Country</Label>
                <Input placeholder="Country" value={form.party_details.address_country} onChange={(e) => handlePartyChange("address_country", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Email</Label>
                <Input type="email" placeholder="email@example.com" value={form.party_details.email} onChange={(e) => handlePartyChange("email", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Telephone</Label>
                <Input placeholder="Telephone number" value={form.party_details.telephone_no} onChange={(e) => handlePartyChange("telephone_no", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Mobile</Label>
                <Input placeholder="Mobile number" value={form.party_details.mobile_no} onChange={(e) => handlePartyChange("mobile_no", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Vendor Rates */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-primary">Vendor Rates</h3>
              <Button type="button" size="sm" className="material-button text-black" onClick={openVendorRateModal}>
                + Add Rate
              </Button>
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Vendor Agent</th>
                    <th className="text-left p-3 font-semibold">Currency</th>
                    <th className="text-right p-3 font-semibold">Rate Total</th>
                    <th className="text-center p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {form.vendor_rates.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center p-4 text-muted-foreground">No vendor rates added yet</td>
                    </tr>
                  ) : (
                    form.vendor_rates.map((rate) => (
                      <tr key={rate.id} className="border-t border-border">
                        <td className="p-3">{rate.vendor_agent}</td>
                        <td className="p-3">{rate.currency}</td>
                        <td className="p-3 text-right">{rate.rate_total}</td>
                        <td className="p-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button type="button" onClick={() => openEditVendorRateModal(rate)} className="text-green-500 hover:text-green-700">Edit</button>
                            <button type="button" onClick={() => removeVendorRate(rate.id)} className="text-red-500 hover:text-red-700">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Services */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-primary">Additional Services</h3>
              <Button type="button" size="sm" className="material-button text-black" onClick={openServiceModal}>
                + Add Service
              </Button>
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Service</th>
                    <th className="text-left p-3 font-semibold">Container Type</th>
                    <th className="text-right p-3 font-semibold">Quantity</th>
                    <th className="text-center p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {form.additional_services.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center p-4 text-muted-foreground">No services added yet</td>
                    </tr>
                  ) : (
                    form.additional_services.map((service) => (
                      <tr key={service.id} className="border-t border-border">
                        <td className="p-3">{service.additional_service}</td>
                        <td className="p-3">{service.container_type}</td>
                        <td className="p-3 text-right">{service.container_quantity}</td>
                        <td className="p-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button type="button" onClick={() => openEditServiceModal(service)} className="text-green-500 hover:text-green-700">Edit</button>
                            <button type="button" onClick={() => removeService(service.id)} className="text-red-500 hover:text-red-700">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Visits */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-primary">Customer Visits</h3>
              <Button type="button" size="sm" className="material-button text-black" onClick={openVisitModal}>
                + Add Visit
              </Button>
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Visit Date</th>
                    <th className="text-left p-3 font-semibold">Time</th>
                    <th className="text-left p-3 font-semibold">Purpose</th>
                    <th className="text-left p-3 font-semibold">Assign To</th>
                    <th className="text-center p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {form.customer_visits.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-4 text-muted-foreground">No visits added yet</td>
                    </tr>
                  ) : (
                    form.customer_visits.map((visit) => (
                      <tr key={visit.id} className="border-t border-border">
                        <td className="p-3">{visit.visit_date}</td>
                        <td className="p-3">{visit.visit_time}</td>
                        <td className="p-3">{visit.purpose}</td>
                        <td className="p-3">{visit.assign_to}</td>
                        <td className="p-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button type="button" onClick={() => openEditVisitModal(visit)} className="text-green-500 hover:text-green-700">Edit</button>
                            <button type="button" onClick={() => removeVisit(visit.id)} className="text-red-500 hover:text-red-700">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" className="bg-red-400 text-black hover:bg-red-350" onClick={() => navigate("/sales/rate-requests")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="material-button text-black">
              {loading ? "Saving..." : id ? "Update Request" : "Save Request"}
            </Button>
          </div>
        </div>
      </form>

      {/* Vendor Rate Modal */}
      {vendorRateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{vendorRateMode === "add" ? "Add Vendor Rate" : "Edit Vendor Rate"}</h3>
              <button onClick={() => setVendorRateModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Vendor Agent</Label>
                <Input placeholder="Vendor name" value={vendorRateDraft.vendor_agent} onChange={(e) => setVendorRateDraft({ ...vendorRateDraft, vendor_agent: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <select value={vendorRateDraft.currency} onChange={(e) => setVendorRateDraft({ ...vendorRateDraft, currency: e.target.value })} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Rate Total</Label>
                <Input type="number" placeholder="0.00" value={vendorRateDraft.rate_total} onChange={(e) => setVendorRateDraft({ ...vendorRateDraft, rate_total: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setVendorRateModal(false)}>Cancel</Button>
              <Button type="button" className="flex-1 material-button text-black" onClick={saveVendorRate}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* Additional Service Modal */}
      {serviceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{serviceMode === "add" ? "Add Service" : "Edit Service"}</h3>
              <button onClick={() => setServiceModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Service Name</Label>
                <Input placeholder="Service name" value={serviceDraft.additional_service} onChange={(e) => setServiceDraft({ ...serviceDraft, additional_service: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Container Type</Label>
                <Input placeholder="20GP, 40HC, etc." value={serviceDraft.container_type} onChange={(e) => setServiceDraft({ ...serviceDraft, container_type: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" placeholder="0" value={serviceDraft.container_quantity} onChange={(e) => setServiceDraft({ ...serviceDraft, container_quantity: parseInt(e.target.value) || 1 })} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setServiceModal(false)}>Cancel</Button>
              <Button type="button" className="flex-1 material-button text-black" onClick={saveService}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Visit Modal */}
      {visitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 max-h-screen overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{visitMode === "add" ? "Add Visit" : "Edit Visit"}</h3>
              <button onClick={() => setVisitModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                <Label>Visit Date</Label>
                <Input type="date" value={visitDraft.visit_date} onChange={(e) => setVisitDraft({ ...visitDraft, visit_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Visit Time</Label>
                <Input type="time" value={visitDraft.visit_time} onChange={(e) => setVisitDraft({ ...visitDraft, visit_time: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Next Visit</Label>
                <Input type="date" value={visitDraft.next_visit} onChange={(e) => setVisitDraft({ ...visitDraft, next_visit: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Next Followup Date</Label>
                <Input type="date" value={visitDraft.next_followup_date} onChange={(e) => setVisitDraft({ ...visitDraft, next_followup_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Input placeholder="Person name" value={visitDraft.assign_to} onChange={(e) => setVisitDraft({ ...visitDraft, assign_to: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Mode of Communication</Label>
                <Input placeholder="In-Person, Phone, Email, etc." value={visitDraft.mode_of_communication} onChange={(e) => setVisitDraft({ ...visitDraft, mode_of_communication: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Visited By</Label>
                <Input placeholder="Person name" value={visitDraft.visited_by} onChange={(e) => setVisitDraft({ ...visitDraft, visited_by: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Purpose</Label>
                <Input placeholder="Rate Discussion, Follow-up, etc." value={visitDraft.purpose} onChange={(e) => setVisitDraft({ ...visitDraft, purpose: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Visit Notes</Label>
                <textarea className="w-full px-3 py-2 border border-input rounded-lg" placeholder="Visit notes" value={visitDraft.visit_notes} onChange={(e) => setVisitDraft({ ...visitDraft, visit_notes: e.target.value })}></textarea>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setVisitModal(false)}>Cancel</Button>
              <Button type="button" className="flex-1 material-button text-black" onClick={saveVisit}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewRateRequest;
