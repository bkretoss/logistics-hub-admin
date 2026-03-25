import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Pencil,
  X,
  ChevronDown,
  Columns3,
  Filter,
  Database,
  Palette,
  BarChart2,
  Rows3,
  BookOpen,
  Download,
  Mail,
  HelpCircle,
  TableProperties,
  ArrowUpDown,
  Sigma,
  Calculator,
  History,
  SplitSquareVertical,
  Highlighter,
  LayoutList,
  FileText,
  FileBarChart,
  FilePieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useOperations } from "./OperationsContext";

const CARRIER_OPTIONS = ["TEAMGLOBAL LOGISTICS PVT LTD", "Maersk Line", "Emirates SkyCargo", "ONE Line"];

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex items-start gap-2 py-1.5">
    <span className="text-sm font-semibold text-foreground w-40 shrink-0">{label}</span>
    <span className="text-sm text-cyan-600 font-medium">{value || ""}</span>
  </div>
);

const NoData = () => (
  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
    <svg className="w-10 h-10 mb-3 opacity-25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v5M13 21h8M13 17l4 4-4 4"
      />
      <rect x="3" y="3" width="18" height="13" rx="2" strokeWidth={1.5} />
    </svg>
    <p className="text-sm font-medium">No Data Available</p>
  </div>
);

const TABS = [
  "Show All",
  "Job Details",
  "Subledgers",
  "Dimension's",
  "Shipping Instructions",
  "Costing",
  "Shipping Bill / BOE",
  "House's List",
  "Others",
];

const STATIC_SUBLEDGERS = [
  {
    id: 1,
    subledgerType: "CUSTOMER",
    subledgerName: "ARCHEAN INDUSTRIES PRIVATE LIMITED",
    address: "NO.2, NORTH CRESCENT ROAD, T.NAGAR, CHENNAI 600017 INDIA",
    phone: "044-28340000",
    fax: "044-28340001",
    mobile: "9840012345",
    email: "info@archean.in",
    city: "Chennai",
  },
  {
    id: 2,
    subledgerType: "AIRLINE",
    subledgerName: "KALRA ONLINE SERVICES PVT. LTD",
    address: "414 4TH FLOOR AGI BUSINESS CENTRE, NEAR BUS STAND, JALANDHAR- (PUNJAB)",
    phone: "0181-5000100",
    fax: "",
    mobile: "9815500100",
    email: "ops@kalraonline.com",
    city: "Jalandhar",
  },
  {
    id: 3,
    subledgerType: "AGENT",
    subledgerName: "TEAMGLOBAL LOGISTICS PVT LTD",
    address: "REFLECTIONS BUILDING.2, LEITH CASTLE CENTER STREET, SANTHOME HIGH RD, CHENNAI",
    phone: "044-43539999",
    fax: "044-43539998",
    mobile: "9884400001",
    email: "team@teamglobal.in",
    city: "Chennai",
  },
  {
    id: 4,
    subledgerType: "CONSIGNEE",
    subledgerName: "TEXELQ ENGINEERING INDIA PVT LTD",
    address: "NO.77/2, KUTHAMPAKKAM ROAD, MEVVALURKKUPPAM, SRIPERUMBUDUR, KANCHIPURAM 602105",
    phone: "044-27162000",
    fax: "",
    mobile: "9962200001",
    email: "logistics@texelq.com",
    city: "Sriperumbudur",
  },
];

