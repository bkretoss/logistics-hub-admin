import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOperations } from "./OperationsContext";
import { getCitiesApi, getServiceModesApi, getOperationApi, createOperationApi, updateOperationApi, createMasterCompanyApi, getMasterCompaniesApi, getBranchesApi, getMasterCompanyAddressesApi, getCountriesApi, getStatesApi, createMasterCompanyAddressApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const FREIGHT_OPTIONS = ["Prepaid", "Collect"];
const SERVICE_TYPES = [
  "FCL/FCL",
  "FCL/LCL",
  "LCL/FCL",
  "LCL/LCL",
  "DOOR TO DOOR",
  "DOOR TO PORT",
  "PORT TO PORT",
  "PORT TO DOOR",
];
const CATEGORIES = ["Customer", "Shipper", "Consignee", "Notify Party", "Agent", "Carrier", "Co-Loader"];
const GST_STATES = [
  "Andhra Pradesh",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Maharashtra",
  "Tamil Nadu",
  "Telangana",
  "West Bengal",
];
const COUNTRIES = ["India", "USA", "UAE", "Singapore", "UK", "China", "Germany", "Japan"];
const COA_OPTIONS = ["Accounts Receivable", "Accounts Payable", "Cash", "Bank", "Revenue", "Expense"];
const PAYMENT_MODES = ["Cash", "Bank Transfer", "Cheque", "Credit Card", "Online"];
const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED", "SGD", "JPY"];

// Branch and Party data with relationships
interface Branch {
  id: string;
  name: string;
  address: string;
  city?: string;
}

interface PartyWithBranches {
  name: string;
  address: string;
  bondExpiryDate?: string;
  branches: Branch[];
}

const CUSTOMER_OPTIONS: PartyWithBranches[] = [
  {
    name: "TEXGRAM INC DBA INOTEX",
    address: "12828 S BROADWAY\nLOS ANGELES, CA 90061\nTEL: 714-240-4446",
    bondExpiryDate: "31 Dec 2026",
    branches: [
      {
        id: "tx-1",
        name: "Los Angeles Office",
        address: "12828 S BROADWAY\nLOS ANGELES, CA 90061",
        city: "Los Angeles",
      },
      { id: "tx-2", name: "New York Office", address: "45 Park Avenue\nNEW YORK, NY 10022", city: "New York" },
    ],
  },
  {
    name: "Acme Corporation",
    address: "123 Acme Street\nNew York, NY 10001",
    bondExpiryDate: "30 Mar 2026",
    branches: [
      { id: "ac-1", name: "New York HQ", address: "123 Acme Street\nNew York, NY 10001", city: "New York" },
      { id: "ac-2", name: "Chicago Branch", address: "456 Commerce Drive\nChicago, IL 60601", city: "Chicago" },
      { id: "ac-3", name: "Boston Branch", address: "789 Harbor Street\nBoston, MA 02101", city: "Boston" },
    ],
  },
  {
    name: "Global Shipping Ltd",
    address: "45 Harbor Road\nSingapore 098765",
    bondExpiryDate: "25 Apr 2026",
    branches: [
      { id: "gs-1", name: "Singapore HQ", address: "45 Harbor Road\nSingapore 098765", city: "Singapore" },
      { id: "gs-2", name: "Hong Kong Branch", address: "12 Victoria Harbour\nHong Kong", city: "Hong Kong" },
      { id: "gs-3", name: "Shanghai Branch", address: "888 Pudong Avenue\nShanghai 200120", city: "Shanghai" },
    ],
  },
  {
    name: "Pacific Freight Co",
    address: "789 Pacific Ave\nLos Angeles, CA 90045",
    bondExpiryDate: "01 Sep 2026",
    branches: [
      { id: "pf-1", name: "Los Angeles Port", address: "789 Pacific Ave\nLos Angeles, CA 90045", city: "Los Angeles" },
      {
        id: "pf-2",
        name: "Long Beach Terminal",
        address: "123 Terminal Drive\nLong Beach, CA 90801",
        city: "Long Beach",
      },
      { id: "pf-3", name: "Oakland Terminal", address: "456 Maritime Way\nOakland, CA 94606", city: "Oakland" },
    ],
  },
];

const SHIPPER_OPTIONS: PartyWithBranches[] = [
  {
    name: "TEST1",
    address: "aaaa",
    branches: [{ id: "test1-1", name: "Main Branch", address: "aaaa", city: "Main" }],
  },
  {
    name: "Relay Logistics",
    address: "22 Relay Park\nMumbai, MH 400001",
    branches: [
      { id: "relay-1", name: "Mumbai Branch", address: "22 Relay Park\nMumbai, MH 400001", city: "Mumbai" },
      { id: "relay-2", name: "Delhi Branch", address: "45 Relay Center\nDelhi, DL 110001", city: "Delhi" },
    ],
  },
  {
    name: "FastTrack Shippers",
    address: "5 FastTrack Blvd\nDelhi, DL 110001",
    branches: [
      { id: "fast-1", name: "Delhi HQ", address: "5 FastTrack Blvd\nDelhi, DL 110001", city: "Delhi" },
      { id: "fast-2", name: "Bangalore Branch", address: "78 FastTrack Road\nBangalore, KA 560001", city: "Bangalore" },
    ],
  },
  {
    name: "BlueLine Shipping",
    address: "9 BlueLine Wharf\nChennai, TN 600001",
    branches: [
      { id: "blue-1", name: "Chennai Port", address: "9 BlueLine Wharf\nChennai, TN 600001", city: "Chennai" },
      { id: "blue-2", name: "Kochi Branch", address: "25 BlueLine Dock\nKochi, KL 682001", city: "Kochi" },
    ],
  },
];

const CARRIER_OPTIONS: PartyWithBranches[] = [
  {
    name: "TEAMGLOBAL LOGISTICS PVT LTD",
    address: "Reflections building.2, Leith Castle\nCenter Street, Santhome High Rd, Chennai,\nTamil Nadu 600028",
    branches: [
      {
        id: "team-1",
        name: "Chennai HQ",
        address: "Reflections building.2, Leith Castle\nCenter Street, Santhome High Rd, Chennai,\nTamil Nadu 600028",
        city: "Chennai",
      },
      { id: "team-2", name: "Mumbai Branch", address: "100 Gateway Plaza\nMumbai, MH 400001", city: "Mumbai" },
    ],
  },
  {
    name: "Maersk Line",
    address: "50 Maersk Tower\nCopenhagen, Denmark 1263",
    branches: [
      {
        id: "maersk-1",
        name: "Copenhagen HQ",
        address: "50 Maersk Tower\nCopenhagen, Denmark 1263",
        city: "Copenhagen",
      },
      { id: "maersk-2", name: "Dubai Branch", address: "88 Maersk Centre\nDubai, UAE", city: "Dubai" },
    ],
  },
  {
    name: "Emirates SkyCargo",
    address: "Emirates SkyCargo Centre\nDubai Airport Freezone, Dubai",
    branches: [
      {
        id: "emirate-1",
        name: "Dubai Hub",
        address: "Emirates SkyCargo Centre\nDubai Airport Freezone, Dubai",
        city: "Dubai",
      },
      { id: "emirate-2", name: "Abu Dhabi Branch", address: "50 Emirates Avenue\nAbu Dhabi, UAE", city: "Abu Dhabi" },
    ],
  },
  {
    name: "ONE Line",
    address: "7 ONE Logistics Park\nSingapore 609919",
    branches: [
      { id: "one-1", name: "Singapore HQ", address: "7 ONE Logistics Park\nSingapore 609919", city: "Singapore" },
      { id: "one-2", name: "Port Klang Branch", address: "35 ONE Centre\nPort Klang, Malaysia", city: "Port Klang" },
    ],
  },
];

const CONSIGNEE_OPTIONS: PartyWithBranches[] = [
  {
    name: "TEXELQ ENGINEERING INDIA PRIVATE LIMITED",
    address: "NO.77/2, KUTHAMPAKKAM ROAD,\nMEVALURKUPPAM, SRIPERUMBUDUR (TK)\nKANCHIPURAM DIST - 602105.",
    branches: [
      {
        id: "tex-1",
        name: "Sriperumbudur Branch",
        address: "NO.77/2, KUTHAMPAKKAM ROAD,\nMEVALURKUPPAM, SRIPERUMBUDUR (TK)\nKANCHIPURAM DIST - 602105.",
        city: "Sriperumbudur",
      },
      { id: "tex-2", name: "Chennai Branch", address: "150 IT Park\nChennai, TN 600096", city: "Chennai" },
    ],
  },
  {
    name: "Gulf Traders LLC",
    address: "Plot 14, Gulf Industrial Area\nSharjah, UAE",
    branches: [
      { id: "gulf-1", name: "Sharjah Office", address: "Plot 14, Gulf Industrial Area\nSharjah, UAE", city: "Sharjah" },
      { id: "gulf-2", name: "Dubai Branch", address: "200 Gulf Centre\nDubai, UAE", city: "Dubai" },
    ],
  },
  {
    name: "SG Imports Pte",
    address: "33 Tuas South Ave\nSingapore 637644",
    branches: [
      { id: "sg-1", name: "Singapore Headquarters", address: "33 Tuas South Ave\nSingapore 637644", city: "Singapore" },
      { id: "sg-2", name: "Johor Branch", address: "55 Industrial Way\nJohor Bahru, Malaysia", city: "Johor Bahru" },
    ],
  },
  {
    name: "UK Distributors Ltd",
    address: "12 Commerce Road\nLondon, EC1A 1BB",
    branches: [
      { id: "uk-1", name: "London Office", address: "12 Commerce Road\nLondon, EC1A 1BB", city: "London" },
      { id: "uk-2", name: "Manchester Branch", address: "75 Trade Centre\nManchester, M1 1AA", city: "Manchester" },
    ],
  },
];

export interface SubledgerEntry {
  id: number;
  subledgerType: string;
  subledgerName: string;
  address: string;
  phone: string;
  fax: string;
  mobile: string;
  email: string;
  city: string;
}

export interface OperationFormData {
  jobNo: string;
  document: string;
  jobDate: string;
  freightPpCc: string;
  placeOfReceipt: string;
  placeOfDelivery: string;
  pol: string;
  pod: string;
  polEtd: string;
  flightName: string;
  flightNumber: string;
  podEta: string;
  note: string;
  serviceType: string;
  blServiceType: string;
  blNo: string;
  mblNo: string;
  salesPerson: string;
  customer: string;
  customerBranch: string;
  customerAddress: string;
  shipper: string;
  shipperBranch: string;
  shipperAddress: string;
  carrier: string;
  carrierBranch: string;
  carrierAddress: string;
  consignee: string;
  consigneeBranch: string;
  consigneeAddress: string;
  notify1: string;
  deliveryAgentName: string;
  deliveryAgent: string;
  deliveryStatus: string;
  deliveryDate: string;
  // FCL Import specific
  bookingDate: string;
  bookingType: string;
  blMarksNo: string;
  etd: string;
  eta: string;
  vesselName: string;
  voyageNumber: string;
  subledgers: SubledgerEntry[];
  status: number;
}

const initialForm: OperationFormData = {
  jobNo: "",
  document: "Air Export",
  jobDate: new Date().toISOString().split("T")[0],
  freightPpCc: "Collect",
  placeOfReceipt: "",
  placeOfDelivery: "",
  pol: "",
  pod: "",
  polEtd: "",
  flightName: "",
  flightNumber: "",
  podEta: "",
  note: "",
  serviceType: "",
  blServiceType: "",
  blNo: "",
  mblNo: "",
  salesPerson: "",
  customer: "",
  customerBranch: "",
  customerAddress: "",
  shipper: "",
  shipperBranch: "",
  shipperAddress: "",
  carrier: "",
  carrierBranch: "",
  carrierAddress: "",
  consignee: "",
  consigneeBranch: "",
  consigneeAddress: "",
  notify1: "",
  deliveryAgentName: "",
  deliveryAgent: "",
  deliveryStatus: "",
  deliveryDate: "",
  bookingDate: new Date().toISOString().split("T")[0],
  bookingType: "Import",
  blMarksNo: "",
  etd: new Date().toISOString().split("T")[0],
  eta: "",
  vesselName: "",
  voyageNumber: "",
  subledgers: [],
  status: 1,
};

interface SubledgerForm {
  name: string;
  actualName: string;
  categories: string;
  position: string;
  website: string;
  branchId: string;
  userName: string;
  password: string;
  scacCode: string;
  interestCalculation: string;
  notes: string;
  iecCode: string;
  iataCode: string;
  bond: string;
  expireBondDate: string;
  status: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pinNo: string;
  branchName: string;
}

export interface PartyRow {
  customer: string;
  customerBranch: string;
  customerAddress: string;
  shipper: string;
  shipperBranch: string;
  shipperAddress: string;
  carrier: string;
  carrierBranch: string;
  carrierAddress: string;
  consignee: string;
  consigneeBranch: string;
  consigneeAddress: string;
  customerAddresses?: { id: number; label: string; address: string }[];
}

const initialSubledger: SubledgerForm = {
  name: "",
  actualName: "",
  categories: "",
  position: "Opened",
  website: "",
  branchId: "",
  userName: "",
  password: "",
  scacCode: "",
  interestCalculation: "No",
  notes: "",
  iecCode: "",
  iataCode: "",
  bond: "",
  expireBondDate: "",
  status: "Active",
  address: "",
  country: "",
  state: "",
  city: "",
  pinNo: "",
  branchName: "",
};

// ── Searchable City Select ───────────────────────────────────────────────────
const CitySearchSelect: React.FC<{
  value: string;
  cities: { id: number; name: string }[];
  onChange: (val: string) => void;
  placeholder?: string;
}> = ({ value, cities, onChange, placeholder = '-- Select --' }) => {
  const [search, setSearch] = useState('');
  const [open, setOpen]     = useState(false);
  const ref                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = cities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const selected = cities.find(c => c.name === value);

  return (
    <div ref={ref} className="relative w-full">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 border border-input rounded-lg text-sm bg-background text-left">
        <span className={selected ? 'text-foreground' : 'text-muted-foreground'}>
          {selected ? selected.name : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-background border border-input rounded-lg shadow-lg">
          <div className="p-2">
            <input autoFocus type="text" placeholder="Search city..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 border border-input rounded-md text-sm bg-background outline-none" />
          </div>
          <ul className="max-h-48 overflow-y-auto">
            <li className="px-3 py-2 text-sm text-muted-foreground hover:bg-muted cursor-pointer"
              onClick={() => { onChange(''); setOpen(false); setSearch(''); }}>{placeholder}</li>
            {filtered.length === 0
              ? <li className="px-3 py-2 text-sm text-muted-foreground">No cities found</li>
              : filtered.map(c => (
                <li key={c.id} onClick={() => { onChange(c.name); setOpen(false); setSearch(''); }}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-muted ${
                    c.name === value ? 'bg-primary/10 font-semibold' : ''
                  }`}>{c.name}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Convert DD-MM-YYYY (API) → YYYY-MM-DD (input[type=date])
const apiDateToInput = (d?: string | null): string => {
  if (!d) return '';
  const m = d.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : d;
};

const NewOperation = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { refresh } = useOperations();
  const { toast } = useToast();
  const isEdit = !!id;

  const [formData, setFormData]         = useState<OperationFormData>(initialForm);
  const [loadingEdit, setLoadingEdit]   = useState(isEdit);
  const [saving, setSaving]             = useState(false);
  const [cities, setCities]             = useState<{ id: number; name: string }[]>([]);
  const [serviceModes, setServiceModes] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    getCitiesApi().then(res => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setCities(raw.map(r => ({ id: r.id, name: r.name })));
    }).catch(() => {});
    getServiceModesApi(1, 9999).then(res => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setServiceModes(raw.filter((r: any) => r.status === 1 || r.status === '1' || r.status === 'active').map((r: any) => ({ id: r.id, name: r.name })));
    }).catch(() => {});
  }, []);

  // Load edit data from API — also pre-fetch customer addresses
  useEffect(() => {
    if (!id) return;
    setLoadingEdit(true);
    getOperationApi(Number(id))
      .then(res => {
        const d = res.data?.data ?? res.data;
        // Pre-fetch customer addresses for edit page
        getMasterCompaniesApi().then(companiesRes => {
          const companies: any[] = companiesRes.data?.data ?? companiesRes.data ?? [];
          const matched = companies.find((c: any) => c.name === (d.customer ?? ''));
          if (matched) fetchCustomerAddresses(matched.id, d.customer ?? '');
        }).catch(() => {});
        setFormData({
          jobNo:            d.job_no            ?? '',
          document:         d.document          ?? 'Air Export',
          jobDate:          apiDateToInput(d.job_date),
          freightPpCc:      d.freight_pp_cc     ?? 'Collect',
          placeOfReceipt:   d.place_of_receipt  ?? '',
          placeOfDelivery:  d.place_of_delivery ?? '',
          pol:              d.pol               ?? '',
          pod:              d.pod               ?? '',
          polEtd:           apiDateToInput(d.pol_etd),
          flightName:       d.flight_name       ?? '',
          flightNumber:     d.flight_number     ?? '',
          podEta:           apiDateToInput(d.pod_eta),
          note:             d.note              ?? '',
          serviceType:      d.service_type      ?? '',
          blServiceType:    d.bl_service_type   ?? '',
          blNo:             d.bl_no             ?? '',
          mblNo:            d.mbl_no            ?? '',
          salesPerson:      d.sales_person      ?? '',
          customer:         d.customer          ?? '',
          customerBranch:   d.customer_branch   ?? '',
          customerAddress:  d.customer_address  ?? '',
          shipper:          d.shipper           ?? '',
          shipperBranch:    d.shipper_branch    ?? '',
          shipperAddress:   d.shipper_address   ?? '',
          carrier:          d.carrier           ?? '',
          carrierBranch:    d.carrier           ?? '',
          carrierAddress:   d.carrier_address   ?? '',
          consignee:        d.consignee         ?? '',
          consigneeBranch:  '',
          consigneeAddress: d.consignee_address ?? '',
          notify1:          d.notify1           ?? '',
          deliveryAgentName:d.delivery_agent_name ?? '',
          deliveryAgent:    d.delivery_agent    ?? '',
          deliveryStatus:   d.delivery_status   ?? '',
          deliveryDate:     apiDateToInput(d.delivery_date),
          bookingDate:      apiDateToInput(d.booking_date) || new Date().toISOString().split('T')[0],
          bookingType:      d.booking_type      ?? 'Import',
          blMarksNo:        d.bl_marks_no       ?? '',
          etd:              apiDateToInput(d.etd) || new Date().toISOString().split('T')[0],
          eta:              apiDateToInput(d.eta) ?? '',
          vesselName:       d.vessel_name       ?? '',
          voyageNumber:     d.voyage_number     ?? '',
          subledgers:       d.subledgers        ?? [],
          status:           d.status            ?? 1,
        });
        if (d.parties && Array.isArray(d.parties)) {
           setParties(d.parties.map((p: any) => ({
             customer: p.customer || "",
             customerBranch: p.customer_branch || "",
             customerAddress: p.customer_address || "",
             shipper: p.shipper || "",
             shipperBranch: p.shipper_branch || "",
             shipperAddress: p.shipper_address || "",
             carrier: p.carrier || "",
             carrierBranch: p.carrier_branch || "",
             carrierAddress: p.carrier_address || "",
             consignee: p.consignee || "",
             consigneeBranch: p.consignee_branch || "",
             consigneeAddress: p.consignee_address || "",
             customerAddresses: [],
           })));

           d.parties.forEach((pt: any, idx: number) => {
             if (pt.customer) {
               getMasterCompaniesApi().then(res => {
                 const comps = res.data?.data ?? res.data ?? [];
                 const match = comps.find((c: any) => c.name === pt.customer);
                 if (match) {
                   getMasterCompanyAddressesApi(match.id).then(ares => {
                      const addrs = mapAddresses(ares.data?.data ?? ares.data ?? []);
                      setParties(curr => {
                        const next = [...curr];
                        if (next[idx]) next[idx].customerAddresses = addrs;
                        return next;
                      });
                   });
                 }
               });
             }
           });
        }
        // Pre-fill notify_list from API
        if (d.notify_list && Array.isArray(d.notify_list)) {
          setNotifyList(d.notify_list.slice(0, 2).map((n: any) => ({
            notify_id: n.notify_branch_id ? String(n.notify_branch_id) : '',
            notify_address: n.notify_address ?? '',
          })));
        } else {
          // fallback: read flat fields
          const nl: { notify_id: string; notify_address: string }[] = [];
          if (d.notify_1_branch) nl.push({ notify_id: String(d.notify_1_branch), notify_address: '' });
          if (d.notify_2_branch) nl.push({ notify_id: String(d.notify_2_branch), notify_address: '' });
          if (nl.length) setNotifyList(nl);
        }
      })
      .catch(() => toast({ title: 'Error', description: 'Failed to load operation.', variant: 'destructive' }))
      .finally(() => setLoadingEdit(false));
  }, [id]);
  const [branchesLoading, setBranchesLoading] = useState<{
    customer: boolean;
    shipper: boolean;
    carrier: boolean;
    consignee: boolean;
  }>({ customer: false, shipper: false, carrier: false, consignee: false });

  const [branchesError, setBranchesError] = useState<{
    customer: string;
    shipper: string;
    carrier: string;
    consignee: string;
  }>({ customer: "", shipper: "", carrier: "", consignee: "" });

  const [errors, setErrors] = useState<Partial<Record<keyof OperationFormData, string>>>({});
  const [subledgerOpen, setSubledgerOpen] = useState(false);
  const [subledger, setSubledger] = useState<SubledgerForm>(initialSubledger);
  const [subledgerErrors, setSubledgerErrors] = useState<Partial<Record<keyof SubledgerForm, string>>>({});
  const [subledgerLogoFile, setSubledgerLogoFile] = useState<File | null>(null);
  const [subledgerLogoFileName, setSubledgerLogoFileName] = useState("");
  const [subledgerSaving, setSubledgerSaving] = useState(false);
  const [subledgerCompanies, setSubledgerCompanies] = useState<{ id: number; name: string }[]>([]);
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [subCountries, setSubCountries] = useState<{ id: number; country_name: string }[]>([]);
  const [subAllStates, setSubAllStates] = useState<{ id: number; country_id: number; name: string }[]>([]);
  const [subAllCities, setSubAllCities] = useState<{ id: number; state_id: number; name: string }[]>([]);
  const [customerAddresses, setCustomerAddresses] = useState<{ id: number; label: string; address: string }[]>([]);
  const [customerAddressesLoading, setCustomerAddressesLoading] = useState(false);
  const [allAddresses, setAllAddresses] = useState<{ id: number; label: string; address: string }[]>([]);

  const [parties, setParties] = useState<PartyRow[]>([]);

  // ── Notify List ──────────────────────────────────────────────────────────
  const [notifyList, setNotifyList] = useState<{ notify_id: string; notify_address: string }[]>([]);

  const addNotify = () => {
    if (notifyList.length >= 2) return;
    setNotifyList(prev => [...prev, { notify_id: '', notify_address: '' }]);
  };

  const removeNotify = (idx: number) => setNotifyList(prev => prev.filter((_, i) => i !== idx));

  const updateNotifyCompany = (idx: number, companyName: string) => {
    const matched = subledgerCompanies.find(c => c.name === companyName);
    setNotifyList(prev => {
      const next = [...prev];
      next[idx] = { notify_id: companyName, notify_branch_id: '', notify_address: '', notifyAddresses: [] };
      return next;
    });
    if (matched) {
      getMasterCompanyAddressesApi(matched.id).then(res => {
        const addrs = mapAddresses(res.data?.data ?? res.data ?? []);
        setNotifyList(prev => {
          const next = [...prev];
          if (next[idx]) next[idx] = { ...next[idx], notifyAddresses: addrs };
          return next;
        });
      }).catch(() => {});
    }
  };

  const updateNotifyBranch = (idx: number, branchId: string) => {
    setNotifyList(prev => {
      const next = [...prev];
      if (next[idx]) {
        const addr = next[idx].notifyAddresses.find(a => String(a.id) === branchId);
        next[idx] = { ...next[idx], notify_branch_id: branchId, notify_address: addr?.address ?? '' };
      }
      return next;
    });
  };

  const addPartyRow = () => {
    setParties([...parties, {
      customer: "", customerBranch: "", customerAddress: "",
      shipper: "", shipperBranch: "", shipperAddress: "",
      carrier: "", carrierBranch: "", carrierAddress: "",
      consignee: "", consigneeBranch: "", consigneeAddress: "",
      customerAddresses: []
    }]);
  };

  const removePartyRow = (index: number) => {
    setParties(parties.filter((_, i) => i !== index));
  };

  const updatePartyRow = (index: number, key: keyof PartyRow, value: any) => {
    setParties(curr => {
      const next = [...curr];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const updatePartyCustomer = (index: number, customerName: string) => {
    updatePartyRow(index, "customer", customerName);
    updatePartyRow(index, "customerBranch", "");
    updatePartyRow(index, "customerAddress", "");
    updatePartyRow(index, "customerAddresses", []);
    const matched = subledgerCompanies.find(c => c.name === customerName);
    if (matched) {
      getMasterCompanyAddressesApi(matched.id).then(res => {
         const addrs = mapAddresses(res.data?.data ?? res.data ?? []);
         updatePartyRow(index, "customerAddresses", addrs);
      });
    }
  };

  const mapAddresses = (raw: any[]) => raw.map(r => ({
    id: r.id,
    label: [r.address_type, r.city, r.address].filter(Boolean).join(' - '),
    address: [r.address, r.city, r.state, r.country].filter(Boolean).join(', '),
  }));

  const fetchCustomerAddresses = (companyId: number, companyName?: string) => {
    setCustomerAddressesLoading(true);
    getMasterCompanyAddressesApi(companyId)
      .then(res => {
        const mapped = mapAddresses(res.data?.data ?? res.data ?? []);
        if (mapped.length === 0 && companyName) {
          const storedAddresses = JSON.parse(localStorage.getItem("subledger_addresses") ?? "{}");
          const storedBranches = JSON.parse(localStorage.getItem("subledger_branches") ?? "{}");
          const addr = storedAddresses[companyName];
          const branch = storedBranches[companyName];
          if (branch) {
            setCustomerAddresses([{ id: Number(branch.id), label: branch.name, address: addr ?? "" }]);
          } else if (addr) {
            setCustomerAddresses([{ id: -1, label: "Default Address", address: addr }]);
          } else {
            setCustomerAddresses([]);
          }
          return;
        }
        setCustomerAddresses(mapped);
      })
      .catch(() => setCustomerAddresses([]))
      .finally(() => setCustomerAddressesLoading(false));
  };

  const loadSubledgerCompanies = () => {
    getMasterCompaniesApi().then(res => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setSubledgerCompanies(raw.map(r => ({ id: r.id, name: r.name })));
    }).catch(() => {});
  };

  useEffect(() => {
    loadSubledgerCompanies();
    getBranchesApi(1, 9999).then(res => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setBranches(raw.filter((r: any) => r.status === 1 || r.status === '1' || r.status === 'active').map((r: any) => ({ id: r.id, name: r.name })));
    }).catch(() => {});
    getMasterCompanyAddressesApi().then(res => {
      const mapped = mapAddresses(res.data?.data ?? res.data ?? []);
      setAllAddresses(mapped);
      // Re-hydrate notify addresses after allAddresses loads
      setNotifyList(prev => prev.map(n =>
        n.notify_id && !n.notify_address
          ? { ...n, notify_address: mapped.find(a => String(a.id) === n.notify_id)?.address ?? '' }
          : n
      ));
    }).catch(() => {});
    getCountriesApi().then(res => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setSubCountries(raw.map(r => ({ id: r.id, country_name: r.country_name })));
    }).catch(() => {});
    getStatesApi(1, 9999).then(res => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setSubAllStates(raw.map(r => ({ id: r.id, country_id: Number(r.country_id), name: r.name })));
    }).catch(() => {});
    getCitiesApi().then(res => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setSubAllCities(raw.map(r => ({ id: r.id, state_id: Number(r.state_id), name: r.name })));
    }).catch(() => {});
  }, []);

  // Generic API call to fetch branches for any party type
  const fetchBranchesForParty = async (
    partyType: "customer" | "shipper" | "carrier" | "consignee",
    partyName: string,
  ): Promise<Branch[]> => {
    setBranchesLoading((prev) => ({ ...prev, [partyType]: true }));
    setBranchesError((prev) => ({ ...prev, [partyType]: "" }));
    try {
      // Simulate API call - Replace with actual API endpoint per party type
      // const response = await fetch(`/api/${partyType}s/${partyName}/branches`);
      // const data = await response.json();

      let partyOptions: PartyWithBranches[] = [];

      switch (partyType) {
        case "customer":
          partyOptions = CUSTOMER_OPTIONS;
          break;
        case "shipper":
          partyOptions = SHIPPER_OPTIONS;
          break;
        case "carrier":
          partyOptions = CARRIER_OPTIONS;
          break;
        case "consignee":
          partyOptions = CONSIGNEE_OPTIONS;
          break;
      }

      const partyData = partyOptions.find((p) => p.name === partyName);
      return partyData?.branches ?? [];
    } catch (error) {
      setBranchesError((prev) => ({ ...prev, [partyType]: "Failed to load branches" }));
      console.error(`Error fetching ${partyType} branches:`, error);
      return [];
    } finally {
      setBranchesLoading((prev) => ({ ...prev, [partyType]: false }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof OperationFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const e: Partial<Record<keyof OperationFormData, string>> = {};
    if (!formData.jobDate) e.jobDate = "Job Date is required";
    if (!formData.placeOfReceipt.trim()) e.placeOfReceipt = "Place of Receipt is required";
    if (!formData.placeOfDelivery.trim()) e.placeOfDelivery = "Place of Delivery is required";
    if (!formData.pol) e.pol = "POL is required";
    if (!formData.pod) e.pod = "POD is required";
    if (!formData.polEtd) e.polEtd = "POL ETD is required";
    if (!formData.podEta) e.podEta = "POD ETA is required";
    if (!formData.customer) e.customer = "Customer is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        document:          formData.document,
        job_date:          formData.jobDate,
        freight_pp_cc:     formData.freightPpCc,
        place_of_receipt:  formData.placeOfReceipt,
        place_of_delivery: formData.placeOfDelivery,
        pol:               formData.pol,
        pod:               formData.pod,
        pol_etd:           formData.polEtd,
        pod_eta:           formData.podEta,
        flight_name:       formData.flightName,
        flight_number:     formData.flightNumber,
        service_type:      formData.serviceType,
        note:              formData.note,
        customer:          formData.customer,
        customer_branch:   Number(formData.customerBranch) > 0 ? formData.customerBranch : "",
        customer_address:  formData.customerAddress,
        shipper:           formData.shipper || undefined,
        shipper_address:   formData.shipperAddress,
        carrier:           formData.carrierBranch || undefined,
        carrier_address:   formData.carrierAddress || undefined,
        consignee:         formData.consignee || undefined,
        consignee_address: formData.consigneeAddress,
        status:            formData.status,
        notify_list: notifyList.map(n => ({
          notify_id: n.notify_id || null,
          notify_branch_id: n.notify_id || null,
        })),
        parties: parties.map(p => ({
          customer: p.customer,
          customer_branch: Number(p.customerBranch) > 0 ? p.customerBranch : "",
          customer_address: p.customerAddress,
          shipper: p.shipper,
          shipper_branch: p.shipperBranch,
          shipper_address: p.shipperAddress,
          carrier: p.carrier || undefined,
          carrier_branch: p.carrierBranch || undefined,
          carrier_address: p.carrierAddress || undefined,
          consignee: p.consignee,
          consignee_branch: p.consigneeBranch,
          consignee_address: p.consigneeAddress,
        })),
      };
      if (isEdit) {
        await updateOperationApi(Number(id), payload);
        toast({ title: 'Updated', description: 'Operation updated successfully.', variant: 'success' });
        refresh();
        navigate(`/operations/view/${id}`);
      } else {
        const res = await createOperationApi(payload);
        const newId = res.data?.data?.id ?? res.data?.id;
        toast({ title: 'Created', description: 'Operation created successfully.', variant: 'success' });
        refresh();
        navigate(`/operations/view/${newId}`);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.response?.data?.error ?? '';
      toast({ title: 'Error', description: msg || `Failed to ${isEdit ? 'update' : 'create'} operation.`, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
    window.scrollTo(0, 0);
  };

  const closeSubledger = () => {
    setSubledger(initialSubledger);
    setSubledgerErrors({});
    setSubledgerLogoFile(null);
    setSubledgerLogoFileName("");
    setSubledgerOpen(false);
  };

  const handleSubledgerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubledger((prev) => ({ ...prev, [name]: value }));
    if (subledgerErrors[name as keyof SubledgerForm])
      setSubledgerErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateSubledger = () => {
    const e: Partial<Record<keyof SubledgerForm, string>> = {};
    if (!subledger.name.trim()) e.name = "Name is required";
    if (!subledger.actualName.trim()) e.actualName = "Actual Name is required";
    if (!subledger.categories.trim()) e.categories = "Categories is required";
    setSubledgerErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubledgerCreate = async () => {
    if (!validateSubledger()) return;
    setSubledgerSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", subledger.name.trim());
      fd.append("actual_name", subledger.actualName.trim());
      fd.append("categories", subledger.categories.trim());
      fd.append("position", subledger.position);
      fd.append("website", subledger.website.trim());
      if (subledger.branchId) fd.append("branch_id", subledger.branchId);
      fd.append("username", subledger.userName.trim());
      fd.append("password", subledger.password);
      fd.append("scac_code", subledger.scacCode.trim());
      fd.append("interest_calculation", subledger.interestCalculation);
      fd.append("notes", subledger.notes);
      fd.append("iec_code", subledger.iecCode.trim());
      fd.append("iata_code", subledger.iataCode.trim());
      fd.append("bond", subledger.bond.trim());
      const expireDateForApi = subledger.expireBondDate
        ? subledger.expireBondDate.split("-").reverse().join("-")
        : "";
      fd.append("expire_bond_date", expireDateForApi);
      fd.append("status", subledger.status === "Active" ? "1" : "0");
      if (subledgerLogoFile) fd.append("logo", subledgerLogoFile);
      const createRes = await createMasterCompanyApi(fd);
      const newCompanyId: number = createRes.data?.data?.id ?? createRes.data?.id;
      const newCompanyName = subledger.name.trim();
      // Submit address to API if address fields are filled
      if (subledger.address.trim() || subledger.pinNo.trim()) {
        try {
          await createMasterCompanyAddressApi({
            company_id: newCompanyId,
            branch_name: subledger.branchName.trim(),
            address: subledger.address.trim(),
            country: subledger.country,
            state: subledger.state,
            city: subledger.city,
            pin_no: subledger.pinNo.trim(),
            status: 1,
          });
        } catch {}
      }
      // Store address in localStorage only (not sent to API)
      if (subledger.address.trim()) {
        const stored = JSON.parse(localStorage.getItem("subledger_addresses") ?? "{}");
        stored[newCompanyName] = subledger.address.trim();
        localStorage.setItem("subledger_addresses", JSON.stringify(stored));
      }
      // Store selected branch in localStorage
      if (subledger.branchId.trim()) {
        const storedBranches = JSON.parse(localStorage.getItem("subledger_branches") ?? "{}");
        storedBranches[newCompanyName] = { id: subledger.branchId.trim(), name: subledger.branchId.trim() };
        localStorage.setItem("subledger_branches", JSON.stringify(storedBranches));
      }
      toast({ title: "Success", description: "Company created successfully.", variant: "success" });
      // Reload companies then auto-select the new one in Customer
      getMasterCompaniesApi().then(async res => {
        const raw: any[] = res.data?.data ?? res.data ?? [];
        setSubledgerCompanies(raw.map(r => ({ id: r.id, name: r.name })));
        const matched = raw.find((r: any) => r.id === newCompanyId || r.name === newCompanyName);
        const resolvedId = matched?.id ?? newCompanyId;
        const resolvedName = matched?.name ?? newCompanyName;
        // Fetch addresses for the new company
        let branches: { id: number; label: string; address: string }[] = [];
        try {
          const addrRes = await getMasterCompanyAddressesApi(resolvedId);
          branches = mapAddresses(addrRes.data?.data ?? addrRes.data ?? []);
        } catch {}
        // Fall back to localStorage if no API addresses
        if (branches.length === 0) {
          const storedAddresses = JSON.parse(localStorage.getItem("subledger_addresses") ?? "{}");
          const storedBranches = JSON.parse(localStorage.getItem("subledger_branches") ?? "{}");
          const addr = storedAddresses[resolvedName];
          const branch = storedBranches[resolvedName];
          if (branch) {
            branches = [{ id: Number(branch.id), label: branch.name, address: addr ?? "" }];
          } else if (addr) {
            branches = [{ id: -1, label: "Default Address", address: addr }];
          }
        }
        const firstBranch = branches[0];
        // Set everything in one batch
        setCustomerAddresses(branches);
        setAllAddresses((curr) => {
          const next = [...curr];
          branches.forEach((b) => {
            if (!next.some((x) => x.id === b.id)) next.push(b);
          });
          return next;
        });
        setFormData(prev => ({
          ...prev,
          customer: resolvedName,
          customerBranch: firstBranch ? String(firstBranch.id) : "",
          customerAddress: firstBranch ? firstBranch.address : "",
        }));
      }).catch(() => {});
      closeSubledger();
    } catch (err: any) {
      const msg: string = err?.response?.data?.message ?? "";
      toast({ title: "Error", description: msg || "Failed to create company.", variant: "destructive" });
    } finally {
      setSubledgerSaving(false);
    }
  };

  const sel = (err?: string) =>
    `w-full px-3 py-2 border rounded-lg text-sm bg-background ${err ? "border-destructive" : "border-input"}`;

  if (loadingEdit) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        <span className="inline-block w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
        Loading operation...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/operations")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {isEdit ? "Edit Operation" : "New Operation"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isEdit ? 'Edit existing operation' : 'Create a new logistics operation'}
          </p>
        </div>
      </div>

      {/* ── Job List Details ── */}
      <div className="material-card material-elevation-1 overflow-hidden">
        <div className="bg-white px-6 py-3 border-b border-border">
          <h2 className="text-lg font-bold text-primary">Job List Details</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
            {/* Document */}
            <div className="flex items-center gap-4">
              <Label className="text-sm font-semibold w-40 shrink-0">Document</Label>
              <div className="flex-1">
                <select
                  id="document"
                  name="document"
                  value={formData.document}
                  onChange={(e) => {
                    setFormData({
                      ...initialForm,
                      document: e.target.value,
                      jobDate: formData.jobDate,
                    });
                    setErrors({} as Partial<Record<keyof OperationFormData, string>>);
                  }}
                  className={sel()}
                >
                  {[
                    "Air Export",
                    "Air Import",
                    "FCL Export",
                    "FCL Import",
                    "Land Export",
                    "Land Import",
                    "LCL Export",
                    "LCL Import",
                  ].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Date */}
            <div className="flex items-center gap-4">
              <Label htmlFor="jobDate" className="text-sm font-semibold w-40 shrink-0">
                Job Date <span className="text-destructive">*</span>
              </Label>
              <div className="flex-1">
                <Input
                  id="jobDate"
                  name="jobDate"
                  type="date"
                  value={formData.jobDate}
                  onChange={handleChange}
                  className={errors.jobDate ? "border-destructive" : ""}
                />
                {errors.jobDate && <p className="text-xs text-destructive mt-1">{errors.jobDate}</p>}
              </div>
            </div>

            {/* Freight PP/CC */}
            <div className="flex items-center gap-4">
              <Label htmlFor="freightPpCc" className="text-sm font-semibold w-40 shrink-0">
                Freight PP / CC
              </Label>
              <div className="flex-1">
                <select
                  id="freightPpCc"
                  name="freightPpCc"
                  value={formData.freightPpCc}
                  onChange={handleChange}
                  className={sel()}
                >
                  {FREIGHT_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Place of Receipt */}
            <div className="flex items-center gap-4">
              <Label htmlFor="placeOfReceipt" className="text-sm font-semibold w-40 shrink-0">
                Place of Receipt <span className="text-destructive">*</span>
              </Label>
              <div className="flex-1">
                <Input
                  id="placeOfReceipt"
                  name="placeOfReceipt"
                  value={formData.placeOfReceipt}
                  onChange={handleChange}
                  className={errors.placeOfReceipt ? "border-destructive" : ""}
                />
                {errors.placeOfReceipt && <p className="text-xs text-destructive mt-1">{errors.placeOfReceipt}</p>}
              </div>
            </div>

            {/* Place of Delivery */}
            <div className="flex items-center gap-4">
              <Label htmlFor="placeOfDelivery" className="text-sm font-semibold w-40 shrink-0">
                Place of Delivery <span className="text-destructive">*</span>
              </Label>
              <div className="flex-1">
                <Input
                  id="placeOfDelivery"
                  name="placeOfDelivery"
                  value={formData.placeOfDelivery}
                  onChange={handleChange}
                  className={errors.placeOfDelivery ? "border-destructive" : ""}
                />
                {errors.placeOfDelivery && <p className="text-xs text-destructive mt-1">{errors.placeOfDelivery}</p>}
              </div>
            </div>

            {/* POL */}
            <div className="flex items-center gap-4">
              <Label htmlFor="pol" className="text-sm font-semibold w-40 shrink-0">
                POL <span className="text-destructive">*</span>
              </Label>
              <div className="flex-1">
                <CitySearchSelect
                  value={formData.pol}
                  cities={cities}
                  onChange={val => { setFormData(prev => ({ ...prev, pol: val })); if (errors.pol) setErrors(prev => ({ ...prev, pol: '' })); }}
                  placeholder="-Select-"
                />
                {errors.pol && <p className="text-xs text-destructive mt-1">{errors.pol}</p>}
              </div>
            </div>

            {/* POD */}
            <div className="flex items-center gap-4">
              <Label htmlFor="pod" className="text-sm font-semibold w-40 shrink-0">
                POD <span className="text-destructive">*</span>
              </Label>
              <div className="flex-1">
                <CitySearchSelect
                  value={formData.pod}
                  cities={cities}
                  onChange={val => { setFormData(prev => ({ ...prev, pod: val })); if (errors.pod) setErrors(prev => ({ ...prev, pod: '' })); }}
                  placeholder="-Select-"
                />
                {errors.pod && <p className="text-xs text-destructive mt-1">{errors.pod}</p>}
              </div>
            </div>

            {/* POL ETD */}
            <div className="flex items-center gap-4">
              <Label htmlFor="polEtd" className="text-sm font-semibold w-40 shrink-0">
                POL ETD <span className="text-destructive">*</span>
              </Label>
              <div className="flex-1">
                <Input
                  id="polEtd"
                  name="polEtd"
                  type="date"
                  value={formData.polEtd}
                  onChange={handleChange}
                  className={errors.polEtd ? "border-destructive" : ""}
                />
                {errors.polEtd && <p className="text-xs text-destructive mt-1">{errors.polEtd}</p>}
              </div>
            </div>

            {/* Flight/Vessel Name */}
            <div className="flex items-center gap-4">
              <Label htmlFor="flightName" className="text-sm font-semibold w-40 shrink-0">
                {["FCL Import", "FCL Export", "Land Export", "Land Import", "LCL Export", "LCL Import"].includes(
                  formData.document,
                )
                  ? "Vessel Name"
                  : "Flight Name"}
              </Label>
              <div className="flex-1">
                <Input id="flightName" name="flightName" value={formData.flightName} onChange={handleChange} />
              </div>
            </div>

            {/* Flight/Voyage Number */}
            <div className="flex items-center gap-4">
              <Label htmlFor="flightNumber" className="text-sm font-semibold w-40 shrink-0">
                {["Land Import", "Land Export"].includes(formData.document)
                  ? "Vessel Number"
                  : ["FCL Import", "FCL Export", "LCL Export", "LCL Import"].includes(formData.document)
                    ? "Voyage Number"
                    : "Flight Number"}
              </Label>
              <div className="flex-1">
                <Input id="flightNumber" name="flightNumber" value={formData.flightNumber} onChange={handleChange} />
              </div>
            </div>

            {/* POD ETA */}
            <div className="flex items-center gap-4">
              <Label htmlFor="podEta" className="text-sm font-semibold w-40 shrink-0">
                POD ETA <span className="text-destructive">*</span>
              </Label>
              <div className="flex-1">
                <Input
                  id="podEta"
                  name="podEta"
                  type="date"
                  value={formData.podEta}
                  onChange={handleChange}
                  className={errors.podEta ? "border-destructive" : ""}
                />
                {errors.podEta && <p className="text-xs text-destructive mt-1">{errors.podEta}</p>}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-4">
              <Label htmlFor="status" className="text-sm font-semibold w-40 shrink-0">
                Status
              </Label>
              <div className="flex-1">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={e => setFormData(prev => ({ ...prev, status: Number(e.target.value) }))}
                  className={sel()}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>

            {/* Note */}
            <div className="flex items-start gap-4 md:col-span-2">
              <Label htmlFor="note" className="text-sm font-semibold w-40 shrink-0 pt-2">
                Note
              </Label>
              <div className="flex-1">
                <Textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={4}
                  className="resize-y"
                />
              </div>
            </div>

            {/* Service Type */}
            <div className="flex items-center gap-4">
              <Label htmlFor="serviceType" className="text-sm font-semibold w-40 shrink-0">
                Service Type
              </Label>
              <div className="flex-1">
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className={sel()}
                >
                  <option value="">--Select--</option>
                  {serviceModes.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Parties ── */}
      <div className="material-card material-elevation-1 overflow-hidden">
        <div className="bg-white px-6 py-3 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">Parties</h2>
          <div className="flex gap-2">
            <Button type="button" className="material-button text-black gap-2" onClick={() => setSubledgerOpen(true)}>
              <Plus className="w-4 h-4" />
              Add New Party
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer */}
            <div className="material-card material-elevation-1 overflow-hidden">
              <div className="bg-[#00BCD4] px-5 py-2.5">
                <h3 className="text-white font-semibold text-sm">Customer</h3>
              </div>
              <div className="p-5 space-y-4">
                {/* Customer and Branch in same row */}
                <div className="flex items-center gap-4">
                  <Label htmlFor="customer" className="text-sm font-semibold w-24 shrink-0">
                    Customer<span className="text-destructive mr-1"> *</span>
                  </Label>
                  <div className="flex-1">
                    <select
                      id="customer"
                      name="customer"
                      value={formData.customer}
                      onChange={(e) => {
                        const customerName = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          customer: customerName,
                          customerBranch: "",
                          customerAddress: "",
                        }));
                        if (errors.customer) setErrors((prev) => ({ ...prev, customer: "" }));
                        setCustomerAddresses([]);
                        const matched = subledgerCompanies.find(c => c.name === customerName);
                        if (matched) fetchCustomerAddresses(matched.id, customerName);
                      }}
                      className={sel(errors.customer)}
                    >
                      <option value="">Select</option>
                      {subledgerCompanies.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.customer && <p className="text-xs text-destructive mt-1">{errors.customer}</p>}
                  </div>
                  {/* Branch - Always Visible */}
                  <div className="flex items-center gap-4">
                    <Label htmlFor="customerBranch" className="text-sm font-semibold w-24 shrink-0">
                      Branch
                    </Label>
                    <div className="flex-1">
                      <select
                        id="customerBranch"
                        name="customerBranch"
                        value={formData.customerBranch}
                        onChange={(e) => {
                          const selectedAddr = customerAddresses.find(a => String(a.id) === e.target.value);
                          setFormData((prev) => ({
                            ...prev,
                            customerBranch: e.target.value,
                            customerAddress: selectedAddr?.address ?? "",
                          }));
                        }}
                        className={sel()}
                        disabled={!formData.customer}
                      >
                        <option value="">{customerAddressesLoading ? "Loading branches..." : "Select Branch"}</option>
                        {customerAddresses.map(a => (
                          <option key={a.id} value={String(a.id)}>
                            {a.label}
                          </option>
                        ))}
                      </select>
                      {branchesError.customer && (
                        <p className="text-xs text-destructive mt-1">{branchesError.customer}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Label htmlFor="customerAddress" className="text-sm font-semibold w-24 shrink-0 pt-2">
                    Address
                  </Label>
                  <Textarea
                    id="customerAddress"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleChange}
                    rows={4}
                    className="flex-1 resize-y"
                  />
                </div>
              </div>
            </div>

            {/* Shipper */}
            <div className="material-card material-elevation-1 overflow-hidden">
              <div className="bg-[#26A69A] px-5 py-2.5">
                <h3 className="text-white font-semibold text-sm">Shipper</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="shipper" className="text-sm font-semibold w-24 shrink-0">Shipper</Label>
                  <div className="flex-1">
                    <select id="shipper" name="shipper" value={formData.shipper}
                      onChange={(e) => {
                        const a = allAddresses.find(x => String(x.id) === e.target.value);
                        setFormData(prev => ({ ...prev, shipper: e.target.value, shipperBranch: a?.label ?? "", shipperAddress: a?.address ?? "" }));
                      }}
                      className={sel()}>
                      <option value="">Select</option>
                      {allAddresses.map(a => <option key={a.id} value={String(a.id)}>{a.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Label htmlFor="shipperAddress" className="text-sm font-semibold w-24 shrink-0 pt-2">Address</Label>
                  <Textarea id="shipperAddress" name="shipperAddress" value={formData.shipperAddress} onChange={handleChange} rows={4} className="flex-1 resize-y" />
                </div>
              </div>
            </div>

            {/* Carrier/Airline */}
            <div className="material-card material-elevation-1 overflow-hidden">
              <div className="bg-[#C8D400] px-5 py-2.5">
                <h3 className="text-white font-semibold text-sm">Carrier/Airline</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="carrier" className="text-sm font-semibold w-24 shrink-0">Carrier<span className="text-destructive mr-1"> *</span></Label>
                  <div className="flex-1">
                    <select id="carrier" name="carrier" value={formData.carrierBranch}
                      onChange={(e) => {
                        const a = allAddresses.find(x => String(x.id) === e.target.value);
                        setFormData(prev => ({ ...prev, carrierBranch: e.target.value, carrier: e.target.value, carrierAddress: a?.address ?? "" }));
                        if (errors.carrier) setErrors(prev => ({ ...prev, carrier: "" }));
                      }}
                      className={sel(errors.carrier)}>
                      <option value="">Select</option>
                      {allAddresses.map(a => <option key={a.id} value={String(a.id)}>{a.label}</option>)}
                    </select>
                    {errors.carrier && <p className="text-xs text-destructive mt-1">{errors.carrier}</p>}
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Label htmlFor="carrierAddress" className="text-sm font-semibold w-24 shrink-0 pt-2">Address</Label>
                  <Textarea id="carrierAddress" name="carrierAddress" value={formData.carrierAddress} onChange={handleChange} rows={4} className="flex-1 resize-y" />
                </div>
              </div>
            </div>

            {/* Consignee */}
            <div className="material-card material-elevation-1 overflow-hidden">
              <div className="bg-[#4CAF50] px-5 py-2.5">
                <h3 className="text-white font-semibold text-sm">Consignee</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="consignee" className="text-sm font-semibold w-24 shrink-0">Consignee</Label>
                  <div className="flex-1">
                    <select id="consignee" name="consignee" value={formData.consignee}
                      onChange={(e) => {
                        const a = allAddresses.find(x => String(x.id) === e.target.value);
                        setFormData(prev => ({ ...prev, consignee: e.target.value, consigneeAddress: a?.address ?? "" }));
                      }}
                      className={sel()}>
                      <option value="">Select</option>
                      {allAddresses.map(a => <option key={a.id} value={String(a.id)}>{a.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Label htmlFor="consigneeAddress" className="text-sm font-semibold w-24 shrink-0 pt-2">Address</Label>
                  <Textarea id="consigneeAddress" name="consigneeAddress" value={formData.consigneeAddress} onChange={handleChange} rows={4} className="flex-1 resize-y" />
                </div>
              </div>
            </div>
          </div>
          {parties.map((party, index) => (
            <div key={index} className="border-t border-border mt-6 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 relative">
              <Button 
                type="button" 
                variant="destructive" 
                size="sm" 
                className="absolute -top-4 right-0"
                onClick={() => removePartyRow(index)}
              >
                Remove
              </Button>
              {/* Customer */}
              <div className="material-card material-elevation-1 overflow-hidden">
                <div className="bg-[#00BCD4] px-5 py-2.5">
                  <h3 className="text-white font-semibold text-sm">Customer</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="text-sm font-semibold w-24 shrink-0">Customer</Label>
                    <div className="flex-1">
                      <select
                        value={party.customer}
                        onChange={(e) => updatePartyCustomer(index, e.target.value)}
                        className={sel()}
                      >
                        <option value="">Select</option>
                        {subledgerCompanies.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-sm font-semibold w-24 shrink-0">Branch</Label>
                    <div className="flex-1">
                      <select
                        value={party.customerBranch}
                        onChange={(e) => {
                          const selectedAddr = party.customerAddresses?.find(a => String(a.id) === e.target.value);
                          updatePartyRow(index, "customerBranch", e.target.value);
                          updatePartyRow(index, "customerAddress", selectedAddr?.address ?? "");
                        }}
                        className={sel()}
                        disabled={!party.customer}
                      >
                        <option value="">Select Branch</option>
                        {party.customerAddresses?.map(a => (
                          <option key={a.id} value={String(a.id)}>{a.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Label className="text-sm font-semibold w-24 shrink-0 pt-2">Address</Label>
                    <Textarea value={party.customerAddress} onChange={(e) => updatePartyRow(index, "customerAddress", e.target.value)} rows={4} className="flex-1 resize-y" />
                  </div>
                </div>
              </div>
              {/* Shipper */}
              <div className="material-card material-elevation-1 overflow-hidden">
                <div className="bg-[#26A69A] px-5 py-2.5">
                  <h3 className="text-white font-semibold text-sm">Shipper</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="text-sm font-semibold w-24 shrink-0">Shipper</Label>
                    <div className="flex-1">
                      <select value={party.shipperBranch}
                        onChange={(e) => {
                          const a = allAddresses.find(x => String(x.id) === e.target.value);
                          updatePartyRow(index, "shipperBranch", e.target.value);
                          updatePartyRow(index, "shipperAddress", a?.address ?? "");
                        }}
                        className={sel()}>
                        <option value="">Select</option>
                        {allAddresses.map(a => <option key={a.id} value={String(a.id)}>{a.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Label className="text-sm font-semibold w-24 shrink-0 pt-2">Address</Label>
                    <Textarea value={party.shipperAddress} onChange={(e) => updatePartyRow(index, "shipperAddress", e.target.value)} rows={4} className="flex-1 resize-y" />
                  </div>
                </div>
              </div>
              {/* Carrier */}
              <div className="material-card material-elevation-1 overflow-hidden">
                <div className="bg-[#C8D400] px-5 py-2.5">
                  <h3 className="text-white font-semibold text-sm">Carrier/Airline</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="text-sm font-semibold w-24 shrink-0">Carrier</Label>
                    <div className="flex-1">
                      <select value={party.carrier}
                        onChange={(e) => {
                          const a = allAddresses.find(x => String(x.id) === e.target.value);
                          updatePartyRow(index, "carrierBranch", e.target.value);
                          updatePartyRow(index, "carrierAddress", a?.address ?? "");
                        }}
                        className={sel()}>
                        <option value="">Select</option>
                        {allAddresses.map(a => <option key={a.id} value={String(a.id)}>{a.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Label className="text-sm font-semibold w-24 shrink-0 pt-2">Address</Label>
                    <Textarea value={party.carrierAddress} onChange={(e) => updatePartyRow(index, "carrierAddress", e.target.value)} rows={4} className="flex-1 resize-y" />
                  </div>
                </div>
              </div>
              {/* Consignee */}
              <div className="material-card material-elevation-1 overflow-hidden">
                <div className="bg-[#4CAF50] px-5 py-2.5">
                  <h3 className="text-white font-semibold text-sm">Consignee</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="text-sm font-semibold w-24 shrink-0">Consignee</Label>
                    <div className="flex-1">
                      <select value={party.consigneeBranch}
                        onChange={(e) => {
                          const a = allAddresses.find(x => String(x.id) === e.target.value);
                          updatePartyRow(index, "consigneeBranch", e.target.value);
                          updatePartyRow(index, "consigneeAddress", a?.address ?? "");
                        }}
                        className={sel()}>
                        <option value="">Select</option>
                        {allAddresses.map(a => <option key={a.id} value={String(a.id)}>{a.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Label className="text-sm font-semibold w-24 shrink-0 pt-2">Address</Label>
                    <Textarea value={party.consigneeAddress} onChange={(e) => updatePartyRow(index, "consigneeAddress", e.target.value)} rows={4} className="flex-1 resize-y" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Notify Section ── */}
      <div className="material-card material-elevation-1 overflow-hidden">
        <div className="bg-white px-6 py-3 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">Notify</h2>
          {notifyList.length < 2 && (
            <Button type="button" className="material-button text-black gap-2" variant="outline" onClick={addNotify}>
              <Plus className="w-4 h-4" />
              Add Notify
            </Button>
          )}
        </div>
        <div className="p-6">
          {notifyList.length === 0 && (
            <p className="text-sm text-muted-foreground">No notify parties added.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notifyList.map((notify, idx) => (
              <div key={idx} className="material-card material-elevation-1 overflow-hidden relative">
                <div className="bg-[#FF7043] px-5 py-2.5 flex items-center justify-between">
                  <h3 className="text-white font-semibold text-sm">Notify {idx + 1}</h3>
                  <button type="button" onClick={() => removeNotify(idx)} className="text-white hover:text-red-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="text-sm font-semibold w-24 shrink-0">Notify</Label>
                    <div className="flex-1">
                      <select
                        value={notify.notify_id}
                        onChange={e => {
                          const a = allAddresses.find(x => String(x.id) === e.target.value);
                          setNotifyList(prev => {
                            const next = [...prev];
                            if (next[idx]) next[idx] = { notify_id: e.target.value, notify_address: a?.address ?? '' };
                            return next;
                          });
                        }}
                        className={sel()}
                      >
                        <option value="">Select</option>
                        {allAddresses.map(a => (
                          <option key={a.id} value={String(a.id)}>{a.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Label className="text-sm font-semibold w-24 shrink-0 pt-2">Address</Label>
                    <Textarea
                      value={notify.notify_address}
                      onChange={e => setNotifyList(prev => {
                        const next = [...prev];
                        if (next[idx]) next[idx] = { ...next[idx], notify_address: e.target.value };
                        return next;
                      })}
                      rows={4}
                      className="flex-1 resize-y"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Add New Subledger Modal ── */}
      {subledgerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeSubledger} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">Add New Party</h3>
              <button onClick={closeSubledger} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            {/* Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
              {/* Row 1: Name | Categories | Position */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Name <span className="text-destructive">*</span></Label>
                  <Input name="name" value={subledger.name} onChange={handleSubledgerChange} className={subledgerErrors.name ? "border-destructive" : ""} />
                  {subledgerErrors.name && <p className="text-xs text-destructive mt-1">{subledgerErrors.name}</p>}
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Categories <span className="text-destructive">*</span></Label>
                  <Input name="categories" value={subledger.categories} onChange={handleSubledgerChange} className={subledgerErrors.categories ? "border-destructive" : ""} />
                  {subledgerErrors.categories && <p className="text-xs text-destructive mt-1">{subledgerErrors.categories}</p>}
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Position</Label>
                  <select name="position" value={subledger.position} onChange={handleSubledgerChange} className={sel()}>
                    {["Opened","Closed","Pending","Suspended"].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              {/* Row 2: Actual Name | Website */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Actual Name <span className="text-destructive">*</span></Label>
                  <Input name="actualName" value={subledger.actualName} onChange={handleSubledgerChange} className={subledgerErrors.actualName ? "border-destructive" : ""} />
                  {subledgerErrors.actualName && <p className="text-xs text-destructive mt-1">{subledgerErrors.actualName}</p>}
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Website</Label>
                  <Input name="website" value={subledger.website} onChange={handleSubledgerChange} />
                </div>
                <div />
              </div>
              {/* Row 3: Customer Logo | User Name | Password */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Customer Logo</Label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-2 border border-input rounded-lg text-sm bg-background hover:bg-muted whitespace-nowrap">
                      Choose File
                      <input type="file" accept="image/*" className="hidden" onChange={e => {
                        const file = e.target.files?.[0];
                        setSubledgerLogoFile(file ?? null);
                        setSubledgerLogoFileName(file ? file.name : "");
                      }} />
                    </label>
                    <span className="text-sm text-muted-foreground truncate">{subledgerLogoFileName || "No file chosen"}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">User Name</Label>
                  <Input name="userName" value={subledger.userName} onChange={handleSubledgerChange} />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Password</Label>
                  <Input type="password" name="password" value={subledger.password} onChange={handleSubledgerChange} />
                </div>
              </div>
              {/* Row 4: SCAC Code | Interest Calculation | Notes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">SCAC Code</Label>
                  <Input name="scacCode" value={subledger.scacCode} onChange={handleSubledgerChange} />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Interest Calculation</Label>
                  <select name="interestCalculation" value={subledger.interestCalculation} onChange={handleSubledgerChange} className={sel()}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Notes</Label>
                  <textarea name="notes" value={subledger.notes} onChange={handleSubledgerChange} rows={4}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background resize-y" />
                </div>
              </div>
              {/* Row 5: IEC Code | IATA Code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">IEC Code</Label>
                  <Input name="iecCode" value={subledger.iecCode} onChange={handleSubledgerChange} />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">IATA Code</Label>
                  <Input name="iataCode" value={subledger.iataCode} onChange={handleSubledgerChange} />
                </div>
                <div />
              </div>
              {/* Address */}
              <div className="space-y-1">
                <Label className="text-sm font-medium">Address</Label>
                <textarea name="address" value={subledger.address} onChange={handleSubledgerChange} rows={3}
                  className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background resize-y" />
              </div>
              {/* Country | State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Country</Label>
                  <select name="country" value={subledger.country} onChange={e => {
                    setSubledger(prev => ({ ...prev, country: e.target.value, state: "", city: "" }));
                  }} className={sel()}>
                    <option value="">--Select--</option>
                    {subCountries.map(c => <option key={c.id} value={c.country_name}>{c.country_name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">State</Label>
                  <select name="state" value={subledger.state} onChange={e => {
                    setSubledger(prev => ({ ...prev, state: e.target.value, city: "" }));
                  }} disabled={!subledger.country} className={`${sel()} disabled:opacity-60`}>
                    <option value="">{subledger.country ? "--Select--" : "Select country first"}</option>
                    {subAllStates
                      .filter(s => {
                        const matched = subCountries.find(c => c.country_name === subledger.country);
                        return matched ? s.country_id === matched.id : false;
                      })
                      .map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              {/* City | PIN No */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">City</Label>
                  <select name="city" value={subledger.city} onChange={handleSubledgerChange}
                    disabled={!subledger.state} className={`${sel()} disabled:opacity-60`}>
                    <option value="">{subledger.state ? "--Select--" : "Select state first"}</option>
                    {subAllCities
                      .filter(c => {
                        const matchedState = subAllStates.find(s => s.name === subledger.state);
                        return matchedState ? c.state_id === matchedState.id : false;
                      })
                      .map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">PIN No</Label>
                  <Input name="pinNo" value={subledger.pinNo} onChange={handleSubledgerChange} />
                </div>
              </div>
              {/* Branch Name */}
              <div className="space-y-1">
                <Label className="text-sm font-medium">Branch Name</Label>
                <Input name="branchName" value={subledger.branchName} onChange={handleSubledgerChange} />
              </div>
            </div>
            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
              <Button variant="outline" onClick={closeSubledger}>Cancel</Button>
              <Button type="button" className="material-button text-black px-8" onClick={handleSubledgerCreate} disabled={subledgerSaving}>
                {subledgerSaving ? "Saving..." : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pb-4">
        <Button
          type="button"
          className="bg-red-400 text-black hover:bg-red-350"
          onClick={() => navigate("/operations")}
        >
          Cancel
        </Button>
        <Button type="button" className="material-button text-black" onClick={handleSave} disabled={saving}>
          {saving ? (isEdit ? 'Updating...' : 'Saving...') : isEdit ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default NewOperation;
