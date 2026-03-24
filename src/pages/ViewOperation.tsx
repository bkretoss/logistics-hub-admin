import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOperations } from './OperationsContext';

const CARRIER_OPTIONS = [
  'TEAMGLOBAL LOGISTICS PVT LTD',
  'Maersk Line',
  'Emirates SkyCargo',
  'ONE Line',
];

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex items-start gap-2 py-1.5">
    <span className="text-sm font-semibold text-foreground w-40 shrink-0">{label}</span>
    <span className="text-sm text-cyan-600 font-medium">{value || ''}</span>
  </div>
);

const NoData = () => (
  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
    <svg className="w-10 h-10 mb-3 opacity-25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v5M13 21h8M13 17l4 4-4 4" />
      <rect x="3" y="3" width="18" height="13" rx="2" strokeWidth={1.5} />
    </svg>
    <p className="text-sm font-medium">No Data Available</p>
  </div>
);

const TABS = ['Show All', 'Job Details', 'Subledgers', "Dimension's", 'Shipping Instructions', 'Costing', 'Shipping Bill / BOE', "House's List", 'Others'];

const STATIC_SUBLEDGERS = [
  { id: 1, subledgerType: 'CUSTOMER',  subledgerName: 'ARCHEAN INDUSTRIES PRIVATE LIMITED', address: 'NO.2, NORTH CRESCENT ROAD, T.NAGAR, CHENNAI 600017 INDIA',                          phone: '044-28340000', fax: '044-28340001', mobile: '9840012345', email: 'info@archean.in',       city: 'Chennai'   },
  { id: 2, subledgerType: 'AIRLINE',   subledgerName: 'KALRA ONLINE SERVICES PVT. LTD',      address: '414 4TH FLOOR AGI BUSINESS CENTRE, NEAR BUS STAND, JALANDHAR- (PUNJAB)',          phone: '0181-5000100', fax: '',             mobile: '9815500100', email: 'ops@kalraonline.com',  city: 'Jalandhar' },
  { id: 3, subledgerType: 'AGENT',     subledgerName: 'TEAMGLOBAL LOGISTICS PVT LTD',        address: 'REFLECTIONS BUILDING.2, LEITH CASTLE CENTER STREET, SANTHOME HIGH RD, CHENNAI', phone: '044-43539999', fax: '044-43539998', mobile: '9884400001', email: 'team@teamglobal.in',    city: 'Chennai'   },
  { id: 4, subledgerType: 'CONSIGNEE', subledgerName: 'TEXELQ ENGINEERING INDIA PVT LTD',    address: 'NO.77/2, KUTHAMPAKKAM ROAD, MEVVALURKKUPPAM, SRIPERUMBUDUR, KANCHIPURAM 602105', phone: '044-27162000', fax: '',             mobile: '9962200001', email: 'logistics@texelq.com', city: 'Sriperumbudur' },
];