const ViewOperation = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { operations, addOperation, updateOperation } = useOperations();
  const op = operations.find((o) => o.id === Number(id));
  const [activeTab, setActiveTab] = useState("Job Details");
  const [dupOpen, setDupOpen] = useState(false);
  const [dupCarrier, setDupCarrier] = useState("");
  const [dupDate, setDupDate] = useState(new Date().toISOString().split("T")[0]);
  const [dupCarrierError, setDupCarrierError] = useState(false);

  // Rider Container modal
  const [riderOpen, setRiderOpen] = useState(false);

  // Status Update modal
  const [statusOpen, setStatusOpen] = useState(false);
  const UPDATE_TO_OPTIONS = ["Email", "SMS", "WhatsApp", "Phone Call", "Letter", "Fax"];
  const POSITION_OPTIONS = ["Opened", "In Transit", "Arrived", "Delivered", "Closed"];
  const initStatus = {
    lineNo: "",
    updateTo: "",
    position: "Opened",
    subject: "",
    from: "",
    to: "",
    bcc: "",
    cc: "",
    header: "",
    body: "",
    footer: "",
    notes: "",
  };
  const [statusForm, setStatusForm] = useState(initStatus);
  const [statusRows, setStatusRows] = useState<(typeof initStatus)[]>([]);
  const [statusEditIndex, setStatusEditIndex] = useState<number | null>(null);
  const statusChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setStatusForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const openStatusEdit = (index: number) => {
    setStatusEditIndex(index);
    setStatusForm({ ...statusRows[index] });
    setStatusOpen(true);
  };
  const closeStatusModal = () => {
    setStatusOpen(false);
    setStatusForm(initStatus);
    setStatusEditIndex(null);
  };
  const saveStatus = () => {
    if (statusEditIndex !== null) {
      setStatusRows((prev) => prev.map((r, i) => (i === statusEditIndex ? statusForm : r)));
    } else {
      setStatusRows((prev) => [...prev, statusForm]);
    }
    closeStatusModal();
  };

  // Dimensions modal
  const [dimOpen, setDimOpen] = useState(false);
  const PACKAGE_TYPES = ["Boxes", "Pallets", "Cartons", "Bags", "Drums", "Crates", "Bundles"];
  const WEIGHT_UNITS = ["Kg", "Lbs", "MT"];
  const COMMODITY_TYPES = ["General", "Hazardous", "Perishable", "Fragile", "Oversized", "Valuable"];
  const initDim = {
    sNo: "10",
    lxwxh: "",
    lxwxhMeasurement: "",
    length: "",
    width: "",
    height: "",
    noOfPcs: "",
    packageType: "",
    gWeight: "",
    gWeightUnit: "Kg",
    vWeight: "",
    vWeightUnit: "Kg",
    netWeight: "",
    netWeightUnit: "Kg",
    volume: "",
    coo: "",
    commodityType: "",
    commodityCode: "",
    commodityDesc: "",
    notes: "",
  };
  const [dimForm, setDimForm] = useState(initDim);
  const [dimRows, setDimRows] = useState<(typeof initDim)[]>([]);
  const [dimEditIndex, setDimEditIndex] = useState<number | null>(null);
  const dimChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setDimForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const openDimEdit = (index: number) => {
    setDimEditIndex(index);
    setDimForm({ ...dimRows[index] });
    setDimOpen(true);
  };
  const closeDimModal = () => {
    setDimOpen(false);
    setDimForm(initDim);
    setDimEditIndex(null);
  };
  const saveDim = () => {
    if (dimEditIndex !== null) {
      setDimRows((prev) => prev.map((r, i) => (i === dimEditIndex ? dimForm : r)));
    } else {
      setDimRows((prev) => [...prev, dimForm]);
    }
    closeDimModal();
  };

  // Shipping Instructions modal
  const [siOpen, setSiOpen] = useState(false);
  const [roroOpen, setRoroOpen] = useState(false);
  const PACK_TYPES = ["Boxes", "Pallets", "Cartons", "Bags", "Drums", "Crates", "Bundles"];
  const SI_WEIGHT_UNITS = ["Kg", "Lbs", "MT"];
  const SI_COMMODITY_TYPES = ["General", "Hazardous", "Perishable", "Fragile", "Oversized", "Valuable"];
  const SEAL_TYPE_OPTIONS = ["Original", "Telex", "Seaway Bill", "Express Release"];
  const initSi = {
    sNo: "10",
    noOfPcs: "",
    packType: "",
    noOfPallet: "",
    gWeight: "",
    gWeightUnit: "Kg",
    vWeight: "",
    vWeightUnit: "CBM",
    nWeight: "",
    nWeightUnit: "Kg",
    volume: "",
    chargeableUnit: "",
    commodityType: "",
    commodityCode: "",
    commodityDesc: "",
    manifestSeal: "",
    actualLinerSeal: "",
    customSeal: "",
    exciseSealNo: "",
    sealDate: "",
    sealTypeIndicator: "",
    sealDeviceId: "",
    movementDocType: "",
    movementDocNo: "",
    notes: "",
    roroYear: "",
    roroBrand: "",
    roroModel: "",
    roroSpecification: "",
    roroChasisNo: "",
    roroEngineNo: "",
  };
  const [siForm, setSiForm] = useState(initSi);
  const [siRows, setSiRows] = useState<(typeof initSi)[]>([]);
  const [siEditIndex, setSiEditIndex] = useState<number | null>(null);
  const siChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setSiForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const openSiEdit = (index: number) => {
    setSiEditIndex(index);
    setSiForm({ ...siRows[index] });
    setSiOpen(true);
  };
  const closeSiModal = () => {
    setSiOpen(false);
    setSiForm(initSi);
    setSiEditIndex(null);
  };
  const saveSi = () => {
    if (siEditIndex !== null) {
      setSiRows((prev) => prev.map((r, i) => (i === siEditIndex ? siForm : r)));
    } else {
      setSiRows((prev) => [...prev, siForm]);
    }
    closeSiModal();
  };

  // Shipping Bill modal
  const [sbOpen, setSbOpen] = useState(false);
  const SB_PACK_TYPES = ["Boxes", "Pallets", "Cartons", "Bags", "Drums", "Crates", "Bundles"];
  const initSb = {
    shippingBillNo: "",
    shippingBillDate: "",
    mateReceiptNo: "",
    mateReceiptDate: "",
    noOfPcs: "",
    packType: "",
    grossWeight: "",
    measurement: "",
    volume: "",
    commodityCode: "",
    commodityType: "",
    commodityDesc: "",
    note: "",
  };
  const [sbForm, setSbForm] = useState(initSb);
  const [sbErrors, setSbErrors] = useState<Partial<Record<keyof typeof initSb, string>>>({});
  const [sbRows, setSbRows] = useState<(typeof initSb)[]>([]);
  const [sbEditIndex, setSbEditIndex] = useState<number | null>(null);
  const sbChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSbForm((prev) => ({ ...prev, [name]: value }));
    if (sbErrors[name as keyof typeof initSb]) setSbErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const openSbEdit = (index: number) => {
    setSbEditIndex(index);
    setSbForm({ ...sbRows[index] });
    setSbErrors({});
    setSbOpen(true);
  };
  const closeSbModal = () => {
    setSbOpen(false);
    setSbForm(initSb);
    setSbErrors({});
    setSbEditIndex(null);
  };
  const saveSb = () => {
    const errs: Partial<Record<keyof typeof initSb, string>> = {};
    if (!sbForm.shippingBillNo.trim()) errs.shippingBillNo = "Shipping Bill No is required";
    if (!sbForm.shippingBillDate) errs.shippingBillDate = "Shipping Bill Date is required";
    if (Object.keys(errs).length) {
      setSbErrors(errs);
      return;
    }
    if (sbEditIndex !== null) {
      setSbRows((prev) => prev.map((r, i) => (i === sbEditIndex ? sbForm : r)));
    } else {
      setSbRows((prev) => [...prev, sbForm]);
    }
    closeSbModal();
  };

  // House's List modal
  const HOUSE_INCO_TERMS = ["EXW", "FCA", "CPT", "CIP", "DAP", "DPU", "DDP", "FAS", "FOB", "CFR", "CIF"];
  const HOUSE_FREIGHT_TERMS = ["Collect", "Prepaid"];
  const HOUSE_CUSTOMERS = [
    "ARCHEAN INDUSTRIES PRIVATE LIMITED",
    "TEXELQ ENGINEERING INDIA PVT LTD",
    "TEXGRAM INC DBA INOTEX",
  ];
  const HOUSE_SHIPPERS = ["TEAMGLOBAL LOGISTICS PVT LTD", "Maersk Line", "Emirates SkyCargo", "ONE Line"];
  const HOUSE_CONSIGNEES = ["ARCHEAN INDUSTRIES PRIVATE LIMITED", "TEXELQ ENGINEERING INDIA PVT LTD"];
  const HOUSE_NOTIFY = [
    "ARCHEAN INDUSTRIES PRIVATE LIMITED",
    "TEXELQ ENGINEERING INDIA PVT LTD",
    "TEAMGLOBAL LOGISTICS PVT LTD",
  ];
  const initHouse = {
    placeOfReceipt: "",
    placeOfDelivery: "",
    incoTerm: "",
    hawbNo: "",
    hawbDate: "",
    hawbMarkNo: "",
    freightTerm: "Collect",
    notes: "",
    customer: "",
    customerAddress: "",
    shipper: "",
    shipperAddress: "",
    consignee: "",
    consigneeAddress: "",
    notify1: "",
    notify1Address: "",
  };
  const [houseOpen, setHouseOpen] = useState(false);
  const [houseForm, setHouseForm] = useState(initHouse);
  const [houseErrors, setHouseErrors] = useState<Partial<Record<keyof typeof initHouse, string>>>({});
  const [houseRows, setHouseRows] = useState<(typeof initHouse)[]>([]);
  const [houseEditIndex, setHouseEditIndex] = useState<number | null>(null);
  const houseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHouseForm((prev) => ({ ...prev, [name]: value }));
    if (houseErrors[name as keyof typeof initHouse]) setHouseErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const openHouseEdit = (index: number) => {
    setHouseEditIndex(index);
    setHouseForm({ ...houseRows[index] });
    setHouseErrors({});
    setHouseOpen(true);
  };
  const closeHouseModal = () => {
    setHouseOpen(false);
    setHouseForm(initHouse);
    setHouseErrors({});
    setHouseEditIndex(null);
  };
  const saveHouse = () => {
    const errs: Partial<Record<keyof typeof initHouse, string>> = {};
    if (!houseForm.placeOfReceipt.trim()) errs.placeOfReceipt = "Place of Receipt is required";
    if (!houseForm.placeOfDelivery.trim()) errs.placeOfDelivery = "Place of Delivery is required";
    if (!houseForm.incoTerm) errs.incoTerm = "INCO Term is required";
    if (!houseForm.customer) errs.customer = "Customer is required";
    if (Object.keys(errs).length) {
      setHouseErrors(errs);
      return;
    }
    if (houseEditIndex !== null) {
      setHouseRows((prev) => prev.map((r, i) => (i === houseEditIndex ? houseForm : r)));
    } else {
      setHouseRows((prev) => [...prev, houseForm]);
    }
    closeHouseModal();
  };

  // Routing modal
  const [routingOpen, setRoutingOpen] = useState(false);
  const PORT_OPTIONS = ["CHENNAI", "MUMBAI", "DELHI", "KOLKATA", "NHAVA SHEVA", "COCHIN", "JSD", "JNPT"];
  const AIRLINE_OPTIONS = ["TEAMGLOBAL LOGISTICS PVT LTD", "Maersk Line", "Emirates SkyCargo", "ONE Line"];
  const initRouting = {
    sNo: "10",
    fromPortCode: "",
    fromPortName: "",
    fromEtd: "",
    fromAtd: "",
    toPortCode: "",
    toPortName: "",
    position: "Opened",
    toEta: "",
    toAta: "",
    airlineCode: "",
    flightName: "",
    status: "Planned",
    fromEtdFollowup: "No",
    notes: "",
  };
  const [routingForm, setRoutingForm] = useState(initRouting);
  const [routingRows, setRoutingRows] = useState<(typeof initRouting)[]>([]);
  const routingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setRoutingForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const saveRouting = () => {
    setRoutingRows((prev) => [...prev, routingForm]);
    setRoutingForm({ ...initRouting, sNo: String(Number(routingForm.sNo) + 10) });
    setRoutingOpen(false);
  };

  // Profit Share modal
  const [profitOpen, setProfitOpen] = useState(false);
  const PS_TYPE_OPTIONS = ["Employee", "Agent", "Partner", "Branch", "Other"];
  const PS_TO_NAME_OPTIONS = ["MANAGEMENT", "SALES TEAM", "OPERATIONS", "ACCOUNTS"];
  const initProfit = {
    type: "",
    toName: "",
    toNameDesc: "",
    percentage: "",
    profitAmount: "",
    jobProfit: "",
    note: "",
  };
  const [profitForm, setProfitForm] = useState(initProfit);
  const [profitErrors, setProfitErrors] = useState<Partial<typeof initProfit>>({});
  const [profitRows, setProfitRows] = useState<(typeof initProfit)[]>([]);
  const profitChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfitForm((prev) => ({ ...prev, [name]: value }));
    if (profitErrors[name as keyof typeof initProfit]) setProfitErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const saveProfit = () => {
    const errs: Partial<typeof initProfit> = {};
    if (!profitForm.type) errs.type = "Required";
    if (!profitForm.toName) errs.toName = "Required";
    if (!profitForm.percentage) errs.percentage = "Required";
    if (!profitForm.profitAmount) errs.profitAmount = "Required";
    if (!profitForm.jobProfit) errs.jobProfit = "Required";
    if (Object.keys(errs).length) {
      setProfitErrors(errs);
      return;
    }
    setProfitRows((prev) => [...prev, profitForm]);
    setProfitForm(initProfit);
    setProfitErrors({});
    setProfitOpen(false);
  };

  // Working Team modal
  const [teamOpen, setTeamOpen] = useState(false);
  const EMPLOYEE_OPTIONS = ["MANAGEMENT", "SALES TEAM", "OPERATIONS", "ACCOUNTS", "ADMIN"];
  const DEPT_OPTIONS = ["SALES", "OPERATIONS", "ACCOUNTS", "ADMIN", "HR", "IT"];
  const initTeam = { employee: "", department: "", followupRequired: "No", note: "" };
  const [teamForm, setTeamForm] = useState(initTeam);
  const [teamError, setTeamError] = useState("");
  const [teamRows, setTeamRows] = useState([
    {
      employee: "MANAGEMENT",
      department: "SALES",
      followupRequired: "No",
      followupDate: "",
      followupNote: "",
      note: "Auto Inserted",
    },
  ]);
  const teamChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) =>
    setTeamForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const saveTeam = () => {
    if (!teamForm.employee) {
      setTeamError("Employee is required");
      return;
    }
    setTeamRows((prev) => [...prev, { ...teamForm, followupDate: "", followupNote: "" }]);
    setTeamForm(initTeam);
    setTeamError("");
    setTeamOpen(false);
  };
  const [slOpen, setSlOpen] = useState(false);
  const initSl = {
    customerName: "",
    categories: "",
    scacCode: "",
    address: "",
    pinCode: "",
    phone: "",
    mobile: "",
    emailId: "",
    gstState: "",
    gstNo: "",
    panNo: "",
    country: "",
  };
  const [slForm, setSlForm] = useState(initSl);
  const [slErrors, setSlErrors] = useState<Partial<typeof initSl>>({});
  const [slEditId, setSlEditId] = useState<number | null>(null);

  // Costing modal
  const [costOpen, setCostOpen] = useState(false);
  const initCost = {
    sNo: "10",
    charge: "",
    freightPpCc: "",
    description: "",
    unit: "",
    noOfUnit: "1",
    sacCode: "",
    note: "",
    saleOtherTerritory: "No",
    // Sale Charges
    saleCustomer: "",
    saleDrCr: "Cr (+)",
    saleCurrency: "INR - INDIAN RUPEE",
    saleExRate: "1",
    salePerUnit: "1",
    saleCrcyAmount: "1",
    saleLocalAmount: "",
    saleTaxPct: "",
    saleTaxableAmount: "",
    saleNonTaxableAmount: "",
    saleCgst: "",
    saleSgst: "",
    saleIgst: "",
    saleTotalTax: "0",
    // Cost Charges
    costVendor: "",
    costDrCr: "Dr (+)",
    costCurrency: "INR - INDIAN RUPEE",
    costExRate: "1",
    costPerUnit: "",
    costCrcyAmount: "",
    costLocalAmount: "",
    costTaxPct: "",
    costTaxableAmount: "",
    costNonTaxableAmount: "",
    costCgst: "",
    costSgst: "",
    costIgst: "",
    costTotalTax: "",
  };
  const [costForm, setCostForm] = useState(initCost);
  const costChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setCostForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const ci = (name: keyof typeof initCost, cls = "") => (
    <input
      name={name}
      value={costForm[name]}
      onChange={costChange}
      className={`w-full px-2 py-1 border border-input rounded text-xs bg-background ${cls}`}
    />
  );
  const cs = (name: keyof typeof initCost, opts: string[], placeholder = "--Select--") => (
    <select
      name={name}
      value={costForm[name]}
      onChange={costChange}
      className="w-full px-2 py-1 border border-input rounded text-xs bg-background"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {opts.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
  const CHARGES = ["Freight", "Documentation", "Handling", "THC", "BL Fee", "Customs", "Transport", "Other"];
  const UNITS = ["KG", "CBM", "PCS", "BL", "Container", "Shipment", "Ton"];
  const CURRENCIES = ["INR - INDIAN RUPEE", "USD - US DOLLAR", "EUR - EURO", "AED - UAE DIRHAM", "GBP - POUND"];
  const TAX_PCTS = ["0%", "5%", "12%", "18%", "28%"];
  const DR_CR_SALE = ["Cr (+)", "Dr (-)"];
  const DR_CR_COST = ["Dr (+)", "Cr (-)"];
  const CUSTOMERS = [
    "ARCHEAN INDUSTRIES PRIVATE LIMITED",
    "TEXELQ ENGINEERING INDIA PVT LTD",
    "TEXGRAM INC DBA INOTEX",
  ];
  const VENDORS = ["TEAMGLOBAL LOGISTICS PVT LTD", "Maersk Line", "Emirates SkyCargo", "ONE Line"];
  const saveCost = (keepOpen: boolean) => {
    setCostForm(keepOpen ? { ...initCost, sNo: String(Number(costForm.sNo) + 10) } : initCost);
    if (!keepOpen) setCostOpen(false);
  };
  const SL_CATEGORIES = ["Customer", "Shipper", "Consignee", "Notify Party", "Agent", "Carrier", "Co-Loader"];
  const SL_GST_STATES = [
    "Andhra Pradesh",
    "Delhi",
    "Gujarat",
    "Karnataka",
    "Maharashtra",
    "Tamil Nadu",
    "Telangana",
    "West Bengal",
  ];
  const SL_COUNTRIES = ["India", "USA", "UAE", "Singapore", "UK", "China", "Germany", "Japan"];
  const slChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSlForm((prev) => ({ ...prev, [name]: value }));
    if (slErrors[name as keyof typeof initSl]) setSlErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const slSave = () => {
    const errs: Partial<typeof initSl> = {};
    if (!slForm.customerName.trim()) errs.customerName = "Required";
    if (!slForm.categories) errs.categories = "Required";
    if (!slForm.address.trim()) errs.address = "Required";
    if (Object.keys(errs).length) {
      setSlErrors(errs);
      return;
    }
    const newEntry = {
      id: slEditId ?? Date.now(),
      subledgerType: slForm.categories.toUpperCase(),
      subledgerName: slForm.customerName,
      address: slForm.address,
      phone: slForm.phone,
      fax: "",
      mobile: slForm.mobile,
      email: slForm.emailId,
      city: "",
    };
    const current = (op!.subledgers ?? []).length === 0 ? STATIC_SUBLEDGERS : op!.subledgers;
    const updated = slEditId ? current.map((s) => (s.id === slEditId ? newEntry : s)) : [...current, newEntry];
    updateOperation(op!.id, { subledgers: updated });
    setSlForm(initSl);
    setSlErrors({});
    setSlEditId(null);
    setSlOpen(false);
  };
  const openSlEdit = (sl: (typeof STATIC_SUBLEDGERS)[0]) => {
    setSlEditId(sl.id);
    setSlForm({
      customerName: sl.subledgerName,
      categories: sl.subledgerType.charAt(0) + sl.subledgerType.slice(1).toLowerCase(),
      scacCode: "",
      address: sl.address,
      pinCode: "",
      phone: sl.phone,
      mobile: sl.mobile,
      emailId: sl.email,
      gstState: "",
      gstNo: "",
      panNo: "",
      country: "",
    });
    setSlErrors({});
    setSlOpen(true);
  };
  const [rider, setRider] = useState({
    containerNo: "",
    containerType: "",
    noOfPcs: "",
    packType: "",
    noOfPallet: "",
    volume: "",
    grossWeight: "",
    grossMeasure: "Kg",
    volumeWeight: "",
    volumeMeasure: "Kg",
    netWeight: "",
    netMeasure: "Kg",
    commodityType: "",
    commodityCode: "",
    commodityDesc: "",
    manifestSeal: "",
    actualSeal: "",
    customSeal: "",
  });
  const riderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setRider((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const sel = (name: string) => (
    <select
      name={name}
      value={rider[name as keyof typeof rider]}
      onChange={riderChange}
      className="w-full px-2 py-1.5 border border-input rounded text-sm bg-background"
    >
      <option value="">--Select--</option>
      {name === "containerType"
        ? ["20GP", "40GP", "40HC", "45HC", "20RF", "40RF"].map((o) => <option key={o}>{o}</option>)
        : ["Boxes", "Pallets", "Cartons", "Bags", "Drums", "Crates"].map((o) => <option key={o}>{o}</option>)}
    </select>
  );
  const measureSel = (name: string) => (
    <select
      name={name}
      value={rider[name as keyof typeof rider]}
      onChange={riderChange}
      className="w-full px-2 py-1.5 border border-input rounded text-sm bg-background"
    >
      {["Kg", "Lbs", "MT", "CBM"].map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
  const inp = (name: string, placeholder = "") => (
    <input
      name={name}
      value={rider[name as keyof typeof rider]}
      onChange={riderChange}
      placeholder={placeholder}
      className="w-full px-2 py-1.5 border border-input rounded text-sm bg-background"
    />
  );

  const handleDuplicate = () => {
    if (!dupCarrier) {
      setDupCarrierError(true);
      return;
    }
    addOperation({
      ...op,
      id: Date.now(),
      jobNo: "",
      jobDate: dupDate,
      carrier: dupCarrier,
      status: "Created",
      statusColor: "text-blue-500",
      statusBgColor: "bg-blue-500/10",
    });
    setDupOpen(false);
  };

  const openDup = () => {
    setDupCarrier(op.carrier ?? "");
    setDupDate(new Date().toISOString().split("T")[0]);
    setDupCarrierError(false);
    setDupOpen(true);
  };

  if (!op) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Operation not found.</p>
        <Button className="mt-4" onClick={() => navigate("/operations")}>
          Back to List
        </Button>
      </div>
    );
  }

  const isVessel = ["FCL Import", "FCL Export", "LCL Export", "LCL Import", "Land Export", "Land Import"].includes(
    op.document,
  );
  const flightLabel = isVessel ? "Vessel Name" : "Flight Name";
  const numberLabel = ["Land Import", "Land Export"].includes(op.document)
    ? "Vessel Number"
    : isVessel
      ? "Voyage Number"
      : "Flight Number";

  return (
    <div className="space-y-4">
      {/* Breadcrumb + header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            <button className="hover:underline text-primary" onClick={() => navigate("/operations")}>
              Jobs List
            </button>
            {" › "}
            <span>
              Job No# - ( {op.jobNo || "—"} ~ {op.jobDate} )
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/operations")}>
            Cancel
          </Button>
          <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-black font-semibold">
            Reports
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/operations/edit/${op.id}`)}>
            Edit
          </Button>
          <Button variant="outline" size="sm">
            Create
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border text-sm">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Job Details card */}
      {(activeTab === "Job Details" || activeTab === "Show All") && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-white px-6 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Job Details</h2>
            <Button
              size="sm"
              className="bg-amber-400 hover:bg-amber-500 text-black font-semibold text-xs"
              onClick={openDup}
            >
              Duplicate Job
            </Button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 gap-x-6">
              {/* Column 1 */}
              <div className="col-span-1 space-y-0">
                <Field label="Document Name" value={op.document} />
                <Field label="Job Status" value={op.status} />
                <Field label="Place of Receipt" value={op.placeOfReceipt} />
                <Field label="POL Name" value={op.pol} />
                <Field label="POL ETD" value={op.polEtd} />
                <Field label="POD ETA" value={op.podEta} />
                <Field label="INCO Term" value="" />
                <Field label={flightLabel} value={op.flightName} />
                <Field label="Service Type" value={op.serviceType} />
                <div className="flex items-center gap-2 py-1.5">
                  <span className="text-sm font-semibold text-foreground w-40 shrink-0">AWB No</span>
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white text-xs h-7 px-3">
                    Gen BL NO#
                  </Button>
                </div>
                <Field label="MAWB No" value={op.mblNo} />
                <Field label="Do No#" value="" />
                <Field label="BL Place of Issue" value="" />
                <Field label="On Board Date" value="" />
                <Field label="BL Mark No" value={op.blMarksNo} />
                <div className="py-1.5">
                  <span className="text-sm font-semibold text-foreground">Notes</span>
                  <p className="text-sm text-cyan-600 mt-1">{op.note}</p>
                </div>
                <div className="mt-2">
                  <Button
                    size="sm"
                    className="bg-amber-400 hover:bg-amber-500 text-black text-xs font-semibold"
                    onClick={() => setRiderOpen(true)}
                  >
                    Rider Container
                  </Button>
                </div>
              </div>

              {/* Column 2 */}
              <div className="col-span-1 space-y-0">
                <Field label="Job Type" value={op.bookingType} />
                <Field label="PP / CC" value={op.freightPpCc} />
                <Field label="Place of Delivery" value={op.placeOfDelivery} />
                <Field label="POD Name" value={op.pod} />
                <Field label="POL ATD" value="" />
                <Field label="POD ATA" value="" />
                <Field label="No of BL" value="" />
                <Field label={numberLabel} value={op.flightNumber} />
                <Field label="BL Status" value={op.blServiceType} />
                <Field label="AWB Date" value="" />
                <Field label="MAWB Date" value="" />
                <Field label="Do Date" value="" />
                <Field label="Job Close Date" value="" />
                <Field label="Vessel Status" value="" />
              </div>

              {/* Column 3 — Source From and To */}
              <div className="col-span-1">
                <div className="border border-border rounded overflow-hidden">
                  <div className="bg-[#00BCD4] px-4 py-2">
                    <h3 className="text-white font-semibold text-sm">Source From and To</h3>
                  </div>
                  <div className="p-4 space-y-0">
                    <Field label="Quote No" value="" />
                    <Field label="Quote Date" value="" />
                    <Field label="Booking No" value="" />
                    <Field label="Booking Date" value={op.bookingDate} />
                    <Field label="No of Credit Days" value="" />
                    <Field label="Delivery Status" value={op.deliveryStatus} />
                    <Field label="Delivery Date" value={op.deliveryDate} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Job Modal */}
      {dupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDupOpen(false)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-bold text-primary">Duplicate Job</h3>
              <button onClick={() => setDupOpen(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Row 1: From Job No + New Job Date — same line */}
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-foreground whitespace-nowrap shrink-0">
                    From Job No
                  </label>
                  <Input value="RLPL/AE/J0302" readOnly className="bg-muted text-sm min-w-0" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-foreground whitespace-nowrap shrink-0">
                    New Job Date
                  </label>
                  <div className="relative min-w-0 flex-1">
                    <Input
                      type="date"
                      value={dupDate}
                      onChange={(e) => setDupDate(e.target.value)}
                      className="text-sm w-full"
                    />
                  </div>
                </div>
              </div>
              {/* Row 2: Carrier */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-foreground whitespace-nowrap w-24 shrink-0">
                  <span className="text-destructive mr-1">*</span>Carrier
                </label>
                <div className="flex-1 max-w-xs">
                  <select
                    value={dupCarrier}
                    onChange={(e) => {
                      setDupCarrier(e.target.value);
                      setDupCarrierError(false);
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-background ${
                      dupCarrierError ? "border-destructive" : "border-input"
                    }`}
                  >
                    <option value="">--Select--</option>
                    {CARRIER_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {dupCarrierError && <p className="text-xs text-destructive mt-1">Carrier is required</p>}
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="flex justify-end px-6 pb-5">
              <Button size="sm" variant="outline" onClick={handleDuplicate} className="px-6">
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rider Container Modal */}
      {riderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRiderOpen(false)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">Rider BL (Container)</h3>
              <button onClick={() => setRiderOpen(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-5">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {/* Row 1 */}
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Container No</label>
                  {inp("containerNo")}
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">
                    Container Type
                  </label>
                  {sel("containerType")}
                </div>

                {/* Row 2 */}
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">No of PCS</label>
                  {inp("noOfPcs")}
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Pack Type</label>
                  {sel("packType")}
                </div>

                {/* Row 3 */}
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">No of Pallet</label>
                  {inp("noOfPallet")}
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Volume</label>
                  {inp("volume")}
                </div>

                {/* Row 4 — Gross Weight */}
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Gross Weight</label>
                  {inp("grossWeight")}
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Measuremer</label>
                  {measureSel("grossMeasure")}
                </div>

                {/* Row 5 — Volume Weight */}
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">
                    Volume Weight
                  </label>
                  {inp("volumeWeight")}
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Measuremer</label>
                  {measureSel("volumeMeasure")}
                </div>

                {/* Row 6 — Net Weight */}
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Net Weight</label>
                  {inp("netWeight")}
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Measuremer</label>
                  {measureSel("netMeasure")}
                </div>

                {/* Row 7 — Commodity */}
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">
                    Commodity Type
                  </label>
                  {inp("commodityType")}
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">
                    Commodity Code
                  </label>
                  {inp("commodityCode")}
                </div>

                {/* Row 8 — Commodity Desc full width */}
                <div className="col-span-2 flex items-start gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground pt-1">
                    Commodity Desc
                  </label>
                  <textarea
                    name="commodityDesc"
                    value={rider.commodityDesc}
                    onChange={riderChange}
                    rows={3}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-sm bg-background resize-y"
                  />
                </div>

                {/* Row 9 — Seals */}
                <div className="col-span-2 flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">
                      Manifest Seal
                    </label>
                    {inp("manifestSeal")}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <label className="shrink-0 text-xs font-semibold text-foreground whitespace-nowrap">
                      Actual Seal
                    </label>
                    {inp("actualSeal")}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <label className="shrink-0 text-xs font-semibold text-foreground whitespace-nowrap">
                      Custom Seal
                    </label>
                    {inp("customSeal")}
                  </div>
                </div>
              </div>

              {/* Search toolbar */}
              <div className="mt-4 bg-[#00BCD4] rounded px-3 py-2 flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white rounded px-2 py-1">
                  <span className="text-xs text-muted-foreground">Q</span>
                  <span className="text-xs text-muted-foreground">▾</span>
                </div>
                <input className="flex-1 px-2 py-1 text-sm rounded border border-input bg-white" />
                <button className="px-3 py-1 bg-white text-xs font-semibold rounded border border-input">Go</button>
                <button className="px-3 py-1 bg-white text-xs font-semibold rounded border border-input">
                  Actions ▾
                </button>
              </div>

              {/* Empty state */}
              <div className="flex items-center justify-center h-24 text-muted-foreground">
                <svg className="w-8 h-8 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button
                size="sm"
                className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-6"
                onClick={() => setRiderOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6">
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Subledgers card */}
      {(activeTab === "Subledgers" || activeTab === "Show All") && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-white px-6 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Subledgers</h2>
          </div>
          <div className="p-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Subledger Type",
                    "Subledger Name",
                    "Address",
                    "Phone",
                    "Fax",
                    "Mobile",
                    "Email",
                    "City",
                    "Action",
                  ].map((h) => (
                    <th key={h} className="text-left px-3 py-2 font-semibold text-foreground text-xs whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {((op.subledgers ?? []).length === 0 ? STATIC_SUBLEDGERS : op.subledgers).map((sl) => (
                  <tr key={sl.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{sl.subledgerType}</td>
                    <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{sl.subledgerName}</td>
                    <td className="px-3 py-2 text-xs text-foreground max-w-xs">{sl.address}</td>
                    <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{sl.phone}</td>
                    <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{sl.fax}</td>
                    <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{sl.mobile}</td>
                    <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{sl.email}</td>
                    <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{sl.city}</td>
                    <td className="px-3 py-2">
                      <button className="text-red-400 hover:text-red-600" onClick={() => openSlEdit(sl)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-3">
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold"
                onClick={() => setSlOpen(true)}
              >
                Add New Subledgers
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dimensions card */}
      {(activeTab === "Dimension's" || activeTab === "Show All") && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-white px-6 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Dimension's</h2>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs px-3 bg-white font-semibold"
              onClick={() => {
                setDimEditIndex(null);
                setDimForm(initDim);
                setDimOpen(true);
              }}
            >
              Add Dimension
            </Button>
          </div>
          {dimRows.length === 0 ? (
            <NoData />
          ) : (
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "S.No#",
                      "L×W×H",
                      "Measurement",
                      "No of Pcs",
                      "Package Type",
                      "G.Weight",
                      "V.Weight",
                      "Net Weight",
                      "Volume",
                      "COO",
                      "Commodity Type",
                      "Commodity Code",
                      "Notes",
                      "Action",
                    ].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dimRows.map((row, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/30">
                      <td className="px-3 py-2 text-xs text-foreground">{row.sNo}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.lxwxh}</td>
                      <td className="px-3 py-2 text-xs text-foreground">
                        {[row.length, row.width, row.height].filter(Boolean).join(" × ")}
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.noOfPcs}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.packageType}</td>
                      <td className="px-3 py-2 text-xs text-foreground">
                        {row.gWeight}
                        {row.gWeight && ` ${row.gWeightUnit}`}
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground">
                        {row.vWeight}
                        {row.vWeight && ` ${row.vWeightUnit}`}
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground">
                        {row.netWeight}
                        {row.netWeight && ` ${row.netWeightUnit}`}
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.volume}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.coo}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.commodityType}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.commodityCode}</td>
                      <td className="px-3 py-2 text-xs text-foreground max-w-[120px] truncate">{row.notes}</td>
                      <td className="px-3 py-2">
                        <button className="text-red-400 hover:text-red-600" onClick={() => openDimEdit(i)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Shipping Instructions card */}
      {(activeTab === "Shipping Instructions" || activeTab === "Show All") && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-white px-6 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Shipping Instructions</h2>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs px-3 bg-white font-semibold"
              onClick={() => {
                setSiEditIndex(null);
                setSiForm(initSi);
                setSiOpen(true);
              }}
            >
              Add Job Consignment
            </Button>
          </div>
          {siRows.length === 0 ? (
            <NoData />
          ) : (
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "S.No#",
                      "No of PCS",
                      "Pack Type",
                      "No of Pallet",
                      "G.Weight",
                      "V.Weight",
                      "N.Weight",
                      "Volume",
                      "Chargeable Unit",
                      "Commodity Type",
                      "Commodity Code",
                      "Manifest Seal",
                      "Actual/Liner Seal",
                      "Custom Seal",
                      "Excise Seal No",
                      "Seal Date",
                      "Seal Type",
                      "Seal Device ID",
                      "Movement Doc Type",
                      "Movement Doc No",
                      "Notes",
                      "RORO Year",
                      "RORO Brand",
                      "RORO Model",
                      "RORO Chasis No",
                      "RORO Engine No",
                      "Action",
                    ].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {siRows.map((row, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/30">
                      <td className="px-3 py-2 text-xs text-foreground">{row.sNo}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.noOfPcs}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.packType}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.noOfPallet}</td>
                      <td className="px-3 py-2 text-xs text-foreground">
                        {row.gWeight}
                        {row.gWeight && ` ${row.gWeightUnit}`}
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground">
                        {row.vWeight}
                        {row.vWeight && ` ${row.vWeightUnit}`}
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground">
                        {row.nWeight}
                        {row.nWeight && ` ${row.nWeightUnit}`}
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.volume}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.chargeableUnit}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.commodityType}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.commodityCode}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.manifestSeal}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.actualLinerSeal}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.customSeal}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.exciseSealNo}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.sealDate}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.sealTypeIndicator}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.sealDeviceId}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.movementDocType}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.movementDocNo}</td>
                      <td className="px-3 py-2 text-xs text-foreground max-w-[120px] truncate">{row.notes}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.roroYear}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.roroBrand}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.roroModel}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.roroChasisNo}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.roroEngineNo}</td>
                      <td className="px-3 py-2">
                        <button className="text-red-400 hover:text-red-600" onClick={() => openSiEdit(i)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Costing card */}
      {(activeTab === "Costing" || activeTab === "Show All") && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-white px-4 py-2.5 border-b border-border flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-lg font-bold text-primary shrink-0">Costing</h2>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Button size="sm" variant="outline" className="h-7 text-xs px-3 bg-white">
                Ex Rate
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs px-3 bg-white">
                Proforma INV
              </Button>
              <Button size="sm" className="h-7 text-xs px-3 bg-red-500 hover:bg-red-600 text-white border-0">
                Deleted Charges
              </Button>
              <Button size="sm" className="h-7 text-xs px-3 bg-amber-400 hover:bg-amber-500 text-black border-0">
                Job Vouchers
              </Button>
              <Button size="sm" className="h-7 text-xs px-3 bg-green-500 hover:bg-green-600 text-white border-0">
                Generate PCN
              </Button>
              <Button size="sm" className="h-7 text-xs px-3 bg-green-500 hover:bg-green-600 text-white border-0">
                Generate CN
              </Button>
              <Button size="sm" className="h-7 text-xs px-3 bg-green-500 hover:bg-green-600 text-white border-0">
                Generate INV
              </Button>
              <Button size="sm" className="h-7 text-xs px-3 bg-green-500 hover:bg-green-600 text-white border-0">
                Generate PI
              </Button>
              <Button
                size="sm"
                className="h-7 text-xs px-3 bg-slate-400 hover:bg-slate-500 text-white border-0"
                onClick={() => setCostOpen(true)}
              >
                Add Costing
              </Button>
            </div>
          </div>
          <div className="p-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-foreground">Sale Amount</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-foreground">Cost Amount</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-foreground">Profit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { sale: 125000, cost: 98000 },
                  { sale: 87500, cost: 61200 },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/30">
                    <td className="px-3 py-2 text-xs text-foreground">{row.sale.toLocaleString("en-IN")}</td>
                    <td className="px-3 py-2 text-xs text-foreground">{row.cost.toLocaleString("en-IN")}</td>
                    <td
                      className={`px-3 py-2 text-xs font-medium ${row.sale - row.cost >= 0 ? "text-green-600" : "text-red-500"}`}
                    >
                      {(row.sale - row.cost).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Shipping Bill / BOE card */}
      {(activeTab === "Shipping Bill / BOE" || activeTab === "Show All") && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-white px-6 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Shipping Bill / BOE</h2>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs px-3 bg-white font-semibold"
              onClick={() => {
                setSbEditIndex(null);
                setSbForm(initSb);
                setSbOpen(true);
              }}
            >
              Add Shipping Bill
            </Button>
          </div>
          {sbRows.length === 0 ? (
            <NoData />
          ) : (
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "Shipping Bill No",
                      "Shipping Bill Date",
                      "Mate Receipt No",
                      "Mate Receipt Date",
                      "No of PCS",
                      "Pack Type",
                      "Gross Weight",
                      "Measurement",
                      "Volume",
                      "Commodity Code",
                      "Commodity Type",
                      "Commodity Desc",
                      "Note",
                      "Action",
                    ].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sbRows.map((row, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/30">
                      <td className="px-3 py-2 text-xs text-foreground">{row.shippingBillNo}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.shippingBillDate}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.mateReceiptNo}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.mateReceiptDate}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.noOfPcs}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.packType}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.grossWeight}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.measurement}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.volume}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.commodityCode}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.commodityType}</td>
                      <td className="px-3 py-2 text-xs text-foreground max-w-[120px] truncate">{row.commodityDesc}</td>
                      <td className="px-3 py-2 text-xs text-foreground max-w-[120px] truncate">{row.note}</td>
                      <td className="px-3 py-2">
                        <button className="text-red-400 hover:text-red-600" onClick={() => openSbEdit(i)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* House's List card */}
      {(activeTab === "House's List" || activeTab === "Show All") && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-white px-6 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">House's List</h2>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs px-3 bg-white font-semibold"
              onClick={() => {
                setHouseEditIndex(null);
                setHouseForm(initHouse);
                setHouseOpen(true);
              }}
            >
              Add New House
            </Button>
          </div>
          {houseRows.length === 0 ? (
            <NoData />
          ) : (
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "HAWB No",
                      "HAWB Date",
                      "HAWB Mark No",
                      "Place of Receipt",
                      "Place of Delivery",
                      "INCO Term",
                      "Freight Term",
                      "Customer",
                      "Shipper",
                      "Consignee",
                      "Notify1",
                      "Notes",
                      "Action",
                    ].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {houseRows.map((row, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/30">
                      <td className="px-3 py-2 text-xs text-foreground">{row.hawbNo}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.hawbDate}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.hawbMarkNo}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.placeOfReceipt}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.placeOfDelivery}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.incoTerm}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.freightTerm}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{row.customer}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{row.shipper}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{row.consignee}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{row.notify1}</td>
                      <td className="px-3 py-2 text-xs text-foreground max-w-[120px] truncate">{row.notes}</td>
                      <td className="px-3 py-2">
                        <button className="text-red-400 hover:text-red-600" onClick={() => openHouseEdit(i)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Others card */}
      {(activeTab === "Others" || activeTab === "Show All") && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-white px-6 py-3 border-b border-border">
            <h2 className="text-lg font-bold text-primary">Others</h2>
          </div>

          {/* Routing (Vessel Movement) */}
          <div className="border-b border-border">
            <div className="bg-[#00BCD4] px-6 py-2.5 flex items-center justify-between">
              <span className="text-white font-semibold text-sm">Routing (Vessel Movement)</span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs px-3 bg-white">
                  Get Schedule
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs px-3 bg-white font-semibold"
                  onClick={() => setRoutingOpen(true)}
                >
                  Routing +
                </Button>
              </div>
            </div>
            <div className="p-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "Edit",
                      "Line No",
                      "From Port Code",
                      "From Port Name",
                      "From ETD",
                      "From ATD",
                      "To Port CODE",
                      "To port Name",
                      "To ETA",
                      "To ATA",
                      "Vessel / Flight Name",
                      "Status",
                      "Notes",
                    ].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {routingRows.map((row, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/30">
                      <td className="px-3 py-2">
                        <button className="text-red-400 hover:text-red-600">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.sNo}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.fromPortCode}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.fromPortName}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.fromEtd}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.fromAtd}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.toPortCode}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.toPortName}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.toEta}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.toAta}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.flightName}</td>
                      <td className="px-3 py-2 text-xs text-foreground uppercase">{row.status}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Team + Profit Share */}
          <div className="grid grid-cols-2 gap-0 border-b border-border">
            <div className="border-r border-border">
              <div className="bg-[#00BCD4] px-4 py-2.5 flex items-center justify-between">
                <span className="text-white font-semibold text-sm">Team</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs px-3 bg-white font-semibold"
                  onClick={() => setTeamOpen(true)}
                >
                  Add Working Team
                </Button>
              </div>
              <div className="p-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      {["Edit", "Employee", "Dept", "Followup Required", "Followup Date", "Followup Note", "Note"].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-left px-2 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {teamRows.map((row, i) => (
                      <tr key={i} className="border-b border-border hover:bg-muted/30">
                        <td className="px-2 py-2">
                          <button className="text-red-400 hover:text-red-600">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </td>
                        <td className="px-2 py-2 text-xs text-foreground">{row.employee}</td>
                        <td className="px-2 py-2 text-xs text-foreground">{row.department}</td>
                        <td className="px-2 py-2 text-xs text-foreground">{row.followupRequired}</td>
                        <td className="px-2 py-2 text-xs text-foreground">{row.followupDate}</td>
                        <td className="px-2 py-2 text-xs text-foreground">{row.followupNote}</td>
                        <td className="px-2 py-2 text-xs text-foreground">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-2 text-xs text-muted-foreground">
                  {teamRows.length} - {teamRows.length}
                </div>
              </div>
            </div>
            <div>
              <div className="bg-[#00BCD4] px-4 py-2.5 flex items-center justify-between">
                <span className="text-white font-semibold text-sm">Profit Share</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs px-3 bg-white font-semibold"
                  onClick={() => setProfitOpen(true)}
                >
                  Add +
                </Button>
              </div>
              <div className="p-4">
                {profitRows.length === 0 ? (
                  <div className="min-h-[80px]" />
                ) : (
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        {[
                          "Edit",
                          "Type",
                          "To Name",
                          "To Name (Desc)",
                          "Percentage",
                          "Profit Amount",
                          "Job Profit",
                          "Note",
                        ].map((h) => (
                          <th
                            key={h}
                            className="text-left px-2 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {profitRows.map((row, i) => (
                        <tr key={i} className="border-b border-border hover:bg-muted/30">
                          <td className="px-2 py-2">
                            <button className="text-red-400 hover:text-red-600">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </td>
                          <td className="px-2 py-2 text-xs text-foreground">{row.type}</td>
                          <td className="px-2 py-2 text-xs text-foreground">{row.toName}</td>
                          <td className="px-2 py-2 text-xs text-foreground">{row.toNameDesc}</td>
                          <td className="px-2 py-2 text-xs text-foreground">{row.percentage}</td>
                          <td className="px-2 py-2 text-xs text-foreground">{row.profitAmount}</td>
                          <td className="px-2 py-2 text-xs text-foreground">{row.jobProfit}</td>
                          <td className="px-2 py-2 text-xs text-foreground">{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="border-b border-border">
            <div className="bg-[#00BCD4] px-6 py-2.5 flex items-center justify-between">
              <span className="text-white font-semibold text-sm">Status Update</span>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs px-3 bg-white font-semibold"
                onClick={() => {
                  setStatusEditIndex(null);
                  setStatusForm(initStatus);
                  setStatusOpen(true);
                }}
              >
                Add +
              </Button>
            </div>
            <div className="p-4">
              {statusRows.length === 0 ? (
                <div className="min-h-[40px]" />
              ) : (
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      {[
                        "Edit",
                        "Line No#",
                        "Update To (Type)",
                        "Position",
                        "Subject",
                        "From",
                        "To",
                        "Bcc",
                        "Cc",
                        "Header",
                        "Body",
                        "Footer",
                        "Notes",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-2 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {statusRows.map((row, i) => (
                      <tr key={i} className="border-b border-border hover:bg-muted/30">
                        <td className="px-2 py-2">
                          <button className="text-red-400 hover:text-red-600" onClick={() => openStatusEdit(i)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </td>
                        <td className="px-2 py-2 text-xs text-foreground">{row.lineNo}</td>
                        <td className="px-2 py-2 text-xs text-foreground">{row.updateTo}</td>
                        <td className="px-2 py-2 text-xs text-foreground">{row.position}</td>
                        <td className="px-2 py-2 text-xs text-foreground max-w-[120px] truncate">{row.subject}</td>
                        <td className="px-2 py-2 text-xs text-foreground">{row.from}</td>
                        <td className="px-2 py-2 text-xs text-foreground">{row.to}</td>
                        <td className="px-2 py-2 text-xs text-foreground">{row.bcc}</td>
                        <td className="px-2 py-2 text-xs text-foreground">{row.cc}</td>
                        <td className="px-2 py-2 text-xs text-foreground max-w-[100px] truncate">{row.header}</td>
                        <td className="px-2 py-2 text-xs text-foreground max-w-[100px] truncate">{row.body}</td>
                        <td className="px-2 py-2 text-xs text-foreground max-w-[100px] truncate">{row.footer}</td>
                        <td className="px-2 py-2 text-xs text-foreground max-w-[100px] truncate">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Audit */}
          <div className="border-b border-border">
            <div className="bg-[#00BCD4] px-6 py-2.5">
              <span className="text-white font-semibold text-sm">Audit</span>
            </div>
            <div className="p-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {["Insert / Update", "Created / Updated By", "Field Name", "Old Value", "New Value", "Time"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-3 py-2 font-semibold text-foreground text-xs whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="px-3 py-2 text-xs text-foreground">New Record</td>
                    <td className="px-3 py-2 text-xs text-foreground">info@relay-logistics.com</td>
                    <td className="px-3 py-2 text-xs text-foreground">{op.jobNo || "RLPL/AE/J0303"}</td>
                    <td className="px-3 py-2 text-xs text-foreground">-</td>
                    <td className="px-3 py-2 text-xs text-foreground">-</td>
                    <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">
                      {op.jobDate ? `${op.jobDate} 12:03PM` : "24-MAR-2026 12:03PM"}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end mt-2 text-xs text-muted-foreground">1 - 1</div>
            </div>
          </div>

          {/* Pre Alert */}
          <div>
            <div className="bg-[#00BCD4] px-6 py-2.5">
              <span className="text-white font-semibold text-sm">Pre Alert</span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <input
                  className="flex-1 max-w-xs px-2 py-1 text-xs rounded border border-input bg-background"
                  placeholder="Search..."
                />
                <button className="px-3 py-1 bg-background text-xs font-semibold rounded border border-input">
                  Go
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5 px-3 h-[30px] text-xs rounded">
                      Actions <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem className="gap-2 text-xs">
                      <Columns3 className="w-3.5 h-3.5" /> Columns
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-xs">
                      <Filter className="w-3.5 h-3.5" /> Filter
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="gap-2 text-xs">
                        <Database className="w-3.5 h-3.5" /> Data
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem className="gap-2 text-xs">
                          <ArrowUpDown className="w-3.5 h-3.5" /> Sort
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs">
                          <Sigma className="w-3.5 h-3.5" /> Aggregate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs">
                          <Calculator className="w-3.5 h-3.5" /> Compute
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs">
                          <History className="w-3.5 h-3.5" /> Flashback
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="gap-2 text-xs">
                        <Palette className="w-3.5 h-3.5" /> Format
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem className="gap-2 text-xs">
                          <SplitSquareVertical className="w-3.5 h-3.5" /> Control Break
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs">
                          <Highlighter className="w-3.5 h-3.5" /> Highlight
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="gap-2 text-xs">
                            <LayoutList className="w-3.5 h-3.5" /> Rows Per Page
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {[1, 5, 10, 15, 20, 25, 50, 100].map((n) => (
                              <DropdownMenuItem key={n} className="gap-2 text-xs">
                                {n}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem className="gap-2 text-xs">
                      <BarChart2 className="w-3.5 h-3.5" /> Chart
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-xs">
                      <Rows3 className="w-3.5 h-3.5" /> Group By
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-xs">
                      <TableProperties className="w-3.5 h-3.5" /> Pivot
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="gap-2 text-xs">
                        <BookOpen className="w-3.5 h-3.5" /> Report
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem className="gap-2 text-xs">
                          <FileText className="w-3.5 h-3.5" /> Summary
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs">
                          <FileBarChart className="w-3.5 h-3.5" /> Detailed
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs">
                          <FilePieChart className="w-3.5 h-3.5" /> Analytics
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem className="gap-2 text-xs">
                      <Download className="w-3.5 h-3.5" /> Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-xs">
                      <Mail className="w-3.5 h-3.5" /> Subscription
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-xs">
                      <HelpCircle className="w-3.5 h-3.5" /> Help
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="overflow-x-auto">
                <table className="text-sm border-collapse" style={{ minWidth: "2800px" }}>
                  <thead>
                    <tr className="border-b border-border">
                      {[
                        "Customer Name",
                        "Customer Address",
                        "Shipper Name",
                        "Shipper Address",
                        "Consignee Name",
                        "Consignee Address",
                        "Notify Name",
                        "Notify Address",
                        "BL No",
                        "Carrier SCAC Code",
                        "MBL No",
                        "Place of Receipt",
                        "POR Name",
                        "POL Port",
                        "POL Name",
                        "POD Name",
                        "POD Port",
                        "Place of Delivery",
                        "POL ETD",
                        "POD ETA",
                        "Freight",
                        "Inco Terms",
                        "No of Pcs",
                        "Gross Weight",
                        "No of Container",
                        "Vessel Name",
                        "Vessel No",
                        "Description",
                        "Container Type",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-3 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border hover:bg-muted/30">
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">
                        ARCHEAN INDUSTRIES PRIVATE LIMITED
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground" style={{ maxWidth: "180px" }}>
                        NO.2,NORTH CRESCENT ROAD, T.NAGAR,CHENNAI 600017 INDIA...
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground">--</td>
                      <td className="px-3 py-2 text-xs text-foreground">--</td>
                      <td className="px-3 py-2 text-xs text-foreground">--</td>
                      <td className="px-3 py-2 text-xs text-foreground">--</td>
                      <td className="px-3 py-2 text-xs text-foreground">...</td>
                      <td className="px-3 py-2 text-xs text-foreground">...</td>
                      <td className="px-3 py-2 text-xs text-foreground"></td>
                      <td className="px-3 py-2 text-xs text-foreground">a</td>
                      <td className="px-3 py-2 text-xs text-foreground"></td>
                      <td className="px-3 py-2 text-xs text-foreground"></td>
                      <td className="px-3 py-2 text-xs text-foreground"></td>
                      <td className="px-3 py-2 text-xs text-foreground">JSD</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">
                        SIKORSKY HELIPORT-STRATFORD, CT
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">
                        SIKORSKY HELIPORT-STRATFORD, CT
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground">JSD</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">
                        {op.placeOfDelivery || ""}
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">
                        {op.polEtd || "25-MAR-26"}
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">
                        {op.podEta || "26-MAR-26"}
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">
                        {op.freightPpCc ? op.freightPpCc.toUpperCase() : "COLLECT"}
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground"></td>
                      <td className="px-3 py-2 text-xs text-foreground"></td>
                      <td className="px-3 py-2 text-xs text-foreground"></td>
                      <td className="px-3 py-2 text-xs text-foreground"></td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.flightName || ""}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">
                        {op.flightNumber || "111"}
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground"></td>
                      <td className="px-3 py-2 text-xs text-foreground"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-2 text-xs text-muted-foreground">1 - 1</div>
            </div>
          </div>
        </div>
      )}

      {/* House's List Modal */}
      {houseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeHouseModal} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-4xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">
                {houseEditIndex !== null ? "Edit House Job" : "Create New House Job"}
              </h3>
              <button onClick={closeHouseModal} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
              {/* Read-only job info row */}
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-foreground w-20 shrink-0">Job No</span>
                  <span className="text-foreground">
                    {op.jobNo || "RLPL/AE/J0306"} / {op.jobDate || "25-MAR-26"}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-foreground w-10 shrink-0">POL</span>
                  <span className="text-foreground">{op.pol || "JSD / SIKORSKY HELIPORT-STRATFORD, CT"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-foreground w-10 shrink-0">POD</span>
                  <span className="text-foreground">{op.pod || "JSD / SIKORSKY HELIPORT-STRATFORD, CT"}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground w-20 shrink-0">ETD / ATD</span>
                  <span className="text-foreground">{op.polEtd || "25-Mar-26"} /</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground w-20 shrink-0">ETA / ATA</span>
                  <span className="text-foreground">{op.podEta || "26-Mar-26"} /</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground w-32 shrink-0">Flight Name / No.</span>
                  <span className="text-foreground">{op.flightName || ""}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground w-20 shrink-0">MAWB No. / Date</span>
                  <span className="text-foreground">{op.mblNo || ""}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="font-semibold text-foreground w-24 shrink-0">
                    Place of Receipt <span className="text-destructive">*</span>
                  </label>
                  <div className="flex-1">
                    <input
                      name="placeOfReceipt"
                      value={houseForm.placeOfReceipt}
                      onChange={houseChange}
                      className={`w-full px-2 py-1 border rounded text-xs bg-background ${houseErrors.placeOfReceipt ? "border-destructive" : "border-input"}`}
                    />
                    {houseErrors.placeOfReceipt && (
                      <p className="text-xs text-destructive mt-0.5">{houseErrors.placeOfReceipt}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="font-semibold text-foreground w-24 shrink-0">
                    Place of Delivery <span className="text-destructive">*</span>
                  </label>
                  <div className="flex-1">
                    <input
                      name="placeOfDelivery"
                      value={houseForm.placeOfDelivery}
                      onChange={houseChange}
                      className={`w-full px-2 py-1 border rounded text-xs bg-background ${houseErrors.placeOfDelivery ? "border-destructive" : "border-input"}`}
                    />
                    {houseErrors.placeOfDelivery && (
                      <p className="text-xs text-destructive mt-0.5">{houseErrors.placeOfDelivery}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* INCO Term + HAWB No + HAWB Date */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-24 shrink-0">
                    INCO Term <span className="text-destructive">*</span>
                  </label>
                  <div className="flex-1">
                    <select
                      name="incoTerm"
                      value={houseForm.incoTerm}
                      onChange={houseChange}
                      className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${houseErrors.incoTerm ? "border-destructive" : "border-input"}`}
                    >
                      <option value="">--Select--</option>
                      {HOUSE_INCO_TERMS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                    {houseErrors.incoTerm && <p className="text-xs text-destructive mt-0.5">{houseErrors.incoTerm}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-20 shrink-0">HAWB No.</label>
                  <input
                    name="hawbNo"
                    value={houseForm.hawbNo}
                    onChange={houseChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-24 shrink-0">HAWB Date</label>
                  <input
                    type="date"
                    name="hawbDate"
                    value={houseForm.hawbDate}
                    onChange={houseChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
              </div>

              {/* Freight Term + HAWB Mark No + Notes */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-24 shrink-0">Freight Term</label>
                  <select
                    name="freightTerm"
                    value={houseForm.freightTerm}
                    onChange={houseChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  >
                    {HOUSE_FREIGHT_TERMS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-start gap-2">
                  <label className="text-xs font-semibold text-foreground w-20 shrink-0 pt-1">HAWB Mark No.</label>
                  <textarea
                    name="hawbMarkNo"
                    value={houseForm.hawbMarkNo}
                    onChange={houseChange}
                    rows={3}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                  />
                </div>
                <div className="flex items-start gap-2">
                  <label className="text-xs font-semibold text-foreground w-24 shrink-0 pt-1">Notes</label>
                  <textarea
                    name="notes"
                    value={houseForm.notes}
                    onChange={houseChange}
                    rows={3}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                  />
                </div>
              </div>

              {/* Customer + Shipper panels */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-border rounded overflow-hidden">
                  <div className="bg-[#00BCD4] px-3 py-2">
                    <h4 className="text-white font-semibold text-xs">Customer</h4>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-foreground w-20 shrink-0">
                        <span className="text-destructive mr-1">*</span>Customer
                      </label>
                      <div className="flex-1">
                        <select
                          name="customer"
                          value={houseForm.customer}
                          onChange={houseChange}
                          className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${houseErrors.customer ? "border-destructive" : "border-input"}`}
                        >
                          <option value="">--Select Customer--</option>
                          {HOUSE_CUSTOMERS.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                        {houseErrors.customer && (
                          <p className="text-xs text-destructive mt-0.5">{houseErrors.customer}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <label className="text-xs font-semibold text-foreground w-20 shrink-0 pt-1">Address</label>
                      <textarea
                        name="customerAddress"
                        value={houseForm.customerAddress}
                        onChange={houseChange}
                        rows={3}
                        className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                      />
                    </div>
                  </div>
                </div>
                <div className="border border-border rounded overflow-hidden">
                  <div className="bg-[#00BCD4] px-3 py-2">
                    <h4 className="text-white font-semibold text-xs">Shipper</h4>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-foreground w-20 shrink-0">Shipper</label>
                      <select
                        name="shipper"
                        value={houseForm.shipper}
                        onChange={houseChange}
                        className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                      >
                        <option value="">--Select Shipper--</option>
                        {HOUSE_SHIPPERS.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-start gap-2">
                      <label className="text-xs font-semibold text-foreground w-20 shrink-0 pt-1">Address</label>
                      <textarea
                        name="shipperAddress"
                        value={houseForm.shipperAddress}
                        onChange={houseChange}
                        rows={3}
                        className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Consignee + Notify1 panels */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-border rounded overflow-hidden">
                  <div className="bg-[#00BCD4] px-3 py-2">
                    <h4 className="text-white font-semibold text-xs">Consignee</h4>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-foreground w-20 shrink-0">Consignee</label>
                      <select
                        name="consignee"
                        value={houseForm.consignee}
                        onChange={houseChange}
                        className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                      >
                        <option value="">--Select Consignee--</option>
                        {HOUSE_CONSIGNEES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-start gap-2">
                      <label className="text-xs font-semibold text-foreground w-20 shrink-0 pt-1">Address</label>
                      <textarea
                        name="consigneeAddress"
                        value={houseForm.consigneeAddress}
                        onChange={houseChange}
                        rows={3}
                        className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                      />
                    </div>
                  </div>
                </div>
                <div className="border border-border rounded overflow-hidden">
                  <div className="bg-amber-400 px-3 py-2">
                    <h4 className="text-white font-semibold text-xs">Notify1</h4>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-foreground w-20 shrink-0">Notify1</label>
                      <select
                        name="notify1"
                        value={houseForm.notify1}
                        onChange={houseChange}
                        className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                      >
                        <option value="">--Select Notify1--</option>
                        {HOUSE_NOTIFY.map((n) => (
                          <option key={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-start gap-2">
                      <label className="text-xs font-semibold text-foreground w-20 shrink-0 pt-1">Address</label>
                      <textarea
                        name="notify1Address"
                        value={houseForm.notify1Address}
                        onChange={houseChange}
                        rows={3}
                        className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button
                size="sm"
                className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-6"
                onClick={closeHouseModal}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6"
                onClick={saveHouse}
              >
                {houseEditIndex !== null ? "Update House Job" : "Create House Job"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Bill Modal */}
      {sbOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeSbModal} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">Shipping Bill</h3>
              <button onClick={closeSbModal} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
              {/* Row 1: Shipping Bill No + Shipping Bill Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">
                    <span className="text-destructive mr-1">*</span>Shipping Bill No
                  </label>
                  <div className="flex-1">
                    <input
                      name="shippingBillNo"
                      value={sbForm.shippingBillNo}
                      onChange={sbChange}
                      className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${sbErrors.shippingBillNo ? "border-destructive" : "border-input"}`}
                    />
                    {sbErrors.shippingBillNo && (
                      <p className="text-xs text-destructive mt-0.5">{sbErrors.shippingBillNo}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">
                    <span className="text-destructive mr-1">*</span>Shipping Bill Date
                  </label>
                  <div className="flex-1">
                    <input
                      type="date"
                      name="shippingBillDate"
                      value={sbForm.shippingBillDate}
                      onChange={sbChange}
                      className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${sbErrors.shippingBillDate ? "border-destructive" : "border-input"}`}
                    />
                    {sbErrors.shippingBillDate && (
                      <p className="text-xs text-destructive mt-0.5">{sbErrors.shippingBillDate}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Mate Receipt No + Mate Receipt Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Mate Receipt No</label>
                  <input
                    name="mateReceiptNo"
                    value={sbForm.mateReceiptNo}
                    onChange={sbChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Mate Receipt Date</label>
                  <input
                    type="date"
                    name="mateReceiptDate"
                    value={sbForm.mateReceiptDate}
                    onChange={sbChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
              </div>

              {/* Row 3: No of PCS + Pack Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">No Of PCS</label>
                  <input
                    name="noOfPcs"
                    value={sbForm.noOfPcs}
                    onChange={sbChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Pack Type</label>
                  <select
                    name="packType"
                    value={sbForm.packType}
                    onChange={sbChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  >
                    <option value="">--Select--</option>
                    {SB_PACK_TYPES.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Gross Weight + Measurement */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Gross Weight</label>
                  <input
                    name="grossWeight"
                    value={sbForm.grossWeight}
                    onChange={sbChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Measurement</label>
                  <input
                    name="measurement"
                    value={sbForm.measurement}
                    onChange={sbChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
              </div>

              {/* Row 5: Volume + Commodity Code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Volume</label>
                  <input
                    name="volume"
                    value={sbForm.volume}
                    onChange={sbChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Commodity Code</label>
                  <input
                    name="commodityCode"
                    value={sbForm.commodityCode}
                    onChange={sbChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
              </div>

              {/* Row 6: Commodity Type + Commodity Desc */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Commodity Type</label>
                  <input
                    name="commodityType"
                    value={sbForm.commodityType}
                    onChange={sbChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-start gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0 pt-1">Commodity Desc</label>
                  <textarea
                    name="commodityDesc"
                    value={sbForm.commodityDesc}
                    onChange={sbChange}
                    rows={3}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                  />
                </div>
              </div>

              {/* Row 7: Note (full width) */}
              <div className="flex items-start gap-2">
                <label className="text-xs font-semibold text-foreground w-32 shrink-0 pt-1">Note</label>
                <textarea
                  name="note"
                  value={sbForm.note}
                  onChange={sbChange}
                  rows={3}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button
                size="sm"
                className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-6"
                onClick={closeSbModal}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6"
                onClick={saveSb}
              >
                {sbEditIndex !== null ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Instructions Modal */}
      {siOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeSiModal} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-3xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">Job Consignment Details</h3>
              <button onClick={closeSiModal} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
              {/* Row 1: S.No# + No of PCS */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">S.No#</label>
                  <input
                    name="sNo"
                    value={siForm.sNo}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background text-right"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">No of PCS</label>
                  <input
                    name="noOfPcs"
                    value={siForm.noOfPcs}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
              </div>

              {/* Row 2: Pack Type + No of Pallet */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Pack Type</label>
                  <select
                    name="packType"
                    value={siForm.packType}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  >
                    <option value="">--Select--</option>
                    {PACK_TYPES.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">No of Pallet</label>
                  <input
                    name="noOfPallet"
                    value={siForm.noOfPallet}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
              </div>

              {/* Row 3: G.Weight + G.Weight Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">G.Weight</label>
                  <input
                    name="gWeight"
                    value={siForm.gWeight}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">G.Weight Unit</label>
                  <select
                    name="gWeightUnit"
                    value={siForm.gWeightUnit}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  >
                    {SI_WEIGHT_UNITS.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: V.Weight + V.Weight Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">V.Weight</label>
                  <input
                    name="vWeight"
                    value={siForm.vWeight}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">V.Weight Unit</label>
                  <select
                    name="vWeightUnit"
                    value={siForm.vWeightUnit}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  >
                    {["CBM", "Kg", "Lbs", "MT"].map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: N.Weight + N.Weight Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">N.Weight</label>
                  <input
                    name="nWeight"
                    value={siForm.nWeight}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">N.Weight Unit</label>
                  <select
                    name="nWeightUnit"
                    value={siForm.nWeightUnit}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  >
                    {SI_WEIGHT_UNITS.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 6: Volume + Chargeable Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Volume</label>
                  <input
                    name="volume"
                    value={siForm.volume}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Chargeable Unit</label>
                  <input
                    name="chargeableUnit"
                    value={siForm.chargeableUnit}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
              </div>

              {/* Row 7: Commodity Type + Commodity Code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Commodity Type</label>
                  <select
                    name="commodityType"
                    value={siForm.commodityType}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  >
                    <option value="">--Select--</option>
                    {SI_COMMODITY_TYPES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Commodity Code</label>
                  <input
                    name="commodityCode"
                    value={siForm.commodityCode}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
              </div>

              {/* Row 8: Commodity Desc (full width) */}
              <div className="flex items-start gap-2">
                <label className="text-xs font-semibold text-foreground w-32 shrink-0 pt-1">Commodity Desc</label>
                <textarea
                  name="commodityDesc"
                  value={siForm.commodityDesc}
                  onChange={siChange}
                  rows={3}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                />
              </div>

              {/* Row 9: Manifest Seal + Actual/Liner Seal */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Manifest Seal</label>
                  <input
                    name="manifestSeal"
                    value={siForm.manifestSeal}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Actual / Liner Seal</label>
                  <input
                    name="actualLinerSeal"
                    value={siForm.actualLinerSeal}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
              </div>

              {/* Row 10: Custom Seal + Excise Seal No */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Custom Seal</label>
                  <input
                    name="customSeal"
                    value={siForm.customSeal}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Excise Seal No</label>
                  <input
                    name="exciseSealNo"
                    value={siForm.exciseSealNo}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
              </div>

              {/* Row 11: Seal Date + Seal Type Indicator */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Seal Date</label>
                  <input
                    type="date"
                    name="sealDate"
                    value={siForm.sealDate}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Seal Type Indicator</label>
                  <select
                    name="sealTypeIndicator"
                    value={siForm.sealTypeIndicator}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  >
                    <option value="">--Select--</option>
                    {SEAL_TYPE_OPTIONS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 12: Seal Device ID + Movement Doc Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Seal Device ID</label>
                  <input
                    name="sealDeviceId"
                    value={siForm.sealDeviceId}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Movement Doc Type</label>
                  <input
                    name="movementDocType"
                    value={siForm.movementDocType}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
              </div>

              {/* Row 13: Movement Doc No + Notes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Movement Doc No</label>
                  <input
                    name="movementDocNo"
                    value={siForm.movementDocNo}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Notes</label>
                  <input
                    name="notes"
                    value={siForm.notes}
                    onChange={siChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
              </div>

              {/* RORO Section */}
              <div className="rounded overflow-hidden border border-[#00BCD4]">
                <button
                  type="button"
                  onClick={() => setRoroOpen((prev) => !prev)}
                  className="w-full bg-[#00BCD4] px-3 py-2 flex items-center justify-between text-left"
                >
                  <span className="text-white font-semibold text-xs">RORO</span>
                  <span
                    className={`text-white text-xs transition-transform duration-200 ${roroOpen ? "rotate-180" : "rotate-0"}`}
                  >
                    ▼
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${roroOpen ? "max-h-96" : "max-h-0"}`}>
                  <div className="p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Roro Year</label>
                        <input
                          name="roroYear"
                          value={siForm.roroYear}
                          onChange={siChange}
                          className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Roro Brand</label>
                        <input
                          name="roroBrand"
                          value={siForm.roroBrand}
                          onChange={siChange}
                          className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Roro Model</label>
                        <input
                          name="roroModel"
                          value={siForm.roroModel}
                          onChange={siChange}
                          className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Roro Specification</label>
                        <textarea
                          name="roroSpecification"
                          value={siForm.roroSpecification}
                          onChange={siChange}
                          rows={3}
                          className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">RORO Chasis No#</label>
                        <input
                          name="roroChasisNo"
                          value={siForm.roroChasisNo}
                          onChange={siChange}
                          className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">RORO Engine No#</label>
                        <input
                          name="roroEngineNo"
                          value={siForm.roroEngineNo}
                          onChange={siChange}
                          className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button
                size="sm"
                className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-6"
                onClick={closeSiModal}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6"
                onClick={saveSi}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dimensions Modal */}
      {dimOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeDimModal} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">Dimension Details</h3>
              <button onClick={closeDimModal} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
              {/* Row 1: S.No# + L×W×H Measurement */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">
                    S.No# <span className="text-destructive">*</span>
                  </label>
                  <input
                    name="sNo"
                    value={dimForm.sNo}
                    onChange={dimChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background text-right"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground whitespace-nowrap shrink-0">
                    L x W x H<br />
                    Measurement
                  </label>
                  <input
                    name="lxwxhMeasurement"
                    value={dimForm.lxwxhMeasurement}
                    onChange={dimChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
              </div>

              {/* Row 2: L×W×H */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0">
                  L x W x H <span className="text-destructive">*</span>
                </label>
                <div className="flex items-center gap-1.5 flex-1">
                  <input
                    name="lxwxh"
                    value={dimForm.lxwxh}
                    onChange={dimChange}
                    placeholder="L"
                    className="w-0 flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                  <span className="text-xs text-muted-foreground shrink-0">×</span>
                  <input
                    name="width"
                    value={dimForm.width}
                    onChange={dimChange}
                    placeholder="W"
                    className="w-0 flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                  <span className="text-xs text-muted-foreground shrink-0">×</span>
                  <input
                    name="height"
                    value={dimForm.height}
                    onChange={dimChange}
                    placeholder="H"
                    className="w-0 flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
              </div>

              {/* Row 3: No of Pcs + Package Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">No of Pcs</label>
                  <input
                    name="noOfPcs"
                    value={dimForm.noOfPcs}
                    onChange={dimChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground whitespace-nowrap shrink-0">
                    Package Type
                  </label>
                  <select
                    name="packageType"
                    value={dimForm.packageType}
                    onChange={dimChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background ml-2"
                  >
                    <option value="">-- Select --</option>
                    {PACKAGE_TYPES.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: G.Weight + unit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">G.Weight</label>
                  <input
                    name="gWeight"
                    value={dimForm.gWeight}
                    onChange={dimChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    name="gWeightUnit"
                    value={dimForm.gWeightUnit}
                    onChange={dimChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  >
                    {WEIGHT_UNITS.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: V.Weight + unit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">V.Weight</label>
                  <input
                    name="vWeight"
                    value={dimForm.vWeight}
                    onChange={dimChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    name="vWeightUnit"
                    value={dimForm.vWeightUnit}
                    onChange={dimChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  >
                    {WEIGHT_UNITS.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 6: Net Weight + unit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">Net Weight</label>
                  <input
                    name="netWeight"
                    value={dimForm.netWeight}
                    onChange={dimChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    name="netWeightUnit"
                    value={dimForm.netWeightUnit}
                    onChange={dimChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  >
                    {WEIGHT_UNITS.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 7: Volume + COO */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">Volume</label>
                  <input
                    name="volume"
                    value={dimForm.volume}
                    onChange={dimChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground whitespace-nowrap shrink-0">COO</label>
                  <input
                    name="coo"
                    value={dimForm.coo}
                    onChange={dimChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background ml-2"
                  />
                </div>
              </div>

              {/* Row 8: Commodity Type + Commodity Code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">Commodity Type</label>
                  <select
                    name="commodityType"
                    value={dimForm.commodityType}
                    onChange={dimChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  >
                    <option value="">-- Select --</option>
                    {COMMODITY_TYPES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground whitespace-nowrap shrink-0">
                    Commodity Code
                  </label>
                  <input
                    name="commodityCode"
                    value={dimForm.commodityCode}
                    onChange={dimChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background ml-2"
                  />
                </div>
              </div>

              {/* Row 9: Commodity Desc */}
              <div className="flex items-start gap-2">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0 pt-1">Commodity Desc</label>
                <textarea
                  name="commodityDesc"
                  value={dimForm.commodityDesc}
                  onChange={dimChange}
                  rows={3}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                />
              </div>

              {/* Row 10: Notes */}
              <div className="flex items-start gap-2">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0 pt-1">Notes</label>
                <textarea
                  name="notes"
                  value={dimForm.notes}
                  onChange={dimChange}
                  rows={3}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button size="sm" variant="outline" className="px-5" onClick={closeDimModal}>
                Cancel
              </Button>
              <Button size="sm" className="bg-[#00BCD4] hover:bg-cyan-600 text-white px-6" onClick={saveDim}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Costing Details Modal */}
      {costOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCostOpen(false)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-4xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">Costing Details</h3>
              <button onClick={() => setCostOpen(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              {/* Row 1: S.No, Charge, Freight PP/CC */}
              <div className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-foreground block mb-1">S.No#</label>
                  {ci("sNo", "text-right")}
                </div>
                <div className="col-span-5">
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    <span className="text-destructive mr-1">*</span>Charge
                  </label>
                  {cs("charge", CHARGES)}
                </div>
                <div className="col-span-5">
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    <span className="text-destructive mr-1">*</span>Freight PP / CC
                  </label>
                  {cs("freightPpCc", ["Prepaid", "Collect"])}
                </div>
              </div>

              {/* Row 2: Description, Unit, No of Unit */}
              <div className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5">
                  <label className="text-xs font-semibold text-foreground block mb-1">Description</label>
                  {ci("description")}
                </div>
                <div className="col-span-3">
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    <span className="text-destructive mr-1">*</span>Unit
                  </label>
                  {cs("unit", UNITS)}
                </div>
                <div className="col-span-4">
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    <span className="text-destructive mr-1">*</span>No of Unit
                  </label>
                  {ci("noOfUnit", "text-right")}
                </div>
              </div>

              {/* Row 3: SAC Code, Note */}
              <div className="grid grid-cols-12 gap-3 items-start">
                <div className="col-span-5">
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    <span className="text-destructive mr-1">*</span>SAC Code
                  </label>
                  {ci("sacCode")}
                </div>
                <div className="col-span-7">
                  <label className="text-xs font-semibold text-foreground block mb-1">Note</label>
                  <textarea
                    name="note"
                    value={costForm.note}
                    onChange={costChange}
                    rows={2}
                    className="w-full px-2 py-1 border border-input rounded text-xs bg-background resize-none"
                  />
                </div>
              </div>

              {/* Row 4: Sale Other Territory */}
              <div className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5">
                  <label className="text-xs font-semibold text-foreground block mb-1">Sale Other Territory</label>
                  {cs("saleOtherTerritory", ["No", "Yes"], "")}
                </div>
              </div>

              {/* Sale Charges + Cost Charges panels */}
              <div className="grid grid-cols-2 gap-4">
                {/* Sale Charges */}
                <div className="border border-border rounded overflow-hidden">
                  <div className="bg-green-500 px-3 py-2">
                    <h4 className="text-white font-semibold text-xs">Sale Charges</h4>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Customer</label>
                        {cs("saleCustomer", CUSTOMERS)}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Sale Dr / Cr</label>
                        {cs("saleDrCr", DR_CR_SALE, "")}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Currency</label>
                        {cs("saleCurrency", CURRENCIES, "")}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Ex.Rate</label>
                        {ci("saleExRate", "text-right")}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Per Unit</label>
                        {ci("salePerUnit", "text-right")}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Crcy Amount</label>
                        {ci("saleCrcyAmount", "text-right")}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Local Amount</label>
                        {ci("saleLocalAmount", "text-right")}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Tax %</label>
                        {cs("saleTaxPct", TAX_PCTS)}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Taxable Amount</label>
                        {ci("saleTaxableAmount", "text-right")}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Non Taxable Amount</label>
                        {ci("saleNonTaxableAmount", "text-right")}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">CGST Amount</label>
                        {ci("saleCgst", "text-right")}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">SGST Amount</label>
                        {ci("saleSgst", "text-right")}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">IGST Amount</label>
                        {ci("saleIgst", "text-right")}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Total Tax Amount</label>
                        {ci("saleTotalTax", "text-right")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Charges */}
                <div className="border border-border rounded overflow-hidden">
                  <div className="bg-[#00BCD4] px-3 py-2">
                    <h4 className="text-white font-semibold text-xs">Cost Charges</h4>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Vendor</label>
                        {cs("costVendor", VENDORS)}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Cost Dr / Cr</label>
                        {cs("costDrCr", DR_CR_COST, "")}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Currency</label>
                        {cs("costCurrency", CURRENCIES, "")}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Ex.Rate</label>
                        {ci("costExRate", "text-right")}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Per Unit</label>
                        {ci("costPerUnit", "text-right")}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Crcy Amount</label>
                        {ci("costCrcyAmount", "text-right")}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Local Amount</label>
                        {ci("costLocalAmount", "text-right")}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Tax %</label>
                        {cs("costTaxPct", TAX_PCTS)}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Taxable Amount</label>
                        {ci("costTaxableAmount", "text-right")}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Non Taxable Amount</label>
                        {ci("costNonTaxableAmount", "text-right")}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">CGST Amount</label>
                        {ci("costCgst", "text-right")}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">SGST Amount</label>
                        {ci("costSgst", "text-right")}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">IGST Amount</label>
                        {ci("costIgst", "text-right")}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Total Tax Amount</label>
                        {ci("costTotalTax", "text-right")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button size="sm" variant="outline" className="px-5" onClick={() => setCostOpen(false)}>
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="px-5" onClick={() => saveCost(true)}>
                  Save &amp; New
                </Button>
                <Button
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white px-5"
                  onClick={() => saveCost(false)}
                >
                  Save &amp; Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Subledger Modal */}
      {slOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setSlOpen(false);
              setSlForm(initSl);
              setSlErrors({});
              setSlEditId(null);
            }}
          />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-md mx-4 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">{slEditId ? "Edit Subledger" : "New Customer"}</h3>
              <button
                onClick={() => {
                  setSlOpen(false);
                  setSlForm(initSl);
                  setSlErrors({});
                  setSlEditId(null);
                }}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-3">
              {/* Customer Name */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">
                  <span className="text-destructive mr-1">*</span>Customer Name
                </label>
                <div className="flex-1">
                  <input
                    name="customerName"
                    value={slForm.customerName}
                    onChange={slChange}
                    className={`w-full px-3 py-1.5 border rounded text-sm bg-background ${slErrors.customerName ? "border-destructive" : "border-input"}`}
                  />
                  {slErrors.customerName && <p className="text-xs text-destructive mt-0.5">{slErrors.customerName}</p>}
                </div>
              </div>
              {/* Categories */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">
                  <span className="text-destructive mr-1">*</span>Categories
                </label>
                <div className="flex-1">
                  <select
                    name="categories"
                    value={slForm.categories}
                    onChange={slChange}
                    className={`w-full px-3 py-1.5 border rounded text-sm bg-background ${slErrors.categories ? "border-destructive" : "border-input"}`}
                  >
                    <option value="">--Select--</option>
                    {SL_CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  {slErrors.categories && <p className="text-xs text-destructive mt-0.5">{slErrors.categories}</p>}
                </div>
              </div>
              {/* SCAC Code */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">SCAC Code</label>
                <input
                  name="scacCode"
                  value={slForm.scacCode}
                  onChange={slChange}
                  className="flex-1 px-3 py-1.5 border border-input rounded text-sm bg-background"
                />
              </div>
              {/* Address */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">
                  <span className="text-destructive mr-1">*</span>Address
                </label>
                <div className="flex-1">
                  <input
                    name="address"
                    value={slForm.address}
                    onChange={slChange}
                    className={`w-full px-3 py-1.5 border rounded text-sm bg-background ${slErrors.address ? "border-destructive" : "border-input"}`}
                  />
                  {slErrors.address && <p className="text-xs text-destructive mt-0.5">{slErrors.address}</p>}
                </div>
              </div>
              {/* Pin Code */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">Pin Code</label>
                <input
                  name="pinCode"
                  value={slForm.pinCode}
                  onChange={slChange}
                  className="flex-1 px-3 py-1.5 border border-input rounded text-sm bg-background"
                />
              </div>
              {/* Phone */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">Phone</label>
                <input
                  name="phone"
                  value={slForm.phone}
                  onChange={slChange}
                  className="flex-1 px-3 py-1.5 border border-input rounded text-sm bg-background"
                />
              </div>
              {/* Mobile */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">Mobile</label>
                <input
                  name="mobile"
                  value={slForm.mobile}
                  onChange={slChange}
                  className="flex-1 px-3 py-1.5 border border-input rounded text-sm bg-background"
                />
              </div>
              {/* Email Id */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">Email Id</label>
                <input
                  name="emailId"
                  value={slForm.emailId}
                  onChange={slChange}
                  className="flex-1 px-3 py-1.5 border border-input rounded text-sm bg-background"
                />
              </div>
              {/* GST State */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">GST State</label>
                <select
                  name="gstState"
                  value={slForm.gstState}
                  onChange={slChange}
                  className="flex-1 px-3 py-1.5 border border-input rounded text-sm bg-background"
                >
                  <option value="">--Select--</option>
                  {SL_GST_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              {/* GST No */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">GST No</label>
                <input
                  name="gstNo"
                  value={slForm.gstNo}
                  onChange={slChange}
                  className="flex-1 px-3 py-1.5 border border-input rounded text-sm bg-background"
                />
              </div>
              {/* PAN No */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">PAN No</label>
                <input
                  name="panNo"
                  value={slForm.panNo}
                  onChange={slChange}
                  className="flex-1 px-3 py-1.5 border border-input rounded text-sm bg-background"
                />
              </div>
              {/* Country */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">Country</label>
                <input
                  name="country"
                  value={slForm.country}
                  onChange={slChange}
                  className="flex-1 px-3 py-1.5 border border-input rounded text-sm bg-background"
                />
              </div>
            </div>
            <div className="flex justify-end px-6 py-4 border-t border-border shrink-0">
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6"
                onClick={slSave}
              >
                {slEditId ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Profit Share Modal */}
      {profitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setProfitOpen(false);
              setProfitForm(initProfit);
              setProfitErrors({});
            }}
          />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">Profit Share</h3>
              <button
                onClick={() => {
                  setProfitOpen(false);
                  setProfitForm(initProfit);
                  setProfitErrors({});
                }}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              {/* JOB No# + JOB Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">JOB No#</label>
                  <input
                    readOnly
                    value={op.jobNo || "RLPL/AE/J0303"}
                    className="w-full px-2 py-1.5 border border-input rounded text-xs bg-muted"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">JOB Date</label>
                  <input
                    readOnly
                    value={op.jobDate || "24-MAR-26"}
                    className="w-full px-2 py-1.5 border border-input rounded text-xs bg-muted"
                  />
                </div>
              </div>
              {/* Type */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  <span className="text-destructive mr-1">*</span>Type
                </label>
                <select
                  name="type"
                  value={profitForm.type}
                  onChange={profitChange}
                  className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${
                    profitErrors.type ? "border-destructive" : "border-input"
                  }`}
                >
                  <option value="">--Select--</option>
                  {PS_TYPE_OPTIONS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                {profitErrors.type && <p className="text-xs text-destructive mt-0.5">{profitErrors.type}</p>}
              </div>
              {/* To Name + To Name (Description) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    <span className="text-destructive mr-1">*</span>To Name
                  </label>
                  <select
                    name="toName"
                    value={profitForm.toName}
                    onChange={profitChange}
                    className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${
                      profitErrors.toName ? "border-destructive" : "border-input"
                    }`}
                  >
                    <option value="">--Select--</option>
                    {PS_TO_NAME_OPTIONS.map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                  {profitErrors.toName && <p className="text-xs text-destructive mt-0.5">{profitErrors.toName}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    <span className="text-destructive mr-1">*</span>To Name (Description)
                  </label>
                  <input
                    name="toNameDesc"
                    value={profitForm.toNameDesc}
                    onChange={profitChange}
                    className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
              </div>
              {/* Percentage + Profit Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    <span className="text-destructive mr-1">*</span>Percentage
                  </label>
                  <input
                    name="percentage"
                    value={profitForm.percentage}
                    onChange={profitChange}
                    className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${
                      profitErrors.percentage ? "border-destructive" : "border-input"
                    }`}
                  />
                  {profitErrors.percentage && (
                    <p className="text-xs text-destructive mt-0.5">{profitErrors.percentage}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    <span className="text-destructive mr-1">*</span>Profit Amount
                  </label>
                  <input
                    name="profitAmount"
                    value={profitForm.profitAmount}
                    onChange={profitChange}
                    className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${
                      profitErrors.profitAmount ? "border-destructive" : "border-input"
                    }`}
                  />
                  {profitErrors.profitAmount && (
                    <p className="text-xs text-destructive mt-0.5">{profitErrors.profitAmount}</p>
                  )}
                </div>
              </div>
              {/* Job Profit */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  <span className="text-destructive mr-1">*</span>Job Profit
                </label>
                <input
                  name="jobProfit"
                  value={profitForm.jobProfit}
                  onChange={profitChange}
                  className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${
                    profitErrors.jobProfit ? "border-destructive" : "border-input"
                  }`}
                />
                {profitErrors.jobProfit && <p className="text-xs text-destructive mt-0.5">{profitErrors.jobProfit}</p>}
              </div>
              {/* Note */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Note</label>
                <textarea
                  name="note"
                  value={profitForm.note}
                  onChange={profitChange}
                  rows={4}
                  className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="px-5"
                onClick={() => {
                  setProfitOpen(false);
                  setProfitForm(initProfit);
                  setProfitErrors({});
                }}
              >
                Cancel
              </Button>
              <Button size="sm" className="bg-[#00BCD4] hover:bg-cyan-600 text-white px-6" onClick={saveProfit}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Working Team Modal */}
      {teamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setTeamOpen(false);
              setTeamForm(initTeam);
              setTeamError("");
            }}
          />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">Job Working Team</h3>
              <button
                onClick={() => {
                  setTeamOpen(false);
                  setTeamForm(initTeam);
                  setTeamError("");
                }}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              {/* Employee */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground w-32 shrink-0">
                  Employee <span className="text-destructive">*</span>
                </label>
                <div className="flex-1">
                  <select
                    name="employee"
                    value={teamForm.employee}
                    onChange={(e) => {
                      teamChange(e);
                      setTeamError("");
                    }}
                    className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${
                      teamError ? "border-destructive" : "border-input"
                    }`}
                  >
                    <option value="">--Select--</option>
                    {EMPLOYEE_OPTIONS.map((e) => (
                      <option key={e}>{e}</option>
                    ))}
                  </select>
                  {teamError && <p className="text-xs text-destructive mt-0.5">{teamError}</p>}
                </div>
              </div>
              {/* Department + Followup Required */}
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground whitespace-nowrap shrink-0">
                    Department(Sec)
                  </label>
                  <select
                    name="department"
                    value={teamForm.department}
                    onChange={teamChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  >
                    <option value=""></option>
                    {DEPT_OPTIONS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground whitespace-nowrap shrink-0">
                    Followup Required
                  </label>
                  <div className="flex rounded overflow-hidden border border-input ml-1">
                    {["No", "Yes"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setTeamForm((prev) => ({ ...prev, followupRequired: opt }))}
                        className={`px-4 py-1.5 text-xs font-semibold transition-colors ${
                          teamForm.followupRequired === opt
                            ? "bg-[#00BCD4] text-white"
                            : "bg-background text-foreground hover:bg-muted"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Note */}
              <div className="flex items-start gap-3">
                <label className="text-xs font-semibold text-foreground w-32 shrink-0 pt-1">Note</label>
                <textarea
                  name="note"
                  value={teamForm.note}
                  onChange={teamChange}
                  rows={4}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="px-5"
                onClick={() => {
                  setTeamOpen(false);
                  setTeamForm(initTeam);
                  setTeamError("");
                }}
              >
                Cancel
              </Button>
              <Button size="sm" className="bg-[#00BCD4] hover:bg-cyan-600 text-white px-6" onClick={saveTeam}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {statusOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeStatusModal} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">
                {statusEditIndex !== null ? "Edit Status Update" : "Status Update"}
              </h3>
              <button onClick={closeStatusModal} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
              {/* Row 1: Line No# + Update To (Type) */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0">Line No#</label>
                <input
                  name="lineNo"
                  value={statusForm.lineNo}
                  onChange={statusChange}
                  className="w-24 px-2 py-1.5 border border-input rounded text-xs bg-background"
                />
                <label className="text-xs font-semibold text-foreground whitespace-nowrap ml-2">Update To (Type)</label>
                <select
                  name="updateTo"
                  value={statusForm.updateTo}
                  onChange={statusChange}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                >
                  <option value="">--Select--</option>
                  {UPDATE_TO_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              {/* Position */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0">
                  Position <span className="text-destructive">*</span>
                </label>
                <select
                  name="position"
                  value={statusForm.position}
                  onChange={statusChange}
                  className="w-48 px-2 py-1.5 border border-input rounded text-xs bg-background"
                >
                  {POSITION_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              {/* Subject */}
              <div className="flex items-start gap-3">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0 pt-1">Subject</label>
                <textarea
                  name="subject"
                  value={statusForm.subject}
                  onChange={statusChange}
                  rows={3}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                />
              </div>
              {/* From */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0">From</label>
                <input
                  name="from"
                  value={statusForm.from}
                  onChange={statusChange}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                />
              </div>
              {/* To */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0">To</label>
                <input
                  name="to"
                  value={statusForm.to}
                  onChange={statusChange}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                />
              </div>
              {/* Bcc */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0">Bcc</label>
                <input
                  name="bcc"
                  value={statusForm.bcc}
                  onChange={statusChange}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                />
              </div>
              {/* Cc */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0">Cc</label>
                <input
                  name="cc"
                  value={statusForm.cc}
                  onChange={statusChange}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                />
              </div>
              {/* Header */}
              <div className="flex items-start gap-3">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0 pt-1">Header</label>
                <textarea
                  name="header"
                  value={statusForm.header}
                  onChange={statusChange}
                  rows={3}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                />
              </div>
              {/* Body */}
              <div className="flex items-start gap-3">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0 pt-1">Body</label>
                <textarea
                  name="body"
                  value={statusForm.body}
                  onChange={statusChange}
                  rows={3}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                />
              </div>
              {/* Footer */}
              <div className="flex items-start gap-3">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0 pt-1">Footer</label>
                <textarea
                  name="footer"
                  value={statusForm.footer}
                  onChange={statusChange}
                  rows={3}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                />
              </div>
              {/* Notes */}
              <div className="flex items-start gap-3">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0 pt-1">Notes</label>
                <textarea
                  name="notes"
                  value={statusForm.notes}
                  onChange={statusChange}
                  rows={3}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button size="sm" variant="outline" className="px-5" onClick={closeStatusModal}>
                Cancel
              </Button>
              <Button size="sm" className="bg-[#00BCD4] hover:bg-cyan-600 text-white px-6" onClick={saveStatus}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Routing Modal */}
      {routingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRoutingOpen(false)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">Routing</h3>
              <button onClick={() => setRoutingOpen(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              {/* Row 1: S.No# + From Port Code */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0">S.No#</label>
                <input
                  name="sNo"
                  value={routingForm.sNo}
                  onChange={routingChange}
                  className="w-16 px-2 py-1.5 border border-input rounded text-xs bg-background"
                />
                <label className="text-xs font-semibold text-foreground whitespace-nowrap ml-2">From Port Code</label>
                <select
                  name="fromPortCode"
                  value={routingForm.fromPortCode}
                  onChange={routingChange}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                >
                  <option value="">--Select--</option>
                  {PORT_OPTIONS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
              {/* Row 1b: From Port Name */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0">From Port Name</label>
                <input
                  name="fromPortName"
                  value={routingForm.fromPortName}
                  onChange={routingChange}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                />
              </div>
              {/* Row 2: From ETD + From ATD */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-20 shrink-0">From ETD</label>
                  <input
                    type="date"
                    name="fromEtd"
                    value={routingForm.fromEtd}
                    onChange={routingChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-20 shrink-0">From ATD</label>
                  <input
                    type="date"
                    name="fromAtd"
                    value={routingForm.fromAtd}
                    onChange={routingChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
              </div>
              {/* Row 3: To Port Code + Position */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-20 shrink-0">To Port Code</label>
                  <select
                    name="toPortCode"
                    value={routingForm.toPortCode}
                    onChange={routingChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  >
                    <option value="">--Select--</option>
                    {PORT_OPTIONS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground whitespace-nowrap shrink-0">
                    Position <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="position"
                    value={routingForm.position}
                    onChange={routingChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background ml-2"
                  >
                    {["Opened", "Closed", "In Transit", "Arrived"].map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Row 3b: To Port Name */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-foreground w-20 shrink-0">To Port Name</label>
                <input
                  name="toPortName"
                  value={routingForm.toPortName}
                  onChange={routingChange}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                />
              </div>
              {/* Row 4: To ETA + To ATA */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-20 shrink-0">To ETA</label>
                  <input
                    type="date"
                    name="toEta"
                    value={routingForm.toEta}
                    onChange={routingChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-20 shrink-0">To ATA</label>
                  <input
                    type="date"
                    name="toAta"
                    value={routingForm.toAta}
                    onChange={routingChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
              </div>
              {/* Row 5: Airline Code */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0">Airline Code</label>
                <select
                  name="airlineCode"
                  value={routingForm.airlineCode}
                  onChange={routingChange}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                >
                  <option value="">--Select--</option>
                  {AIRLINE_OPTIONS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
              {/* Row 6: Flight Name + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-20 shrink-0">Flight Name</label>
                  <input
                    name="flightName"
                    value={routingForm.flightName}
                    onChange={routingChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-14 shrink-0">Status</label>
                  <select
                    name="status"
                    value={routingForm.status}
                    onChange={routingChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                  >
                    {["Planned", "Confirmed", "Departed", "Arrived", "Cancelled"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Row 7: From ETD Followup toggle */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0">From ETD Followup</label>
                <div className="flex rounded overflow-hidden border border-input">
                  {["No", "Yes"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setRoutingForm((prev) => ({ ...prev, fromEtdFollowup: opt }))}
                      className={`px-5 py-1.5 text-xs font-semibold transition-colors ${
                        routingForm.fromEtdFollowup === opt
                          ? "bg-[#00BCD4] text-white"
                          : "bg-background text-foreground hover:bg-muted"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              {/* Row 8: Notes */}
              <div className="flex items-start gap-2">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0 pt-1">Notes</label>
                <textarea
                  name="notes"
                  value={routingForm.notes}
                  onChange={routingChange}
                  rows={3}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y"
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button size="sm" variant="outline" className="px-5" onClick={() => setRoutingOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" className="bg-[#00BCD4] hover:bg-cyan-600 text-white px-6" onClick={saveRouting}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOperation;
