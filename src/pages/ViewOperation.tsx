import { useState, useEffect } from "react";
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
import WorkingTeamModal from "@/components/operations/WorkingTeamModal";
import ProfitShareModal from "@/components/operations/ProfitShareModal";
import StatusUpdateModal from "@/components/operations/StatusUpdateModal";
import { getOperationApi, createOperationApi, getOperationsApi, getRiderContainersApi, createRiderContainerApi, updateRiderContainerApi, deleteRiderContainerApi, getSubledgersApi, createSubledgerApi, updateSubledgerApi, deleteSubledgerApi, getDimensionsApi, createDimensionApi, updateDimensionApi, deleteDimensionApi, getCargoDetailsApi, createCargoDetailApi, updateCargoDetailApi, deleteCargoDetailApi, getCostingsApi, createCostingApi, updateCostingApi, deleteCostingApi, getShippingBillsApi, createShippingBillApi, updateShippingBillApi, deleteShippingBillApi, getHouseJobsApi, createHouseJobApi, updateHouseJobApi, deleteHouseJobApi, getRoutingsApi, createRoutingApi, updateRoutingApi, deleteRoutingApi, getMasterCompaniesApi, getMasterCompanyAddressesApi, getMasterPortsApi, getMasterPortApi, getMasterPortTerminalsApi, getWorkingTeamsApi, createWorkingTeamApi, updateWorkingTeamApi, deleteWorkingTeamApi, getProfitSharesApi, createProfitShareApi, updateProfitShareApi, deleteProfitShareApi, getStatusUpdatesApi, createStatusUpdateApi, updateStatusUpdateApi, deleteStatusUpdateApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

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
  "Party",
  "Dimension's",
  "Cargo details",
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
  const { refresh } = useOperations();
  const { toast } = useToast();

  const [op, setOp] = useState<any>(null);
  const [opLoading, setOpLoading] = useState(true);

  // Load operation from API
  useEffect(() => {
    if (!id) return;
    setOpLoading(true);
    getOperationApi(Number(id))
      .then(res => setOp(res.data?.data ?? res.data))
      .catch(() => setOp(null))
      .finally(() => setOpLoading(false));
  }, [id]);

  // Fetch active carriers from operations list (unique carrier names)
  const [carrierOptions, setCarrierOptions] = useState<string[]>([]);
  useEffect(() => {
    getOperationsApi(1, 9999)
      .then(res => {
        const raw: any[] = res.data?.data ?? res.data ?? [];
        const unique = [...new Set(raw.map((o: any) => o.carrier).filter(Boolean))] as string[];
        setCarrierOptions(unique);
      })
      .catch(() => {});
  }, []);

  const [activeTab, setActiveTab] = useState("Job Details");
  const [dupOpen, setDupOpen] = useState(false);
  const [dupCarrier, setDupCarrier] = useState("");
  const [dupDate, setDupDate] = useState(new Date().toISOString().split("T")[0]);
  const [dupCarrierError, setDupCarrierError] = useState(false);
  const [dupSaving, setDupSaving] = useState(false);

  // Rider Container CRUD
  const [riderOpen, setRiderOpen] = useState(false);
  const [riderList, setRiderList] = useState<any[]>([]);
  const [riderLoading, setRiderLoading] = useState(false);
  const [riderFormOpen, setRiderFormOpen] = useState(false);
  const [riderEditing, setRiderEditing] = useState<any | null>(null);
  const [riderSaving, setRiderSaving] = useState(false);
  const [riderDeleteId, setRiderDeleteId] = useState<number | null>(null);

  const RIDER_EMPTY = {
    container_no: '', container_type: '', no_of_pcs: '', pack_type: '',
    no_of_pallet: '', volume: '', gross_weight: '', gross_weight_measurement: 'Kg',
    volume_weight: '', volume_weight_measurement: 'Kg', net_weight: '', net_weight_measurement: 'Kg',
    commodity_type: '', commodity_code: '', commodity_desc: '',
    manifest_seal: '', actual_seal: '', custom_seal: '',
  };
  const [riderForm, setRiderForm] = useState(RIDER_EMPTY);
  const [riderContainerNoError, setRiderContainerNoError] = useState('');

  const loadRiderContainers = async () => {
    if (!id) return;
    setRiderLoading(true);
    try {
      const res = await getRiderContainersApi(Number(id));
      setRiderList(res.data?.data ?? []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load rider containers.', variant: 'destructive' });
    } finally {
      setRiderLoading(false);
    }
  };

  const openRiderCreate = () => {
    setRiderEditing(null);
    setRiderForm(RIDER_EMPTY);
    setRiderContainerNoError('');
    setRiderFormOpen(true);
  };

  const openRiderEdit = (item: any) => {
    setRiderEditing(item);
    setRiderForm({
      container_no: item.container_no ?? '',
      container_type: item.container_type ?? '',
      no_of_pcs: String(item.no_of_pcs ?? ''),
      pack_type: item.pack_type ?? '',
      no_of_pallet: String(item.no_of_pallet ?? ''),
      volume: item.volume ?? '',
      gross_weight: item.gross_weight ?? '',
      gross_weight_measurement: item.gross_weight_measurement ?? 'Kg',
      volume_weight: item.volume_weight ?? '',
      volume_weight_measurement: item.volume_weight_measurement ?? 'Kg',
      net_weight: item.net_weight ?? '',
      net_weight_measurement: item.net_weight_measurement ?? 'Kg',
      commodity_type: item.commodity_type ?? '',
      commodity_code: item.commodity_code ?? '',
      commodity_desc: item.commodity_desc ?? '',
      manifest_seal: item.manifest_seal ?? '',
      actual_seal: item.actual_seal ?? '',
      custom_seal: item.custom_seal ?? '',
    });
    setRiderContainerNoError('');
    setRiderFormOpen(true);
  };

  const handleRiderSave = async () => {
    if (!riderForm.container_no.trim()) {
      setRiderContainerNoError('Container No is required.');
      return;
    }
    setRiderSaving(true);
    try {
      const payload = {
        ...riderForm,
        operation_id: Number(id),
        status: "1",
        no_of_pcs: riderForm.no_of_pcs !== '' ? Number(riderForm.no_of_pcs) : null,
        no_of_pallet: riderForm.no_of_pallet !== '' ? Number(riderForm.no_of_pallet) : null,
        volume: riderForm.volume !== '' ? Number(riderForm.volume) : null,
        gross_weight: riderForm.gross_weight !== '' ? Number(riderForm.gross_weight) : null,
        volume_weight: riderForm.volume_weight !== '' ? Number(riderForm.volume_weight) : null,
        net_weight: riderForm.net_weight !== '' ? Number(riderForm.net_weight) : null,
      };
      if (riderEditing) {
        await updateRiderContainerApi(riderEditing.id, payload);
        toast({ title: 'Success', description: 'Rider container updated.', variant: 'success' });
      } else {
        await createRiderContainerApi(payload);
        toast({ title: 'Success', description: 'Rider container created.', variant: 'success' });
      }
      setRiderFormOpen(false);
      loadRiderContainers();
    } catch {
      toast({ title: 'Error', description: 'Failed to save rider container.', variant: 'destructive' });
    } finally {
      setRiderSaving(false);
    }
  };

  const handleRiderDelete = async () => {
    if (riderDeleteId === null) return;
    try {
      await deleteRiderContainerApi(riderDeleteId);
      toast({ title: 'Success', description: 'Rider container deleted.', variant: 'success' });
      setRiderDeleteId(null);
      loadRiderContainers();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete rider container.', variant: 'destructive' });
    }
  };

  // Status Update CRUD
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const UPDATE_TO_OPTIONS = ["Email", "SMS", "WhatsApp", "Phone Call", "Letter", "Fax"];
  const POSITION_OPTIONS = ["Opened", "Closed"];
  const initStatus = {
    lineNo: "", updateTo: "", position: "Opened",
    subject: "", from: "", to: "", bcc: "", cc: "",
    header: "", body: "", footer: "", notes: "",
  };
  const [statusForm, setStatusForm] = useState(initStatus);
  const [statusPositionError, setStatusPositionError] = useState("");
  const [statusList, setStatusList] = useState<any[]>([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusEditId, setStatusEditId] = useState<number | null>(null);
  const [statusDeleteId, setStatusDeleteId] = useState<number | null>(null);

  const loadStatusUpdates = async () => {
    if (!id) return;
    setStatusLoading(true);
    try {
      const res = await getStatusUpdatesApi(Number(id));
      const raw: any[] = res.data?.data ?? [];
      setStatusList([...raw].reverse()); // latest first
    } catch {
      toast({ title: 'Error', description: 'Failed to load status updates.', variant: 'destructive' });
    } finally { setStatusLoading(false); }
  };

  const statusChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStatusForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'position') setStatusPositionError('');
  };

  const openStatusCreate = () => {
    setStatusEditId(null);
    setStatusForm(initStatus);
    setStatusPositionError('');
    setIsStatusUpdateOpen(true);
  };

  const openStatusEdit = (row: any) => {
    setStatusEditId(row.id);
    setStatusForm({
      lineNo:   row.line_no ?? '',
      updateTo: row.update_to_type ?? '',
      position: row.position ?? 'Opened',
      subject:  row.subject ?? '',
      from:     row.from ?? '',
      to:       row.to ?? '',
      bcc:      row.bcc ?? '',
      cc:       row.cc ?? '',
      header:   row.header ?? '',
      body:     row.body ?? '',
      footer:   row.footer ?? '',
      notes:    row.notes ?? '',
    });
    setStatusPositionError('');
    setIsStatusUpdateOpen(true);
  };

  const saveStatus = async () => {
    if (!statusForm.position) { setStatusPositionError('Position is required.'); return; }
    setStatusSaving(true);
    try {
      const payload = {
        operation_id:   Number(id),
        line_no:        statusForm.lineNo || null,
        update_to_type: statusForm.updateTo || null,
        position:       statusForm.position,
        subject:        statusForm.subject || null,
        from:           statusForm.from || null,
        to:             statusForm.to || null,
        bcc:            statusForm.bcc || null,
        cc:             statusForm.cc || null,
        header:         statusForm.header || null,
        body:           statusForm.body || null,
        footer:         statusForm.footer || null,
        notes:          statusForm.notes || null,
        status:         1,
      };
      if (statusEditId) {
        await updateStatusUpdateApi(statusEditId, payload);
        toast({ title: 'Success', description: 'Status update saved.', variant: 'success' });
      } else {
        await createStatusUpdateApi(payload);
        toast({ title: 'Success', description: 'Status update created.', variant: 'success' });
      }
      setIsStatusUpdateOpen(false);
      setStatusForm(initStatus);
      setStatusPositionError('');
      setStatusEditId(null);
      loadStatusUpdates();
    } catch {
      toast({ title: 'Error', description: 'Failed to save status update.', variant: 'destructive' });
    } finally { setStatusSaving(false); }
  };

  const handleStatusDelete = async () => {
    if (statusDeleteId === null) return;
    try {
      await deleteStatusUpdateApi(statusDeleteId);
      toast({ title: 'Success', description: 'Status update deleted.', variant: 'success' });
      setStatusDeleteId(null);
      loadStatusUpdates();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete status update.', variant: 'destructive' });
    }
  };

  // Dimensions CRUD
  const [dimOpen, setDimOpen] = useState(false);
  const PACKAGE_TYPES = ["Boxes", "Pallets", "Cartons", "Bags", "Drums", "Crates", "Bundles"];
  const WEIGHT_UNITS = ["Kg", "Lbs", "MT"];
  const COMMODITY_TYPES = ["General", "Hazardous", "Perishable", "Fragile", "Oversized", "Valuable"];

  const DIM_EMPTY = {
    sNo: '10', lxwxhMeasurement: '', length: '', width: '', height: '',
    noOfPcs: '', packageType: '', gWeight: '', gWeightUnit: 'Kg',
    vWeight: '', vWeightUnit: 'Kg', netWeight: '', netWeightUnit: 'Kg',
    volume: '', coo: '', commodityType: '', commodityCode: '', commodityDesc: '', notes: '',
  };
  const [dimForm, setDimForm] = useState(DIM_EMPTY);
  const [dimList, setDimList] = useState<any[]>([]);
  const [dimLoading, setDimLoading] = useState(false);
  const [dimSaving, setDimSaving] = useState(false);
  const [dimEditId, setDimEditId] = useState<number | null>(null);
  const [dimDeleteId, setDimDeleteId] = useState<number | null>(null);
  const [dimErrors, setDimErrors] = useState<Partial<typeof DIM_EMPTY>>({});

  const loadDimensions = async () => {
    setDimLoading(true);
    try {
      const res = await getDimensionsApi(Number(id));
      setDimList(res.data?.data ?? res.data ?? []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load dimensions.', variant: 'destructive' });
    } finally {
      setDimLoading(false);
    }
  };

  const openDimCreate = () => {
    setDimEditId(null);
    const lastId = dimList.length > 0
      ? Math.max(...dimList.map((d: any) => Number(d.id) || 0))
      : 0;
    setDimForm({ ...DIM_EMPTY, sNo: String(lastId + 1) });
    setDimErrors({});
    setDimOpen(true);
  };

  const openDimEdit = (item: any) => {
    setDimEditId(item.id);
    setDimForm({
      sNo:              String(item.s_no ?? item.id),
      lxwxhMeasurement: item.lxwxh_measurement ?? '',
      length:           item.length ?? '',
      width:            item.width ?? '',
      height:           item.height ?? '',
      noOfPcs:          String(item.no_of_pcs ?? ''),
      packageType:      item.package_type ?? '',
      gWeight:          item.g_weight ?? '',
      gWeightUnit:      item.g_weight_unit ?? 'Kg',
      vWeight:          item.v_weight ?? '',
      vWeightUnit:      item.v_weight_unit ?? 'Kg',
      netWeight:        item.net_weight ?? '',
      netWeightUnit:    item.net_weight_unit ?? 'Kg',
      volume:           item.volume ?? '',
      coo:              item.coo ?? '',
      commodityType:    item.commodity_type ?? '',
      commodityCode:    item.commodity_code ?? '',
      commodityDesc:    item.commodity_desc ?? '',
      notes:            item.notes ?? '',
    });
    setDimErrors({});
    setDimOpen(true);
  };

  const dimChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDimForm(prev => ({ ...prev, [name]: value }));
    if (dimErrors[name as keyof typeof DIM_EMPTY]) setDimErrors(prev => ({ ...prev, [name]: '' }));
  };

  const saveDim = async () => {
    const errs: Partial<typeof DIM_EMPTY> = {};
    if (!dimForm.length.trim())                                            errs.length   = 'Length is required.';
    else if (isNaN(Number(dimForm.length)) || Number(dimForm.length) <= 0) errs.length   = 'Enter a valid positive number.';
    if (!dimForm.width.trim())                                             errs.width    = 'Width is required.';
    else if (isNaN(Number(dimForm.width))  || Number(dimForm.width)  <= 0) errs.width    = 'Enter a valid positive number.';
    if (!dimForm.height.trim())                                            errs.height   = 'Height is required.';
    else if (isNaN(Number(dimForm.height)) || Number(dimForm.height) <= 0) errs.height   = 'Enter a valid positive number.';
    if (dimForm.noOfPcs !== '' && (isNaN(Number(dimForm.noOfPcs)) || Number(dimForm.noOfPcs) < 0))   errs.noOfPcs   = 'Enter a valid positive number.';
    if (dimForm.gWeight !== '' && (isNaN(Number(dimForm.gWeight)) || Number(dimForm.gWeight) < 0))   errs.gWeight   = 'Enter a valid positive number.';
    if (dimForm.vWeight !== '' && (isNaN(Number(dimForm.vWeight)) || Number(dimForm.vWeight) < 0))   errs.vWeight   = 'Enter a valid positive number.';
    if (dimForm.netWeight !== '' && (isNaN(Number(dimForm.netWeight)) || Number(dimForm.netWeight) < 0)) errs.netWeight = 'Enter a valid positive number.';
    if (dimForm.volume !== '' && (isNaN(Number(dimForm.volume)) || Number(dimForm.volume) < 0))      errs.volume    = 'Enter a valid positive number.';
    if (Object.keys(errs).length) { setDimErrors(errs); return; }
    setDimSaving(true);
    try {
      const payload: Record<string, unknown> = {
        operation_id:      Number(id),
        s_no:              Number(dimForm.sNo),
        lxwxh_measurement: dimForm.lxwxhMeasurement || null,
        length:            Number(dimForm.length),
        width:             Number(dimForm.width),
        height:            Number(dimForm.height),
        no_of_pcs:         dimForm.noOfPcs !== '' ? Number(dimForm.noOfPcs) : null,
        package_type:      dimForm.packageType || null,
        g_weight:          dimForm.gWeight !== '' ? Number(dimForm.gWeight) : null,
        g_weight_unit:     dimForm.gWeightUnit || null,
        v_weight:          dimForm.vWeight !== '' ? Number(dimForm.vWeight) : null,
        v_weight_unit:     dimForm.vWeightUnit || null,
        net_weight:        dimForm.netWeight !== '' ? Number(dimForm.netWeight) : null,
        net_weight_unit:   dimForm.netWeightUnit || null,
        volume:            dimForm.volume !== '' ? Number(dimForm.volume) : null,
        coo:               dimForm.coo || null,
        commodity_type:    dimForm.commodityType || null,
        commodity_code:    dimForm.commodityCode || null,
        commodity_desc:    dimForm.commodityDesc || null,
        notes:             dimForm.notes || null,
        status:            1,
      };
      if (dimEditId) {
        await updateDimensionApi(dimEditId, payload);
        toast({ title: 'Success', description: 'Dimension updated successfully.', variant: 'success' });
      } else {
        await createDimensionApi(payload);
        toast({ title: 'Success', description: 'Dimension created successfully.', variant: 'success' });
      }
      setDimOpen(false);
      setDimForm(DIM_EMPTY);
      setDimErrors({});
      setDimEditId(null);
      loadDimensions();
    } catch {
      toast({ title: 'Error', description: 'Failed to save dimension.', variant: 'destructive' });
    } finally {
      setDimSaving(false);
    }
  };

  const handleDimDelete = async () => {
    if (dimDeleteId === null) return;
    try {
      await deleteDimensionApi(dimDeleteId);
      toast({ title: 'Success', description: 'Dimension deleted successfully.', variant: 'success' });
      setDimDeleteId(null);
      loadDimensions();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete dimension.', variant: 'destructive' });
    }
  };

  const closeDimModal = () => {
    setDimOpen(false);
    setDimForm(DIM_EMPTY);
    setDimEditId(null);
    setDimErrors({});
  };

  // Shipping Instructions modal
  const [siOpen, setSiOpen] = useState(false);
  const [roroOpen, setRoroOpen] = useState(false);
  const PACK_TYPES = ["Boxes", "Pallets", "Cartons", "Bags", "Drums", "Crates", "Bundles"];
  const SI_WEIGHT_UNITS = ["Kg", "Lbs", "MT"];
  const SI_COMMODITY_TYPES = ["General", "Hazardous", "Perishable", "Frozen cargo", "Oversized", "Valuable"];
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
    unNo: "",
    unNoEnabled: false,
    dgClass: "",
    dgClassEnabled: false,
    oversizedEnabled: false,
    dimension: "",
    frozenEnabled: false,
    temperature: "",
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
  const [siRows, setSiRows] = useState<any[]>([]);
  const [siLoading, setSiLoading] = useState(false);
  const [siSaving, setSiSaving] = useState(false);
  const [siEditId, setSiEditId] = useState<number | null>(null);
  const [siDeleteId, setSiDeleteId] = useState<number | null>(null);
  const [siErrors, setSiErrors] = useState<{ gWeight?: string; vWeight?: string; nWeight?: string; noOfPcs?: string }>({});

  const loadCargoDetails = async () => {
    if (!id) return;
    setSiLoading(true);
    try {
      const res = await getCargoDetailsApi(Number(id));
      setSiRows(res.data?.data ?? []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load cargo details.', variant: 'destructive' });
    } finally {
      setSiLoading(false);
    }
  };

  const siChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSiForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'gWeight' || name === 'vWeight' || name === 'nWeight' || name === 'noOfPcs')
      setSiErrors(prev => ({ ...prev, [name]: '' }));
  };
  const toggleSiHazard = (field: "unNoEnabled" | "dgClassEnabled") =>
    setSiForm((prev) => ({
      ...prev,
      [field]: !prev[field],
      ...(prev[field] ? { [field === "unNoEnabled" ? "unNo" : "dgClass"]: "" } : {}),
    }));
  const toggleSiOversized = () =>
    setSiForm((prev) => ({
      ...prev,
      oversizedEnabled: !prev.oversizedEnabled,
      ...(!prev.oversizedEnabled ? {} : { dimension: "" }),
    }));
  const toggleSiFrozen = () =>
    setSiForm((prev) => ({
      ...prev,
      frozenEnabled: !prev.frozenEnabled,
      ...(!prev.frozenEnabled ? {} : { temperature: "" }),
    }));
  const openSiEdit = (item: any) => {
    setSiEditId(item.id);
    setSiForm({
      sNo:               String(item.s_no ?? ''),
      noOfPcs:           String(item.no_of_pcs ?? ''),
      packType:          item.pack_type ?? '',
      noOfPallet:        String(item.no_of_pallet ?? ''),
      gWeight:           item.g_weight ?? '',
      gWeightUnit:       item.g_weight_unit ?? 'Kg',
      vWeight:           item.v_weight ?? '',
      vWeightUnit:       item.v_weight_unit ?? 'CBM',
      nWeight:           item.n_weight ?? '',
      nWeightUnit:       item.n_weight_unit ?? 'Kg',
      volume:            item.volume ?? '',
      chargeableUnit:    item.chargeable_unit ?? '',
      commodityType:     item.commodity_type ?? '',
      commodityCode:     item.commodity_code ?? '',
      commodityDesc:     item.commodity_desc ?? '',
      unNo:              '',
      unNoEnabled:       false,
      dgClass:           '',
      dgClassEnabled:    false,
      oversizedEnabled:  false,
      dimension:         '',
      frozenEnabled:     false,
      temperature:       '',
      manifestSeal:      item.manifest_seal ?? '',
      actualLinerSeal:   item.actual_liner_seal ?? '',
      customSeal:        item.custom_seal ?? '',
      exciseSealNo:      item.excise_seal_no ?? '',
      sealDate:          item.seal_date ? toApiDate(item.seal_date) : '',
      sealTypeIndicator: item.seal_type_indicator ?? '',
      sealDeviceId:      item.seal_device_id ?? '',
      movementDocType:   item.movement_doc_type ?? '',
      movementDocNo:     item.movement_doc_no ?? '',
      notes:             item.notes ?? '',
      roroYear:          item.roro_year ?? '',
      roroBrand:         item.roro_brand ?? '',
      roroModel:         item.roro_model ?? '',
      roroSpecification: item.roro_specification ?? '',
      roroChasisNo:      item.roro_chasis_no ?? '',
      roroEngineNo:      item.roro_engine_no ?? '',
    });
    setSiOpen(true);
  };
  const closeSiModal = () => {
    setSiOpen(false);
    setSiForm(initSi);
    setSiEditId(null);
    setSiErrors({});
  };
  const saveSi = async () => {
    const errs: { gWeight?: string; vWeight?: string; nWeight?: string; noOfPcs?: string } = {};
    if (siForm.noOfPcs !== '' && (isNaN(Number(siForm.noOfPcs)) || Number(siForm.noOfPcs) < 0))
      errs.noOfPcs = 'Enter a valid positive number.';
    if (siForm.gWeight !== '' && (isNaN(Number(siForm.gWeight)) || Number(siForm.gWeight) < 0))
      errs.gWeight = 'Enter a valid positive number.';
    if (siForm.vWeight !== '' && (isNaN(Number(siForm.vWeight)) || Number(siForm.vWeight) < 0))
      errs.vWeight = 'Enter a valid positive number.';
    if (siForm.nWeight !== '' && (isNaN(Number(siForm.nWeight)) || Number(siForm.nWeight) < 0))
      errs.nWeight = 'Enter a valid positive number.';
    if (Object.keys(errs).length) { setSiErrors(errs); return; }
    setSiSaving(true);
    try {
      const payload: Record<string, unknown> = {
        operation_id:       Number(id),
        s_no:               siForm.sNo !== '' ? Number(siForm.sNo) : null,
        no_of_pcs:          siForm.noOfPcs !== '' ? Number(siForm.noOfPcs) : null,
        pack_type:          siForm.packType || null,
        no_of_pallet:       siForm.noOfPallet !== '' ? Number(siForm.noOfPallet) : null,
        g_weight:           siForm.gWeight !== '' ? Number(siForm.gWeight) : null,
        g_weight_unit:      siForm.gWeightUnit || null,
        v_weight:           siForm.vWeight !== '' ? Number(siForm.vWeight) : null,
        v_weight_unit:      siForm.vWeightUnit || null,
        n_weight:           siForm.nWeight !== '' ? Number(siForm.nWeight) : null,
        n_weight_unit:      siForm.nWeightUnit || null,
        volume:             siForm.volume !== '' ? Number(siForm.volume) : null,
        chargeable_unit:    siForm.chargeableUnit || null,
        commodity_type:     siForm.commodityType || null,
        commodity_code:     siForm.commodityCode || null,
        commodity_desc:     siForm.commodityDesc || null,
        manifest_seal:      siForm.manifestSeal || null,
        actual_liner_seal:  siForm.actualLinerSeal || null,
        custom_seal:        siForm.customSeal || null,
        excise_seal_no:     siForm.exciseSealNo || null,
        seal_date:          siForm.sealDate || null,
        seal_type_indicator: siForm.sealTypeIndicator || null,
        seal_device_id:     siForm.sealDeviceId || null,
        movement_doc_type:  siForm.movementDocType || null,
        movement_doc_no:    siForm.movementDocNo || null,
        notes:              siForm.notes || null,
        roro_year:          siForm.roroYear || null,
        roro_brand:         siForm.roroBrand || null,
        roro_model:         siForm.roroModel || null,
        roro_specification: siForm.roroSpecification || null,
        roro_chasis_no:     siForm.roroChasisNo || null,
        roro_engine_no:     siForm.roroEngineNo || null,
        status:             1,
      };
      if (siEditId) {
        await updateCargoDetailApi(siEditId, payload);
        toast({ title: 'Success', description: 'Cargo detail updated successfully.', variant: 'success' });
      } else {
        await createCargoDetailApi(payload);
        toast({ title: 'Success', description: 'Cargo detail created successfully.', variant: 'success' });
      }
      closeSiModal();
      setSiErrors({});
      loadCargoDetails();
    } catch {
      toast({ title: 'Error', description: 'Failed to save cargo detail.', variant: 'destructive' });
    } finally {
      setSiSaving(false);
    }
  };
  const handleSiDelete = async () => {
    if (siDeleteId === null) return;
    try {
      await deleteCargoDetailApi(siDeleteId);
      toast({ title: 'Success', description: 'Cargo detail deleted successfully.', variant: 'success' });
      setSiDeleteId(null);
      loadCargoDetails();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete cargo detail.', variant: 'destructive' });
    }
  };

  // Shipping Bill CRUD
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
    containerNo: "",
    containerType: "",
  };
  const [sbForm, setSbForm] = useState(initSb);
  const [sbErrors, setSbErrors] = useState<Partial<Record<keyof typeof initSb, string>>>({});
  const [sbRows, setSbRows] = useState<any[]>([]);
  const [sbLoading, setSbLoading] = useState(false);
  const [sbSaving, setSbSaving] = useState(false);
  const [sbEditId, setSbEditId] = useState<number | null>(null);
  const [sbDeleteId, setSbDeleteId] = useState<number | null>(null);

  const toApiDate = (d?: string | null): string => {
    if (!d) return '';
    const m = d.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    return m ? `${m[3]}-${m[2]}-${m[1]}` : d;
  };

  const loadShippingBills = async () => {
    if (!id) return;
    setSbLoading(true);
    try {
      const res = await getShippingBillsApi(Number(id));
      setSbRows(res.data?.data ?? []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load shipping bills.', variant: 'destructive' });
    } finally { setSbLoading(false); }
  };

  const sbChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSbForm((prev) => ({ ...prev, [name]: value }));
    if (sbErrors[name as keyof typeof initSb]) setSbErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const openSbCreate = () => {
    setSbEditId(null);
    setSbForm(initSb);
    setSbErrors({});
    setSbOpen(true);
  };

  const openSbEdit = (row: any) => {
    setSbEditId(row.id);
    setSbForm({
      shippingBillNo:   row.shipping_bill_no ?? '',
      shippingBillDate: row.shipping_bill_date ? toApiDate(row.shipping_bill_date) : '',
      mateReceiptNo:    row.mate_receipt_no ?? '',
      mateReceiptDate:  row.mate_receipt_date ? toApiDate(row.mate_receipt_date) : '',
      noOfPcs:          row.no_of_pcs != null ? String(row.no_of_pcs) : '',
      packType:         row.pack_type ?? '',
      grossWeight:      row.gross_weight ?? '',
      measurement:      row.measurement ?? '',
      volume:           row.volume ?? '',
      commodityCode:    row.commodity_code ?? '',
      commodityType:    row.commodity_type ?? '',
      commodityDesc:    row.commodity_desc ?? '',
      note:             row.note ?? '',
      containerNo:      row.container_no ?? '',
      containerType:    row.container_type ?? '',
    });
    setSbErrors({});
    setSbOpen(true);
  };

  const closeSbModal = () => {
    setSbOpen(false);
    setSbForm(initSb);
    setSbErrors({});
    setSbEditId(null);
  };

  const saveSb = async () => {
    const errs: Partial<Record<keyof typeof initSb, string>> = {};
    if (!sbForm.shippingBillNo.trim()) errs.shippingBillNo = 'Shipping Bill No is required.';
    if (!sbForm.shippingBillDate)      errs.shippingBillDate = 'Shipping Bill Date is required.';
    if (sbForm.noOfPcs !== '' && (isNaN(Number(sbForm.noOfPcs)) || Number(sbForm.noOfPcs) < 0)) errs.noOfPcs = 'Enter a valid positive number.';
    if (sbForm.grossWeight !== '' && (isNaN(Number(sbForm.grossWeight)) || Number(sbForm.grossWeight) < 0)) errs.grossWeight = 'Enter a valid positive number.';
    if (sbForm.volume !== '' && (isNaN(Number(sbForm.volume)) || Number(sbForm.volume) < 0)) errs.volume = 'Enter a valid positive number.';
    if (!sbForm.commodityType.trim())  errs.commodityType = 'Commodity Type is required.';
    if (!sbForm.containerType)         errs.containerType = 'Container Type is required.';
    if (Object.keys(errs).length) { setSbErrors(errs); return; }
    setSbSaving(true);
    try {
      const payload: Record<string, unknown> = {
        operation_id:       Number(id),
        shipping_bill_no:   sbForm.shippingBillNo,
        shipping_bill_date: sbForm.shippingBillDate || null,
        mate_receipt_no:    sbForm.mateReceiptNo || null,
        mate_receipt_date:  sbForm.mateReceiptDate || null,
        no_of_pcs:          sbForm.noOfPcs !== '' ? Number(sbForm.noOfPcs) : null,
        pack_type:          sbForm.packType || null,
        gross_weight:       sbForm.grossWeight !== '' ? String(sbForm.grossWeight) : null,
        measurement:        sbForm.measurement || null,
        volume:             sbForm.volume !== '' ? String(sbForm.volume) : null,
        commodity_code:     sbForm.commodityCode || null,
        commodity_type:     sbForm.commodityType || null,
        commodity_desc:     sbForm.commodityDesc || null,
        note:               sbForm.note || null,
        container_no:       sbForm.containerNo || null,
        container_type:     sbForm.containerType || null,
        status:             1,
      };
      if (sbEditId) {
        await updateShippingBillApi(sbEditId, payload);
        toast({ title: 'Success', description: 'Shipping bill updated successfully.', variant: 'success' });
      } else {
        await createShippingBillApi(payload);
        toast({ title: 'Success', description: 'Shipping bill created successfully.', variant: 'success' });
      }
      closeSbModal();
      loadShippingBills();
    } catch {
      toast({ title: 'Error', description: 'Failed to save shipping bill.', variant: 'destructive' });
    } finally { setSbSaving(false); }
  };

  const handleSbDelete = async () => {
    if (sbDeleteId === null) return;
    try {
      await deleteShippingBillApi(sbDeleteId);
      toast({ title: 'Success', description: 'Shipping bill deleted successfully.', variant: 'success' });
      setSbDeleteId(null);
      loadShippingBills();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete shipping bill.', variant: 'destructive' });
    }
  };

  // House Job CRUD
  const [houseOpen, setHouseOpen] = useState(false);
  const [houseList, setHouseList] = useState<any[]>([]);
  const [houseLoading, setHouseLoading] = useState(false);
  const [houseSaving, setHouseSaving] = useState(false);
  const [houseEditId, setHouseEditId] = useState<number | null>(null);
  const [houseDeleteId, setHouseDeleteId] = useState<number | null>(null);

  const HOUSE_INCO_TERMS = ["EXW", "FCA", "CPT", "CIP", "DAP", "DPU", "DDP", "FAS", "FOB", "CFR", "CIF"];
  const HOUSE_FREIGHT_TERMS = ["Collect", "Prepaid"];
  const initHouse = {
    placeOfReceipt: "", placeOfDelivery: "", incoTerm: "",
    hawbNo: "", hawbDate: "", hawbMarkNo: "", freightTerm: "Collect", notes: "",
    customer: "", customer_id: "", customerAddress: "", shipper: "", shipperAddress: "",
    consignee: "", consigneeAddress: "", notify1: "", notify1Address: "", notify2: "", notify2Address: "",
  };
  const [houseForm, setHouseForm] = useState(initHouse);
  const [houseErrors, setHouseErrors] = useState<Partial<Record<keyof typeof initHouse, string>>>({});
  const [houseCompanies, setHouseCompanies] = useState<{ id: number; name: string }[]>([]);
  const [houseCompaniesLoading, setHouseCompaniesLoading] = useState(false);
  const [houseAddresses, setHouseAddresses] = useState<{ id: number; label: string; address: string }[]>([]);
  const [houseAddressesLoading, setHouseAddressesLoading] = useState(false);
  const [shipperAddresses, setShipperAddresses] = useState<{ id: number; label: string; address: string }[]>([]);
  const [consigneeAddresses, setConsigneeAddresses] = useState<{ id: number; label: string; address: string }[]>([]);
  const [notify1Addresses, setNotify1Addresses] = useState<{ id: number; label: string; address: string }[]>([]);
  const [notify2Addresses, setNotify2Addresses] = useState<{ id: number; label: string; address: string }[]>([]);

  const fetchEntityAddresses = async (companyId: number, setAddresses: React.Dispatch<React.SetStateAction<any[]>>) => {
    setAddresses([]);
    if (!companyId) return;
    try {
      const res = await getMasterCompanyAddressesApi(companyId);
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setAddresses(raw.map((r: any) => ({
        id: r.id,
        label: [r.address_type, r.city, r.address].filter(Boolean).join(' - '),
        address: [r.address, r.city, r.state, r.country].filter(Boolean).join(', '),
      })));
    } catch {
      setAddresses([]);
    }
  };

  const loadHouseCompanies = async () => {
    if (houseCompanies.length > 0) return;
    setHouseCompaniesLoading(true);
    try {
      const res = await getMasterCompaniesApi();
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setHouseCompanies(raw.filter((c: any) => c.status === 1 || c.status === '1' || c.status === 'active').map((c: any) => ({ id: c.id, name: c.name })));
    } catch {
      toast({ title: 'Error', description: 'Failed to load companies.', variant: 'destructive' });
    } finally {
      setHouseCompaniesLoading(false);
    }
  };

  const loadHouseAddresses = async (companyId: number) => {
    setHouseAddressesLoading(true);
    setHouseAddresses([]);
    try {
      const res = await getMasterCompanyAddressesApi(companyId);
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setHouseAddresses(raw.map((r: any) => ({
        id: r.id,
        label: [r.address_type, r.city, r.address].filter(Boolean).join(' - '),
        address: [r.address, r.city, r.state, r.country].filter(Boolean).join(', '),
      })));
    } catch {
      setHouseAddresses([]);
    } finally {
      setHouseAddressesLoading(false);
    }
  };

  const loadHouseJobs = async () => {
    if (!id) return;
    setHouseLoading(true);
    try {
      const res = await getHouseJobsApi(Number(id));
      setHouseList(res.data?.data ?? []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load house jobs.', variant: 'destructive' });
    } finally { setHouseLoading(false); }
  };

  const houseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHouseForm((prev) => ({ ...prev, [name]: value }));
    if (houseErrors[name as keyof typeof initHouse]) setHouseErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const openHouseCreate = () => {
    setHouseEditId(null);
    setHouseForm(initHouse);
    setHouseErrors({});
    setHouseAddresses([]);
    setShipperAddresses([]);
    setConsigneeAddresses([]);
    setNotify1Addresses([]);
    setNotify2Addresses([]);
    loadHouseCompanies();
    setHouseOpen(true);
  };

  const openHouseEdit = (row: any) => {
    setHouseEditId(row.id);
    loadHouseCompanies();
    const customerId = row.customer_id ? String(row.customer_id) : '';
    if (customerId) loadHouseAddresses(Number(customerId));
    else setHouseAddresses([]);
    setShipperAddresses([]);
    setConsigneeAddresses([]);
    setNotify1Addresses([]);
    setNotify2Addresses([]);
    setHouseForm({
      placeOfReceipt:  row.place_of_receipt ?? '',
      placeOfDelivery: row.place_of_delivery ?? '',
      incoTerm:        row.inco_term ?? '',
      hawbNo:          row.hawb_no ?? '',
      hawbDate:        row.hawb_date ? toApiDate(row.hawb_date) : '',
      hawbMarkNo:      row.hawb_mark_no ?? '',
      freightTerm:     row.freight_term ?? 'Collect',
      notes:           row.notes ?? '',
      customer:        row.customer ?? '',
      customer_id:     customerId,
      customerAddress: row.customer_address ?? '',
      shipper:         row.shipper ?? '',
      shipperAddress:  row.shipper_address ?? '',
      consignee:       row.consignee ?? '',
      consigneeAddress: row.consignee_address ?? '',
      notify1:         row.notify1 ?? '',
      notify1Address:  row.notify1_address ?? '',
      notify2:         row.notify2 ?? '',
      notify2Address:  row.notify2_address ?? '',
    });
    setHouseErrors({});
    setHouseOpen(true);
  };

  const closeHouseModal = () => {
    setHouseOpen(false);
    setHouseForm(initHouse);
    setHouseErrors({});
    setHouseEditId(null);
  };

  const saveHouse = async () => {
    const errs: Partial<Record<keyof typeof initHouse, string>> = {};
    if (!houseForm.placeOfReceipt.trim()) errs.placeOfReceipt = 'Place of Receipt is required.';
    if (!houseForm.placeOfDelivery.trim()) errs.placeOfDelivery = 'Place of Delivery is required.';
    if (!houseForm.incoTerm) errs.incoTerm = 'INCO Term is required.';

    if (Object.keys(errs).length) { setHouseErrors(errs); return; }
    setHouseSaving(true);
    try {
      const payload: Record<string, unknown> = {
        operation_id:     Number(id),
        place_of_receipt: houseForm.placeOfReceipt,
        place_of_delivery: houseForm.placeOfDelivery,
        inco_term:        houseForm.incoTerm,
        hawb_no:          houseForm.hawbNo || null,
        hawb_date:        houseForm.hawbDate || null,
        hawb_mark_no:     houseForm.hawbMarkNo || null,
        freight_term:     houseForm.freightTerm || null,
        notes:            houseForm.notes || null,
        customer_id:      Number(houseForm.customer_id),
        customer:         houseForm.customer,
        customer_address: houseForm.customerAddress || null,
        shipper:          houseForm.shipper || null,
        shipper_address:  houseForm.shipperAddress || null,
        consignee:        houseForm.consignee || null,
        consignee_address: houseForm.consigneeAddress || null,
        notify1:          houseForm.notify1 || null,
        notify1_address:  houseForm.notify1Address || null,
        notify2:          houseForm.notify2 || null,
        notify2_address:  houseForm.notify2Address || null,
        status:           1,
      };
      if (houseEditId) {
        await updateHouseJobApi(houseEditId, payload);
        toast({ title: 'Success', description: 'House job updated successfully.', variant: 'success' });
      } else {
        await createHouseJobApi(payload);
        toast({ title: 'Success', description: 'House job created successfully.', variant: 'success' });
      }
      closeHouseModal();
      loadHouseJobs();
    } catch {
      toast({ title: 'Error', description: 'Failed to save house job.', variant: 'destructive' });
    } finally { setHouseSaving(false); }
  };

  const handleHouseDelete = async () => {
    if (houseDeleteId === null) return;
    try {
      await deleteHouseJobApi(houseDeleteId);
      toast({ title: 'Success', description: 'House job deleted successfully.', variant: 'success' });
      setHouseDeleteId(null);
      loadHouseJobs();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete house job.', variant: 'destructive' });
    }
  };

  // Routing CRUD
  const [routingOpen, setRoutingOpen] = useState(false);
  const [routingList, setRoutingList] = useState<any[]>([]);
  const [routingLoading, setRoutingLoading] = useState(false);
  const [routingSaving, setRoutingSaving] = useState(false);
  const [routingEditId, setRoutingEditId] = useState<number | null>(null);
  const [routingDeleteId, setRoutingDeleteId] = useState<number | null>(null);
  const [portOptions, setPortOptions] = useState<{ code: string; name: string }[]>([]);
  useEffect(() => {
    getMasterPortsApi(1, 9999)
      .then(res => {
        const raw: any[] = res.data?.data ?? res.data ?? [];
        setPortOptions(raw.map((p: any) => ({ code: p.code, name: p.name })));
      })
      .catch(() => {});
  }, []);
  const POSITION_OPTIONS_ROUTING = ["Opened", "Closed", "Pending"];
  const STATUS_OPTIONS_ROUTING = ["Planned", "Confirmed", "Departed", "Arrived", "Cancelled"];
  const initRouting = {
    sNo: "10",
    fromPortCode: "",
    fromPortName: "",
    fromTerminalId: "",
    fromEtd: "",
    fromAtd: "",
    toPortCode: "",
    toPortName: "",
    toTerminalId: "",
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
  const [routingErrors, setRoutingErrors] = useState<{ fromPortCode?: string; toPortCode?: string }>({});
  const [fromTerminals, setFromTerminals] = useState<{ id: number; name: string }[]>([]);
  const [toTerminals, setToTerminals] = useState<{ id: number; name: string }[]>([]);
  const [fromTerminalsLoading, setFromTerminalsLoading] = useState(false);
  const [toTerminalsLoading, setToTerminalsLoading] = useState(false);

  const loadRoutings = async () => {
    if (!id) return;
    setRoutingLoading(true);
    try {
      const res = await getRoutingsApi(Number(id));
      setRoutingList(res.data?.data ?? []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load routing records.', variant: 'destructive' });
    } finally { setRoutingLoading(false); }
  };

  const loadFromTerminals = async (portId: number, matchName?: string) => {
    setFromTerminalsLoading(true);
    setFromTerminals([]);
    try {
      const res = await getMasterPortTerminalsApi(portId);
      const raw: any[] = res.data?.data ?? res.data ?? [];
      const mapped = raw.map((t: any) => ({ id: t.id, name: t.name }));
      setFromTerminals(mapped);
      if (matchName) {
        const match = mapped.find(t => t.name === matchName);
        if (match) setRoutingForm(prev => ({ ...prev, fromTerminalId: String(match.id) }));
      }
    } catch {
      setFromTerminals([]);
    } finally {
      setFromTerminalsLoading(false);
    }
  };

  const loadToTerminals = async (portId: number, matchName?: string) => {
    setToTerminalsLoading(true);
    setToTerminals([]);
    try {
      const res = await getMasterPortTerminalsApi(portId);
      const raw: any[] = res.data?.data ?? res.data ?? [];
      const mapped = raw.map((t: any) => ({ id: t.id, name: t.name }));
      setToTerminals(mapped);
      if (matchName) {
        const match = mapped.find(t => t.name === matchName);
        if (match) setRoutingForm(prev => ({ ...prev, toTerminalId: String(match.id) }));
      }
    } catch {
      setToTerminals([]);
    } finally {
      setToTerminalsLoading(false);
    }
  };

  const openRoutingCreate = () => {
    setRoutingEditId(null);
    const nextSno = routingList.length > 0
      ? Math.max(...routingList.map((r: any) => Number(r.s_no) || 0)) + 10
      : 10;
    setRoutingForm({ ...initRouting, sNo: String(nextSno) });
    setRoutingErrors({});
    setFromTerminals([]);
    setToTerminals([]);
    setRoutingOpen(true);
  };

  const openRoutingEdit = (row: any) => {
    setRoutingEditId(row.id);
    setRoutingForm({
      sNo:             String(row.s_no ?? '10'),
      fromPortCode:    row.from_port_code ?? '',
      fromPortName:    row.from_port_name ?? '',
      fromTerminalId:  row.from_terminal_id ? String(row.from_terminal_id) : '',
      fromEtd:         row.from_etd ? toApiDate(row.from_etd) : '',
      fromAtd:         row.from_atd ? toApiDate(row.from_atd) : '',
      toPortCode:      row.to_port_code ?? '',
      toPortName:      row.to_port_name ?? '',
      toTerminalId:    row.to_terminal_id ? String(row.to_terminal_id) : '',
      position:        row.position ?? 'Opened',
      toEta:           row.to_eta ? toApiDate(row.to_eta) : '',
      toAta:           row.to_ata ? toApiDate(row.to_ata) : '',
      airlineCode:     row.airline_code ?? '',
      flightName:      row.flight_name ?? '',
      status:          row.status ?? 'Planned',
      fromEtdFollowup: row.from_etd_followup ? 'Yes' : 'No',
      notes:           row.notes ?? '',
    });
    // Pre-load terminals for existing port selections
    const fromPort = portOptions.find(p => p.code === (row.from_port_code ?? ''));
    const toPort = portOptions.find(p => p.code === (row.to_port_code ?? ''));
    if (fromPort) {
      getMasterPortsApi(1, 9999).then(res => {
        const raw: any[] = res.data?.data ?? res.data ?? [];
        const port = raw.find((p: any) => p.code === row.from_port_code);
        if (port) loadFromTerminals(port.id, row.from_terminal);
      }).catch(() => {});
    } else {
      setFromTerminals([]);
    }
    if (toPort) {
      getMasterPortsApi(1, 9999).then(res => {
        const raw: any[] = res.data?.data ?? res.data ?? [];
        const port = raw.find((p: any) => p.code === row.to_port_code);
        if (port) loadToTerminals(port.id, row.to_terminal);
      }).catch(() => {});
    } else {
      setToTerminals([]);
    }
    setRoutingErrors({});
    setRoutingOpen(true);
  };

  const closeRoutingModal = () => {
    setRoutingOpen(false);
    setRoutingForm(initRouting);
    setRoutingErrors({});
    setRoutingEditId(null);
  };

  const routingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRoutingForm((prev) => ({ ...prev, [name]: value }));
    if (routingErrors[name as keyof typeof routingErrors]) setRoutingErrors(prev => ({ ...prev, [name]: '' }));
    
    // Handle port changes to load terminals
    if (name === 'fromPortCode') {
      setRoutingForm(prev => ({ ...prev, fromTerminalId: '' }));
      setFromTerminals([]);
      if (value) {
        getMasterPortsApi(1, 9999).then(res => {
          const raw: any[] = res.data?.data ?? res.data ?? [];
          const port = raw.find((p: any) => p.code === value);
          if (port) loadFromTerminals(port.id);
        }).catch(() => {});
      }
    }
    if (name === 'toPortCode') {
      setRoutingForm(prev => ({ ...prev, toTerminalId: '' }));
      setToTerminals([]);
      if (value) {
        getMasterPortsApi(1, 9999).then(res => {
          const raw: any[] = res.data?.data ?? res.data ?? [];
          const port = raw.find((p: any) => p.code === value);
          if (port) loadToTerminals(port.id);
        }).catch(() => {});
      }
    }
  };

  const saveRouting = async () => {
    const errs: { fromPortCode?: string; toPortCode?: string } = {};
    if (!routingForm.fromPortCode) errs.fromPortCode = 'From Port Code is required.';
    if (!routingForm.toPortCode)   errs.toPortCode   = 'To Port Code is required.';
    if (Object.keys(errs).length) { setRoutingErrors(errs); return; }
    setRoutingSaving(true);
    try {
      const payload: Record<string, unknown> = {
        operation_id:     Number(id),
        s_no:             routingForm.sNo !== '' ? Number(routingForm.sNo) : null,
        from_port_code:   routingForm.fromPortCode,
        from_port_name:   routingForm.fromPortName || null,
        from_terminal:    fromTerminals.find(t => String(t.id) === String(routingForm.fromTerminalId))?.name || null,
        from_terminal_id: routingForm.fromTerminalId ? Number(routingForm.fromTerminalId) : null,
        from_etd:         routingForm.fromEtd || null,
        from_atd:         routingForm.fromAtd || null,
        to_port_code:     routingForm.toPortCode,
        to_port_name:     routingForm.toPortName || null,
        to_terminal:      toTerminals.find(t => String(t.id) === String(routingForm.toTerminalId))?.name || null,
        to_terminal_id:   routingForm.toTerminalId ? Number(routingForm.toTerminalId) : null,
        position:         routingForm.position || null,
        to_eta:           routingForm.toEta || null,
        to_ata:           routingForm.toAta || null,
        airline_code:     routingForm.airlineCode || null,
        flight_name:      routingForm.flightName || null,
        status:           routingForm.status || null,
        from_etd_followup: routingForm.fromEtdFollowup === 'Yes' ? 1 : 0,
        notes:            routingForm.notes || null,
      };
      if (routingEditId) {
        await updateRoutingApi(routingEditId, payload);
        toast({ title: 'Success', description: 'Routing updated successfully.', variant: 'success' });
      } else {
        await createRoutingApi(payload);
        toast({ title: 'Success', description: 'Routing created successfully.', variant: 'success' });
      }
      closeRoutingModal();
      loadRoutings();
    } catch {
      toast({ title: 'Error', description: 'Failed to save routing record.', variant: 'destructive' });
    } finally { setRoutingSaving(false); }
  };

  const handleRoutingDelete = async () => {
    if (routingDeleteId === null) return;
    try {
      await deleteRoutingApi(routingDeleteId);
      toast({ title: 'Success', description: 'Routing deleted successfully.', variant: 'success' });
      setRoutingDeleteId(null);
      loadRoutings();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete routing record.', variant: 'destructive' });
    }
  };

  // Profit Share CRUD
  const [isProfitShareOpen, setIsProfitShareOpen] = useState(false);
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
  const [profitList, setProfitList] = useState<any[]>([]);
  const [profitLoading, setProfitLoading] = useState(false);
  const [profitSaving, setProfitSaving] = useState(false);
  const [profitEditId, setProfitEditId] = useState<number | null>(null);
  const [profitDeleteId, setProfitDeleteId] = useState<number | null>(null);

  const loadProfitShares = async () => {
    if (!id) return;
    setProfitLoading(true);
    try {
      const res = await getProfitSharesApi(Number(id));
      setProfitList(res.data?.data ?? []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load profit shares.', variant: 'destructive' });
    } finally { setProfitLoading(false); }
  };

  const profitChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfitForm((prev) => ({ ...prev, [name]: value }));
    if (profitErrors[name as keyof typeof initProfit]) setProfitErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const openProfitCreate = () => {
    setProfitEditId(null);
    setProfitForm(initProfit);
    setProfitErrors({});
    setIsProfitShareOpen(true);
  };

  const openProfitEdit = (row: any) => {
    setProfitEditId(row.id);
    setProfitForm({
      type: row.type ?? '',
      toName: row.to_name ?? '',
      toNameDesc: row.to_name_description ?? '',
      percentage: row.percentage != null ? String(row.percentage) : '',
      profitAmount: row.profit_amount != null ? String(row.profit_amount) : '',
      jobProfit: row.job_profit != null ? String(row.job_profit) : '',
      note: row.note ?? '',
    });
    setProfitErrors({});
    setIsProfitShareOpen(true);
  };

  const saveProfit = async () => {
    const errs: Partial<typeof initProfit> = {};
    if (!profitForm.type) errs.type = "Required";
    if (!profitForm.toName) errs.toName = "Required";
    if (!profitForm.percentage) errs.percentage = "Required";
    else if (isNaN(Number(profitForm.percentage)) || Number(profitForm.percentage) < 0 || Number(profitForm.percentage) > 100)
      errs.percentage = "Enter a valid percentage (0-100)";
    if (!profitForm.profitAmount) errs.profitAmount = "Required";
    else if (isNaN(Number(profitForm.profitAmount)) || Number(profitForm.profitAmount) < 0)
      errs.profitAmount = "Enter a valid amount";
    if (!profitForm.jobProfit) errs.jobProfit = "Required";
    else if (isNaN(Number(profitForm.jobProfit)) || Number(profitForm.jobProfit) < 0)
      errs.jobProfit = "Enter a valid amount";
    
    // Check total percentage doesn't exceed 100%
    if (!errs.percentage) {
      const currentPercentage = Number(profitForm.percentage);
      const totalOthers = profitList
        .filter(p => p.id !== profitEditId)
        .reduce((sum, p) => sum + (Number(p.percentage) || 0), 0);
      if (currentPercentage + totalOthers > 100) {
        errs.percentage = `Total percentage cannot exceed 100%. Current total: ${(currentPercentage + totalOthers).toFixed(2)}%`;
      }
    }

    if (Object.keys(errs).length) { setProfitErrors(errs); return; }
    setProfitSaving(true);
    try {
      const payload = {
        operation_id: Number(id),
        type: profitForm.type,
        to_name: profitForm.toName,
        to_name_description: profitForm.toNameDesc || null,
        percentage: Number(profitForm.percentage),
        profit_amount: Number(profitForm.profitAmount),
        job_profit: Number(profitForm.jobProfit),
        note: profitForm.note || null,
        status: 1,
      };
      if (profitEditId) {
        await updateProfitShareApi(profitEditId, payload);
        toast({ title: 'Success', description: 'Profit share updated.', variant: 'success' });
      } else {
        await createProfitShareApi(payload);
        toast({ title: 'Success', description: 'Profit share added.', variant: 'success' });
      }
      setIsProfitShareOpen(false);
      setProfitForm(initProfit);
      setProfitErrors({});
      setProfitEditId(null);
      loadProfitShares();
    } catch {
      toast({ title: 'Error', description: 'Failed to save profit share.', variant: 'destructive' });
    } finally { setProfitSaving(false); }
  };

  const handleProfitDelete = async () => {
    if (profitDeleteId === null) return;
    try {
      await deleteProfitShareApi(profitDeleteId);
      toast({ title: 'Success', description: 'Profit share deleted.', variant: 'success' });
      setProfitDeleteId(null);
      loadProfitShares();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete profit share.', variant: 'destructive' });
    }
  };

  // Working Team CRUD
  const [isWorkingTeamOpen, setIsWorkingTeamOpen] = useState(false);
  const EMPLOYEE_OPTIONS = ["MANAGEMENT", "SALES TEAM", "OPERATIONS", "ACCOUNTS", "ADMIN"];
  const DEPT_OPTIONS = ["SALES", "OPERATIONS", "ACCOUNTS", "ADMIN", "HR", "IT"];
  const initTeam = { employee: "", department: "", followupRequired: "No", note: "" };
  const [teamForm, setTeamForm] = useState(initTeam);
  const [teamError, setTeamError] = useState("");
  const [teamList, setTeamList] = useState<any[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamSaving, setTeamSaving] = useState(false);
  const [teamEditId, setTeamEditId] = useState<number | null>(null);
  const [teamDeleteId, setTeamDeleteId] = useState<number | null>(null);

  const loadWorkingTeams = async () => {
    if (!id) return;
    setTeamLoading(true);
    try {
      const res = await getWorkingTeamsApi(Number(id));
      setTeamList(res.data?.data ?? []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load working team.', variant: 'destructive' });
    } finally { setTeamLoading(false); }
  };

  const teamChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    setTeamForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'employee') setTeamError('');
  };

  const openTeamCreate = () => {
    setTeamEditId(null);
    setTeamForm(initTeam);
    setTeamError('');
    setIsWorkingTeamOpen(true);
  };

  const openTeamEdit = (row: any) => {
    setTeamEditId(row.id);
    setTeamForm({
      employee: row.employee_id ?? '',
      department: row.department ?? '',
      followupRequired: row.followup_required ?? 'No',
      note: row.note ?? '',
    });
    setTeamError('');
    setIsWorkingTeamOpen(true);
  };

  const saveTeam = async () => {
    if (!teamForm.employee) { setTeamError('Employee is required'); return; }
    setTeamSaving(true);
    try {
      const payload = {
        operation_id: Number(id),
        employee_id: teamForm.employee,
        department: teamForm.department,
        followup_required: teamForm.followupRequired,
        note: teamForm.note,
        status: 1,
      };
      if (teamEditId) {
        await updateWorkingTeamApi(teamEditId, payload);
        toast({ title: 'Success', description: 'Working team member updated.', variant: 'success' });
      } else {
        await createWorkingTeamApi(payload);
        toast({ title: 'Success', description: 'Working team member added.', variant: 'success' });
      }
      setIsWorkingTeamOpen(false);
      setTeamForm(initTeam);
      setTeamError('');
      setTeamEditId(null);
      loadWorkingTeams();
    } catch {
      toast({ title: 'Error', description: 'Failed to save working team member.', variant: 'destructive' });
    } finally { setTeamSaving(false); }
  };

  const handleTeamDelete = async () => {
    if (teamDeleteId === null) return;
    try {
      await deleteWorkingTeamApi(teamDeleteId);
      toast({ title: 'Success', description: 'Working team member deleted.', variant: 'success' });
      setTeamDeleteId(null);
      loadWorkingTeams();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete working team member.', variant: 'destructive' });
    }
  };
  const [slOpen, setSlOpen] = useState(false);
  const SL_EMPTY = {
    customerName: '', categories: '', scacCode: '', address: '',
    pinCode: '', phone: '', mobile: '', emailId: '',
    gstState: '', gstNo: '', panNo: '', country: '',
  };
  const [slForm, setSlForm] = useState(SL_EMPTY);
  const [slErrors, setSlErrors] = useState<Partial<typeof SL_EMPTY>>({});
  const [slEditId, setSlEditId] = useState<number | null>(null);
  const [slList, setSlList] = useState<any[]>([]);
  const [slLoading, setSlLoading] = useState(false);
  const [slSaving, setSlSaving] = useState(false);
  const [slDeleteId, setSlDeleteId] = useState<number | null>(null);

  const loadSubledgers = async () => {
    setSlLoading(true);
    try {
      const res = await getSubledgersApi(Number(id));
      setSlList(res.data?.data ?? res.data ?? []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load parties.', variant: 'destructive' });
    } finally {
      setSlLoading(false);
    }
  };

  const openSlCreate = () => {
    setSlEditId(null);
    setSlForm(SL_EMPTY);
    setSlErrors({});
    setSlOpen(true);
  };

  const openSlEdit = (sl: any) => {
    setSlEditId(sl.id);
    setSlForm({
      customerName: sl.customer_name ?? sl.subledgerName ?? '',
      categories:   sl.categories   ?? (sl.subledgerType ? sl.subledgerType.charAt(0) + sl.subledgerType.slice(1).toLowerCase() : ''),
      scacCode:     sl.scac_code    ?? '',
      address:      sl.address      ?? '',
      pinCode:      sl.pin_code     ?? '',
      phone:        sl.phone        ?? '',
      mobile:       sl.mobile       ?? '',
      emailId:      sl.email_id     ?? sl.email ?? '',
      gstState:     sl.gst_state    ?? '',
      gstNo:        sl.gst_no       ?? '',
      panNo:        sl.pan_no       ?? '',
      country:      sl.country      ?? '',
    });
    setSlErrors({});
    setSlOpen(true);
  };

  const slChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSlForm(prev => ({ ...prev, [name]: value }));
    if (slErrors[name as keyof typeof SL_EMPTY]) setSlErrors(prev => ({ ...prev, [name]: '' }));
  };

  const slSave = async () => {
    const errs: Partial<typeof SL_EMPTY> = {};
    if (!slForm.customerName.trim()) errs.customerName = 'Required';
    if (!slForm.categories)          errs.categories   = 'Required';
    if (!slForm.address.trim())      errs.address      = 'Required';
    if (slForm.emailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(slForm.emailId)) errs.emailId = 'Invalid email address.';
    if (Object.keys(errs).length) { setSlErrors(errs); return; }
    setSlSaving(true);
    try {
      const payload = {
        operation_id:  Number(id),
        customer_name: slForm.customerName,
        categories:    slForm.categories,
        scac_code:     slForm.scacCode,
        address:       slForm.address,
        pin_code:      slForm.pinCode,
        phone:         slForm.phone,
        mobile:        slForm.mobile,
        email_id:      slForm.emailId,
        gst_state:     slForm.gstState,
        gst_no:        slForm.gstNo,
        pan_no:        slForm.panNo,
        country:       slForm.country,
        status:        '1',
      };
      if (slEditId) {
        await updateSubledgerApi(slEditId, payload);
        toast({ title: 'Success', description: 'Party updated successfully.', variant: 'success' });
      } else {
        await createSubledgerApi(payload);
        toast({ title: 'Success', description: 'Party created successfully.', variant: 'success' });
      }
      setSlOpen(false);
      setSlForm(SL_EMPTY);
      setSlErrors({});
      setSlEditId(null);
      loadSubledgers();
    } catch {
      toast({ title: 'Error', description: 'Failed to save party.', variant: 'destructive' });
    } finally {
      setSlSaving(false);
    }
  };

  const handleSlDelete = async () => {
    if (slDeleteId === null) return;
    try {
      await deleteSubledgerApi(slDeleteId);
      toast({ title: 'Success', description: 'Party deleted successfully.', variant: 'success' });
      setSlDeleteId(null);
      loadSubledgers();
    } catch {
      toast({ title: 'Error', description: 'Failed to Delete Party.', variant: 'destructive' });
    }
  };

  const closeSlModal = () => {
    setSlOpen(false);
    setSlForm(SL_EMPTY);
    setSlEditId(null);
    setSlErrors({});
  };

  // Costing CRUD
  const [costOpen, setCostOpen] = useState(false);
  const [costList, setCostList] = useState<any[]>([]);
  const [costLoading, setCostLoading] = useState(false);
  const [costSaving, setCostSaving] = useState(false);
  const [costEditId, setCostEditId] = useState<number | null>(null);
  const [costDeleteId, setCostDeleteId] = useState<number | null>(null);
  const initCost = {
    sNo: "10", charge: "", freightPpCc: "", description: "", unit: "", noOfUnit: "1",
    sacCode: "", note: "", saleOtherTerritory: "No",
    saleCustomer: "", saleDrCr: "Cr (+)", saleCurrency: "INR - INDIAN RUPEE",
    saleExRate: "1", salePerUnit: "", saleCrcyAmount: "", saleLocalAmount: "",
    saleTaxPct: "18", saleTaxableAmount: "", saleNonTaxableAmount: "0",
    saleCgst: "", saleSgst: "", saleIgst: "0", saleTotalTax: "",
    costVendor: "", costDrCr: "Dr (+)", costCurrency: "INR - INDIAN RUPEE",
    costExRate: "1", costPerUnit: "", costCrcyAmount: "", costLocalAmount: "",
    costTaxPct: "18", costTaxableAmount: "", costNonTaxableAmount: "0",
    costCgst: "", costSgst: "", costIgst: "0", costTotalTax: "",
  };
  const [costForm, setCostForm] = useState(initCost);
  const CHARGES = ["Ocean Freight", "Air Freight", "Freight", "Documentation", "Handling", "THC", "BL Fee", "Customs", "Transport", "Other"];
  const UNITS = ["Per BL", "Per KG", "Per CBM", "Per PCS", "Per Container", "Per Shipment", "Per Ton", "KG", "CBM"];
  const CURRENCIES = ["INR - INDIAN RUPEE", "USD - US DOLLAR", "EUR - EURO", "AED - UAE DIRHAM", "GBP - POUND"];
  const TAX_PCTS = ["0", "5", "12", "18", "28"];
  const DR_CR_SALE = ["Cr (+)", "Dr (-)"];
  const DR_CR_COST = ["Dr (+)", "Cr (-)"];
  const [costCustomers, setCostCustomers] = useState<{ id: number; name: string }[]>([]);
  const VENDORS = ["Maersk Line", "TEAMGLOBAL LOGISTICS PVT LTD", "Emirates SkyCargo", "ONE Line"];
  const [costErrors, setCostErrors] = useState<Partial<Record<keyof typeof initCost, string>>>({});
  const calcTax = (form: typeof initCost, prefix: 'sale' | 'cost') => {
    const perUnit   = Number(form[`${prefix}PerUnit`  as keyof typeof initCost]) || 0;
    const exRate    = Number(form[`${prefix}ExRate`   as keyof typeof initCost]) || 1;
    const taxPct    = Number(form[`${prefix}TaxPct`   as keyof typeof initCost]) || 0;
    const currency  = form[`${prefix}Currency` as keyof typeof initCost] as string;
    const noOfUnit  = Number(form.noOfUnit) || 1;
    const isINR     = currency.startsWith('INR');

    const crcyAmt   = perUnit * noOfUnit;
    const localAmt  = crcyAmt * exRate;
    const taxableAmt    = isINR ? localAmt : 0;
    const nonTaxableAmt = isINR ? 0 : localAmt;
    const totalTaxAmt   = (localAmt * taxPct) / 100;
    const cgst = isINR ? totalTaxAmt / 2 : 0;
    const sgst = isINR ? totalTaxAmt / 2 : 0;
    const igst = isINR ? 0 : totalTaxAmt;

    const fmt = (v: number) => v > 0 ? v.toFixed(2) : '';
    return {
      [`${prefix}CrcyAmount`]:      fmt(crcyAmt),
      [`${prefix}LocalAmount`]:     fmt(localAmt),
      [`${prefix}TaxableAmount`]:   fmt(taxableAmt),
      [`${prefix}NonTaxableAmount`]: isINR ? '0' : fmt(nonTaxableAmt),
      [`${prefix}Cgst`]:            fmt(cgst),
      [`${prefix}Sgst`]:            fmt(sgst),
      [`${prefix}Igst`]:            isINR ? '0' : fmt(igst),
      [`${prefix}TotalTax`]:        fmt(totalTaxAmt),
    };
  };

  const costChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCostForm((prev) => {
      const updated = { ...prev, [name]: value };
      const saleFields = ['salePerUnit','saleExRate','saleTaxPct','saleCurrency','noOfUnit'];
      const costFields = ['costPerUnit','costExRate','costTaxPct','costCurrency','noOfUnit'];
      if (saleFields.includes(name)) Object.assign(updated, calcTax(updated, 'sale'));
      if (costFields.includes(name)) Object.assign(updated, calcTax(updated, 'cost'));
      return updated;
    });
    if (costErrors[name as keyof typeof initCost]) setCostErrors(prev => ({ ...prev, [name]: '' }));
  };
  const ci = (name: keyof typeof initCost, cls = "") => {
    const calcFields = ['saleCrcyAmount','saleLocalAmount','saleTaxableAmount','saleNonTaxableAmount','saleCgst','saleSgst','saleIgst','saleTotalTax','costCrcyAmount','costLocalAmount','costTaxableAmount','costNonTaxableAmount','costCgst','costSgst','costIgst','costTotalTax'];
    const isReadOnly = calcFields.includes(name);
    return (
      <div>
        <input name={name} value={costForm[name]} onChange={costChange} readOnly={isReadOnly}
          className={`w-full px-2 py-1 border rounded text-xs ${isReadOnly ? 'bg-muted cursor-not-allowed' : 'bg-background'} ${
            costErrors[name] ? 'border-red-500' : 'border-input'
          } ${cls}`} />
        {costErrors[name] && <p className="text-xs text-red-500 mt-0.5">⚠ {costErrors[name]}</p>}
      </div>
    );
  };
  const cs = (name: keyof typeof initCost, opts: string[], placeholder = "--Select--") => (
    <div>
      <select name={name} value={costForm[name]} onChange={costChange}
        className={`w-full px-2 py-1 border rounded text-xs bg-background ${
          costErrors[name] ? 'border-red-500' : 'border-input'
        }`}>
        {placeholder && <option value="">{placeholder}</option>}
        {opts.map((o) => (<option key={o}>{o}</option>))}
      </select>
      {costErrors[name] && <p className="text-xs text-red-500 mt-0.5">? {costErrors[name]}</p>}
    </div>
  );
  const loadCostings = async () => {
    if (!id) return;
    setCostLoading(true);
    try {
      const res = await getCostingsApi(Number(id));
      const raw = res.data?.data ?? res.data ?? [];
      setCostList(Array.isArray(raw) ? raw : []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load costing records.', variant: 'destructive' });
    } finally { setCostLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'Costing' || activeTab === 'Show All') loadCostings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);
  const loadCostCustomers = async () => {
    if (costCustomers.length > 0) return;
    try {
      const res = await getMasterCompaniesApi();
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setCostCustomers(
        raw
          .filter((c: any) => c.status === 1 || c.status === '1' || c.status === 'active')
          .map((c: any) => ({ id: c.id, name: c.name }))
      );
    } catch { /* silent */ }
  };

  const openCostCreate = () => {
    setCostDeleteId(null);
    setCostEditId(null);
    loadCostCustomers();
    const nextSno = costList.length > 0
      ? Math.max(...costList.map((c: any) => Number(c.id) || 0)) + 1
      : 1;
    setCostForm({ ...initCost, sNo: String(nextSno) });
    setCostOpen(true);
  };
  const openCostEdit = (item: any) => {
    loadCostCustomers();
    setCostEditId(item.id);
    setCostForm({
      sNo: String(item.id ?? '10'), charge: item.charge ?? '', freightPpCc: item.freight_pp_cc ?? '',
      description: item.description ?? '', unit: item.unit ?? '', noOfUnit: item.no_of_unit ?? '1',
      sacCode: item.sac_code ?? '', note: item.note ?? '', saleOtherTerritory: item.sale_other_territory ?? 'No',
      saleCustomer: item.sale_customer ?? '', saleDrCr: item.sale_dr_cr ?? 'Cr (+)',
      saleCurrency: item.sale_currency ?? 'INR - INDIAN RUPEE', saleExRate: item.sale_ex_rate ?? '1',
      salePerUnit: item.sale_per_unit ?? '', saleCrcyAmount: item.sale_crcy_amount ?? '',
      saleLocalAmount: item.sale_local_amount ?? '', saleTaxPct: item.sale_tax_percent != null ? String(item.sale_tax_percent) : '18',
      saleTaxableAmount: item.sale_taxable_amount ?? '', saleNonTaxableAmount: item.sale_non_taxable_amount ?? '',
      saleCgst: item.sale_cgst_amount ?? '', saleSgst: item.sale_sgst_amount ?? '',
      saleIgst: item.sale_igst_amount ?? '', saleTotalTax: item.sale_total_tax_amount ?? '0',
      costVendor: item.cost_vendor ?? '', costDrCr: item.cost_dr_cr ?? 'Dr (+)',
      costCurrency: item.cost_currency ?? 'INR - INDIAN RUPEE', costExRate: item.cost_ex_rate ?? '1',
      costPerUnit: item.cost_per_unit ?? '', costCrcyAmount: item.cost_crcy_amount ?? '',
      costLocalAmount: item.cost_local_amount ?? '', costTaxPct: item.cost_tax_percent != null ? String(item.cost_tax_percent) : '18',
      costTaxableAmount: item.cost_taxable_amount ?? '', costNonTaxableAmount: item.cost_non_taxable_amount ?? '',
      costCgst: item.cost_cgst_amount ?? '', costSgst: item.cost_sgst_amount ?? '',
      costIgst: item.cost_igst_amount ?? '', costTotalTax: item.cost_total_tax_amount ?? '',
    });
    setCostOpen(true);
  };
  const closeCostModal = () => { setCostOpen(false); setCostForm(initCost); setCostEditId(null); setCostErrors({}); };
  const toNum = (v: string) => v !== '' ? Number(v) : null;
  const saveCost = async (keepOpen: boolean) => {
    const errs: Partial<Record<keyof typeof initCost, string>> = {};
    if (!costForm.charge.trim()) errs.charge = 'Charge is required.';
    if (!costForm.freightPpCc.trim()) errs.freightPpCc = 'Freight PP/CC is required.';
    if (!costForm.unit.trim()) errs.unit = 'Unit is required.';
    if (!costForm.sacCode.trim()) errs.sacCode = 'SAC Code is required.';
    if (Object.keys(errs).length) { setCostErrors(errs); return; }
    setCostSaving(true);
    try {
      const payload: Record<string, unknown> = {
        operation_id: Number(id),
        charge: costForm.charge,
        freight_pp_cc: costForm.freightPpCc,
        description: costForm.description || null,
        unit: costForm.unit,
        no_of_unit: toNum(costForm.noOfUnit),
        sac_code: costForm.sacCode,
        note: costForm.note || null,
        sale_other_territory: costForm.saleOtherTerritory || null,
        sale_customer: costForm.saleCustomer || null,
        sale_dr_cr: costForm.saleDrCr || null,
        sale_currency: costForm.saleCurrency || null,
        sale_ex_rate: toNum(costForm.saleExRate),
        sale_per_unit: toNum(costForm.salePerUnit),
        sale_crcy_amount: toNum(costForm.saleCrcyAmount),
        sale_local_amount: toNum(costForm.saleLocalAmount),
        sale_tax_percent: toNum(costForm.saleTaxPct),
        sale_taxable_amount: toNum(costForm.saleTaxableAmount),
        sale_non_taxable_amount: toNum(costForm.saleNonTaxableAmount),
        sale_cgst_amount: toNum(costForm.saleCgst),
        sale_sgst_amount: toNum(costForm.saleSgst),
        sale_igst_amount: toNum(costForm.saleIgst),
        sale_total_tax_amount: toNum(costForm.saleTotalTax),
        cost_vendor: costForm.costVendor || null,
        cost_dr_cr: costForm.costDrCr || null,
        cost_currency: costForm.costCurrency || null,
        cost_ex_rate: toNum(costForm.costExRate),
        cost_per_unit: toNum(costForm.costPerUnit),
        cost_crcy_amount: toNum(costForm.costCrcyAmount),
        cost_local_amount: toNum(costForm.costLocalAmount),
        cost_tax_percent: toNum(costForm.costTaxPct),
        cost_taxable_amount: toNum(costForm.costTaxableAmount),
        cost_non_taxable_amount: toNum(costForm.costNonTaxableAmount),
        cost_cgst_amount: toNum(costForm.costCgst),
        cost_sgst_amount: toNum(costForm.costSgst),
        cost_igst_amount: toNum(costForm.costIgst),
        cost_total_tax_amount: toNum(costForm.costTotalTax),
        status: 1,
      };
      if (costEditId) {
        await updateCostingApi(costEditId, payload);
        toast({ title: 'Success', description: 'Costing updated successfully.', variant: 'success' });
      } else {
        await createCostingApi(payload);
        toast({ title: 'Success', description: 'Costing created successfully.', variant: 'success' });
      }
      if (keepOpen) { setCostEditId(null); setCostErrors({}); setCostForm({ ...initCost, sNo: String(Number(costForm.sNo) + 10) }); }
      else { closeCostModal(); }
      loadCostings();
    } catch {
      toast({ title: 'Error', description: 'Failed to save costing record.', variant: 'destructive' });
    } finally { setCostSaving(false); }
  };
  const handleCostDelete = async () => {
    if (costDeleteId === null) return;
    try {
      await deleteCostingApi(costDeleteId);
      toast({ title: 'Success', description: 'Costing deleted successfully.', variant: 'success' });
      setCostDeleteId(null); loadCostings();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete costing record.', variant: 'destructive' });
    }
  };
  const riderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setRiderForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Convert DD-MM-YYYY (API response) ? YYYY-MM-DD (API request)
  // (toApiDate is defined in the Shipping Bill section above)

  const handleDuplicate = async () => {
    if (!dupCarrier) { setDupCarrierError(true); return; }
    setDupSaving(true);
    try {
      const payload: Record<string, unknown> = {
        document:          op.document          ?? '',
        branch:            op.branch            ?? '',
        job_date:          dupDate,
        freight_pp_cc:     op.freight_pp_cc     ?? '',
        place_of_receipt:  op.place_of_receipt  ?? '',
        place_of_delivery: op.place_of_delivery ?? '',
        pol:               op.pol               ?? '',
        pod:               op.pod               ?? '',
        pol_etd:           toApiDate(op.pol_etd),
        pod_eta:           toApiDate(op.pod_eta),
        flight_name:       op.flight_name       ?? '',
        flight_number:     op.flight_number     ?? '',
        service_type:      op.service_type      ?? '',
        note:              op.note              ?? '',
        customer:          op.customer          ?? '',
        customer_branch:   op.customer_branch   ?? '',
        customer_address:  op.customer_address  ?? '',
        shipper:           op.shipper           ?? '',
        shipper_address:   op.shipper_address   ?? '',
        carrier:           dupCarrier,
        carrier_address:   op.carrier_address   ?? '',
        consignee:         op.consignee         ?? '',
        consignee_address: op.consignee_address ?? '',
        status:            op.status            ?? 1,
      };
      const res = await createOperationApi(payload);
      const newId = res.data?.data?.id ?? res.data?.id;
      toast({ title: 'Duplicated', description: 'Job duplicated successfully.', variant: 'success' });
      refresh();
      setDupOpen(false);
      navigate(`/operations/view/${newId}`);
    } catch {
      toast({ title: 'Error', description: 'Failed to duplicate job.', variant: 'destructive' });
    } finally {
      setDupSaving(false);
    }
  };

  const openDup = () => {
    setDupCarrier(op?.carrier ?? '');
    setDupDate(new Date().toISOString().split('T')[0]);
    setDupCarrierError(false);
    setDupOpen(true);
  };

  if (opLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        <span className="inline-block w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
        Loading operation...
      </div>
    );
  }

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

  const isVessel = ["FCL Import", "FCL Export", "LCL Export", "LCL Import", "Land Export", "Land Import"].includes(op.document ?? '');
  const flightLabel = isVessel ? "Vessel Name" : "Flight Name";
  const numberLabel = ["Land Import", "Land Export"].includes(op.document ?? '') ? "Vessel Number" : isVessel ? "Voyage Number" : "Flight Number";

  const HOUSE_STATIC_CUSTOMERS: { name: string; address: string }[] = [];
  const HOUSE_STATIC_SHIPPERS: { name: string; address: string }[] = [];
  const HOUSE_STATIC_CONSIGNEES: { name: string; address: string }[] = [];
  const HOUSE_STATIC_NOTIFY: { name: string; address: string }[] = [];

  const houseApiOptions = (statics: { name: string }[]) =>
    slList.filter((s: any) => !statics.some(st => st.name === (s.customer_name ?? '')));

  const houseSelectChange =
    (field: keyof typeof initHouse, addressField: keyof typeof initHouse, statics: { name: string; address: string }[]) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      const fromStatic = statics.find(s => s.name === val);
      const fromApi = slList.find((s: any) => (s.customer_name ?? '') === val);
      setHouseForm(prev => ({
        ...prev,
        [field]: val,
        [addressField]: fromApi?.address ?? fromStatic?.address ?? prev[addressField],
      }));
    };

  return (
    <div className="space-y-4">
      {/* Breadcrumb + header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            <button className="hover:underline text-primary" onClick={() => navigate("/operations")}>
              Jobs List
            </button>
            {" � "}
            <span>
              Job No# - ( {op.document || " "} ~ {op.job_date} )
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/operations")}>
            Cancel
          </Button>
          {/* <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-black font-semibold">
            Reports
          </Button> */}
          <Button variant="outline" size="sm" onClick={() => navigate(`/operations/edit/${op.id}`)}>
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/operations/new`)}>
            Create
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border text-sm">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === 'Subledgers') loadSubledgers();
              if (tab === "Dimension's") loadDimensions();
              if (tab === 'Cargo details') loadCargoDetails();
              if (tab === 'Shipping Bill / BOE') loadShippingBills();
              if (tab === "House's List") loadHouseJobs();
              if (tab === 'Others') { loadRoutings(); loadWorkingTeams(); loadProfitShares(); loadStatusUpdates(); }
              if (tab === 'Show All') { loadSubledgers(); loadDimensions(); loadCargoDetails(); loadShippingBills(); loadHouseJobs(); loadRoutings(); loadWorkingTeams(); loadProfitShares(); loadStatusUpdates(); }
            }}
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
                <Field label="Job Status" value={op.status === 1 ? 'Active' : 'Inactive'} />
                <Field label="Place of Receipt" value={op.place_of_receipt} />
                <Field label="POL Name" value={op.pol} />
                <Field label="POL ETD" value={op.pol_etd} />
                <Field label="POD ETA" value={op.pod_eta} />
                <Field label="INCO Term" value="" />
                <Field label={flightLabel} value={op.flight_name} />
                <Field label="Service Type" value={op.service_type} />
                <div className="flex items-center gap-2 py-1.5">
                  <span className="text-sm font-semibold text-foreground w-40 shrink-0">AWB No</span>
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white text-xs h-7 px-3">
                    Gen BL NO#
                  </Button>
                </div>
                <Field label="MAWB No" value={op.note} />
                <Field label="Do No#" value="" />
                <Field label="BL Place of Issue" value="" />
                <Field label="On Board Date" value="" />
                <div className="py-1.5">
                  <span className="text-sm font-semibold text-foreground">Notes</span>
                  <p className="text-sm text-cyan-600 mt-1">{op.note}</p>
                </div>
                <div className="mt-2">
                  <Button
                    size="sm"
                    className="bg-amber-400 hover:bg-amber-500 text-black text-xs font-semibold"
                    onClick={() => { setRiderOpen(true); loadRiderContainers(); }}
                  >
                    Rider Container
                  </Button>
                </div>
              </div>

              {/* Column 2 */}
              <div className="col-span-1 space-y-0">
                <Field label="Job Type" value={op.document} />
                <Field label="PP / CC" value={op.freight_pp_cc} />
                <Field label="Place of Delivery" value={op.place_of_delivery} />
                <Field label="POD Name" value={op.pod} />
                <Field label="POL ATD" value="" />
                <Field label="POD ATA" value="" />
                <Field label="No of BL" value="" />
                <Field label={numberLabel} value={op.flight_number} />
                <Field label="BL Status" value={op.service_type} />
                <Field label="AWB Date" value="" />
                <Field label="MAWB Date" value="" />
                <Field label="Do Date" value="" />
                <Field label="Job Close Date" value="" />
                <Field label="Vessel Status" value="" />
              </div>

              {/* Column 3  Source From and To */}
              <div className="col-span-1">
                <div className="border border-border rounded overflow-hidden">
                  <div className="bg-[#00BCD4] px-4 py-2">
                    <h3 className="text-white font-semibold text-sm">Source From and To</h3>
                  </div>
                  <div className="p-4 space-y-0">
                    <Field label="Quote No" value="" />
                    <Field label="Quote Date" value="" />
                    <Field label="Booking No" value="" />
                    <Field label="Booking Date" value={op.job_date} />
                    <Field label="No of Credit Days" value="" />
                    <Field label="Delivery Status" value="" />
                    <Field label="Delivery Date" value="" />
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
              {/* Row 1: From Job No + New Job Date  same line */}
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-foreground whitespace-nowrap shrink-0">
                    From Job No
                  </label>
                  <Input value={op?.document || ' '} readOnly className="bg-muted text-sm min-w-0" />
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
                    {carrierOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {dupCarrierError && <p className="text-xs text-destructive mt-1">Carrier is required</p>}
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="flex justify-end px-6 pb-5">
              <Button size="sm" variant="outline" onClick={handleDuplicate} disabled={dupSaving} className="px-6">
                {dupSaving ? 'Saving...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rider Container Modal full CRUD */}
      {riderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRiderOpen(false)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-5xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">Rider BL (Container)</h3>
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold" onClick={openRiderCreate}>
                  + Add Container
                </Button>
                <button onClick={() => setRiderOpen(false)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 p-4">
              {riderLoading ? (
                <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
                  <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />Loading...
                </div>
              ) : riderList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <svg className="w-8 h-8 opacity-30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth="2" /><path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" /></svg>
                  <p className="text-sm">No containers found. Click "+ Add Container" to create one.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        {['#', 'Container No', 'Type', 'Pcs', 'Pack Type', 'Pallet', 'Volume', 'G.Weight', 'V.Weight', 'N.Weight', 'Commodity Type', 'Code', 'Manifest Seal', 'Actual Seal', 'Custom Seal', 'Actions'].map(h => (
                          <th key={h} className="px-3 py-2 text-left font-semibold text-foreground whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {riderList.map((row, i) => (
                        <tr key={row.id} className="border-b border-border hover:bg-muted/30">
                          <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                          <td className="px-3 py-2 font-medium whitespace-nowrap">{row.container_no}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.container_type}</td>
                          <td className="px-3 py-2">{row.no_of_pcs}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.pack_type}</td>
                          <td className="px-3 py-2">{row.no_of_pallet}</td>
                          <td className="px-3 py-2">{row.volume}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.gross_weight} {row.gross_weight_measurement}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.volume_weight} {row.volume_weight_measurement}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.net_weight} {row.net_weight_measurement}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{row.commodity_type}</td>
                          <td className="px-3 py-2">{row.commodity_code}</td>
                          <td className="px-3 py-2">{row.manifest_seal}</td>
                          <td className="px-3 py-2">{row.actual_seal}</td>
                          <td className="px-3 py-2">{row.custom_seal}</td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-1">
                              <button className="p-1 hover:bg-green-50 rounded" title="Edit" onClick={() => openRiderEdit(row)}>
                                <Pencil className="w-3.5 h-3.5 text-green-500" />
                              </button>
                              <button className="p-1 hover:bg-red-50 rounded" title="Delete" onClick={() => setRiderDeleteId(row.id)}>
                                <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end px-5 py-3 border-t border-border shrink-0">
              <Button size="sm" variant="outline" onClick={() => setRiderOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Rider Container Form Modal (Create / Edit) */}
      {riderFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRiderFormOpen(false)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">{riderEditing ? 'Edit Container' : 'Add Container'}</h3>
              <button onClick={() => setRiderFormOpen(false)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <div className="overflow-y-auto flex-1 p-5">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">

                {/* Container No */}
                <div className="flex items-center gap-2">
                  <label className="w-32 shrink-0 text-right text-xs font-semibold"><span className="text-destructive mr-1">*</span>Container No</label>
                  <div className="flex-1">
                    <input name="container_no" value={riderForm.container_no} onChange={(e) => { riderChange(e); setRiderContainerNoError(''); }}
                      className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${riderContainerNoError ? 'border-destructive' : 'border-input'}`} />
                    {riderContainerNoError && <p className="text-xs text-destructive mt-0.5">? {riderContainerNoError}</p>}
                  </div>
                </div>

                {/* Container Type */}
                <div className="flex items-center gap-2">
                  <label className="w-32 shrink-0 text-right text-xs font-semibold">Container Type</label>
                  <select name="container_type" value={riderForm.container_type} onChange={riderChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background">
                    <option value="">--Select--</option>
                    {['20GP','40GP','40HC','45HC','20RF','40RF','20OT','40OT','20FR','40FR','40 FLAT COLLAPSIBLE','20 FLAT COLLAPSIBLE','20 FT','40 FT','LCL'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>

                {/* No of PCS */}
                <div className="flex items-center gap-2">
                  <label className="w-32 shrink-0 text-right text-xs font-semibold">No of PCS</label>
                  <input name="no_of_pcs" value={riderForm.no_of_pcs} onChange={riderChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>

                {/* Pack Type */}
                <div className="flex items-center gap-2">
                  <label className="w-32 shrink-0 text-right text-xs font-semibold">Pack Type</label>
                  <select name="pack_type" value={riderForm.pack_type} onChange={riderChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background">
                    <option value="">--Select--</option>
                    {['BALES', 'Boxes', 'Pallets', 'Cartons', 'Bags', 'Drums', 'Crates'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>

                {/* No of Pallet */}
                <div className="flex items-center gap-2">
                  <label className="w-32 shrink-0 text-right text-xs font-semibold">No of Pallet</label>
                  <input name="no_of_pallet" value={riderForm.no_of_pallet} onChange={riderChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <label className="w-32 shrink-0 text-right text-xs font-semibold">Volume</label>
                  <input name="volume" value={riderForm.volume} onChange={riderChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>

                {/* Gross Weight + Measurement */}
                <div className="flex items-center gap-2">
                  <label className="w-32 shrink-0 text-right text-xs font-semibold">Gross Weight</label>
                  <input name="gross_weight" value={riderForm.gross_weight} onChange={riderChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-32 shrink-0 text-right text-xs font-semibold">Measurement</label>
                  <select name="gross_weight_measurement" value={riderForm.gross_weight_measurement} onChange={riderChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background">
                    {['Kg', 'Lbs', 'MT', 'CBM'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>

                {/* Volume Weight + Measurement */}
                <div className="flex items-center gap-2">
                  <label className="w-32 shrink-0 text-right text-xs font-semibold">Volume Weight</label>
                  <input name="volume_weight" value={riderForm.volume_weight} onChange={riderChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-32 shrink-0 text-right text-xs font-semibold">Measurement</label>
                  <select name="volume_weight_measurement" value={riderForm.volume_weight_measurement} onChange={riderChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background">
                    {['Kg', 'Lbs', 'MT', 'CBM'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>

                {/* Net Weight + Measurement */}
                <div className="flex items-center gap-2">
                  <label className="w-32 shrink-0 text-right text-xs font-semibold">Net Weight</label>
                  <input name="net_weight" value={riderForm.net_weight} onChange={riderChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-32 shrink-0 text-right text-xs font-semibold">Measurement</label>
                  <select name="net_weight_measurement" value={riderForm.net_weight_measurement} onChange={riderChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background">
                    {['Kg', 'Lbs', 'MT', 'CBM'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>

                {/* Commodity Type */}
                <div className="flex items-center gap-2">
                  <label className="w-32 shrink-0 text-right text-xs font-semibold">Commodity Type</label>
                  <input name="commodity_type" value={riderForm.commodity_type} onChange={riderChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>

                {/* Commodity Code */}
                <div className="flex items-center gap-2">
                  <label className="w-32 shrink-0 text-right text-xs font-semibold">Commodity Code</label>
                  <input name="commodity_code" value={riderForm.commodity_code} onChange={riderChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>

                {/* Commodity Desc  full width */}
                <div className="col-span-2 flex items-start gap-2">
                  <label className="w-32 shrink-0 text-right text-xs font-semibold pt-1">Commodity Desc</label>
                  <textarea name="commodity_desc" value={riderForm.commodity_desc} onChange={riderChange} rows={3}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y" />
                </div>

                {/* Seals */}
                <div className="flex items-center gap-2">
                  <label className="w-32 shrink-0 text-right text-xs font-semibold">Manifest Seal</label>
                  <input name="manifest_seal" value={riderForm.manifest_seal} onChange={riderChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-32 shrink-0 text-right text-xs font-semibold">Actual Seal</label>
                  <input name="actual_seal" value={riderForm.actual_seal} onChange={riderChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-32 shrink-0 text-right text-xs font-semibold">Custom Seal</label>
                  <input name="custom_seal" value={riderForm.custom_seal} onChange={riderChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>

              </div>
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button size="sm" variant="outline" onClick={() => setRiderFormOpen(false)}>Cancel</Button>
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6" onClick={handleRiderSave} disabled={riderSaving}>
                {riderSaving ? 'Saving...' : riderEditing ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rider Container Delete Confirmation */}
      {riderDeleteId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRiderDeleteId(null)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold text-primary">Delete Container</h3>
              <button onClick={() => setRiderDeleteId(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this container? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3 px-5 py-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setRiderDeleteId(null)}>Cancel</Button>
              <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={handleRiderDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* Subledgers card */}
      {(activeTab === "Party" || activeTab === "Show All") && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-white px-6 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Party</h2>
            <Button
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold"
              onClick={openSlCreate}
            >
              Add New Party
            </Button>
          </div>
          <div className="p-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Party Type",
                    "Party Name",
                    "Address",
                    "Phone",
                    "Mobile",
                    "Email",
                    "Action",
                  ].map((h) => (
                    <th key={h} className="text-left px-3 py-2 font-semibold text-foreground text-xs whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slLoading ? (
                  <tr><td colSpan={7} className="px-3 py-6 text-center text-sm text-muted-foreground">Loading...</td></tr>
                ) : slList.length === 0 ? (
                  <tr><td colSpan={7} className="px-3 py-6 text-center text-sm text-muted-foreground">No parties found.</td></tr>
                ) : slList.map((sl: any) => (
                  <tr key={sl.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{sl.categories?.toUpperCase() ?? ''}</td>
                    <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{sl.customer_name ?? ''}</td>
                    <td className="px-3 py-2 text-xs text-foreground max-w-xs">{sl.address}</td>
                    <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{sl.phone}</td>
                    <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{sl.mobile}</td>
                    <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{sl.email_id ?? sl.email ?? ''}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-green-50 rounded" title="Edit" onClick={() => openSlEdit(sl)}>
                          <Pencil className="w-3.5 h-3.5 text-green-500" />
                        </button>
                        <button className="p-1 hover:bg-red-50 rounded" title="Delete" onClick={() => setSlDeleteId(sl.id)}>
                          <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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

      {/* Dimensions card */}
      {(activeTab === "Dimension's" || activeTab === "Show All") && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-white px-6 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Dimension's</h2>
            <Button size="sm" variant="outline" className="h-7 text-xs px-3 bg-white font-semibold" onClick={openDimCreate}>
              Add Dimension
            </Button>
          </div>
          {dimLoading ? (
            <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
              <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />Loading...
            </div>
          ) : dimList.length === 0 ? (
            <NoData />
          ) : (
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {['S.No#','L W H','Measurement','No of Pcs','Package Type','G.Weight','V.Weight','Net Weight','Volume','COO','Commodity Type','Commodity Code','Notes','Action'].map(h => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dimList.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-3 py-2 text-xs text-foreground">{row.s_no}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{[row.length, row.width, row.height].filter(Boolean).join('  ')}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.lxwxh_measurement}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.no_of_pcs}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.package_type}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{row.g_weight}{row.g_weight && ` ${row.g_weight_unit}`}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{row.v_weight}{row.v_weight && ` ${row.v_weight_unit}`}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{row.net_weight}{row.net_weight && ` ${row.net_weight_unit}`}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.volume}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.coo}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.commodity_type}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.commodity_code}</td>
                      <td className="px-3 py-2 text-xs text-foreground max-w-[120px] truncate">{row.notes}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <button className="p-1 hover:bg-green-50 rounded" title="Edit" onClick={() => openDimEdit(row)}>
                            <Pencil className="w-3.5 h-3.5 text-green-500" />
                          </button>
                          <button className="p-1 hover:bg-red-50 rounded" title="Delete" onClick={() => setDimDeleteId(row.id)}>
                            <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Dimension Form Modal */}
      {dimOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeDimModal} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-4xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">{dimEditId ? 'Edit Dimension' : 'Add Dimension'}</h3>
              <button onClick={closeDimModal} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-5 space-y-4 text-xs">
              <div className="grid grid-cols-4 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">S.No#</label>
                  <input name="sNo" value={dimForm.sNo} readOnly className="w-full px-2 py-1 border border-input rounded text-xs bg-muted cursor-not-allowed" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold"><span className="text-destructive mr-1">*</span>Length</label>
                  <input name="length" value={dimForm.length} onChange={dimChange} placeholder="Enter length" className={`w-full px-2 py-1 border rounded text-xs ${dimErrors.length ? 'border-red-500' : 'border-input'} bg-background`} />
                  {dimErrors.length && <span className="text-red-500 text-xs">{dimErrors.length}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold"><span className="text-destructive mr-1">*</span>Width</label>
                  <input name="width" value={dimForm.width} onChange={dimChange} placeholder="Enter width" className={`w-full px-2 py-1 border rounded text-xs ${dimErrors.width ? 'border-red-500' : 'border-input'} bg-background`} />
                  {dimErrors.width && <span className="text-red-500 text-xs">{dimErrors.width}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold"><span className="text-destructive mr-1">*</span>Height</label>
                  <input name="height" value={dimForm.height} onChange={dimChange} placeholder="Enter height" className={`w-full px-2 py-1 border rounded text-xs ${dimErrors.height ? 'border-red-500' : 'border-input'} bg-background`} />
                  {dimErrors.height && <span className="text-red-500 text-xs">{dimErrors.height}</span>}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">L W H Measurement</label>
                  <input name="lxwxhMeasurement" value={dimForm.lxwxhMeasurement} onChange={dimChange} placeholder="e.g. CM" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">No of Pcs</label>
                  <input name="noOfPcs" value={dimForm.noOfPcs} onChange={dimChange} placeholder="Enter number" className={`w-full px-2 py-1 border rounded text-xs ${dimErrors.noOfPcs ? 'border-red-500' : 'border-input'} bg-background`} />
                  {dimErrors.noOfPcs && <span className="text-red-500 text-xs">{dimErrors.noOfPcs}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Package Type</label>
                  <select name="packageType" value={dimForm.packageType} onChange={dimChange} className="w-full px-2 py-1 border border-input rounded text-xs bg-background">
                    <option value="">--Select--</option>
                    {PACKAGE_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Volume</label>
                  <input name="volume" value={dimForm.volume} onChange={dimChange} placeholder="Enter volume" className={`w-full px-2 py-1 border rounded text-xs ${dimErrors.volume ? 'border-red-500' : 'border-input'} bg-background`} />
                  {dimErrors.volume && <span className="text-red-500 text-xs">{dimErrors.volume}</span>}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">G.Weight</label>
                  <input name="gWeight" value={dimForm.gWeight} onChange={dimChange} placeholder="Enter weight" className={`w-full px-2 py-1 border rounded text-xs ${dimErrors.gWeight ? 'border-red-500' : 'border-input'} bg-background`} />
                  {dimErrors.gWeight && <span className="text-red-500 text-xs">{dimErrors.gWeight}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">G.Weight Unit</label>
                  <select name="gWeightUnit" value={dimForm.gWeightUnit} onChange={dimChange} className="w-full px-2 py-1 border border-input rounded text-xs bg-background">
                    {WEIGHT_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">V.Weight</label>
                  <input name="vWeight" value={dimForm.vWeight} onChange={dimChange} placeholder="Enter weight" className={`w-full px-2 py-1 border rounded text-xs ${dimErrors.vWeight ? 'border-red-500' : 'border-input'} bg-background`} />
                  {dimErrors.vWeight && <span className="text-red-500 text-xs">{dimErrors.vWeight}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">V.Weight Unit</label>
                  <select name="vWeightUnit" value={dimForm.vWeightUnit} onChange={dimChange} className="w-full px-2 py-1 border border-input rounded text-xs bg-background">
                    {WEIGHT_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Net Weight</label>
                  <input name="netWeight" value={dimForm.netWeight} onChange={dimChange} placeholder="Enter weight" className={`w-full px-2 py-1 border rounded text-xs ${dimErrors.netWeight ? 'border-red-500' : 'border-input'} bg-background`} />
                  {dimErrors.netWeight && <span className="text-red-500 text-xs">{dimErrors.netWeight}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Net Weight Unit</label>
                  <select name="netWeightUnit" value={dimForm.netWeightUnit} onChange={dimChange} className="w-full px-2 py-1 border border-input rounded text-xs bg-background">
                    {WEIGHT_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">COO</label>
                  <input name="coo" value={dimForm.coo} onChange={dimChange} placeholder="Country of Origin" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Commodity Type</label>
                  <select name="commodityType" value={dimForm.commodityType} onChange={dimChange} className="w-full px-2 py-1 border border-input rounded text-xs bg-background">
                    <option value="">--Select--</option>
                    {COMMODITY_TYPES.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Commodity Code</label>
                  <input name="commodityCode" value={dimForm.commodityCode} onChange={dimChange} placeholder="Enter code" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="font-semibold">Commodity Description</label>
                  <textarea name="commodityDesc" value={dimForm.commodityDesc} onChange={dimChange} placeholder="Enter description" className="w-full px-2 py-1 border border-input rounded text-xs resize-none bg-background" rows={2} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold">Notes</label>
                <textarea name="notes" value={dimForm.notes} onChange={dimChange} placeholder="Enter notes" className="w-full px-2 py-1 border border-input rounded text-xs resize-none bg-background" rows={2} />
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button size="sm" variant="outline" onClick={closeDimModal}>Cancel</Button>
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6" onClick={saveDim} disabled={dimSaving}>
                {dimSaving ? 'Saving...' : dimEditId ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dimension Delete Confirmation */}
      {dimDeleteId !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDimDeleteId(null)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold text-primary">Delete Dimension</h3>
              <button onClick={() => setDimDeleteId(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this dimension? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3 px-5 py-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setDimDeleteId(null)}>Cancel</Button>
              <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDimDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Instructions card */}
      {(activeTab === "Cargo details" || activeTab === "Show All") && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-white px-6 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Cargo details</h2>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs px-3 bg-white font-semibold"
              onClick={() => {
                setSiEditId(null);
                const nextSno = siRows.length > 0
                  ? Math.max(...siRows.map((r: any) => Number(r.id) || 0)) + 1
                  : 1;
                setSiForm({ ...initSi, sNo: String(nextSno) });
                setSiOpen(true);
              }}
            >
              Add Job Consignment
            </Button>
          </div>
          {siLoading ? (
            <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
              <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />Loading...
            </div>
          ) : siRows.length === 0 ? (
            <NoData />
          ) : (
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "S.No#", "No of PCS", "Pack Type", "No of Pallet",
                      "G.Weight", "V.Weight", "N.Weight", "Volume", "Chargeable Unit",
                      "Commodity Type", "Commodity Code", "Manifest Seal", "Actual/Liner Seal",
                      "Custom Seal", "Excise Seal No", "Seal Date", "Seal Type",
                      "Seal Device ID", "Movement Doc Type", "Movement Doc No", "Notes",
                      "RORO Year", "RORO Brand", "RORO Model", "RORO Chasis No", "RORO Engine No",
                      "Action",
                    ].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {siRows.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-3 py-2 text-xs text-foreground">{row.s_no}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.no_of_pcs}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.pack_type}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.no_of_pallet}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{row.g_weight}{row.g_weight && ` ${row.g_weight_unit}`}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{row.v_weight}{row.v_weight && ` ${row.v_weight_unit}`}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{row.n_weight}{row.n_weight && ` ${row.n_weight_unit}`}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.volume}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.chargeable_unit}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.commodity_type}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.commodity_code}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.manifest_seal}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.actual_liner_seal}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.custom_seal}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.excise_seal_no}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.seal_date}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.seal_type_indicator}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.seal_device_id}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.movement_doc_type}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.movement_doc_no}</td>
                      <td className="px-3 py-2 text-xs text-foreground max-w-[120px] truncate">{row.notes}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.roro_year}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.roro_brand}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.roro_model}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.roro_chasis_no}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.roro_engine_no}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <button className="p-1 hover:bg-green-50 rounded" title="Edit" onClick={() => openSiEdit(row)}>
                            <Pencil className="w-3.5 h-3.5 text-green-500" />
                          </button>
                          <button className="p-1 hover:bg-red-50 rounded" title="Delete" onClick={() => setSiDeleteId(row.id)}>
                            <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Cargo Details Form Modal */}
      {siOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeSiModal} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-5xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">{siEditId ? 'Edit Job Consignment' : 'Add Job Consignment'}</h3>
              <button onClick={closeSiModal} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-5 space-y-4 text-xs">
              {/* Basic Info */}
              <div className="border border-border rounded overflow-hidden">
                <div className="bg-cyan-500 px-3 py-2"><span className="text-white font-semibold text-xs">Basic Information</span></div>
                <div className="p-3 grid grid-cols-5 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">S.No#</label>
                    <input name="sNo" value={siForm.sNo} readOnly className="w-full px-2 py-1 border border-input rounded text-xs bg-muted cursor-not-allowed" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">No of PCS</label>
                    <input name="noOfPcs" value={siForm.noOfPcs} onChange={siChange} placeholder="Enter count" className={`w-full px-2 py-1 border rounded text-xs ${siErrors.noOfPcs ? 'border-red-500' : 'border-input'} bg-background`} />
                    {siErrors.noOfPcs && <span className="text-red-500 text-xs">{siErrors.noOfPcs}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Pack Type</label>
                    <select name="packType" value={siForm.packType} onChange={siChange} className="w-full px-2 py-1 border border-input rounded text-xs bg-background">
                      <option value="">--Select--</option>
                      {PACK_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">No of Pallet</label>
                    <input name="noOfPallet" value={siForm.noOfPallet} onChange={siChange} placeholder="Enter count" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Chargeable Unit</label>
                    <input name="chargeableUnit" value={siForm.chargeableUnit} onChange={siChange} placeholder="Enter unit" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                  </div>
                </div>
              </div>

              {/* Weight Section */}
              <div className="border border-border rounded overflow-hidden">
                <div className="bg-orange-500 px-3 py-2"><span className="text-white font-semibold text-xs">Weight & Dimensions</span></div>
                <div className="p-3 grid grid-cols-4 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">G.Weight</label>
                    <input name="gWeight" value={siForm.gWeight} onChange={siChange} placeholder="Enter weight" className={`w-full px-2 py-1 border rounded text-xs ${siErrors.gWeight ? 'border-red-500' : 'border-input'} bg-background`} />
                    {siErrors.gWeight && <span className="text-red-500 text-xs">{siErrors.gWeight}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">G.Weight Unit</label>
                    <select name="gWeightUnit" value={siForm.gWeightUnit} onChange={siChange} className="w-full px-2 py-1 border border-input rounded text-xs bg-background">
                      {SI_WEIGHT_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">V.Weight</label>
                    <input name="vWeight" value={siForm.vWeight} onChange={siChange} placeholder="Enter weight" className={`w-full px-2 py-1 border rounded text-xs ${siErrors.vWeight ? 'border-red-500' : 'border-input'} bg-background`} />
                    {siErrors.vWeight && <span className="text-red-500 text-xs">{siErrors.vWeight}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">V.Weight Unit</label>
                    <select name="vWeightUnit" value={siForm.vWeightUnit} onChange={siChange} className="w-full px-2 py-1 border border-input rounded text-xs bg-background">
                      {SI_WEIGHT_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">N.Weight</label>
                    <input name="nWeight" value={siForm.nWeight} onChange={siChange} placeholder="Enter weight" className={`w-full px-2 py-1 border rounded text-xs ${siErrors.nWeight ? 'border-red-500' : 'border-input'} bg-background`} />
                    {siErrors.nWeight && <span className="text-red-500 text-xs">{siErrors.nWeight}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">N.Weight Unit</label>
                    <select name="nWeightUnit" value={siForm.nWeightUnit} onChange={siChange} className="w-full px-2 py-1 border border-input rounded text-xs bg-background">
                      {SI_WEIGHT_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="font-semibold">Volume</label>
                    <input name="volume" value={siForm.volume} onChange={siChange} placeholder="Enter volume" className={`w-full px-2 py-1 border rounded text-xs ${siErrors.volume ? 'border-red-500' : 'border-input'} bg-background`} />
                    {siErrors.volume && <span className="text-red-500 text-xs">{siErrors.volume}</span>}
                  </div>
                </div>
              </div>

              {/* Commodity Section */}
              <div className="border border-border rounded overflow-hidden">
                <div className="bg-green-600 px-3 py-2"><span className="text-white font-semibold text-xs">Commodity Details</span></div>
                <div className="p-3 grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Commodity Type</label>
                    <select name="commodityType" value={siForm.commodityType} onChange={siChange} className="w-full px-2 py-1 border border-input rounded text-xs bg-background">
                      <option value="">--Select--</option>
                      {SI_COMMODITY_TYPES.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Commodity Code</label>
                    <input name="commodityCode" value={siForm.commodityCode} onChange={siChange} placeholder="Enter code" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Commodity Description</label>
                    <textarea name="commodityDesc" value={siForm.commodityDesc} onChange={siChange} placeholder="Enter description" className="w-full px-2 py-1 border border-input rounded text-xs resize-none bg-background" rows={1} />
                  </div>
                </div>
              </div>

              {/* Hazard & Special Cargo */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-border rounded overflow-hidden">
                  <div className="bg-red-600 px-3 py-2"><span className="text-white font-semibold text-xs">Hazardous Cargo</span></div>
                  <div className="p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="unNoEnabled" checked={siForm.unNoEnabled} onChange={() => toggleSiHazard("unNoEnabled")} className="rounded" />
                      <label htmlFor="unNoEnabled" className="font-semibold">UN Number</label>
                    </div>
                    {siForm.unNoEnabled && (
                      <input name="unNo" value={siForm.unNo} onChange={siChange} placeholder="Enter UN number" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                    )}
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="dgClassEnabled" checked={siForm.dgClassEnabled} onChange={() => toggleSiHazard("dgClassEnabled")} className="rounded" />
                      <label htmlFor="dgClassEnabled" className="font-semibold">DG Class</label>
                    </div>
                    {siForm.dgClassEnabled && (
                      <input name="dgClass" value={siForm.dgClass} onChange={siChange} placeholder="Enter DG class" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                    )}
                  </div>
                </div>

                <div className="border border-border rounded overflow-hidden">
                  <div className="bg-blue-600 px-3 py-2"><span className="text-white font-semibold text-xs">Special Conditions</span></div>
                  <div className="p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="oversizedEnabled" checked={siForm.oversizedEnabled} onChange={toggleSiOversized} className="rounded" />
                      <label htmlFor="oversizedEnabled" className="font-semibold">Oversized</label>
                    </div>
                    {siForm.oversizedEnabled && (
                      <input name="dimension" value={siForm.dimension} onChange={siChange} placeholder="Enter dimension" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                    )}
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="frozenEnabled" checked={siForm.frozenEnabled} onChange={toggleSiFrozen} className="rounded" />
                      <label htmlFor="frozenEnabled" className="font-semibold">Frozen Cargo</label>
                    </div>
                    {siForm.frozenEnabled && (
                      <input name="temperature" value={siForm.temperature} onChange={siChange} placeholder="Enter temperature" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                    )}
                  </div>
                </div>
              </div>

              {/* Seal Details */}
              <div className="border border-border rounded overflow-hidden">
                <div className="bg-purple-600 px-3 py-2"><span className="text-white font-semibold text-xs">Seal Details</span></div>
                <div className="p-3 grid grid-cols-4 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Manifest Seal</label>
                    <input name="manifestSeal" value={siForm.manifestSeal} onChange={siChange} placeholder="Enter seal" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Actual/Liner Seal</label>
                    <input name="actualLinerSeal" value={siForm.actualLinerSeal} onChange={siChange} placeholder="Enter seal" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Custom Seal</label>
                    <input name="customSeal" value={siForm.customSeal} onChange={siChange} placeholder="Enter seal" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Excise Seal No</label>
                    <input name="exciseSealNo" value={siForm.exciseSealNo} onChange={siChange} placeholder="Enter seal" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Seal Date</label>
                    <input name="sealDate" type="date" value={siForm.sealDate} onChange={siChange} className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Seal Type</label>
                    <select name="sealTypeIndicator" value={siForm.sealTypeIndicator} onChange={siChange} className="w-full px-2 py-1 border border-input rounded text-xs bg-background">
                      <option value="">--Select--</option>
                      {SEAL_TYPE_OPTIONS.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="font-semibold">Seal Device ID</label>
                    <input name="sealDeviceId" value={siForm.sealDeviceId} onChange={siChange} placeholder="Enter device ID" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                  </div>
                </div>
              </div>

              {/* Document Details */}
              <div className="border border-border rounded overflow-hidden">
                <div className="bg-slate-600 px-3 py-2"><span className="text-white font-semibold text-xs">Document Details</span></div>
                <div className="p-3 grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Movement Doc Type</label>
                    <input name="movementDocType" value={siForm.movementDocType} onChange={siChange} placeholder="Enter type" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Movement Doc No</label>
                    <input name="movementDocNo" value={siForm.movementDocNo} onChange={siChange} placeholder="Enter no" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Notes</label>
                    <textarea name="notes" value={siForm.notes} onChange={siChange} placeholder="Enter notes" className="w-full px-2 py-1 border border-input rounded text-xs resize-none bg-background" rows={1} />
                  </div>
                </div>
              </div>

              {/* RORO Details */}
              <div className="border border-border rounded overflow-hidden">
                <div className="bg-indigo-600 px-3 py-2"><span className="text-white font-semibold text-xs">RORO Details</span></div>
                <div className="p-3 grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Year</label>
                    <input name="roroYear" value={siForm.roroYear} onChange={siChange} placeholder="Enter year" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Brand</label>
                    <input name="roroBrand" value={siForm.roroBrand} onChange={siChange} placeholder="Enter brand" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Model</label>
                    <input name="roroModel" value={siForm.roroModel} onChange={siChange} placeholder="Enter model" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Specification</label>
                    <input name="roroSpecification" value={siForm.roroSpecification} onChange={siChange} placeholder="Enter spec" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Chassis No</label>
                    <input name="roroChasisNo" value={siForm.roroChasisNo} onChange={siChange} placeholder="Enter chassis no" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Engine No</label>
                    <input name="roroEngineNo" value={siForm.roroEngineNo} onChange={siChange} placeholder="Enter engine no" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button size="sm" variant="outline" onClick={closeSiModal}>Cancel</Button>
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6" onClick={saveSi} disabled={siSaving}>
                {siSaving ? 'Saving...' : siEditId ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cargo Detail Delete Confirmation */}
      {siDeleteId !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSiDeleteId(null)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold text-primary">Delete Cargo Detail</h3>
              <button onClick={() => setSiDeleteId(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this cargo detail? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3 px-5 py-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setSiDeleteId(null)}>Cancel</Button>
              <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={handleSiDelete}>Delete</Button>
            </div>
          </div>
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
                onClick={openCostCreate}
              >
                Add Costing
              </Button>
            </div>
          </div>
          {costLoading ? (
            <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
              <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />Loading...
            </div>
          ) : costList.length === 0 ? (
            <NoData />
          ) : (
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {['#','Charge','PP/CC','Description','Unit','No of Unit','SAC Code',
                      'Sale Customer','Sale Dr/Cr','Sale Currency','Sale Ex Rate','Sale/Unit','Sale Crcy Amt','Sale Local Amt','Sale Tax%','Sale Tax Amt',
                      'Cost Vendor','Cost Dr/Cr','Cost Currency','Cost Ex Rate','Cost/Unit','Cost Crcy Amt','Cost Local Amt','Cost Tax%','Cost Tax Amt',
                      'Actions'].map(h => (
                      <th key={h} className="px-2 py-2 text-left font-semibold text-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {costList.map((row, i) => (
                    <tr key={row.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-2 py-2 text-muted-foreground">{i + 1}</td>
                      <td className="px-2 py-2 font-medium whitespace-nowrap">{row.charge}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{row.freight_pp_cc}</td>
                      <td className="px-2 py-2 max-w-[120px] truncate" title={row.description}>{row.description}</td>
                      <td className="px-2 py-2">{row.unit}</td>
                      <td className="px-2 py-2">{row.no_of_unit}</td>
                      <td className="px-2 py-2">{row.sac_code}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{row.sale_customer}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{row.sale_dr_cr}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{row.sale_currency}</td>
                      <td className="px-2 py-2">{row.sale_ex_rate}</td>
                      <td className="px-2 py-2">{row.sale_per_unit}</td>
                      <td className="px-2 py-2">{row.sale_crcy_amount}</td>
                      <td className="px-2 py-2">{row.sale_local_amount}</td>
                      <td className="px-2 py-2">{row.sale_tax_percent}</td>
                      <td className="px-2 py-2">{row.sale_total_tax_amount}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{row.cost_vendor}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{row.cost_dr_cr}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{row.cost_currency}</td>
                      <td className="px-2 py-2">{row.cost_ex_rate}</td>
                      <td className="px-2 py-2">{row.cost_per_unit}</td>
                      <td className="px-2 py-2">{row.cost_crcy_amount}</td>
                      <td className="px-2 py-2">{row.cost_local_amount}</td>
                      <td className="px-2 py-2">{row.cost_tax_percent}</td>
                      <td className="px-2 py-2">{row.cost_total_tax_amount}</td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-1">
                          <button className="p-1 hover:bg-green-50 rounded" title="Edit" onClick={() => openCostEdit(row)}>
                            <Pencil className="w-3.5 h-3.5 text-green-500" />
                          </button>
                          <button className="p-1 hover:bg-red-50 rounded" title="Delete" onClick={() => setCostDeleteId(row.id)}>
                            <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Costing Form Modal */}
      {costOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeCostModal} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-5xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">{costEditId ? 'Edit Costing' : 'Add Costing'}</h3>
              <button onClick={closeCostModal} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-5 space-y-4 text-xs">

              {/* Basic Info */}
              <div className="grid grid-cols-4 gap-3">
                <div className="flex flex-col gap-1"><label className="font-semibold">S.No#</label><input name="sNo" value={costForm.sNo} readOnly className="w-full px-2 py-1 border border-input rounded text-xs bg-muted cursor-not-allowed" /></div>
                <div className="flex flex-col gap-1"><label className="font-semibold"><span className="text-destructive mr-1">*</span>Charge</label>{cs('charge', CHARGES)}</div>
                <div className="flex flex-col gap-1"><label className="font-semibold"><span className="text-destructive mr-1">*</span>Freight PP/CC</label>{cs('freightPpCc', ['Prepaid','Collect'])}</div>
                <div className="flex flex-col gap-1"><label className="font-semibold">Description</label>{ci('description')}</div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="flex flex-col gap-1"><label className="font-semibold"><span className="text-destructive mr-1">*</span>Unit</label>{cs('unit', UNITS)}</div>
                <div className="flex flex-col gap-1"><label className="font-semibold">No of Unit</label>{ci('noOfUnit')}</div>
                <div className="flex flex-col gap-1"><label className="font-semibold"><span className="text-destructive mr-1">*</span>SAC Code</label>{ci('sacCode')}</div>
                <div className="flex flex-col gap-1"><label className="font-semibold">Note</label>{ci('note')}</div>
              </div>

              {/* Sale Section */}
              <div className="border border-border rounded overflow-hidden">
                <div className="bg-[#00BCD4] px-3 py-2"><span className="text-white font-semibold text-xs">Sale Details</span></div>
                <div className="p-3 grid grid-cols-4 gap-3">
                  <div className="flex flex-col gap-1"><label className="font-semibold">Other Territory</label>
                    <select name="saleOtherTerritory" value={costForm.saleOtherTerritory} onChange={costChange} className="w-full px-2 py-1 border border-input rounded text-xs bg-background">
                      {['No','Yes'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Customer</label>
                    <select name="saleCustomer" value={costForm.saleCustomer} onChange={costChange}
                      className={`w-full px-2 py-1 border rounded text-xs bg-background ${costErrors.saleCustomer ? 'border-red-500' : 'border-input'}`}>
                      <option value="">--Select--</option>
                      {costCustomers.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    {costErrors.saleCustomer && <p className="text-xs text-red-500 mt-0.5">? {costErrors.saleCustomer}</p>}
                  </div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Dr/Cr</label>{cs('saleDrCr', DR_CR_SALE, '')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Currency</label>{cs('saleCurrency', CURRENCIES, '')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Ex Rate</label>{ci('saleExRate')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Per Unit</label>{ci('salePerUnit')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Crcy Amount</label>{ci('saleCrcyAmount')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Local Amount</label>{ci('saleLocalAmount')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Tax %</label>{cs('saleTaxPct', TAX_PCTS)}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Taxable Amt</label>{ci('saleTaxableAmount')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Non-Taxable Amt</label>{ci('saleNonTaxableAmount')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">CGST</label>{ci('saleCgst')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">SGST</label>{ci('saleSgst')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">IGST</label>{ci('saleIgst')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Total Tax</label>{ci('saleTotalTax')}</div>
                </div>
              </div>

              {/* Cost Section */}
              <div className="border border-border rounded overflow-hidden">
                <div className="bg-amber-400 px-3 py-2"><span className="text-white font-semibold text-xs">Cost Details</span></div>
                <div className="p-3 grid grid-cols-4 gap-3">
                  <div className="flex flex-col gap-1"><label className="font-semibold">Vendor</label>
                    <select name="costVendor" value={costForm.costVendor} onChange={costChange}
                      className={`w-full px-2 py-1 border rounded text-xs bg-background ${costErrors.costVendor ? 'border-red-500' : 'border-input'}`}>
                      <option value="">--Select--</option>
                      {costCustomers.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    {costErrors.costVendor && <p className="text-xs text-red-500 mt-0.5">? {costErrors.costVendor}</p>}
                  </div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Dr/Cr</label>{cs('costDrCr', DR_CR_COST, '')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Currency</label>{cs('costCurrency', CURRENCIES, '')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Ex Rate</label>{ci('costExRate')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Per Unit</label>{ci('costPerUnit')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Crcy Amount</label>{ci('costCrcyAmount')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Local Amount</label>{ci('costLocalAmount')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Tax %</label>{cs('costTaxPct', TAX_PCTS)}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Taxable Amt</label>{ci('costTaxableAmount')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Non-Taxable Amt</label>{ci('costNonTaxableAmount')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">CGST</label>{ci('costCgst')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">SGST</label>{ci('costSgst')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">IGST</label>{ci('costIgst')}</div>
                  <div className="flex flex-col gap-1"><label className="font-semibold">Total Tax</label>{ci('costTotalTax')}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button size="sm" variant="outline" onClick={closeCostModal}>Cancel</Button>
              <div className="flex gap-2">
                {/* {!costEditId && (
                  <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-black font-semibold" onClick={() => saveCost(true)} disabled={costSaving}>
                    {costSaving ? 'Saving...' : 'Save & Add Next'}
                  </Button>
                )} */}
                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6" onClick={() => saveCost(false)} disabled={costSaving}>
                  {costSaving ? 'Saving...' : costEditId ? 'Update' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Costing Delete Confirmation */}
      {costDeleteId !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCostDeleteId(null)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold text-primary">Delete Costing</h3>
              <button onClick={() => setCostDeleteId(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this costing record? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3 px-5 py-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setCostDeleteId(null)}>Cancel</Button>
              <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={handleCostDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* Subledger Form Modal */}
      {slOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeSlModal} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">{slEditId ? 'Edit Party' : 'Add New Party'}</h3>
              <button onClick={closeSlModal} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold"><span className="text-destructive mr-1">*</span>Party Type</label>
                  <select name="categories" value={slForm.categories} onChange={slChange} className={`w-full px-2 py-1 border rounded text-xs ${slErrors.categories ? 'border-red-500' : 'border-input'} bg-background`}>
                    <option value="">--Select Type--</option>
                    <option value="Customer">Customer</option>
                    <option value="Airline">Airline</option>
                    <option value="Agent">Agent</option>
                    <option value="Consignee">Consignee</option>
                  </select>
                  {slErrors.categories && <span className="text-red-500 text-xs">{slErrors.categories}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold"><span className="text-destructive mr-1">*</span>Party Name</label>
                  <input name="customerName" value={slForm.customerName} onChange={slChange} placeholder="Enter name" className={`w-full px-2 py-1 border rounded text-xs ${slErrors.customerName ? 'border-red-500' : 'border-input'} bg-background`} />
                  {slErrors.customerName && <span className="text-red-500 text-xs">{slErrors.customerName}</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">SCAC Code</label>
                  <input name="scacCode" value={slForm.scacCode} onChange={slChange} placeholder="Enter SCAC code" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Country</label>
                  <input name="country" value={slForm.country} onChange={slChange} placeholder="Enter country" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-semibold"><span className="text-destructive mr-1">*</span>Address</label>
                <textarea name="address" value={slForm.address} onChange={slChange} placeholder="Enter full address" className={`w-full px-2 py-1 border rounded text-xs resize-none ${slErrors.address ? 'border-red-500' : 'border-input'} bg-background`} rows={2} />
                {slErrors.address && <span className="text-red-500 text-xs">{slErrors.address}</span>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">PIN Code</label>
                  <input name="pinCode" value={slForm.pinCode} onChange={slChange} placeholder="Enter PIN code" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">GST State</label>
                  <input name="gstState" value={slForm.gstState} onChange={slChange} placeholder="Enter GST state" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">GST No</label>
                  <input name="gstNo" value={slForm.gstNo} onChange={slChange} placeholder="Enter GST number" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">PAN No</label>
                  <input name="panNo" value={slForm.panNo} onChange={slChange} placeholder="Enter PAN number" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Phone</label>
                  <input name="phone" value={slForm.phone} onChange={slChange} placeholder="Enter phone" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Mobile</label>
                  <input name="mobile" value={slForm.mobile} onChange={slChange} placeholder="Enter mobile" className="w-full px-2 py-1 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-semibold">Email</label>
                  <input name="emailId" value={slForm.emailId} onChange={slChange} placeholder="Enter email" className={`w-full px-2 py-1 border rounded text-xs ${slErrors.emailId ? 'border-red-500' : 'border-input'} bg-background`} />
                  {slErrors.emailId && <span className="text-red-500 text-xs">{slErrors.emailId}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button size="sm" variant="outline" onClick={closeSlModal}>Cancel</Button>
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6" onClick={slSave} disabled={slSaving}>
                {slSaving ? 'Saving...' : slEditId ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Subledger Delete Confirmation */}
      {slDeleteId !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSlDeleteId(null)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold text-primary">Delete Party</h3>
              <button onClick={() => setSlDeleteId(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this subledger? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3 px-5 py-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setSlDeleteId(null)}>Cancel</Button>
              <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={handleSlDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Bill / BOE card */}
      {(activeTab === "Shipping Bill / BOE" || activeTab === "Show All") && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-white px-6 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Shipping Bill / BOE</h2>
            <Button size="sm" variant="outline" className="h-7 text-xs px-3 bg-white font-semibold" onClick={openSbCreate}>
              Add Shipping Bill
            </Button>
          </div>
          {sbLoading ? (
            <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
              <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />Loading...
            </div>
          ) : sbRows.length === 0 ? (
            <NoData />
          ) : (
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {["Shipping Bill No","Shipping Bill Date","Mate Receipt No","Mate Receipt Date","No of PCS","Pack Type","Gross Weight","Measurement","Volume","Commodity Code","Commodity Type","Commodity Desc","Note","Action"].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sbRows.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-3 py-2 text-xs text-foreground">{row.shipping_bill_no}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.shipping_bill_date}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.mate_receipt_no}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.mate_receipt_date}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.no_of_pcs}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.pack_type}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.gross_weight}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.measurement}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.volume}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.commodity_code}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.commodity_type}</td>
                      <td className="px-3 py-2 text-xs text-foreground max-w-[120px] truncate">{row.commodity_desc}</td>
                      <td className="px-3 py-2 text-xs text-foreground max-w-[120px] truncate">{row.note}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <button className="p-1 hover:bg-green-50 rounded" title="Edit" onClick={() => openSbEdit(row)}>
                            <Pencil className="w-3.5 h-3.5 text-green-500" />
                          </button>
                          <button className="p-1 hover:bg-red-50 rounded" title="Delete" onClick={() => setSbDeleteId(row.id)}>
                            <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
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
              onClick={openHouseCreate}
            >
              Add New House
            </Button>
          </div>
          {houseLoading ? (
            <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
              <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />Loading...
            </div>
          ) : houseList.length === 0 ? (
            <NoData />
          ) : (
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {["HAWB No","HAWB Date","HAWB Mark No","Place of Receipt","Place of Delivery","INCO Term","Freight Term","Customer","Shipper","Consignee","Notify1","Notify2","Notes","Action"].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {houseList.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-3 py-2 text-xs text-foreground">{row.hawb_no}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.hawb_date}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.hawb_mark_no}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.place_of_receipt}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.place_of_delivery}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.inco_term}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.freight_term}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{row.customer}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{row.shipper}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{row.consignee}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{row.notify1}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{row.notify2}</td>
                      <td className="px-3 py-2 text-xs text-foreground max-w-[120px] truncate">{row.notes}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <button className="p-1 hover:bg-green-50 rounded" title="Edit" onClick={() => openHouseEdit(row)}>
                            <Pencil className="w-3.5 h-3.5 text-green-500" />
                          </button>
                          <button className="p-1 hover:bg-red-50 rounded" title="Delete" onClick={() => setHouseDeleteId(row.id)}>
                            <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
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
                {/* <Button size="sm" variant="outline" className="h-7 text-xs px-3 bg-white">Get Schedule</Button> */}
                <Button size="sm" variant="outline" className="h-7 text-xs px-3 bg-white font-semibold" onClick={openRoutingCreate}>
                  Routing +
                </Button>
              </div>
            </div>
            {routingLoading ? (
              <div className="flex items-center justify-center h-16 text-muted-foreground text-sm">
                <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />Loading...
              </div>
            ) : (
            <div className="p-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {["#","Line No","From Port Code","From ETD","From ATD","To Port Code","Position","To ETA","To ATA","Airline Code","Flight Name","Status","Followup","Notes","Action"].map(h => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {routingList.length === 0 ? (
                    <tr><td colSpan={17} className="px-3 py-8 text-center text-sm text-muted-foreground">No routing records found.</td></tr>
                  ) : routingList.map((row, i) => (
                    <tr key={row.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-3 py-2 text-xs text-muted-foreground">{i + 1}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.s_no}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.from_port_code}</td>
                      {/* <td className="px-3 py-2 text-xs text-foreground">{row.from_port_name}</td> */}
                      <td className="px-3 py-2 text-xs text-foreground">{row.from_etd}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.from_atd}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.to_port_code}</td>
                      {/* <td className="px-3 py-2 text-xs text-foreground">{row.to_port_name}</td> */}
                      <td className="px-3 py-2 text-xs text-foreground">{row.position}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.to_eta}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.to_ata}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.airline_code}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{row.flight_name}</td>
                      <td className="px-3 py-2 text-xs text-foreground uppercase">{row.status}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{row.from_etd_followup ? 'Yes' : 'No'}</td>
                      <td className="px-3 py-2 text-xs text-foreground max-w-[120px] truncate">{row.notes}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <button className="p-1 hover:bg-green-50 rounded" title="Edit" onClick={() => openRoutingEdit(row)}>
                            <Pencil className="w-3.5 h-3.5 text-green-500" />
                          </button>
                          <button className="p-1 hover:bg-red-50 rounded" title="Delete" onClick={() => setRoutingDeleteId(row.id)}>
                            <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>{/* Team + Profit Share */}
          <div className="grid grid-cols-2 gap-0 border-b border-border">
            <div className="border-r border-border">
              <div className="bg-[#00BCD4] px-4 py-2.5 flex items-center justify-between">
                <span className="text-white font-semibold text-sm">Team</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs px-3 bg-white font-semibold"
                  onClick={openTeamCreate}
                >
                  Add Working Team
                </Button>
              </div>
              <div className="p-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      {["Employee", "Dept", "Followup Required", "Note", "Action"].map(
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
                    {teamLoading ? (
                      <tr><td colSpan={5} className="px-2 py-6 text-center text-xs text-muted-foreground">Loading...</td></tr>
                    ) : teamList.length === 0 ? (
                      <tr><td colSpan={5} className="px-2 py-6 text-center text-xs text-muted-foreground">No team members found.</td></tr>
                    ) : teamList.map((row) => (
                      <tr key={row.id} className="border-b border-border hover:bg-muted/30">
                        <td className="px-2 py-2 text-xs text-foreground">{row.employee_name ?? row.employee_id}</td>
                        <td className="px-2 py-2 text-xs text-foreground">{row.department}</td>
                        <td className="px-2 py-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              (row.followup_required === 'Yes' || row.followup_required === 1 || row.followup_required === '1')
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-slate-50 text-slate-500 border-slate-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                (row.followup_required === 'Yes' || row.followup_required === 1 || row.followup_required === '1') ? 'bg-green-500' : 'bg-slate-400'
                              }`} />
                              {(row.followup_required === 'Yes' || row.followup_required === 1 || row.followup_required === '1') ? 'Yes' : 'No'}
                            </span>
                          </td>
                        <td className="px-2 py-2 text-xs text-foreground">{row.note}</td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1">
                            <button className="p-1 hover:bg-green-50 rounded" title="Edit" onClick={() => openTeamEdit(row)}>
                              <Pencil className="w-3.5 h-3.5 text-green-500" />
                            </button>
                            <button className="p-1 hover:bg-red-50 rounded" title="Delete" onClick={() => setTeamDeleteId(row.id)}>
                              <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <div className="bg-[#00BCD4] px-4 py-2.5 flex items-center justify-between">
                <span className="text-white font-semibold text-sm">Profit Share</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs px-3 bg-white font-semibold"
                  onClick={openProfitCreate}
                >
                  Add +
                </Button>
              </div>
              <div className="p-4">
                {profitLoading ? (
                  <div className="flex items-center justify-center h-16 text-muted-foreground text-sm">
                    <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />Loading...
                  </div>
                ) : profitList.length === 0 ? (
                  <div className="min-h-[80px] flex items-center justify-center text-xs text-muted-foreground">No profit share records found.</div>
                ) : (
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        {["Type", "To Name", "To Name (Desc)", "Percentage", "Profit Amount", "Job Profit", "Note", "Action"].map((h) => (
                          <th key={h} className="text-left px-2 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {profitList.map((row) => (
                        <tr key={row.id} className="border-b border-border hover:bg-muted/30">
                          <td className="px-2 py-2 text-xs text-foreground">{row.type}</td>
                          <td className="px-2 py-2 text-xs text-foreground">{row.to_name}</td>
                          <td className="px-2 py-2 text-xs text-foreground">{row.to_name_description}</td>
                          <td className="px-2 py-2 text-xs text-foreground">{row.percentage}%</td>
                          <td className="px-2 py-2 text-xs text-foreground">{row.profit_amount}</td>
                          <td className="px-2 py-2 text-xs text-foreground">{row.job_profit}</td>
                          <td className="px-2 py-2 text-xs text-foreground max-w-[100px] truncate">{row.note}</td>
                          <td className="px-2 py-2">
                            <div className="flex items-center gap-1">
                              <button className="p-1 hover:bg-green-50 rounded" title="Edit" onClick={() => openProfitEdit(row)}>
                                <Pencil className="w-3.5 h-3.5 text-green-500" />
                              </button>
                              <button className="p-1 hover:bg-red-50 rounded" title="Delete" onClick={() => setProfitDeleteId(row.id)}>
                                <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </td>
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
                onClick={openStatusCreate}
              >
                Add +
              </Button>
            </div>
            <div className="p-4">
              {statusLoading ? (
                <div className="flex items-center justify-center h-16 text-muted-foreground text-sm">
                  <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />Loading...
                </div>
              ) : statusList.length === 0 ? (
                <div className="min-h-[40px] flex items-center justify-center text-xs text-muted-foreground">No status updates found.</div>
              ) : (
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      {["Line No#", "Update To (Type)", "Position", "Subject", "From", "To", "Bcc", "Cc", "Header", "Body", "Footer", "Notes", "Action"].map((h) => (
                        <th key={h} className="text-left px-2 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {statusList.map((row) => (
                      <tr key={row.id} className="border-b border-border hover:bg-muted/30">
                        <td className="px-2 py-2 text-xs text-foreground">{row.line_no}</td>
                        <td className="px-2 py-2 text-xs text-foreground">{row.update_to_type}</td>
                        <td className="px-2 py-2 text-xs text-foreground">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                            row.position === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                            row.position === 'In Transit' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            row.position === 'Arrived' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            row.position === 'Closed' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              row.position === 'Delivered' ? 'bg-green-500' :
                              row.position === 'In Transit' ? 'bg-blue-500' :
                              row.position === 'Arrived' ? 'bg-amber-500' :
                              row.position === 'Closed' ? 'bg-red-500' : 'bg-slate-400'
                            }`} />
                            {row.position}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-xs text-foreground max-w-[120px] truncate">{row.subject}</td>
                        <td className="px-2 py-2 text-xs text-foreground whitespace-nowrap">{row.from}</td>
                        <td className="px-2 py-2 text-xs text-foreground whitespace-nowrap">{row.to}</td>
                        <td className="px-2 py-2 text-xs text-foreground">{row.bcc}</td>
                        <td className="px-2 py-2 text-xs text-foreground">{row.cc}</td>
                        <td className="px-2 py-2 text-xs text-foreground max-w-[100px] truncate">{row.header}</td>
                        <td className="px-2 py-2 text-xs text-foreground max-w-[100px] truncate">{row.body}</td>
                        <td className="px-2 py-2 text-xs text-foreground max-w-[100px] truncate">{row.footer}</td>
                        <td className="px-2 py-2 text-xs text-foreground max-w-[100px] truncate">{row.notes}</td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1">
                            <button className="p-1 hover:bg-green-50 rounded" title="Edit" onClick={() => openStatusEdit(row)}>
                              <Pencil className="w-3.5 h-3.5 text-green-500" />
                            </button>
                            <button className="p-1 hover:bg-red-50 rounded" title="Delete" onClick={() => setStatusDeleteId(row.id)}>
                              <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
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
                    <td className="px-3 py-2 text-xs text-foreground">admin@admin.com</td>
                    <td className="px-3 py-2 text-xs text-foreground">{op.document || "RLPL/AE/J0303"}</td>
                    <td className="px-3 py-2 text-xs text-foreground">-</td>
                    <td className="px-3 py-2 text-xs text-foreground">-</td>
                    <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">
                      {op.job_date ? `${op.job_date} 12:03PM` : "24-MAR-2026 12:03PM"}
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
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.customer || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground" style={{ maxWidth: "180px" }}>{op.customer_address || op.branch || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.shipper || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{op.shipper_address || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.consignee || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{op.consignee_address || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">
                        {Array.isArray(op.notify_list) ? (op.notify_list[0]?.name || op.notify_list.map((n: any) => n?.name || n).filter(Boolean).join(", ") || "-") : (op.notify_list || "-")}
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground">
                        {Array.isArray(op.notify_list) ? (op.notify_list[0]?.branch || op.notify_list[0]?.address || "-") : "-"}
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.bl_no || op.document || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.carrier_scac_code || op.carrier || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.mbl_no || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.place_of_receipt || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.place_of_receipt || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.pol || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{portOptions.find(p => p.code === op.pol)?.name || op.pol || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{portOptions.find(p => p.code === op.pod)?.name || op.pod || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.pod || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.place_of_delivery || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.pol_etd || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.pod_eta || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.freight_pp_cc ? op.freight_pp_cc.toUpperCase() : "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.service_type || op.incoterms || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{siRows.length > 0 ? (siRows.reduce((sum: number, r: any) => sum + (Number(r.no_of_pcs) || 0), 0) || "-") : "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{siRows.length > 0 ? (siRows.map((r: any) => r.g_weight ? (r.g_weight + " " + (r.g_weight_unit || "")).trim() : null).filter(Boolean).join(", ") || "-") : "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{riderList.length > 0 ? riderList.length : (siRows.length > 0 ? siRows.length : "-")}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.flight_name || op.vessel_name || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.flight_number || op.vessel_no || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{op.note || "-"}</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{riderList.length > 0 ? ([...new Set(riderList.map((r: any) => r.container_type).filter(Boolean))].join(", ") || "-") : (siRows.length > 0 ? ([...new Set(siRows.map((r: any) => r.commodity_type).filter(Boolean))].join(", ") || "-") : "-")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-2 text-xs text-muted-foreground">1 - 1</div>
            </div>
          </div>
        </div>
      )}

      {/* Routing Modal */}
      {routingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeRoutingModal} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">{routingEditId ? 'Edit Routing' : 'Add Routing'}</h3>
              <button onClick={closeRoutingModal} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">S.No#</label>
                  <input name="sNo" value={routingForm.sNo} readOnly className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-muted cursor-not-allowed" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">Position</label>
                  <select name="position" value={routingForm.position} onChange={routingChange} className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background">
                    {POSITION_OPTIONS_ROUTING.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0"><span className="text-destructive mr-1">*</span>From Port Code</label>
                  <div className="flex-1">
                    <select name="fromPortCode" value={routingForm.fromPortCode} onChange={routingChange} className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${routingErrors.fromPortCode ? 'border-destructive' : 'border-input'}`}>
                      <option value="">--Select--</option>
                      {portOptions.map(p => <option key={p.code} value={p.code}>{p.code} - {p.name}</option>)}
                    </select>
                    {routingErrors.fromPortCode && <p className="text-xs text-destructive mt-0.5">? {routingErrors.fromPortCode}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">From Terminal</label>
                  <select name="fromTerminalId" value={routingForm.fromTerminalId} onChange={routingChange} className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" disabled={fromTerminalsLoading || !routingForm.fromPortCode}>
                    <option value="">{fromTerminalsLoading ? 'Loading...' : '--Select--'}</option>
                    {fromTerminals.map(t => <option key={t.id} value={String(t.id)}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0"><span className="text-destructive mr-1">*</span>To Port Code</label>
                  <div className="flex-1">
                    <select name="toPortCode" value={routingForm.toPortCode} onChange={routingChange} className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${routingErrors.toPortCode ? 'border-destructive' : 'border-input'}`}>
                      <option value="">--Select--</option>
                      {portOptions.map(p => <option key={p.code} value={p.code}>{p.code} - {p.name}</option>)}
                    </select>
                    {routingErrors.toPortCode && <p className="text-xs text-destructive mt-0.5">? {routingErrors.toPortCode}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">To Terminal</label>
                  <select name="toTerminalId" value={routingForm.toTerminalId} onChange={routingChange} className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" disabled={toTerminalsLoading || !routingForm.toPortCode}>
                    <option value="">{toTerminalsLoading ? 'Loading...' : '--Select--'}</option>
                    {toTerminals.map(t => <option key={t.id} value={String(t.id)}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">From ETD</label>
                  <input type="date" name="fromEtd" value={routingForm.fromEtd} onChange={routingChange} className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">From ATD</label>
                  <input type="date" name="fromAtd" value={routingForm.fromAtd} onChange={routingChange} className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">To ETA</label>
                  <input type="date" name="toEta" value={routingForm.toEta} onChange={routingChange} className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">To ATA</label>
                  <input type="date" name="toAta" value={routingForm.toAta} onChange={routingChange} className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">Airline Code</label>
                  <input name="airlineCode" value={routingForm.airlineCode} onChange={routingChange} className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">Flight Name</label>
                  <input name="flightName" value={routingForm.flightName} onChange={routingChange} className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">Status</label>
                  <select name="status" value={routingForm.status} onChange={routingChange} className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background">
                    {STATUS_OPTIONS_ROUTING.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-28 shrink-0">ETD Followup</label>
                  <select name="fromEtdFollowup" value={routingForm.fromEtdFollowup} onChange={routingChange} className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0 pt-1">Notes</label>
                <textarea name="notes" value={routingForm.notes} onChange={routingChange} rows={3} className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y" />
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-6" onClick={closeRoutingModal}>Cancel</Button>
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6" onClick={saveRouting} disabled={routingSaving}>
                {routingSaving ? 'Saving...' : routingEditId ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Routing Delete Confirmation */}
      {routingDeleteId !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRoutingDeleteId(null)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold text-primary">Delete Routing</h3>
              <button onClick={() => setRoutingDeleteId(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this routing record? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3 px-5 py-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setRoutingDeleteId(null)}>Cancel</Button>
              <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={handleRoutingDelete}>Delete</Button>
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
                {houseEditId !== null ? "Edit House Job" : "Create New House Job"}
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
                  <span className="text-foreground">{op.document || ""} / {op.job_date || ""}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-foreground w-10 shrink-0">POL</span>
                  <span className="text-foreground">{op.pol || ""}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-foreground w-10 shrink-0">POD</span>
                  <span className="text-foreground">{op.pod || ""}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground w-20 shrink-0">ETD / ATD</span>
                  <span className="text-foreground">{op.pol_etd || ""} /</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground w-20 shrink-0">ETA / ATA</span>
                  <span className="text-foreground">{op.pod_eta || ""} /</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground w-32 shrink-0">Flight Name / No.</span>
                  <span className="text-foreground">{op.flight_name || ""}</span>
                </div>
              </div>

              {/* Place of Receipt + Place of Delivery */}
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground w-20 shrink-0">MAWB No. / Date</span>
                  <span className="text-foreground">{op.note || ""}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="font-semibold text-foreground w-24 shrink-0">
                    Place of Receipt <span className="text-destructive">*</span>
                  </label>
                  <div className="flex-1">
                    <input name="placeOfReceipt" value={houseForm.placeOfReceipt} onChange={houseChange}
                      className={`w-full px-2 py-1 border rounded text-xs bg-background ${houseErrors.placeOfReceipt ? 'border-destructive' : 'border-input'}`} />
                    {houseErrors.placeOfReceipt && <p className="text-xs text-destructive mt-0.5">? {houseErrors.placeOfReceipt}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="font-semibold text-foreground w-24 shrink-0">
                    Place of Delivery <span className="text-destructive">*</span>
                  </label>
                  <div className="flex-1">
                    <input name="placeOfDelivery" value={houseForm.placeOfDelivery} onChange={houseChange}
                      className={`w-full px-2 py-1 border rounded text-xs bg-background ${houseErrors.placeOfDelivery ? 'border-destructive' : 'border-input'}`} />
                    {houseErrors.placeOfDelivery && <p className="text-xs text-destructive mt-0.5">? {houseErrors.placeOfDelivery}</p>}
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
                    <select name="incoTerm" value={houseForm.incoTerm} onChange={houseChange}
                      className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${houseErrors.incoTerm ? 'border-destructive' : 'border-input'}`}>
                      <option value="">--Select--</option>
                      {HOUSE_INCO_TERMS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                    {houseErrors.incoTerm && <p className="text-xs text-destructive mt-0.5">? {houseErrors.incoTerm}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-20 shrink-0">HAWB No.</label>
                  <input name="hawbNo" value={houseForm.hawbNo} onChange={houseChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-24 shrink-0">HAWB Date</label>
                  <input type="date" name="hawbDate" value={houseForm.hawbDate} onChange={houseChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
              </div>

              {/* Freight Term + HAWB Mark No + Notes */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-24 shrink-0">Freight Term</label>
                  <select name="freightTerm" value={houseForm.freightTerm} onChange={houseChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background">
                    {HOUSE_FREIGHT_TERMS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex items-start gap-2">
                  <label className="text-xs font-semibold text-foreground w-20 shrink-0 pt-1">HAWB Mark No.</label>
                  <textarea name="hawbMarkNo" value={houseForm.hawbMarkNo} onChange={houseChange} rows={3}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y" />
                </div>
                <div className="flex items-start gap-2">
                  <label className="text-xs font-semibold text-foreground w-24 shrink-0 pt-1">Notes</label>
                  <textarea name="notes" value={houseForm.notes} onChange={houseChange} rows={3}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y" />
                </div>
              </div>

              {/* Customer + Shipper */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-border rounded overflow-hidden">
                  <div className="bg-[#00BCD4] px-3 py-2"><h4 className="text-white font-semibold text-xs">Customer</h4></div>
                  <div className="p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-foreground w-20 shrink-0">
                        <span className="text-destructive mr-1">*</span>Customer
                      </label>
                      <div className="flex-1">
                        <select
                          name="customer"
                          value={houseForm.customer}
                          onChange={(e) => {
                            const val = e.target.value;
                            const comp = houseCompanies.find(c => c.name === val);
                            setHouseForm(prev => ({
                              ...prev,
                              customer: val,
                              customer_id: comp ? String(comp.id) : '',
                            }));
                            if (comp) loadHouseAddresses(comp.id);
                            else setHouseAddresses([]);
                            if (houseErrors.customer) setHouseErrors(prev => ({ ...prev, customer: '' }));
                          }}
                          className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${houseErrors.customer ? 'border-destructive' : 'border-input'}`}
                        >
                          <option value="">--Select Customer--</option>
                          {houseCompaniesLoading ? (
                            <option value="" disabled>Loading...</option>
                          ) : (
                            houseCompanies.map(c => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))
                          )}
                        </select>
                        {houseErrors.customer && <p className="text-xs text-destructive mt-0.5">? {houseErrors.customer}</p>}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <label className="text-xs font-semibold text-foreground w-20 shrink-0 pt-1">Address</label>
                      <div className="flex flex-col gap-2 flex-1">
                        {houseAddresses.length > 0 && (
                          <select
                            className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background"
                            onChange={(e) => {
                              const addr = houseAddresses.find(a => a.id === Number(e.target.value));
                              if (addr) setHouseForm(prev => ({ ...prev, customerAddress: addr.address }));
                            }}
                          >
                            <option value="">--Select Preset Address--</option>
                            {houseAddresses.map((a) => (
                              <option key={a.id} value={a.id}>{a.label}</option>
                            ))}
                          </select>
                        )}
                        <textarea name="customerAddress" value={houseForm.customerAddress} onChange={houseChange} rows={3}
                          className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background resize-y" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border border-border rounded overflow-hidden">
                  <div className="bg-[#00BCD4] px-3 py-2"><h4 className="text-white font-semibold text-xs">Shipper</h4></div>
                  <div className="p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-foreground w-20 shrink-0">Shipper</label>
                      <select
                        name="shipper"
                        value={houseForm.shipper}
                        onChange={(e) => {
                          const val = e.target.value;
                          const comp = houseCompanies.find(c => c.name === val);
                          setHouseForm(prev => ({ ...prev, shipper: val }));
                          if (comp) fetchEntityAddresses(comp.id, setShipperAddresses);
                          else setShipperAddresses([]);
                        }}
                        className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                      >
                        <option value="">--Select Shipper--</option>
                        {houseCompaniesLoading ? (
                          <option value="" disabled>Loading...</option>
                        ) : (
                          houseCompanies.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))
                        )}
                      </select>
                    </div>
                    <div className="flex items-start gap-2">
                      <label className="text-xs font-semibold text-foreground w-20 shrink-0 pt-1">Address</label>
                      <div className="flex flex-col gap-2 flex-1">
                        {shipperAddresses.length > 0 && (
                          <select
                            className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background"
                            onChange={(e) => {
                              const addr = shipperAddresses.find(a => a.id === Number(e.target.value));
                              if (addr) setHouseForm(prev => ({ ...prev, shipperAddress: addr.address }));
                            }}
                          >
                            <option value="">--Select Preset Address--</option>
                            {shipperAddresses.map((a) => (
                              <option key={a.id} value={a.id}>{a.label}</option>
                            ))}
                          </select>
                        )}
                        <textarea name="shipperAddress" value={houseForm.shipperAddress} onChange={houseChange} rows={3}
                          className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background resize-y" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consignee + Notify1 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-border rounded overflow-hidden">
                  <div className="bg-[#00BCD4] px-3 py-2"><h4 className="text-white font-semibold text-xs">Consignee</h4></div>
                  <div className="p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-foreground w-20 shrink-0">Consignee</label>
                      <select
                        name="consignee"
                        value={houseForm.consignee}
                        onChange={(e) => {
                          const val = e.target.value;
                          const comp = houseCompanies.find(c => c.name === val);
                          setHouseForm(prev => ({ ...prev, consignee: val }));
                          if (comp) fetchEntityAddresses(comp.id, setConsigneeAddresses);
                          else setConsigneeAddresses([]);
                        }}
                        className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                      >
                        <option value="">--Select Consignee--</option>
                        {houseCompaniesLoading ? (
                          <option value="" disabled>Loading...</option>
                        ) : (
                          houseCompanies.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))
                        )}
                      </select>
                    </div>
                    <div className="flex items-start gap-2">
                      <label className="text-xs font-semibold text-foreground w-20 shrink-0 pt-1">Address</label>
                      <div className="flex flex-col gap-2 flex-1">
                        {consigneeAddresses.length > 0 && (
                          <select
                            className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background"
                            onChange={(e) => {
                              const addr = consigneeAddresses.find(a => a.id === Number(e.target.value));
                              if (addr) setHouseForm(prev => ({ ...prev, consigneeAddress: addr.address }));
                            }}
                          >
                            <option value="">--Select Preset Address--</option>
                            {consigneeAddresses.map((a) => (
                              <option key={a.id} value={a.id}>{a.label}</option>
                            ))}
                          </select>
                        )}
                        <textarea name="consigneeAddress" value={houseForm.consigneeAddress} onChange={houseChange} rows={3}
                          className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background resize-y" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border border-border rounded overflow-hidden">
                  <div className="bg-amber-400 px-3 py-2"><h4 className="text-white font-semibold text-xs">Notify1</h4></div>
                  <div className="p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-foreground w-20 shrink-0">Notify1</label>
                      <select
                        name="notify1"
                        value={houseForm.notify1}
                        onChange={(e) => {
                          const val = e.target.value;
                          const comp = houseCompanies.find(c => c.name === val);
                          setHouseForm(prev => ({ ...prev, notify1: val }));
                          if (comp) fetchEntityAddresses(comp.id, setNotify1Addresses);
                          else setNotify1Addresses([]);
                        }}
                        className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                      >
                        <option value="">--Select Notify1--</option>
                        {houseCompaniesLoading ? (
                          <option value="" disabled>Loading...</option>
                        ) : (
                          houseCompanies.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))
                        )}
                      </select>
                    </div>
                    <div className="flex items-start gap-2">
                      <label className="text-xs font-semibold text-foreground w-20 shrink-0 pt-1">Address</label>
                      <div className="flex flex-col gap-2 flex-1">
                        {notify1Addresses.length > 0 && (
                          <select
                            className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background"
                            onChange={(e) => {
                              const addr = notify1Addresses.find(a => a.id === Number(e.target.value));
                              if (addr) setHouseForm(prev => ({ ...prev, notify1Address: addr.address }));
                            }}
                          >
                            <option value="">--Select Preset Address--</option>
                            {notify1Addresses.map((a) => (
                              <option key={a.id} value={a.id}>{a.label}</option>
                            ))}
                          </select>
                        )}
                        <textarea name="notify1Address" value={houseForm.notify1Address} onChange={houseChange} rows={3}
                          className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background resize-y" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border border-border rounded overflow-hidden">
                  <div className="bg-amber-500 px-3 py-2"><h4 className="text-white font-semibold text-xs">Notify2</h4></div>
                  <div className="p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-foreground w-20 shrink-0">Notify2</label>
                      <select
                        name="notify2"
                        value={houseForm.notify2}
                        onChange={(e) => {
                          const val = e.target.value;
                          const comp = houseCompanies.find(c => c.name === val);
                          setHouseForm(prev => ({ ...prev, notify2: val }));
                          if (comp) fetchEntityAddresses(comp.id, setNotify2Addresses);
                          else setNotify2Addresses([]);
                        }}
                        className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background"
                      >
                        <option value="">--Select Notify2--</option>
                        {houseCompaniesLoading ? (
                          <option value="" disabled>Loading...</option>
                        ) : (
                          houseCompanies.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))
                        )}
                      </select>
                    </div>
                    <div className="flex items-start gap-2">
                      <label className="text-xs font-semibold text-foreground w-20 shrink-0 pt-1">Address</label>
                      <div className="flex flex-col gap-2 flex-1">
                        {notify2Addresses.length > 0 && (
                          <select
                            className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background"
                            onChange={(e) => {
                              const addr = notify2Addresses.find(a => a.id === Number(e.target.value));
                              if (addr) setHouseForm(prev => ({ ...prev, notify2Address: addr.address }));
                            }}
                          >
                            <option value="">--Select Preset Address--</option>
                            {notify2Addresses.map((a) => (
                              <option key={a.id} value={a.id}>{a.label}</option>
                            ))}
                          </select>
                        )}
                        <textarea name="notify2Address" value={houseForm.notify2Address} onChange={houseChange} rows={3}
                          className="w-full px-2 py-1.5 border border-input rounded text-xs bg-background resize-y" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-6" onClick={closeHouseModal}>Cancel</Button>
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6" onClick={saveHouse} disabled={houseSaving}>
                {houseSaving ? 'Saving...' : houseEditId ? 'Update House Job' : 'Create House Job'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* House Job Delete Confirmation */}
      {houseDeleteId !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setHouseDeleteId(null)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold text-primary">Delete House Job</h3>
              <button onClick={() => setHouseDeleteId(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this house job? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3 px-5 py-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setHouseDeleteId(null)}>Cancel</Button>
              <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={handleHouseDelete}>Delete</Button>
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
              <h3 className="text-lg font-bold text-primary">{sbEditId ? 'Edit Shipping Bill' : 'Add Shipping Bill'}</h3>
              <button onClick={closeSbModal} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0"><span className="text-destructive mr-1">*</span>Shipping Bill No</label>
                  <div className="flex-1">
                    <input name="shippingBillNo" value={sbForm.shippingBillNo} onChange={sbChange}
                      className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${sbErrors.shippingBillNo ? 'border-destructive' : 'border-input'}`} />
                    {sbErrors.shippingBillNo && <p className="text-xs text-destructive mt-0.5">? {sbErrors.shippingBillNo}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0"><span className="text-destructive mr-1">*</span>Shipping Bill Date</label>
                  <div className="flex-1">
                    <input type="date" name="shippingBillDate" value={sbForm.shippingBillDate} onChange={sbChange}
                      className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${sbErrors.shippingBillDate ? 'border-destructive' : 'border-input'}`} />
                    {sbErrors.shippingBillDate && <p className="text-xs text-destructive mt-0.5">? {sbErrors.shippingBillDate}</p>}
                  </div>
                </div>
              </div>
              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Mate Receipt No</label>
                  <input name="mateReceiptNo" value={sbForm.mateReceiptNo} onChange={sbChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Mate Receipt Date</label>
                  <input type="date" name="mateReceiptDate" value={sbForm.mateReceiptDate} onChange={sbChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
              </div>
              {/* Row 3 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">No Of PCS</label>
                  <div className="flex-1">
                    <input name="noOfPcs" value={sbForm.noOfPcs} onChange={sbChange}
                      className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${sbErrors.noOfPcs ? 'border-destructive' : 'border-input'}`} />
                    {sbErrors.noOfPcs && <p className="text-xs text-destructive mt-0.5">? {sbErrors.noOfPcs}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Pack Type</label>
                  <select name="packType" value={sbForm.packType} onChange={sbChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background">
                    <option value="">--Select--</option>
                    {SB_PACK_TYPES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              {/* Row 4 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Gross Weight</label>
                  <div className="flex-1">
                    <input name="grossWeight" value={sbForm.grossWeight} onChange={sbChange}
                      className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${sbErrors.grossWeight ? 'border-destructive' : 'border-input'}`} />
                    {sbErrors.grossWeight && <p className="text-xs text-destructive mt-0.5">? {sbErrors.grossWeight}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Measurement</label>
                  <input name="measurement" value={sbForm.measurement} onChange={sbChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
              </div>
              {/* Row 5 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Volume</label>
                  <div className="flex-1">
                    <input name="volume" value={sbForm.volume} onChange={sbChange}
                      className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${sbErrors.volume ? 'border-destructive' : 'border-input'}`} />
                    {sbErrors.volume && <p className="text-xs text-destructive mt-0.5">? {sbErrors.volume}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Commodity Code</label>
                  <input name="commodityCode" value={sbForm.commodityCode} onChange={sbChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
              </div>
              {/* Row 6 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0"><span className="text-destructive mr-1">*</span>Commodity Type</label>
                  <div className="flex-1">
                    <input name="commodityType" value={sbForm.commodityType} onChange={sbChange}
                      className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${sbErrors.commodityType ? 'border-destructive' : 'border-input'}`} />
                    {sbErrors.commodityType && <p className="text-xs text-destructive mt-0.5">? {sbErrors.commodityType}</p>}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0 pt-1">Commodity Desc</label>
                  <textarea name="commodityDesc" value={sbForm.commodityDesc} onChange={sbChange} rows={3}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y" />
                </div>
              </div>
              {/* Row 7 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0">Container No</label>
                  <input name="containerNo" value={sbForm.containerNo} onChange={sbChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-32 shrink-0"><span className="text-destructive mr-1">*</span>Container Type</label>
                  <div className="flex-1">
                    <select name="containerType" value={sbForm.containerType} onChange={sbChange}
                      className={`w-full px-2 py-1.5 border rounded text-xs bg-background ${sbErrors.containerType ? 'border-destructive' : 'border-input'}`}>
                      <option value="">--Select--</option>
                      {['20GP','40GP','40HC','45HC','20RF','40RF','20OT','40OT','20FR','40FR','40 FLAT COLLAPSIBLE','20 FLAT COLLAPSIBLE','20 FT','40 FT','LCL'].map(o => <option key={o}>{o}</option>)}
                    </select>
                    {sbErrors.containerType && <p className="text-xs text-destructive mt-0.5">? {sbErrors.containerType}</p>}
                  </div>
                </div>
              </div>
              {/* Row 8 */}
              <div className="flex items-start gap-2">
                <label className="text-xs font-semibold text-foreground w-32 shrink-0 pt-1">Note</label>
                <textarea name="note" value={sbForm.note} onChange={sbChange} rows={3}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y" />
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-6" onClick={closeSbModal}>Cancel</Button>
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6" onClick={saveSb} disabled={sbSaving}>
                {sbSaving ? 'Saving...' : sbEditId ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Working Team Modal */}
      <WorkingTeamModal
        open={isWorkingTeamOpen}
        form={teamForm}
        error={teamError}
        isEditing={teamEditId !== null}
        saving={teamSaving}
        employeeOptions={EMPLOYEE_OPTIONS}
        deptOptions={DEPT_OPTIONS}
        onChange={teamChange}
        onSave={saveTeam}
        onClose={() => { setIsWorkingTeamOpen(false); setTeamError(''); setTeamEditId(null); setTeamForm(initTeam); }}
      />

      {/* Working Team Delete Confirmation */}
      {teamDeleteId !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setTeamDeleteId(null)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold text-primary">Delete Team Member</h3>
              <button onClick={() => setTeamDeleteId(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this team member? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3 px-5 py-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setTeamDeleteId(null)}>Cancel</Button>
              <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={handleTeamDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* Profit Share Modal */}
      <ProfitShareModal
        open={isProfitShareOpen}
        form={profitForm}
        errors={profitErrors}
        jobNo={op?.document ?? ""}
        jobDate={op?.job_date ?? ""}
        isEditing={profitEditId !== null}
        saving={profitSaving}
        typeOptions={PS_TYPE_OPTIONS}
        toNameOptions={PS_TO_NAME_OPTIONS}
        onChange={profitChange}
        onSave={saveProfit}
        onClose={() => { setIsProfitShareOpen(false); setProfitErrors({}); setProfitForm(initProfit); setProfitEditId(null); }}
      />

      {/* Profit Share Delete Confirmation */}
      {profitDeleteId !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setProfitDeleteId(null)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold text-primary">Delete Profit Share</h3>
              <button onClick={() => setProfitDeleteId(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this profit share record? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3 px-5 py-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setProfitDeleteId(null)}>Cancel</Button>
              <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={handleProfitDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      <StatusUpdateModal
        open={isStatusUpdateOpen}
        form={statusForm}
        updateToOptions={UPDATE_TO_OPTIONS}
        positionOptions={POSITION_OPTIONS}
        isEditing={statusEditId !== null}
        saving={statusSaving}
        positionError={statusPositionError}
        onChange={statusChange}
        onSave={saveStatus}
        onClose={() => { setIsStatusUpdateOpen(false); setStatusForm(initStatus); setStatusPositionError(''); setStatusEditId(null); }}
      />

      {/* Status Update Delete Confirmation */}
      {statusDeleteId !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setStatusDeleteId(null)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold text-primary">Delete Status Update</h3>
              <button onClick={() => setStatusDeleteId(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this status update? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3 px-5 py-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setStatusDeleteId(null)}>Cancel</Button>
              <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={handleStatusDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Bill Delete Confirmation */}
      {sbDeleteId !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSbDeleteId(null)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold text-primary">Delete Shipping Bill</h3>
              <button onClick={() => setSbDeleteId(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-muted-foreground">Are you sure you want to delete this shipping bill? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3 px-5 py-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setSbDeleteId(null)}>Cancel</Button>
              <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={handleSbDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default ViewOperation;