const ViewOperation = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { operations, addOperation, updateOperation } = useOperations();
  const op = operations.find(o => o.id === Number(id));
  const [activeTab, setActiveTab] = useState('Job Details');
  const [dupOpen, setDupOpen] = useState(false);
  const [dupCarrier, setDupCarrier] = useState('');
  const [dupDate, setDupDate] = useState(new Date().toISOString().split('T')[0]);
  const [dupCarrierError, setDupCarrierError] = useState(false);

  // Rider Container modal
  const [riderOpen, setRiderOpen] = useState(false);

  // Routing modal
  const [routingOpen, setRoutingOpen] = useState(false);
  const PORT_OPTIONS = ['CHENNAI', 'MUMBAI', 'DELHI', 'KOLKATA', 'NHAVA SHEVA', 'COCHIN', 'JSD', 'JNPT'];
  const AIRLINE_OPTIONS = ['TEAMGLOBAL LOGISTICS PVT LTD', 'Maersk Line', 'Emirates SkyCargo', 'ONE Line'];
  const initRouting = {
    sNo: '10', fromPortCode: '', fromPortName: '', fromEtd: '', fromAtd: '',
    toPortCode: '', toPortName: '', position: 'Opened', toEta: '', toAta: '',
    airlineCode: '', flightName: '', status: 'Planned',
    fromEtdFollowup: 'No', notes: '',
  };
  const [routingForm, setRoutingForm] = useState(initRouting);
  const [routingRows, setRoutingRows] = useState<typeof initRouting[]>([]);
  const routingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setRoutingForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const saveRouting = () => {
    setRoutingRows(prev => [...prev, routingForm]);
    setRoutingForm({ ...initRouting, sNo: String(Number(routingForm.sNo) + 10) });
    setRoutingOpen(false);
  };

  // Add New Subledger modal
  const [slOpen, setSlOpen] = useState(false);
  const initSl = { customerName: '', categories: '', scacCode: '', address: '', pinCode: '', phone: '', mobile: '', emailId: '', gstState: '', gstNo: '', panNo: '', country: '' };
  const [slForm, setSlForm] = useState(initSl);
  const [slErrors, setSlErrors] = useState<Partial<typeof initSl>>({});
  const [slEditId, setSlEditId] = useState<number | null>(null);

  // Costing modal
  const [costOpen, setCostOpen] = useState(false);
  const initCost = {
    sNo: '10', charge: '', freightPpCc: '',
    description: '', unit: '', noOfUnit: '1',
    sacCode: '', note: '',
    saleOtherTerritory: 'No',
    // Sale Charges
    saleCustomer: '', saleDrCr: 'Cr (+)', saleCurrency: 'INR - INDIAN RUPEE', saleExRate: '1',
    salePerUnit: '1', saleCrcyAmount: '1', saleLocalAmount: '',
    saleTaxPct: '', saleTaxableAmount: '', saleNonTaxableAmount: '',
    saleCgst: '', saleSgst: '', saleIgst: '', saleTotalTax: '0',
    // Cost Charges
    costVendor: '', costDrCr: 'Dr (+)', costCurrency: 'INR - INDIAN RUPEE', costExRate: '1',
    costPerUnit: '', costCrcyAmount: '', costLocalAmount: '',
    costTaxPct: '', costTaxableAmount: '', costNonTaxableAmount: '',
    costCgst: '', costSgst: '', costIgst: '', costTotalTax: '',
  };
  const [costForm, setCostForm] = useState(initCost);
  const costChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setCostForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const ci = (name: keyof typeof initCost, cls = '') => (
    <input name={name} value={costForm[name]} onChange={costChange}
      className={`w-full px-2 py-1 border border-input rounded text-xs bg-background ${cls}`} />
  );
  const cs = (name: keyof typeof initCost, opts: string[], placeholder = '--Select--') => (
    <select name={name} value={costForm[name]} onChange={costChange}
      className="w-full px-2 py-1 border border-input rounded text-xs bg-background">
      {placeholder && <option value="">{placeholder}</option>}
      {opts.map(o => <option key={o}>{o}</option>)}
    </select>
  );
  const CHARGES = ['Freight', 'Documentation', 'Handling', 'THC', 'BL Fee', 'Customs', 'Transport', 'Other'];
  const UNITS = ['KG', 'CBM', 'PCS', 'BL', 'Container', 'Shipment', 'Ton'];
  const CURRENCIES = ['INR - INDIAN RUPEE', 'USD - US DOLLAR', 'EUR - EURO', 'AED - UAE DIRHAM', 'GBP - POUND'];
  const TAX_PCTS = ['0%', '5%', '12%', '18%', '28%'];
  const DR_CR_SALE = ['Cr (+)', 'Dr (-)'];
  const DR_CR_COST = ['Dr (+)', 'Cr (-)'];
  const CUSTOMERS = ['ARCHEAN INDUSTRIES PRIVATE LIMITED', 'TEXELQ ENGINEERING INDIA PVT LTD', 'TEXGRAM INC DBA INOTEX'];
  const VENDORS = ['TEAMGLOBAL LOGISTICS PVT LTD', 'Maersk Line', 'Emirates SkyCargo', 'ONE Line'];
  const saveCost = (keepOpen: boolean) => {
    setCostForm(keepOpen ? { ...initCost, sNo: String(Number(costForm.sNo) + 10) } : initCost);
    if (!keepOpen) setCostOpen(false);
  };
  const SL_CATEGORIES = ['Customer', 'Shipper', 'Consignee', 'Notify Party', 'Agent', 'Carrier', 'Co-Loader'];
  const SL_GST_STATES = ['Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Telangana', 'West Bengal'];
  const SL_COUNTRIES  = ['India', 'USA', 'UAE', 'Singapore', 'UK', 'China', 'Germany', 'Japan'];
  const slChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSlForm(prev => ({ ...prev, [name]: value }));
    if (slErrors[name as keyof typeof initSl]) setSlErrors(prev => ({ ...prev, [name]: '' }));
  };
  const slSave = () => {
    const errs: Partial<typeof initSl> = {};
    if (!slForm.customerName.trim()) errs.customerName = 'Required';
    if (!slForm.categories)          errs.categories   = 'Required';
    if (!slForm.address.trim())      errs.address      = 'Required';
    if (Object.keys(errs).length) { setSlErrors(errs); return; }
    const newEntry = {
      id: slEditId ?? Date.now(),
      subledgerType: slForm.categories.toUpperCase(),
      subledgerName: slForm.customerName,
      address: slForm.address,
      phone: slForm.phone,
      fax: '',
      mobile: slForm.mobile,
      email: slForm.emailId,
      city: '',
    };
    const current = (op!.subledgers ?? []).length === 0 ? STATIC_SUBLEDGERS : op!.subledgers;
    const updated = slEditId
      ? current.map(s => s.id === slEditId ? newEntry : s)
      : [...current, newEntry];
    updateOperation(op!.id, { subledgers: updated });
    setSlForm(initSl); setSlErrors({}); setSlEditId(null); setSlOpen(false);
  };
  const openSlEdit = (sl: typeof STATIC_SUBLEDGERS[0]) => {
    setSlEditId(sl.id);
    setSlForm({
      customerName: sl.subledgerName,
      categories: sl.subledgerType.charAt(0) + sl.subledgerType.slice(1).toLowerCase(),
      scacCode: '',
      address: sl.address,
      pinCode: '',
      phone: sl.phone,
      mobile: sl.mobile,
      emailId: sl.email,
      gstState: '',
      gstNo: '',
      panNo: '',
      country: '',
    });
    setSlErrors({});
    setSlOpen(true);
  };
  const [rider, setRider] = useState({
    containerNo: '', containerType: '', noOfPcs: '', packType: '',
    noOfPallet: '', volume: '',
    grossWeight: '', grossMeasure: 'Kg',
    volumeWeight: '', volumeMeasure: 'Kg',
    netWeight: '', netMeasure: 'Kg',
    commodityType: '', commodityCode: '',
    commodityDesc: '',
    manifestSeal: '', actualSeal: '', customSeal: '',
  });
  const riderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setRider(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const sel = (name: string) => (
    <select name={name} value={rider[name as keyof typeof rider]} onChange={riderChange}
      className="w-full px-2 py-1.5 border border-input rounded text-sm bg-background">
      <option value="">--Select--</option>
      {name === 'containerType'
        ? ['20GP','40GP','40HC','45HC','20RF','40RF'].map(o => <option key={o}>{o}</option>)
        : ['Boxes','Pallets','Cartons','Bags','Drums','Crates'].map(o => <option key={o}>{o}</option>)
      }
    </select>
  );
  const measureSel = (name: string) => (
    <select name={name} value={rider[name as keyof typeof rider]} onChange={riderChange}
      className="w-full px-2 py-1.5 border border-input rounded text-sm bg-background">
      {['Kg','Lbs','MT','CBM'].map(o => <option key={o}>{o}</option>)}
    </select>
  );
  const inp = (name: string, placeholder = '') => (
    <input name={name} value={rider[name as keyof typeof rider]} onChange={riderChange}
      placeholder={placeholder}
      className="w-full px-2 py-1.5 border border-input rounded text-sm bg-background" />
  );

  const handleDuplicate = () => {
    if (!dupCarrier) { setDupCarrierError(true); return; }
    addOperation({
      ...op,
      id: Date.now(),
      jobNo: '',
      jobDate: dupDate,
      carrier: dupCarrier,
      status: 'Created',
      statusColor: 'text-blue-500',
      statusBgColor: 'bg-blue-500/10',
    });
    setDupOpen(false);
  };

  const openDup = () => {
    setDupCarrier(op.carrier ?? '');
    setDupDate(new Date().toISOString().split('T')[0]);
    setDupCarrierError(false);
    setDupOpen(true);
  };

  if (!op) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Operation not found.</p>
        <Button className="mt-4" onClick={() => navigate('/operations')}>Back to List</Button>
      </div>
    );
  }

  const isVessel = ['FCL Import', 'FCL Export', 'LCL Export', 'LCL Import', 'Land Export', 'Land Import'].includes(op.document);
  const flightLabel = isVessel ? 'Vessel Name' : 'Flight Name';
  const numberLabel = ['Land Import', 'Land Export'].includes(op.document)
    ? 'Vessel Number'
    : isVessel ? 'Voyage Number' : 'Flight Number';

  return (
    <div className="space-y-4">
      {/* Breadcrumb + header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            <button className="hover:underline text-primary" onClick={() => navigate('/operations')}>Jobs List</button>
            {' › '}
            <span>Job No# - ( {op.jobNo || '—'} ~ {op.jobDate} )</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/operations')}>Cancel</Button>
          <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-black font-semibold">Reports</Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/operations/edit/${op.id}`)}>Edit</Button>
          <Button variant="outline" size="sm">Create</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border text-sm">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Job Details card */}
      {(activeTab === 'Job Details' || activeTab === 'Show All') && <div className="material-card material-elevation-1 overflow-hidden">
        <div className="bg-[#00BCD4] px-6 py-3 flex items-center justify-between">
          <h2 className="text-white font-bold text-base">Job Details</h2>
          <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-black font-semibold text-xs" onClick={openDup}>
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
                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white text-xs h-7 px-3">Gen BL NO#</Button>
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
                <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-black text-xs font-semibold"
                  onClick={() => setRiderOpen(true)}>Rider Container</Button>
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
                <div className="bg-slate-600 px-4 py-2">
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
      </div>}

      {/* Duplicate Job Modal */}
      {dupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDupOpen(false)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-[#00BCD4] px-5 py-3 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">Duplicate Job</h3>
              <button onClick={() => setDupOpen(false)} className="text-white hover:text-white/70">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Row 1: From Job No + New Job Date — same line */}
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-foreground whitespace-nowrap shrink-0">From Job No</label>
                  <Input value="RLPL/AE/J0302" readOnly className="bg-muted text-sm min-w-0" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-foreground whitespace-nowrap shrink-0">New Job Date</label>
                  <div className="relative min-w-0 flex-1">
                    <Input
                      type="date"
                      value={dupDate}
                      onChange={e => setDupDate(e.target.value)}
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
                    onChange={e => { setDupCarrier(e.target.value); setDupCarrierError(false); }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-background ${
                      dupCarrierError ? 'border-destructive' : 'border-input'
                    }`}
                  >
                    <option value="">--Select--</option>
                    {CARRIER_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
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
            <div className="bg-[#00BCD4] px-5 py-3 flex items-center justify-between shrink-0">
              <h3 className="text-white font-bold text-sm">Rider BL (Container)</h3>
              <button onClick={() => setRiderOpen(false)}
                className="w-5 h-5 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center">
                <X className="w-3 h-3 text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-5">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">

                {/* Row 1 */}
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Container No</label>
                  {inp('containerNo')}
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Container Type</label>
                  {sel('containerType')}
                </div>

                {/* Row 2 */}
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">No of PCS</label>
                  {inp('noOfPcs')}
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Pack Type</label>
                  {sel('packType')}
                </div>

                {/* Row 3 */}
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">No of Pallet</label>
                  {inp('noOfPallet')}
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Volume</label>
                  {inp('volume')}
                </div>

                {/* Row 4 — Gross Weight */}
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Gross Weight</label>
                  {inp('grossWeight')}
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Measuremer</label>
                  {measureSel('grossMeasure')}
                </div>

                {/* Row 5 — Volume Weight */}
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Volume Weight</label>
                  {inp('volumeWeight')}
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Measuremer</label>
                  {measureSel('volumeMeasure')}
                </div>

                {/* Row 6 — Net Weight */}
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Net Weight</label>
                  {inp('netWeight')}
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Measuremer</label>
                  {measureSel('netMeasure')}
                </div>

                {/* Row 7 — Commodity */}
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Commodity Type</label>
                  {inp('commodityType')}
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Commodity Code</label>
                  {inp('commodityCode')}
                </div>

                {/* Row 8 — Commodity Desc full width */}
                <div className="col-span-2 flex items-start gap-2">
                  <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground pt-1">Commodity Desc</label>
                  <textarea name="commodityDesc" value={rider.commodityDesc} onChange={riderChange}
                    rows={3} className="flex-1 px-2 py-1.5 border border-input rounded text-sm bg-background resize-y" />
                </div>

                {/* Row 9 — Seals */}
                <div className="col-span-2 flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <label className="w-28 shrink-0 text-right text-xs font-semibold text-foreground">Manifest Seal</label>
                    {inp('manifestSeal')}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <label className="shrink-0 text-xs font-semibold text-foreground whitespace-nowrap">Actual Seal</label>
                    {inp('actualSeal')}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <label className="shrink-0 text-xs font-semibold text-foreground whitespace-nowrap">Custom Seal</label>
                    {inp('customSeal')}
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
                <button className="px-3 py-1 bg-white text-xs font-semibold rounded border border-input">Actions ▾</button>
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
              <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-6"
                onClick={() => setRiderOpen(false)}>Cancel</Button>
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6">Create</Button>
            </div>
          </div>
        </div>
      )}

      {/* Subledgers card */}
      {(activeTab === 'Subledgers' || activeTab === 'Show All') && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-[#00BCD4] px-6 py-3 flex items-center justify-between">
            <h2 className="text-white font-bold text-base">Subledgers</h2>
          </div>
          <div className="p-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {['Subledger Type', 'Subledger Name', 'Address', 'Phone', 'Fax', 'Mobile', 'Email', 'City', 'Action'].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-semibold text-foreground text-xs whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {((op.subledgers ?? []).length === 0 ? STATIC_SUBLEDGERS : op.subledgers).map(sl => (
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
                      <button className="text-red-400 hover:text-red-600" onClick={() => openSlEdit(sl)}><Pencil className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-3">
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold"
                onClick={() => setSlOpen(true)}>
                Add New Subledgers
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dimensions card */}
      {(activeTab === "Dimension's" || activeTab === 'Show All') && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-[#00BCD4] px-6 py-3">
            <h2 className="text-white font-bold text-base">Dimension's</h2>
          </div>
          <NoData />
        </div>
      )}

      {/* Shipping Instructions card */}
      {(activeTab === 'Shipping Instructions' || activeTab === 'Show All') && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-[#00BCD4] px-6 py-3">
            <h2 className="text-white font-bold text-base">Shipping Instructions</h2>
          </div>
          <NoData />
        </div>
      )}

      {/* Costing card */}
      {(activeTab === 'Costing' || activeTab === 'Show All') && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-[#00BCD4] px-4 py-2.5 flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-white font-bold text-base shrink-0">Costing</h2>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Button size="sm" variant="outline" className="h-7 text-xs px-3 bg-white">Ex Rate</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs px-3 bg-white">Proforma INV</Button>
              <Button size="sm" className="h-7 text-xs px-3 bg-red-500 hover:bg-red-600 text-white border-0">Deleted Charges</Button>
              <Button size="sm" className="h-7 text-xs px-3 bg-amber-400 hover:bg-amber-500 text-black border-0">Job Vouchers</Button>
              <Button size="sm" className="h-7 text-xs px-3 bg-green-500 hover:bg-green-600 text-white border-0">Generate PCN</Button>
              <Button size="sm" className="h-7 text-xs px-3 bg-green-500 hover:bg-green-600 text-white border-0">Generate CN</Button>
              <Button size="sm" className="h-7 text-xs px-3 bg-green-500 hover:bg-green-600 text-white border-0">Generate INV</Button>
              <Button size="sm" className="h-7 text-xs px-3 bg-green-500 hover:bg-green-600 text-white border-0">Generate PI</Button>
              <Button size="sm" className="h-7 text-xs px-3 bg-slate-400 hover:bg-slate-500 text-white border-0" onClick={() => setCostOpen(true)}>Add Costing</Button>
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
                  { sale: 87500,  cost: 61200 },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/30">
                    <td className="px-3 py-2 text-xs text-foreground">{row.sale.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 text-xs text-foreground">{row.cost.toLocaleString('en-IN')}</td>
                    <td className={`px-3 py-2 text-xs font-medium ${row.sale - row.cost >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {(row.sale - row.cost).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Shipping Bill / BOE card */}
      {(activeTab === 'Shipping Bill / BOE' || activeTab === 'Show All') && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-[#00BCD4] px-6 py-3">
            <h2 className="text-white font-bold text-base">Shipping Bill / BOE</h2>
          </div>
          <NoData />
        </div>
      )}

      {/* House's List card */}
      {(activeTab === "House's List" || activeTab === 'Show All') && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-[#00BCD4] px-6 py-3">
            <h2 className="text-white font-bold text-base">House's List</h2>
          </div>
          <NoData />
        </div>
      )}

      {/* Others card */}
      {(activeTab === 'Others' || activeTab === 'Show All') && (
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-[#00BCD4] px-6 py-3">
            <h2 className="text-white font-bold text-base">Others</h2>
          </div>

          {/* Routing (Vessel Movement) */}
          <div className="border-b border-border">
            <div className="bg-[#00BCD4] px-6 py-2.5 flex items-center justify-between">
              <span className="text-white font-semibold text-sm">Routing (Vessel Movement)</span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs px-3 bg-white">Get Schedule</Button>
                <Button size="sm" variant="outline" className="h-7 text-xs px-3 bg-white font-semibold" onClick={() => setRoutingOpen(true)}>Routing +</Button>
              </div>
            </div>
            <div className="p-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {['Edit', 'Line No', 'From Port Code', 'From Port Name', 'From ETD', 'From ATD', 'To Port CODE', 'To port Name', 'To ETA', 'To ATA', 'Vessel / Flight Name', 'Status', 'Notes'].map(h => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {routingRows.map((row, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/30">
                      <td className="px-3 py-2"><button className="text-red-400 hover:text-red-600"><Pencil className="w-3.5 h-3.5" /></button></td>
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
                <Button size="sm" variant="outline" className="h-7 text-xs px-3 bg-white font-semibold">Add Working Team</Button>
              </div>
              <div className="p-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      {['Edit', 'Employee', 'Dept', 'Followup Required', 'Followup Date', 'Followup Note', 'Note'].map(h => (
                        <th key={h} className="text-left px-2 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border hover:bg-muted/30">
                      <td className="px-2 py-2"><button className="text-red-400 hover:text-red-600"><Pencil className="w-3.5 h-3.5" /></button></td>
                      <td className="px-2 py-2 text-xs text-foreground">MANAGEMENT</td>
                      <td className="px-2 py-2 text-xs text-foreground">SALES</td>
                      <td className="px-2 py-2 text-xs text-foreground"></td>
                      <td className="px-2 py-2 text-xs text-foreground"></td>
                      <td className="px-2 py-2 text-xs text-foreground"></td>
                      <td className="px-2 py-2 text-xs text-foreground">Auto Inserted</td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex justify-end mt-2 text-xs text-muted-foreground">1 - 1</div>
              </div>
            </div>
            <div>
              <div className="bg-[#00BCD4] px-4 py-2.5 flex items-center justify-between">
                <span className="text-white font-semibold text-sm">Profit Share</span>
                <Button size="sm" variant="outline" className="h-7 text-xs px-3 bg-white font-semibold">Add +</Button>
              </div>
              <div className="p-4 min-h-[80px]" />
            </div>
          </div>

          {/* Status Update */}
          <div className="border-b border-border">
            <div className="bg-[#00BCD4] px-6 py-2.5 flex items-center justify-between">
              <span className="text-white font-semibold text-sm">Status Update</span>
              <button className="w-5 h-5 rounded-full border border-white/60 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white/80 inline-block" />
              </button>
            </div>
            <div className="p-4 min-h-[40px]" />
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
                    {['Insert / Update', 'Created / Updated By', 'Field Name', 'Old Value', 'New Value', 'Time'].map(h => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-foreground text-xs whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="px-3 py-2 text-xs text-foreground">New Record</td>
                    <td className="px-3 py-2 text-xs text-cyan-600">info@relay-logistics.com</td>
                    <td className="px-3 py-2 text-xs text-cyan-600">{op.jobNo || 'RLPL/AE/J0303'}</td>
                    <td className="px-3 py-2 text-xs text-foreground">-</td>
                    <td className="px-3 py-2 text-xs text-foreground">-</td>
                    <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">{op.jobDate ? `${op.jobDate} 12:03PM` : '24-MAR-2026 12:03PM'}</td>
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
                <div className="flex items-center gap-1 border border-input rounded px-2 py-1 bg-background">
                  <span className="text-xs text-muted-foreground">🔍</span>
                  <span className="text-xs text-muted-foreground">▾</span>
                </div>
                <input className="flex-1 max-w-xs px-2 py-1 text-xs rounded border border-input bg-background" />
                <button className="px-3 py-1 bg-background text-xs font-semibold rounded border border-input">Go</button>
                <button className="px-3 py-1 bg-background text-xs font-semibold rounded border border-input">Actions ▾</button>
              </div>
              <div className="overflow-x-auto">
                <table className="text-sm border-collapse" style={{ minWidth: '1600px' }}>
                  <thead>
                    <tr className="border-b border-border">
                      {['Customer Name','Customer Address','Shipper Name','Shipper Address','Consignee Name','Consignee Address','Notify Name','Notify Address','BL No','Carrier SCAC Code','MBL No','Place of Receipt','POR Name','POL Port','POL Name','POD Name','POD Port'].map(h => (
                        <th key={h} className="text-left px-3 py-2 font-semibold text-cyan-600 text-xs whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border hover:bg-muted/30">
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">ARCHEAN INDUSTRIES PRIVATE LIMITED</td>
                      <td className="px-3 py-2 text-xs text-foreground" style={{ maxWidth: '180px' }}>NO.2,NORTH CRESCENT ROAD, T.NAGAR,CHENNAI 600017 INDIA...</td>
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
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">SIKORSKY HELIPORT-STRATFORD, CT</td>
                      <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">SIKORSKY HELIPORT-STRATFORD, CT</td>
                      <td className="px-3 py-2 text-xs text-foreground">JSD</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-2 text-xs text-muted-foreground">1 - 1</div>
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
            <div className="bg-[#00BCD4] px-5 py-3 flex items-center justify-between shrink-0">
              <h3 className="text-white font-bold text-sm">Costing Details</h3>
              <button onClick={() => setCostOpen(false)}
                className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white font-bold text-xs">✕</button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-5 space-y-4">

              {/* Row 1: S.No, Charge, Freight PP/CC */}
              <div className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-foreground block mb-1">S.No#</label>
                  {ci('sNo', 'text-right')}
                </div>
                <div className="col-span-5">
                  <label className="text-xs font-semibold text-foreground block mb-1"><span className="text-destructive mr-1">*</span>Charge</label>
                  {cs('charge', CHARGES)}
                </div>
                <div className="col-span-5">
                  <label className="text-xs font-semibold text-foreground block mb-1"><span className="text-destructive mr-1">*</span>Freight PP / CC</label>
                  {cs('freightPpCc', ['Prepaid', 'Collect'])}
                </div>
              </div>

              {/* Row 2: Description, Unit, No of Unit */}
              <div className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5">
                  <label className="text-xs font-semibold text-foreground block mb-1">Description</label>
                  {ci('description')}
                </div>
                <div className="col-span-3">
                  <label className="text-xs font-semibold text-foreground block mb-1"><span className="text-destructive mr-1">*</span>Unit</label>
                  {cs('unit', UNITS)}
                </div>
                <div className="col-span-4">
                  <label className="text-xs font-semibold text-foreground block mb-1"><span className="text-destructive mr-1">*</span>No of Unit</label>
                  {ci('noOfUnit', 'text-right')}
                </div>
              </div>

              {/* Row 3: SAC Code, Note */}
              <div className="grid grid-cols-12 gap-3 items-start">
                <div className="col-span-5">
                  <label className="text-xs font-semibold text-foreground block mb-1"><span className="text-destructive mr-1">*</span>SAC Code</label>
                  {ci('sacCode')}
                </div>
                <div className="col-span-7">
                  <label className="text-xs font-semibold text-foreground block mb-1">Note</label>
                  <textarea name="note" value={costForm.note} onChange={costChange} rows={2}
                    className="w-full px-2 py-1 border border-input rounded text-xs bg-background resize-none" />
                </div>
              </div>

              {/* Row 4: Sale Other Territory */}
              <div className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5">
                  <label className="text-xs font-semibold text-foreground block mb-1">Sale Other Territory</label>
                  {cs('saleOtherTerritory', ['No', 'Yes'], '')}
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
                        {cs('saleCustomer', CUSTOMERS)}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Sale Dr / Cr</label>
                        {cs('saleDrCr', DR_CR_SALE, '')}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Currency</label>
                        {cs('saleCurrency', CURRENCIES, '')}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Ex.Rate</label>
                        {ci('saleExRate', 'text-right')}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Per Unit</label>
                        {ci('salePerUnit', 'text-right')}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Crcy Amount</label>
                        {ci('saleCrcyAmount', 'text-right')}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Local Amount</label>
                        {ci('saleLocalAmount', 'text-right')}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Tax %</label>
                        {cs('saleTaxPct', TAX_PCTS)}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Taxable Amount</label>
                        {ci('saleTaxableAmount', 'text-right')}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Non Taxable Amount</label>
                        {ci('saleNonTaxableAmount', 'text-right')}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">CGST Amount</label>
                        {ci('saleCgst', 'text-right')}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">SGST Amount</label>
                        {ci('saleSgst', 'text-right')}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">IGST Amount</label>
                        {ci('saleIgst', 'text-right')}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Total Tax Amount</label>
                        {ci('saleTotalTax', 'text-right')}
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
                        {cs('costVendor', VENDORS)}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Cost Dr / Cr</label>
                        {cs('costDrCr', DR_CR_COST, '')}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Currency</label>
                        {cs('costCurrency', CURRENCIES, '')}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Ex.Rate</label>
                        {ci('costExRate', 'text-right')}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Per Unit</label>
                        {ci('costPerUnit', 'text-right')}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Crcy Amount</label>
                        {ci('costCrcyAmount', 'text-right')}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Local Amount</label>
                        {ci('costLocalAmount', 'text-right')}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Tax %</label>
                        {cs('costTaxPct', TAX_PCTS)}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Taxable Amount</label>
                        {ci('costTaxableAmount', 'text-right')}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Non Taxable Amount</label>
                        {ci('costNonTaxableAmount', 'text-right')}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">CGST Amount</label>
                        {ci('costCgst', 'text-right')}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">SGST Amount</label>
                        {ci('costSgst', 'text-right')}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">IGST Amount</label>
                        {ci('costIgst', 'text-right')}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">Total Tax Amount</label>
                        {ci('costTotalTax', 'text-right')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button size="sm" variant="outline" className="px-5" onClick={() => setCostOpen(false)}>Cancel</Button>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="px-5" onClick={() => saveCost(true)}>Save &amp; New</Button>
                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white px-5" onClick={() => saveCost(false)}>Save &amp; Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Subledger Modal */}
      {slOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setSlOpen(false); setSlForm(initSl); setSlErrors({}); setSlEditId(null); }} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-md mx-4 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="bg-[#00BCD4] px-5 py-3 flex items-center justify-between shrink-0">
              <h3 className="text-white font-bold text-sm">{slEditId ? 'Edit Subledger' : 'New Customer'}</h3>
              <button onClick={() => { setSlOpen(false); setSlForm(initSl); setSlErrors({}); setSlEditId(null); }}
                className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white font-bold text-xs">✕</button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-3">
              {/* Customer Name */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0"><span className="text-destructive mr-1">*</span>Customer Name</label>
                <div className="flex-1">
                  <input name="customerName" value={slForm.customerName} onChange={slChange}
                    className={`w-full px-3 py-1.5 border rounded text-sm bg-background ${slErrors.customerName ? 'border-destructive' : 'border-input'}`} />
                  {slErrors.customerName && <p className="text-xs text-destructive mt-0.5">{slErrors.customerName}</p>}
                </div>
              </div>
              {/* Categories */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0"><span className="text-destructive mr-1">*</span>Categories</label>
                <div className="flex-1">
                  <select name="categories" value={slForm.categories} onChange={slChange}
                    className={`w-full px-3 py-1.5 border rounded text-sm bg-background ${slErrors.categories ? 'border-destructive' : 'border-input'}`}>
                    <option value="">--Select--</option>
                    {SL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  {slErrors.categories && <p className="text-xs text-destructive mt-0.5">{slErrors.categories}</p>}
                </div>
              </div>
              {/* SCAC Code */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">SCAC Code</label>
                <input name="scacCode" value={slForm.scacCode} onChange={slChange}
                  className="flex-1 px-3 py-1.5 border border-input rounded text-sm bg-background" />
              </div>
              {/* Address */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0"><span className="text-destructive mr-1">*</span>Address</label>
                <div className="flex-1">
                  <input name="address" value={slForm.address} onChange={slChange}
                    className={`w-full px-3 py-1.5 border rounded text-sm bg-background ${slErrors.address ? 'border-destructive' : 'border-input'}`} />
                  {slErrors.address && <p className="text-xs text-destructive mt-0.5">{slErrors.address}</p>}
                </div>
              </div>
              {/* Pin Code */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">Pin Code</label>
                <input name="pinCode" value={slForm.pinCode} onChange={slChange}
                  className="flex-1 px-3 py-1.5 border border-input rounded text-sm bg-background" />
              </div>
              {/* Phone */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">Phone</label>
                <input name="phone" value={slForm.phone} onChange={slChange}
                  className="flex-1 px-3 py-1.5 border border-input rounded text-sm bg-background" />
              </div>
              {/* Mobile */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">Mobile</label>
                <input name="mobile" value={slForm.mobile} onChange={slChange}
                  className="flex-1 px-3 py-1.5 border border-input rounded text-sm bg-background" />
              </div>
              {/* Email Id */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">Email Id</label>
                <input name="emailId" value={slForm.emailId} onChange={slChange}
                  className="flex-1 px-3 py-1.5 border border-input rounded text-sm bg-background" />
              </div>
              {/* GST State */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">GST State</label>
                <select name="gstState" value={slForm.gstState} onChange={slChange}
                  className="flex-1 px-3 py-1.5 border border-input rounded text-sm bg-background">
                  <option value="">--Select--</option>
                  {SL_GST_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              {/* GST No */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">GST No</label>
                <input name="gstNo" value={slForm.gstNo} onChange={slChange}
                  className="flex-1 px-3 py-1.5 border border-input rounded text-sm bg-background" />
              </div>
              {/* PAN No */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">PAN No</label>
                <input name="panNo" value={slForm.panNo} onChange={slChange}
                  className="flex-1 px-3 py-1.5 border border-input rounded text-sm bg-background" />
              </div>
              {/* Country */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground text-right w-28 shrink-0">Country</label>
                <input name="country" value={slForm.country} onChange={slChange}
                  className="flex-1 px-3 py-1.5 border border-input rounded text-sm bg-background" />
              </div>
            </div>
            <div className="flex justify-end px-6 py-4 border-t border-border shrink-0">
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6" onClick={slSave}>{slEditId ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </div>
      )}
      {/* Routing Modal */}
      {routingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRoutingOpen(false)} />
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden">
            <div className="bg-[#00BCD4] px-5 py-3 flex items-center justify-between shrink-0">
              <h3 className="text-white font-bold text-sm">Routing</h3>
              <button onClick={() => setRoutingOpen(false)}
                className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white font-bold text-xs">✕</button>
            </div>
            <div className="px-5 py-4 space-y-3">
              {/* Row 1: S.No# + From Port Code */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0">S.No#</label>
                <input name="sNo" value={routingForm.sNo} onChange={routingChange}
                  className="w-16 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                <label className="text-xs font-semibold text-foreground whitespace-nowrap ml-2">From Port Code</label>
                <select name="fromPortCode" value={routingForm.fromPortCode} onChange={routingChange}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background">
                  <option value="">--Select--</option>
                  {PORT_OPTIONS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              {/* Row 1b: From Port Name */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0">From Port Name</label>
                <input name="fromPortName" value={routingForm.fromPortName} onChange={routingChange}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
              </div>
              {/* Row 2: From ETD + From ATD */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-20 shrink-0">From ETD</label>
                  <input type="date" name="fromEtd" value={routingForm.fromEtd} onChange={routingChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-20 shrink-0">From ATD</label>
                  <input type="date" name="fromAtd" value={routingForm.fromAtd} onChange={routingChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
              </div>
              {/* Row 3: To Port Code + Position */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-20 shrink-0">To Port Code</label>
                  <select name="toPortCode" value={routingForm.toPortCode} onChange={routingChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background">
                    <option value="">--Select--</option>
                    {PORT_OPTIONS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground whitespace-nowrap shrink-0">
                    Position <span className="text-destructive">*</span>
                  </label>
                  <select name="position" value={routingForm.position} onChange={routingChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background ml-2">
                    {['Opened', 'Closed', 'In Transit', 'Arrived'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              {/* Row 3b: To Port Name */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-foreground w-20 shrink-0">To Port Name</label>
                <input name="toPortName" value={routingForm.toPortName} onChange={routingChange}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
              </div>
              {/* Row 4: To ETA + To ATA */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-20 shrink-0">To ETA</label>
                  <input type="date" name="toEta" value={routingForm.toEta} onChange={routingChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-20 shrink-0">To ATA</label>
                  <input type="date" name="toAta" value={routingForm.toAta} onChange={routingChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
              </div>
              {/* Row 5: Airline Code */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0">Airline Code</label>
                <select name="airlineCode" value={routingForm.airlineCode} onChange={routingChange}
                  className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background">
                  <option value="">--Select--</option>
                  {AIRLINE_OPTIONS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              {/* Row 6: Flight Name + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-20 shrink-0">Flight Name</label>
                  <input name="flightName" value={routingForm.flightName} onChange={routingChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground w-14 shrink-0">Status</label>
                  <select name="status" value={routingForm.status} onChange={routingChange}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background">
                    {['Planned', 'Confirmed', 'Departed', 'Arrived', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              {/* Row 7: From ETD Followup toggle */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0">From ETD Followup</label>
                <div className="flex rounded overflow-hidden border border-input">
                  {['No', 'Yes'].map(opt => (
                    <button key={opt} type="button"
                      onClick={() => setRoutingForm(prev => ({ ...prev, fromEtdFollowup: opt }))}
                      className={`px-5 py-1.5 text-xs font-semibold transition-colors ${
                        routingForm.fromEtdFollowup === opt
                          ? 'bg-[#00BCD4] text-white'
                          : 'bg-background text-foreground hover:bg-muted'
                      }`}>{opt}</button>
                  ))}
                </div>
              </div>
              {/* Row 8: Notes */}
              <div className="flex items-start gap-2">
                <label className="text-xs font-semibold text-foreground w-28 shrink-0 pt-1">Notes</label>
                <textarea name="notes" value={routingForm.notes} onChange={routingChange}
                  rows={3} className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-background resize-y" />
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
              <Button size="sm" variant="outline" className="px-5" onClick={() => setRoutingOpen(false)}>Cancel</Button>
              <Button size="sm" className="bg-[#00BCD4] hover:bg-cyan-600 text-white px-6" onClick={saveRouting}>Create</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOperation;
