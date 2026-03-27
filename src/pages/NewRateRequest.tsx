import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { createRateRequestApi, updateRateRequestApi, getOpportunityApi, getLeadsApi } from "@/services/api";

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

// Convert any date string to YYYY-MM-DD for <input type="date">
const toInputDate = (val: string): string => {
  if (!val) return "";
  // already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(val)) return val.slice(0, 10);
  // DD-MM-YYYY or DD/MM/YYYY
  const m = val.match(/(\d{2})[\-\/](\d{2})[\-\/](\d{4})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return val;
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
  const [leads, setLeads] = useState<{ id: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);

  useEffect(() => {
    getLeadsApi().then((res) => {
      const raw = res.data;
      const list = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : Array.isArray(raw?.data?.data) ? raw.data.data : [];
      setLeads(list);
    }).catch(() => {});
  }, []);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Vendor Rate Modal State
  const [vendorRateModal, setVendorRateModal] = useState(false);

  // Additional Service Modal State
  const [serviceModal, setServiceModal] = useState(false);

  // Customer Visit Modal State
  const [visitModal, setVisitModal] = useState(false);
  const [visitDraft, setVisitDraft] = useState<CustomerVisit>(emptyCustomerVisit());
  const [visitNextVisit, setVisitNextVisit] = useState("No");

  useEffect(() => {
    if (id) {
      fetchRateRequest();
    }
  }, [id]);

  const fetchRateRequest = async () => {
    try {
      setFetching(true);
      const res = await getOpportunityApi(id!);
      const raw = res.data;
      const data = raw?.data ?? raw;
      setForm({
        date: toInputDate(data.date ?? ""),
        location: data.location ?? "",
        lead: (() => { const v = data.lead_ref ?? data.lead ?? ""; if (!v) return ""; return /^LEAD-/.test(String(v)) ? String(v) : `LEAD-${String(v).padStart(3, "0")}`; })(),
        sales_team: data.sales_team ?? "",
        opportunity_source: data.opportunity_source ?? "",
        opportunity_type: data.opportunity_type ?? "",
        type: data.type ?? "",
        sales_agent: data.sales_agent ?? "",
        company: data.company ?? "",
        pricing_team: data.pricing_team ?? "",
        shipping_providers: data.shipping_providers ?? "",
        status: data.status ?? "Pending",
        shipment_details: {
          transport_mode: data.shipment_details?.transport_mode ?? "",
          shipment_type: data.shipment_details?.shipment_type ?? "",
          cargo_type: data.shipment_details?.cargo_type ?? "",
          incoterms: data.shipment_details?.incoterms ?? "",
          commodity: data.shipment_details?.commodity ?? "",
          service_mode: data.shipment_details?.service_mode ?? "",
          estimated_shipment_date: toInputDate(data.shipment_details?.estimated_shipment_date ?? ""),
          cargo_status: data.shipment_details?.cargo_status ?? "",
          origin_country: data.shipment_details?.origin_country ?? "",
          destination_country: data.shipment_details?.destination_country ?? "",
          cargo_description: data.shipment_details?.cargo_description ?? "",
        },
        party_details: {
          customer: data.party_details?.customer ?? "",
          contact_person: data.party_details?.contact_person ?? "",
          designation: data.party_details?.designation ?? "",
          customer_type: data.party_details?.customer_type ?? "",
          prospect: data.party_details?.prospect ?? "",
          department: data.party_details?.department ?? "",
          address_street1: data.party_details?.address_street1 ?? "",
          address_street2: data.party_details?.address_street2 ?? "",
          address_state: data.party_details?.address_state ?? "",
          address_city: data.party_details?.address_city ?? "",
          address_zip: data.party_details?.address_zip ?? "",
          address_country: data.party_details?.address_country ?? "",
          email: data.party_details?.email ?? "",
          telephone_no: data.party_details?.telephone_no ?? "",
          mobile_no: data.party_details?.mobile_no ?? "",
        },
        vendor_rates: Array.isArray(data.vendor_rates)
          ? data.vendor_rates.map((r: any, i: number) => ({ id: r.id ?? i, vendor_agent: r.vendor_agent ?? "", currency: r.currency ?? "USD", rate_total: r.rate_total ?? 0 }))
          : [],
        additional_services: Array.isArray(data.additional_services)
          ? data.additional_services.map((s: any, i: number) => ({ id: s.id ?? i, additional_service: s.additional_service ?? "", container_type: s.container_type ?? "", container_quantity: s.container_quantity ?? 1 }))
          : [],
        customer_visits: Array.isArray(data.customer_visits)
          ? data.customer_visits.map((v: any, i: number) => ({ id: v.id ?? i, visit_date: v.visit_date ?? "", visit_time: v.visit_time ?? "", next_visit: v.next_visit ?? "", next_followup_date: v.next_followup_date ?? "", assign_to: v.assign_to ?? "", mode_of_communication: v.mode_of_communication ?? "", visited_by: v.visited_by ?? "", purpose: v.purpose ?? "", visit_notes: v.visit_notes ?? "" }))
          : [],
      });
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to load rate request", variant: "destructive" });
      navigate("/sales/opportunity");
    } finally {
      setFetching(false);
    }
  };

  if (fetching) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/sales/opportunity")}>
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
  const removeVendorRate = (rateId: number) => {
    setForm((prev) => ({ ...prev, vendor_rates: prev.vendor_rates.filter((r) => r.id !== rateId) }));
  };

  // Additional Service handlers
  const removeService = (serviceId: number) => {
    setForm((prev) => ({ ...prev, additional_services: prev.additional_services.filter((s) => s.id !== serviceId) }));
  };

  // Customer Visit handlers
  const openVisitModal = () => {
    setVisitDraft(emptyCustomerVisit());
    setVisitNextVisit("No");
    setVisitModal(true);
  };

  const handleAddVisit = () => {
    if (!visitDraft.visit_date || !visitDraft.mode_of_communication || !visitDraft.visited_by || !visitDraft.purpose) {
      toast({ title: "Error", description: "Please fill all required visit fields", variant: "destructive" });
      return;
    }
    setForm((prev) => ({ ...prev, customer_visits: [...prev.customer_visits, { ...visitDraft, id: Date.now() }] }));
    setVisitModal(false);
  };

  const removeVisit = (visitId: number) => {
    setForm((prev) => ({ ...prev, customer_visits: prev.customer_visits.filter((v) => v.id !== visitId) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { lead, ...rest } = form;
      const payload = { ...rest, lead_ref: lead };
      if (id) {
        await updateRateRequestApi(id, payload);
        toast({ title: "Success", description: "Rate Request updated successfully", variant: "success" });
      } else {
        await createRateRequestApi(payload);
        toast({ title: "Success", description: "Rate Request created successfully", variant: "success" });
      }
      navigate("/sales/opportunity");
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
        <Button variant="outline" size="icon" onClick={() => navigate("/sales/opportunity")}>
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
                <select value={form.lead} onChange={(e) => handleBasicChange("lead", e.target.value)} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  {leads.map((lead) => {
                    const formatted = `LEAD-${String(lead.id).padStart(3, "0")}`;
                    return <option key={lead.id} value={formatted}>{formatted}</option>;
                  })}
                </select>
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
            <h3 className="text-lg font-bold text-primary mb-4">Vendor Rate Comparison</h3>
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-3 gap-4 font-semibold text-sm">
                <div>Agent</div>
                <div>Currency</div>
                <div>Rate Total</div>
              </div>
              {form.vendor_rates.map((vr) => (
                <div key={vr.id} className="grid grid-cols-3 gap-4 items-center">
                  <Input
                    placeholder="Vendor Agent"
                    value={vr.vendor_agent}
                    onChange={(e) => setForm((prev) => ({ ...prev, vendor_rates: prev.vendor_rates.map((r) => r.id === vr.id ? { ...r, vendor_agent: e.target.value } : r) }))}
                  />
                  <select
                    value={vr.currency}
                    onChange={(e) => setForm((prev) => ({ ...prev, vendor_rates: prev.vendor_rates.map((r) => r.id === vr.id ? { ...r, currency: e.target.value } : r) }))}
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
                      onChange={(e) => setForm((prev) => ({ ...prev, vendor_rates: prev.vendor_rates.map((r) => r.id === vr.id ? { ...r, rate_total: parseFloat(e.target.value) || 0 } : r) }))}
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeVendorRate(vr.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, vendor_rates: [...prev.vendor_rates, { id: Date.now(), vendor_agent: "", currency: "USD", rate_total: 0 }] }))}
                className="text-primary text-sm font-medium hover:underline"
              >
                Add a line
              </button>
            </div>
          </div>

          {/* Customer Visits */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">Customer Visit Information</h3>
            <div className="space-y-4">
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">DATE & TIME</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">MODE OF COMMUNICATION</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">VISITED BY</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">PURPOSE</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">NOTES</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.customer_visits.length === 0 ? (
                      <tr><td colSpan={6} className="p-4 text-center text-muted-foreground text-sm">No visits added yet</td></tr>
                    ) : (
                      form.customer_visits.map((visit) => (
                        <tr key={visit.id} className="border-t border-border">
                          <td className="p-3 text-sm">{visit.visit_date} {visit.visit_time}</td>
                          <td className="p-3 text-sm">{visit.mode_of_communication}</td>
                          <td className="p-3 text-sm">{visit.visited_by}</td>
                          <td className="p-3 text-sm">{visit.purpose}</td>
                          <td className="p-3 text-sm">{visit.visit_notes}</td>
                          <td className="p-3 text-sm">
                            <button type="button" onClick={() => removeVisit(visit.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <Button type="button" variant="outline" className="gap-2" onClick={openVisitModal}>
                + Add Line
              </Button>
            </div>
          </div>

          {/* Additional Services */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">Additional Services</h3>
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-3 gap-4 font-semibold text-sm">
                <div>Service</div>
                <div>Container Type</div>
                <div>Container Quantity</div>
              </div>
              {form.additional_services.length === 0 ? (
                <p className="text-sm text-muted-foreground">No services added yet</p>
              ) : (
                form.additional_services.map((service) => (
                  <div key={service.id} className="grid grid-cols-3 gap-4 items-center">
                    <select
                      value={service.additional_service}
                      onChange={(e) => setForm((prev) => ({ ...prev, additional_services: prev.additional_services.map((s) => s.id === service.id ? { ...s, additional_service: e.target.value } : s) }))}
                      className="w-full px-3 py-2 border border-input rounded-lg"
                    >
                      <option value="">Select Service</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Custom Clearance">Custom Clearance</option>
                      <option value="Packaging">Packaging</option>
                    </select>
                    <select
                      value={service.container_type}
                      onChange={(e) => setForm((prev) => ({ ...prev, additional_services: prev.additional_services.map((s) => s.id === service.id ? { ...s, container_type: e.target.value } : s) }))}
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
                        value={service.container_quantity}
                        onChange={(e) => setForm((prev) => ({ ...prev, additional_services: prev.additional_services.map((s) => s.id === service.id ? { ...s, container_quantity: parseInt(e.target.value) || 1 } : s) }))}
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeService(service.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, additional_services: [...prev.additional_services, { id: Date.now(), additional_service: "", container_type: "", container_quantity: 1 }] }))}
                className="text-primary text-sm font-medium hover:underline"
              >
                Add a line
              </button>
            </div>
          </div>


          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" className="bg-red-400 text-black hover:bg-red-350" onClick={() => navigate("/sales/opportunity")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="material-button text-black">
              {loading ? "Saving..." : id ? "Update Request" : "Save Request"}
            </Button>
          </div>
        </div>
      </form>

      {/* Visit Modal */}
      {visitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl material-elevation-4 w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-primary">Create Customer Visit Information</h2>
              <button onClick={() => setVisitModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Visit Date</Label>
                  <Input type="date" value={visitDraft.visit_date} onChange={(e) => setVisitDraft({ ...visitDraft, visit_date: e.target.value })} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Visit Time</Label>
                  <Input type="time" value={visitDraft.visit_time} onChange={(e) => setVisitDraft({ ...visitDraft, visit_time: e.target.value })} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Mode of Communication</Label>
                  <select value={visitDraft.mode_of_communication} onChange={(e) => setVisitDraft({ ...visitDraft, mode_of_communication: e.target.value })} className="w-full px-3 py-2 border border-input rounded-lg h-10">
                    <option value="">Select</option>
                    <option>Phone</option>
                    <option>Email</option>
                    <option>In-Person</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Visited By</Label>
                  <select value={visitDraft.visited_by} onChange={(e) => setVisitDraft({ ...visitDraft, visited_by: e.target.value })} className="w-full px-3 py-2 border border-input rounded-lg h-10">
                    <option value="">Select</option>
                    <option>John Doe</option>
                    <option>Jane Smith</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Purpose</Label>
                  <Input value={visitDraft.purpose} onChange={(e) => setVisitDraft({ ...visitDraft, purpose: e.target.value })} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Next Visit</Label>
                  <select value={visitNextVisit} onChange={(e) => { setVisitNextVisit(e.target.value); setVisitDraft({ ...visitDraft, next_visit: e.target.value }); }} className="w-full px-3 py-2 border border-input rounded-lg h-10">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                {visitNextVisit === "Yes" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Next Followup Date</Label>
                      <Input type="date" value={visitDraft.next_followup_date} onChange={(e) => setVisitDraft({ ...visitDraft, next_followup_date: e.target.value })} className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Assign To</Label>
                      <select value={visitDraft.assign_to} onChange={(e) => setVisitDraft({ ...visitDraft, assign_to: e.target.value })} className="w-full px-3 py-2 border border-input rounded-lg h-10">
                        <option value="">Select</option>
                        <option>John Doe</option>
                        <option>Jane Smith</option>
                      </select>
                    </div>
                  </>
                )}
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-semibold">Notes</Label>
                  <textarea className="w-full px-3 py-2 border border-input rounded-lg" rows={3} value={visitDraft.visit_notes} onChange={(e) => setVisitDraft({ ...visitDraft, visit_notes: e.target.value })}></textarea>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-start gap-3 p-6 border-t border-border">
              <Button type="button" className="bg-primary text-black" onClick={handleAddVisit}>Save</Button>
              <Button type="button" variant="outline" onClick={() => setVisitModal(false)}>Discard</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewRateRequest;
