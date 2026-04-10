import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createRateRequestApi, updateRateRequestApi, getOpportunityApi, getLeadsApi, getCitiesApi, getStatesApi, getEmployeesApi, getCompaniesApi, getSalesAgentsApi, getPricingTeamApi, getShippingProvidersApi, getTransportModesApi, getShipmentTypesApi, getCargoTypesApi, getIncotermsApi, getCommoditiesApi, getServiceModesApi, getCountriesApi, getDesignationsApi, getDepartmentsApi, getProspectsApi } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const toInputDate = (val: string): string => {
  if (!val) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(val)) return val.slice(0, 10);
  const m = val.match(/(\d{2})[\-\/](\d{2})[\-\/](\d{4})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return val;
};

const EditOpportunity = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [leads, setLeads] = useState<{ id: number }[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [employees, setEmployees] = useState<{ id: number; name: string }[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [companies, setCompanies] = useState<{ id: number; name: string }[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [salesAgents, setSalesAgents] = useState<{ id: number; name: string }[]>([]);
  const [salesAgentsLoading, setSalesAgentsLoading] = useState(false);
  const [pricingTeams, setPricingTeams] = useState<{ id: number; name: string }[]>([]);
  const [shippingProviders, setShippingProviders] = useState<{ id: number; name: string }[]>([]);
  const [transportModes, setTransportModes] = useState<{ id: number; name: string }[]>([]);
  const [shipmentTypes, setShipmentTypes] = useState<{ id: number; name: string }[]>([]);
  const [cargoTypes, setCargoTypes] = useState<{ id: number; name: string }[]>([]);
  const [incoterms, setIncoterms] = useState<{ id: number; name: string }[]>([]);
  const [commodities, setCommodities] = useState<{ id: number; name: string }[]>([]);
  const [serviceModes, setServiceModes] = useState<{ id: number; name: string }[]>([]);
  const [countries, setCountries] = useState<{ id: number; name: string }[]>([]);
  const [allStates, setAllStates] = useState<{ id: number; country_id: number; name: string }[]>([]);
  const [allCities, setAllCities] = useState<{ id: number; state_id: number; name: string }[]>([]);
  const [designations, setDesignations] = useState<{ id: number; name: string }[]>([]);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [prospects, setProspects] = useState<{ id: number; name: string }[]>([]);
  const [customers, setCustomers] = useState<{ id: number; name: string }[]>([]);
  const [showVisitDialog, setShowVisitDialog] = useState(false);

  const isActive = (r: any) => r.status === 1 || r.status === '1' || r.status === 'active' || r.status === 'Active';
  const toOptions = (res: any) => { const raw: any[] = res.data?.data ?? res.data ?? []; return raw.filter(isActive).map((r: any) => ({ id: r.id, name: r.name })); };

  useEffect(() => {
    setSalesAgentsLoading(true);
    getSalesAgentsApi(1, 9999).then((res) => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setSalesAgents(raw.filter(isActive).map(r => ({ id: r.id, name: r.name })));
    }).catch(() => {}).finally(() => setSalesAgentsLoading(false));
  }, []);

  useEffect(() => {
    getPricingTeamApi(1, 9999).then(res => setPricingTeams(toOptions(res))).catch(() => {});
    getShippingProvidersApi(1, 9999).then(res => setShippingProviders(toOptions(res))).catch(() => {});
    getTransportModesApi().then(res => setTransportModes(toOptions(res))).catch(() => {});
    getShipmentTypesApi().then(res => setShipmentTypes(toOptions(res))).catch(() => {});
    getCargoTypesApi().then(res => setCargoTypes(toOptions(res))).catch(() => {});
    getIncotermsApi(1, 9999).then(res => setIncoterms(toOptions(res))).catch(() => {});
    getCommoditiesApi(1, 9999).then(res => setCommodities(toOptions(res))).catch(() => {});
    getServiceModesApi(1, 9999).then(res => setServiceModes(toOptions(res))).catch(() => {});
    getCountriesApi().then(res => { const raw: any[] = res.data?.data ?? res.data ?? []; setCountries(raw.filter(isActive).map((r: any) => ({ id: r.id, name: r.country_name ?? r.name }))); }).catch(() => {});
    getStatesApi(1, 9999).then(res => { const raw: any[] = res.data?.data ?? res.data ?? []; setAllStates(raw.filter(isActive).map((r: any) => ({ id: r.id, country_id: Number(r.country_id), name: r.name }))); }).catch(() => {});
    getCitiesApi().then(res => { const raw: any[] = res.data?.data ?? res.data ?? []; setAllCities(raw.filter(isActive).map((r: any) => ({ id: r.id, state_id: Number(r.state_id), name: r.name }))); }).catch(() => {});
    getDesignationsApi(1, 9999, '', 'active').then(res => { const raw: any[] = res.data?.data ?? res.data ?? []; setDesignations(raw.map((r: any) => ({ id: r.id, name: r.name }))); }).catch(() => {});
    getDepartmentsApi(1, 9999, '', 'active').then(res => { const raw: any[] = res.data?.data ?? res.data ?? []; setDepartments(raw.map((r: any) => ({ id: r.id, name: r.name }))); }).catch(() => {});
    getProspectsApi(1, 9999, '', 'active').then(res => { const raw: any[] = res.data?.data ?? res.data ?? []; setProspects(raw.filter(isActive).map((r: any) => ({ id: r.id, name: r.name }))); }).catch(() => {});
    getSalesAgentsApi(1, 9999).then(res => { const raw: any[] = res.data?.data ?? res.data ?? []; setCustomers(raw.filter(isActive).map((r: any) => ({ id: r.id, name: r.name }))); }).catch(() => {});
  }, []);

  useEffect(() => {
    setCompaniesLoading(true);
    getCompaniesApi(1, 9999).then((res) => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setCompanies(raw.filter(r => r.status === 1 || r.status === '1' || r.status === 'active' || r.status === 'Active').map(r => ({ id: r.id, name: r.name })));
    }).catch(() => {}).finally(() => setCompaniesLoading(false));
  }, []);

  useEffect(() => {
    setCitiesLoading(true);
    getCitiesApi().then((res) => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setCities(raw.map(r => ({ id: r.id, name: r.name })));
    }).catch(() => {}).finally(() => setCitiesLoading(false));
  }, []);

  useEffect(() => {
    setEmployeesLoading(true);
    getEmployeesApi().then((res) => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setEmployees(raw.filter(r => r.status === 1 || r.status === '1' || r.status === 'active' || r.status === 'Active').map(r => ({ id: r.id, name: [r.first_name, r.last_name].filter(Boolean).join(' ') })));
    }).catch(() => {}).finally(() => setEmployeesLoading(false));
  }, []);

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
    company: "",
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

  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (id) {
      setFetching(true);
      getOpportunityApi(id)
        .then((res) => {
          const raw = res.data?.data ?? res.data;
          setFormData({
            date: toInputDate(raw.date) || new Date().toISOString().split("T")[0],
            location: raw.location || "",
            lead: (() => { const v = raw.lead_ref ?? raw.lead ?? ""; if (!v) return ""; return /^LEAD-/.test(String(v)) ? String(v) : `LEAD-${String(v).padStart(3, "0")}`; })(),
            sales_team: raw.sales_team ? String(raw.sales_team) : "",
            opportunitySource: raw.opportunity_source || "Online",
            opportunityType: raw.opportunity_type || "New Client",
            type: raw.type || "Shipment",
            sales_agent: raw.sales_agent ? String(raw.sales_agent) : "",
            company: raw.company ? String(raw.company) : "",
            pricing_team: raw.pricing_team ? String(raw.pricing_team) : "",
            shipping_providers: raw.shipping_providers ? String(raw.shipping_providers) : "",
            status: raw.status || "Open",
            transport_mode: raw.shipment_details?.transport_mode ? String(raw.shipment_details.transport_mode) : "",
            shipment_type: raw.shipment_details?.shipment_type ? String(raw.shipment_details.shipment_type) : "",
            cargo_type: raw.shipment_details?.cargo_type ? String(raw.shipment_details.cargo_type) : "",
            incoterms: raw.shipment_details?.incoterms ? String(raw.shipment_details.incoterms) : "",
            commodity: raw.shipment_details?.commodity ? String(raw.shipment_details.commodity) : "",
            service_mode: raw.shipment_details?.service_mode ? String(raw.shipment_details.service_mode) : "",
            estimated_shipment_date: toInputDate(raw.shipment_details?.estimated_shipment_date) || "",
            cargo_status: raw.shipment_details?.cargo_status || "Ready to Ship",
            origin_country: raw.shipment_details?.origin_country ? String(raw.shipment_details.origin_country) : "",
            destination_country: raw.shipment_details?.destination_country ? String(raw.shipment_details.destination_country) : "",
            cargo_description: raw.shipment_details?.cargo_description || "",
            customer: raw.party_details?.customer ? String(raw.party_details.customer) : "",
            contact_person: raw.party_details?.contact_person || "",
            designation: raw.party_details?.designation ? String(raw.party_details.designation) : "",
            customer_type: raw.party_details?.customer_type || "Shipper",
            prospect: raw.party_details?.prospect || "",
            department: raw.party_details?.department ? String(raw.party_details.department) : "",
            address_street1: raw.party_details?.address_street1 || "",
            address_street2: raw.party_details?.address_street2 || "",
            address_state: raw.party_details?.address_state ? String(raw.party_details.address_state) : "",
            address_city: raw.party_details?.address_city ? String(raw.party_details.address_city) : "",
            address_zip: raw.party_details?.address_zip || "",
            address_country: raw.party_details?.address_country ? String(raw.party_details.address_country) : "",
            email: raw.party_details?.email || "",
            telephone_no: raw.party_details?.telephone_no || "",
            mobile_no: raw.party_details?.mobile_no || "",
          });

          if (Array.isArray(raw.vendor_rates) && raw.vendor_rates.length > 0) {
            setVendorRates(raw.vendor_rates.map((r: any, i: number) => ({ id: r.id ?? i, vendor_agent: r.vendor_agent ?? "", currency: r.currency ?? "USD", rate_total: r.rate_total ?? "" })));
          }
          if (Array.isArray(raw.additional_services) && raw.additional_services.length > 0) {
            setServiceLines(raw.additional_services.map((s: any, i: number) => ({ id: s.id ?? i, service: s.additional_service ?? "", containerType: s.container_type ?? "", containerQuantity: s.container_quantity ?? 1 })));
          }
          if (Array.isArray(raw.customer_visits) && raw.customer_visits.length > 0) {
            setCustomerVisits(raw.customer_visits.map((v: any, i: number) => ({ id: v.id ?? i, visit_date: toInputDate(v.visit_date) ?? "", visit_time: v.visit_time ?? "", next_visit: toInputDate(v.next_visit) ?? "", next_followup_date: toInputDate(v.next_followup_date) ?? "", assign_to: v.assign_to ?? "", mode_of_communication: v.mode_of_communication ?? "", visited_by: v.visited_by ?? "", purpose: v.purpose ?? "", visit_notes: v.visit_notes ?? "" })));
          }
        })
        .catch(() => toast({ title: "Error", description: "Failed to load data", variant: "destructive" }))
        .finally(() => setFetching(false));
    }
  }, [id]);

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

  const resolveIdStr = (array: any[], val: string | number | undefined | null) => {
    if (!val) return "";
    const asStr = String(val).trim().toLowerCase();
    const foundById = array.find(i => String(i.id) === String(val));
    if (foundById) return String(foundById.id);
    const foundByName = array.find(i => (i.name && String(i.name).trim().toLowerCase() === asStr));
    return foundByName ? String(foundByName.id) : "";
  };

  const resolveIdNum = (array: any[], val: string | number | undefined | null) => {
    const res = resolveIdStr(array, val);
    return res ? Number(res) : null;
  };

  const buildPayload = () => ({
    date: formData.date,
    location: formData.location ? Number(formData.location) : null,
    location_id: formData.location ? Number(formData.location) : null,
    lead: formData.lead,
    sales_team_id: formData.sales_team ? Number(formData.sales_team) : null,
    sales_team: formData.sales_team ? Number(formData.sales_team) : null,
    opportunity_source: formData.opportunitySource,
    opportunity_type: formData.opportunityType,
    type: formData.type,
    sales_agent_id: formData.sales_agent ? Number(formData.sales_agent) : null,
    sales_agent: formData.sales_agent ? Number(formData.sales_agent) : null,
    company_id: formData.company ? Number(formData.company) : null,
    company: formData.company ? Number(formData.company) : null,
    pricing_team_id: formData.pricing_team ? Number(formData.pricing_team) : null,
    pricing_team: formData.pricing_team ? Number(formData.pricing_team) : null,
    shipping_provider_id: formData.shipping_providers ? Number(formData.shipping_providers) : null,
    shipping_providers: formData.shipping_providers ? Number(formData.shipping_providers) : null,
    status: formData.status,
    shipment_details: {
      transport_mode_id: resolveIdNum(transportModes, formData.transport_mode),
      transport_mode: resolveIdNum(transportModes, formData.transport_mode),
      shipment_type_id: resolveIdNum(shipmentTypes, formData.shipment_type),
      shipment_type: resolveIdNum(shipmentTypes, formData.shipment_type),
      cargo_type_id: resolveIdNum(cargoTypes, formData.cargo_type),
      cargo_type: resolveIdNum(cargoTypes, formData.cargo_type),
      incoterm_id: resolveIdNum(incoterms, formData.incoterms),
      incoterms: resolveIdNum(incoterms, formData.incoterms),
      commodity_id: resolveIdNum(commodities, formData.commodity),
      commodity: resolveIdNum(commodities, formData.commodity),
      service_mode_id: resolveIdNum(serviceModes, formData.service_mode),
      service_mode: resolveIdNum(serviceModes, formData.service_mode),
      estimated_shipment_date: formData.estimated_shipment_date,
      cargo_status: formData.cargo_status,
      origin_country_id: resolveIdNum(countries, formData.origin_country),
      origin_country: resolveIdNum(countries, formData.origin_country),
      destination_country_id: resolveIdNum(countries, formData.destination_country),
      destination_country: resolveIdNum(countries, formData.destination_country),
      cargo_description: formData.cargo_description,
    },
    party_details: {
      customer_id: resolveIdNum(customers, formData.customer),
      customer: resolveIdNum(customers, formData.customer),
      contact_person: formData.contact_person,
      designation_id: resolveIdNum(designations, formData.designation),
      designation: resolveIdNum(designations, formData.designation),
      customer_type: formData.customer_type,
      prospect: formData.prospect,
      prospect_id: resolveIdNum(prospects, formData.prospect),
      department_id: resolveIdNum(departments, formData.department),
      department: resolveIdNum(departments, formData.department),
      address_street1: formData.address_street1,
      address_street2: formData.address_street2,
      address_state_id: resolveIdNum(allStates, formData.address_state),
      address_state: resolveIdNum(allStates, formData.address_state),
      address_city_id: resolveIdNum(allCities, formData.address_city),
      address_city: resolveIdNum(allCities, formData.address_city),
      address_zip: formData.address_zip,
      address_country_id: resolveIdNum(countries, formData.address_country),
      address_country: resolveIdNum(countries, formData.address_country),
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
    customer_visits: customerVisits.map(({ id: _id, ...v }) => ({
      ...v,
      next_visit:         v.next_visit         || null,
      next_followup_date: v.next_followup_date || null,
    })),
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
      if (id) {
        await updateRateRequestApi(id, payload);
        toast({ title: "Success", description: "Opportunity updated successfully", variant: "success" });
      } else {
        await createRateRequestApi(payload);
        toast({ title: "Success", description: "Opportunity created successfully", variant: "success" });
      }
      setSubmitted(true);
      setTimeout(() => {
        navigate("/sales/opportunity");
        window.scrollTo(0, 0);
      }, 1500);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to process opportunity";
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
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{id ? "Edit Opportunity" : "New Rate Request"}</h1>
          <p className="text-muted-foreground text-sm mt-1">{id ? "Modify the opportunity details" : "Create a new rate request entry"}</p>
        </div>
      </div>

      {fetching ? (
        <div className="flex items-center justify-center py-16">
          <span className="text-muted-foreground">Loading...</span>
        </div>
      ) : (
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
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="w-full flex items-center justify-between px-3 py-2 border border-input rounded-lg text-sm bg-background disabled:opacity-60" disabled={citiesLoading}>
                    <span className={formData.location ? '' : 'text-muted-foreground'}>
                      {citiesLoading ? 'Loading...' : (cities.find(c => String(c.id) === String(formData.location))?.name || 'Select City')}
                    </span>
                    <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search city..." />
                    <CommandList>
                      <CommandEmpty>No city found.</CommandEmpty>
                      <CommandGroup>
                        {cities.map(c => (
                          <CommandItem key={c.id} value={String(c.id)} onSelect={(val) => setFormData(prev => ({ ...prev, location: val }))}>
                            <Check className={cn('mr-2 w-4 h-4', formData.location === String(c.id) ? 'opacity-100' : 'opacity-0')} />
                            {c.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
              <select id="salesTeam" name="sales_team" value={formData.sales_team} onChange={handleChange} disabled={employeesLoading} className="w-full px-3 py-2 border border-input rounded-lg disabled:opacity-60">
                <option value="">{employeesLoading ? 'Loading...' : 'Select Employee'}</option>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
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
              <select id="salesAgent" name="sales_agent" value={resolveIdStr(salesAgents, formData.sales_agent)} onChange={handleChange} disabled={salesAgentsLoading} className="w-full px-3 py-2 border border-input rounded-lg disabled:opacity-60">
                <option value="">{salesAgentsLoading ? 'Loading...' : 'Select Sales Agent'}</option>
                {salesAgents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-semibold">
                Company
              </Label>
              <select id="company" name="company" value={resolveIdStr(companies, formData.company)} onChange={handleChange} disabled={companiesLoading} className="w-full px-3 py-2 border border-input rounded-lg disabled:opacity-60">
                <option value="">{companiesLoading ? 'Loading...' : 'Select Company'}</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricingTeam" className="text-sm font-semibold">
                Pricing Team
              </Label>
              <select id="pricingTeam" name="pricing_team" value={resolveIdStr(pricingTeams, formData.pricing_team)} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                <option value="">Select</option>
                {pricingTeams.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingProviders" className="text-sm font-semibold">
                Shipping Providers
              </Label>
              <select id="shippingProviders" name="shipping_providers" value={resolveIdStr(shippingProviders, formData.shipping_providers)} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                <option value="">Select</option>
                {shippingProviders.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
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
                <select id="transportMode" name="transport_mode" value={resolveIdStr(transportModes, formData.transport_mode)} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  {transportModes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipmentType" className="text-sm font-semibold">
                  Shipment Type
                </Label>
                <select id="shipmentType" name="shipment_type" value={resolveIdStr(shipmentTypes, formData.shipment_type)} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  {shipmentTypes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargoType" className="text-sm font-semibold">
                  Cargo Type
                </Label>
                <select id="cargoType" name="cargo_type" value={resolveIdStr(cargoTypes, formData.cargo_type)} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  {cargoTypes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="incoterms" className="text-sm font-semibold">
                  Incoterms
                </Label>
                <select id="incoterms" name="incoterms" value={resolveIdStr(incoterms, formData.incoterms)} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  {incoterms.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="commodity" className="text-sm font-semibold">
                  Commodity
                </Label>
                <select id="commodity" name="commodity" value={resolveIdStr(commodities, formData.commodity)} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  {commodities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceMode" className="text-sm font-semibold">
                  Service Mode
                </Label>
                <select id="serviceMode" name="service_mode" value={resolveIdStr(serviceModes, formData.service_mode)} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  {serviceModes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
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
                <select id="originCountry" name="origin_country" value={resolveIdStr(countries, formData.origin_country)} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinationCountry" className="text-sm font-semibold">
                  Destination Country
                </Label>
                <select id="destinationCountry" name="destination_country" value={resolveIdStr(countries, formData.destination_country)} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                <select id="customer" name="customer" value={resolveIdStr(customers, formData.customer)} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  {customers.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
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
                <select id="designation" name="designation" value={resolveIdStr(designations, formData.designation)} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  {designations.map(d => <option key={d.id} value={String(d.id)}>{d.name}</option>)}
                </select>
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
                <select id="prospect" name="prospect" value={resolveIdStr(prospects, formData.prospect)} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  {prospects.map(p => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-semibold">
                  Department
                </Label>
                <select id="department" name="department" value={resolveIdStr(departments, formData.department)} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  {departments.map(d => <option key={d.id} value={String(d.id)}>{d.name}</option>)}
                </select>
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label className="text-sm font-semibold">Address</Label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Input name="address_street1" placeholder="Street 1..." value={formData.address_street1} onChange={handleChange} />
                  <Input name="address_street2" placeholder="Street 2..." value={formData.address_street2} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <select
                    name="address_country"
                    value={resolveIdStr(countries, formData.address_country)}
                    onChange={(e) => setFormData(prev => ({ ...prev, address_country: e.target.value, address_state: "", address_city: "" }))}
                    className="px-3 py-2 border border-input rounded-lg"
                  >
                    <option value="">Country</option>
                    {countries.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                  </select>
                  <select
                    name="address_state"
                    value={resolveIdStr(allStates, formData.address_state)}
                    disabled={!resolveIdStr(countries, formData.address_country)}
                    onChange={(e) => setFormData(prev => ({ ...prev, address_state: e.target.value, address_city: "" }))}
                    className="px-3 py-2 border border-input rounded-lg disabled:opacity-60"
                  >
                    <option value="">State</option>
                    {allStates.filter(s => String(s.country_id) === String(resolveIdStr(countries, formData.address_country))).map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
                  </select>
                  <select
                    name="address_city"
                    value={resolveIdStr(allCities, formData.address_city)}
                    disabled={!resolveIdStr(allStates, formData.address_state)}
                    onChange={(e) => setFormData(prev => ({ ...prev, address_city: e.target.value }))}
                    className="px-3 py-2 border border-input rounded-lg disabled:opacity-60"
                  >
                    <option value="">City</option>
                    {allCities.filter(c => String(c.state_id) === String(resolveIdStr(allStates, formData.address_state))).map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                  </select>
                  <Input placeholder="ZIP" name="address_zip" value={formData.address_zip} onChange={handleChange} />
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

          {/* Vendor Rates */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Vendor Rates</h2>
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-3 gap-4 font-semibold text-sm">
                <div>Vendor / Agent</div>
                <div>Currency</div>
                <div>Rate Total</div>
              </div>
              {vendorRates.map((rate) => (
                <div key={rate.id} className="grid grid-cols-3 gap-4 items-center">
                  <Input
                    value={rate.vendor_agent}
                    onChange={(e) => setVendorRates(vendorRates.map(r => r.id === rate.id ? { ...r, vendor_agent: e.target.value } : r))}
                    placeholder="Vendor / Agent name"
                  />
                  <select
                    value={rate.currency}
                    onChange={(e) => setVendorRates(vendorRates.map(r => r.id === rate.id ? { ...r, currency: e.target.value } : r))}
                    className="w-full px-3 py-2 border border-input rounded-lg"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="AED">AED</option>
                    <option value="INR">INR</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={rate.rate_total}
                      onChange={(e) => setVendorRates(vendorRates.map(r => r.id === rate.id ? { ...r, rate_total: e.target.value } : r))}
                      placeholder="0.00"
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => setVendorRates(vendorRates.filter(r => r.id !== rate.id))}
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
              {loading ? "Saving..." : (id ? "Update Opportunity" : "Save Rate Request")}
            </Button>
          </div>
        </div>
      </form>
      )}

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

export default EditOpportunity;
