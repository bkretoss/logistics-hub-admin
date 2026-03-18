import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useOperations } from './OperationsContext';

const BRANCHES        = ['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Kolkata'];
const FREIGHT_OPTIONS = ['Prepaid', 'Collect'];
const POL_OPTIONS     = ['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Nhava Sheva', 'Kolkata', 'Cochin'];
const POD_OPTIONS     = ['Dubai', 'Singapore', 'Hong Kong', 'Shanghai', 'London', 'New York', 'Los Angeles'];
const SERVICE_TYPES   = ['FCL/FCL', 'FCL/LCL', 'LCL/FCL', 'LCL/LCL', 'DOOR TO DOOR', 'DOOR TO PORT', 'PORT TO PORT', 'PORT TO DOOR'];
const CATEGORIES       = ['Customer', 'Shipper', 'Consignee', 'Notify Party', 'Agent', 'Carrier', 'Co-Loader'];
const GST_STATES       = ['Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Telangana', 'West Bengal'];
const COUNTRIES        = ['India', 'USA', 'UAE', 'Singapore', 'UK', 'China', 'Germany', 'Japan'];
const COA_OPTIONS      = ['Accounts Receivable', 'Accounts Payable', 'Cash', 'Bank', 'Revenue', 'Expense'];
const PAYMENT_MODES    = ['Cash', 'Bank Transfer', 'Cheque', 'Credit Card', 'Online'];
const CURRENCIES       = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'JPY'];

const CUSTOMER_OPTIONS  = [
  { name: 'TEXGRAM INC DBA INOTEX', address: '12828 S BROADWAY\nLOS ANGELES, CA 90061\nTEL: 714-240-4446' },
  { name: 'Acme Corporation', address: '123 Acme Street\nNew York, NY 10001' },
  { name: 'Global Shipping Ltd', address: '45 Harbor Road\nSingapore 098765' },
  { name: 'Pacific Freight Co', address: '789 Pacific Ave\nLos Angeles, CA 90045' },
];
const SHIPPER_OPTIONS   = [
  { name: 'TEST1', address: 'aaaa' },
  { name: 'Relay Logistics', address: '22 Relay Park\nMumbai, MH 400001' },
  { name: 'FastTrack Shippers', address: '5 FastTrack Blvd\nDelhi, DL 110001' },
  { name: 'BlueLine Shipping', address: '9 BlueLine Wharf\nChennai, TN 600001' },
];
const CARRIER_OPTIONS   = [
  { name: 'TEAMGLOBAL LOGISTICS PVT LTD', address: 'Reflections building.2, Leith Castle\nCenter Street, Santhome High Rd, Chennai,\nTamil Nadu 600028' },
  { name: 'Maersk Line', address: '50 Maersk Tower\nCopenhagen, Denmark 1263' },
  { name: 'Emirates SkyCargo', address: 'Emirates SkyCargo Centre\nDubai Airport Freezone, Dubai' },
  { name: 'ONE Line', address: '7 ONE Logistics Park\nSingapore 609919' },
];
const CONSIGNEE_OPTIONS = [
  { name: 'TEXELQ ENGINEERING INDIA PRIVATE LIMITED', address: 'NO.77/2, KUTHAMPAKKAM ROAD,\nMEVALURKUPPAM, SRIPERUMBUDUR (TK)\nKANCHIPURAM DIST - 602105.' },
  { name: 'Gulf Traders LLC', address: 'Plot 14, Gulf Industrial Area\nSharjah, UAE' },
  { name: 'SG Imports Pte', address: '33 Tuas South Ave\nSingapore 637644' },
  { name: 'UK Distributors Ltd', address: '12 Commerce Road\nLondon, EC1A 1BB' },
];

export interface OperationFormData {
  jobNo: string;
  document: string;
  branch: string;
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
  customerAddress: string;
  shipper: string;
  shipperAddress: string;
  carrier: string;
  carrierAddress: string;
  consignee: string;
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
}

const initialForm: OperationFormData = {
  jobNo: '',
  document: 'Air Export',
  branch: '',
  jobDate: new Date().toISOString().split('T')[0],
  freightPpCc: 'Collect',
  placeOfReceipt: '',
  placeOfDelivery: '',
  pol: '',
  pod: '',
  polEtd: '',
  flightName: '',
  flightNumber: '',
  podEta: '',
  note: '',
  serviceType: '',
  blServiceType: '',
  blNo: '',
  mblNo: '',
  salesPerson: '',
  customer: '',
  customerAddress: '',
  shipper: '',
  shipperAddress: '',
  carrier: '',
  carrierAddress: '',
  consignee: '',
  consigneeAddress: '',
  notify1: '',
  deliveryAgentName: '',
  deliveryAgent: '',
  deliveryStatus: '',
  deliveryDate: '',
  bookingDate: new Date().toISOString().split('T')[0],
  bookingType: 'Import',
  blMarksNo: '',
  etd: new Date().toISOString().split('T')[0],
  eta: '',
  vesselName: '',
  voyageNumber: '',
};

interface SubledgerForm {
  customerName: string;
  categories: string;
  scacCode: string;
  address: string;
  pinCode: string;
  phone: string;
  mobile: string;
  emailId: string;
  gstState: string;
  gstNo: string;
  panNo: string;
  country: string;
  coa: string;
  paymentMode: string;
  currency: string;
}

const initialSubledger: SubledgerForm = {
  customerName: '',
  categories: '',
  scacCode: '',
  address: '',
  pinCode: '',
  phone: '',
  mobile: '',
  emailId: '',
  gstState: '',
  gstNo: '',
  panNo: '',
  country: '',
  coa: '',
  paymentMode: 'Cash',
  currency: '',
};

const NewOperation = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addOperation, updateOperation, operations } = useOperations();
  const editOp = id ? operations.find(o => o.id === Number(id)) : undefined;
  const isEdit = !!editOp;

  const [formData, setFormData] = useState<OperationFormData>(editOp ?? initialForm);

  useEffect(() => {
    if (editOp) setFormData(editOp);
  }, [id]);
  const [errors, setErrors]             = useState<Partial<Record<keyof OperationFormData, string>>>({});
  const [subledgerOpen, setSubledgerOpen] = useState(false);
  const [subledger, setSubledger]       = useState<SubledgerForm>(initialSubledger);
  const [subledgerErrors, setSubledgerErrors] = useState<Partial<Record<keyof SubledgerForm, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof OperationFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const e: Partial<Record<keyof OperationFormData, string>> = {};
    if (!formData.jobDate)                  e.jobDate         = 'Job Date is required';
    if (!formData.placeOfReceipt.trim())    e.placeOfReceipt  = 'Place of Receipt is required';
    if (!formData.placeOfDelivery.trim())   e.placeOfDelivery = 'Place of Delivery is required';
    if (!formData.pol)                      e.pol             = 'POL is required';
    if (!formData.pod)                      e.pod             = 'POD is required';
    if (!formData.polEtd)                   e.polEtd          = 'POL ETD is required';
    if (!formData.podEta)                   e.podEta          = 'POD ETA is required';
    if (!formData.customer)                 e.customer        = 'Customer is required';
    if (!formData.carrier)                  e.carrier         = 'Carrier is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (isEdit && editOp) {
      updateOperation(editOp.id, formData);
    } else {
      addOperation({
        ...formData,
        id: Date.now(),
        status: 'Created',
        statusColor: 'text-blue-500',
        statusBgColor: 'bg-blue-500/10',
      });
    }
    navigate('/operations');
    window.scrollTo(0, 0);
  };

  const closeSubledger = () => {
    setSubledger(initialSubledger);
    setSubledgerErrors({});
    setSubledgerOpen(false);
  };

  const handleSubledgerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSubledger(prev => ({ ...prev, [name]: value }));
    if (subledgerErrors[name as keyof SubledgerForm]) {
      setSubledgerErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateSubledger = () => {
    const e: Partial<Record<keyof SubledgerForm, string>> = {};
    if (!subledger.customerName.trim()) e.customerName = 'Customer Name is required';
    if (!subledger.categories)          e.categories   = 'Categories is required';
    if (!subledger.address.trim())      e.address      = 'Address is required';
    setSubledgerErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubledgerCreate = () => {
    if (!validateSubledger()) return;
    console.log('Subledger created:', subledger);
    setSubledger(initialSubledger);
    setSubledgerErrors({});
    setSubledgerOpen(false);
  };

  const sel = (err?: string) =>
    `w-full px-3 py-2 border rounded-lg text-sm bg-background ${err ? 'border-destructive' : 'border-input'}`;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/operations')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{isEdit ? 'Edit Operation' : 'New Operation'}</h1>
          <p className="text-muted-foreground text-sm mt-1">{isEdit ? `Editing ${editOp?.jobNo || 'operation'}` : 'Create a new logistics operation'}</p>
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
                <select id="document" name="document" value={formData.document} onChange={e => {
                  setFormData({
                    ...initialForm,
                    document: e.target.value,
                    jobDate: formData.jobDate,
                  });
                  setErrors({});
                }} className={sel()}>
                  {['Air Export','Air Import','FCL Export','FCL Import','Land Export','Land Import','LCL Export','LCL Import'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* Branch */}
            <div className="flex items-center gap-4">
              <Label htmlFor="branch" className="text-sm font-semibold w-40 shrink-0">Branch</Label>
              <div className="flex-1">
                <select id="branch" name="branch" value={formData.branch} onChange={handleChange} className={sel()}>
                  <option value="">Select</option>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            {/* Job Date */}
            <div className="flex items-center gap-4">
              <Label htmlFor="jobDate" className="text-sm font-semibold w-40 shrink-0">
                Job Date <span className="text-destructive">*</span>
              </Label>
              <div className="flex-1">
                <Input id="jobDate" name="jobDate" type="date" value={formData.jobDate} onChange={handleChange}
                  className={errors.jobDate ? 'border-destructive' : ''} />
                {errors.jobDate && <p className="text-xs text-destructive mt-1">{errors.jobDate}</p>}
              </div>
            </div>

            {/* Freight PP/CC */}
            <div className="flex items-center gap-4">
              <Label htmlFor="freightPpCc" className="text-sm font-semibold w-40 shrink-0">Freight PP / CC</Label>
              <div className="flex-1">
                <select id="freightPpCc" name="freightPpCc" value={formData.freightPpCc} onChange={handleChange} className={sel()}>
                  {FREIGHT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Place of Receipt */}
            <div className="flex items-center gap-4">
              <Label htmlFor="placeOfReceipt" className="text-sm font-semibold w-40 shrink-0">
                Place of Receipt <span className="text-destructive">*</span>
              </Label>
              <div className="flex-1">
                <Input id="placeOfReceipt" name="placeOfReceipt" value={formData.placeOfReceipt} onChange={handleChange}
                  className={errors.placeOfReceipt ? 'border-destructive' : ''} />
                {errors.placeOfReceipt && <p className="text-xs text-destructive mt-1">{errors.placeOfReceipt}</p>}
              </div>
            </div>

            {/* Place of Delivery */}
            <div className="flex items-center gap-4">
              <Label htmlFor="placeOfDelivery" className="text-sm font-semibold w-40 shrink-0">
                Place of Delivery <span className="text-destructive">*</span>
              </Label>
              <div className="flex-1">
                <Input id="placeOfDelivery" name="placeOfDelivery" value={formData.placeOfDelivery} onChange={handleChange}
                  className={errors.placeOfDelivery ? 'border-destructive' : ''} />
                {errors.placeOfDelivery && <p className="text-xs text-destructive mt-1">{errors.placeOfDelivery}</p>}
              </div>
            </div>

            {/* POL */}
            <div className="flex items-center gap-4">
              <Label htmlFor="pol" className="text-sm font-semibold w-40 shrink-0">
                POL <span className="text-destructive">*</span>
              </Label>
              <div className="flex-1">
                <select id="pol" name="pol" value={formData.pol} onChange={handleChange} className={sel(errors.pol)}>
                  <option value="">-Select-</option>
                  {POL_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.pol && <p className="text-xs text-destructive mt-1">{errors.pol}</p>}
              </div>
            </div>

            {/* POD */}
            <div className="flex items-center gap-4">
              <Label htmlFor="pod" className="text-sm font-semibold w-40 shrink-0">
                POD <span className="text-destructive">*</span>
              </Label>
              <div className="flex-1">
                <select id="pod" name="pod" value={formData.pod} onChange={handleChange} className={sel(errors.pod)}>
                  <option value="">-Select-</option>
                  {POD_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.pod && <p className="text-xs text-destructive mt-1">{errors.pod}</p>}
              </div>
            </div>

            {/* POL ETD */}
            <div className="flex items-center gap-4">
              <Label htmlFor="polEtd" className="text-sm font-semibold w-40 shrink-0">
                POL ETD <span className="text-destructive">*</span>
              </Label>
              <div className="flex-1">
                <Input id="polEtd" name="polEtd" type="date" value={formData.polEtd} onChange={handleChange}
                  className={errors.polEtd ? 'border-destructive' : ''} />
                {errors.polEtd && <p className="text-xs text-destructive mt-1">{errors.polEtd}</p>}
              </div>
            </div>

            {/* Flight/Vessel Name */}
            <div className="flex items-center gap-4">
              <Label htmlFor="flightName" className="text-sm font-semibold w-40 shrink-0">{['FCL Import','FCL Export','Land Export','Land Import','LCL Export','LCL Import'].includes(formData.document) ? 'Vessel Name' : 'Flight Name'}</Label>
              <div className="flex-1">
                <Input id="flightName" name="flightName" value={formData.flightName} onChange={handleChange} />
              </div>
            </div>

            {/* Flight/Voyage Number */}
            <div className="flex items-center gap-4">
              <Label htmlFor="flightNumber" className="text-sm font-semibold w-40 shrink-0">{['Land Import','Land Export'].includes(formData.document) ? 'Vessel Number' : ['FCL Import','FCL Export','LCL Export','LCL Import'].includes(formData.document) ? 'Voyage Number' : 'Flight Number'}</Label>
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
                <Input id="podEta" name="podEta" type="date" value={formData.podEta} onChange={handleChange}
                  className={errors.podEta ? 'border-destructive' : ''} />
                {errors.podEta && <p className="text-xs text-destructive mt-1">{errors.podEta}</p>}
              </div>
            </div>

            {/* Note */}
            <div className="flex items-start gap-4 md:col-span-2">
              <Label htmlFor="note" className="text-sm font-semibold w-40 shrink-0 pt-2">Note</Label>
              <div className="flex-1">
                <Textarea id="note" name="note" value={formData.note} onChange={handleChange} rows={4} className="resize-y" />
              </div>
            </div>

            {/* Service Type */}
            <div className="flex items-center gap-4">
              <Label htmlFor="serviceType" className="text-sm font-semibold w-40 shrink-0">Service Type</Label>
              <div className="flex-1">
                <select id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange} className={sel()}>
                  <option value="">--Select--</option>
                  {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
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
          <Button type="button" className="material-button text-black gap-2"
            onClick={() => setSubledgerOpen(true)}>
            <Plus className="w-4 h-4" />
            Add New Subledger
          </Button>
        </div>
        <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Customer */}
          <div className="material-card material-elevation-1 overflow-hidden">
            <div className="bg-[#00BCD4] px-5 py-2.5">
              <h3 className="text-white font-semibold text-sm">Customer</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="customer" className="text-sm font-semibold w-24 shrink-0">
                  <span className="text-destructive mr-1">*</span>Customer
                </Label>
                <div className="flex-1">
                  <select id="customer" name="customer" value={formData.customer} onChange={e => {
                    const selected = CUSTOMER_OPTIONS.find(c => c.name === e.target.value);
                    setFormData(prev => ({ ...prev, customer: e.target.value, customerAddress: selected?.address ?? '' }));
                    if (errors.customer) setErrors(prev => ({ ...prev, customer: '' }));
                  }}
                    className={sel(errors.customer)}>
                    <option value="">Select</option>
                    {CUSTOMER_OPTIONS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                  {errors.customer && <p className="text-xs text-destructive mt-1">{errors.customer}</p>}
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Label htmlFor="customerAddress" className="text-sm font-semibold w-24 shrink-0 pt-2">Address</Label>
                <Textarea id="customerAddress" name="customerAddress" value={formData.customerAddress}
                  onChange={handleChange} rows={4} className="flex-1 resize-y" />
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
                  <select id="shipper" name="shipper" value={formData.shipper} onChange={e => {
                    const selected = SHIPPER_OPTIONS.find(s => s.name === e.target.value);
                    setFormData(prev => ({ ...prev, shipper: e.target.value, shipperAddress: selected?.address ?? '' }));
                  }} className={sel()}>
                    <option value="">Select</option>
                    {SHIPPER_OPTIONS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Label htmlFor="shipperAddress" className="text-sm font-semibold w-24 shrink-0 pt-2">Address</Label>
                <Textarea id="shipperAddress" name="shipperAddress" value={formData.shipperAddress}
                  onChange={handleChange} rows={4} className="flex-1 resize-y" />
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
                <Label htmlFor="carrier" className="text-sm font-semibold w-24 shrink-0">
                  <span className="text-destructive mr-1">*</span>Carrier
                </Label>
                <div className="flex-1">
                  <select id="carrier" name="carrier" value={formData.carrier} onChange={e => {
                    const selected = CARRIER_OPTIONS.find(c => c.name === e.target.value);
                    setFormData(prev => ({ ...prev, carrier: e.target.value, carrierAddress: selected?.address ?? '' }));
                    if (errors.carrier) setErrors(prev => ({ ...prev, carrier: '' }));
                  }}
                    className={sel(errors.carrier)}>
                    <option value="">Select</option>
                    {CARRIER_OPTIONS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                  {errors.carrier && <p className="text-xs text-destructive mt-1">{errors.carrier}</p>}
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Label htmlFor="carrierAddress" className="text-sm font-semibold w-24 shrink-0 pt-2">Address</Label>
                <Textarea id="carrierAddress" name="carrierAddress" value={formData.carrierAddress}
                  onChange={handleChange} rows={4} className="flex-1 resize-y" />
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
                  <select id="consignee" name="consignee" value={formData.consignee} onChange={e => {
                    const selected = CONSIGNEE_OPTIONS.find(c => c.name === e.target.value);
                    setFormData(prev => ({ ...prev, consignee: e.target.value, consigneeAddress: selected?.address ?? '' }));
                  }} className={sel()}>
                    <option value="">Select</option>
                    {CONSIGNEE_OPTIONS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Label htmlFor="consigneeAddress" className="text-sm font-semibold w-24 shrink-0 pt-2">Address</Label>
                <Textarea id="consigneeAddress" name="consigneeAddress" value={formData.consigneeAddress}
                  onChange={handleChange} rows={4} className="flex-1 resize-y" />
              </div>
            </div>
          </div>

        </div>
        </div>
      </div>

      {/* ── Add New Subledger Modal ── */}
      {subledgerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={closeSubledger} />

          {/* Dialog */}
          <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-bold text-primary">Add New Subledger From Job Creation</h3>
              <button onClick={closeSubledger}
                className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5">
              <div className="space-y-4">

                {/* Customer Name */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="sl-customerName" className="text-sm font-semibold text-right w-32 shrink-0">
                    <span className="text-destructive mr-1">*</span>Customer Name
                  </Label>
                  <div className="flex-1">
                    <Input id="sl-customerName" name="customerName" value={subledger.customerName}
                      onChange={handleSubledgerChange}
                      className={subledgerErrors.customerName ? 'border-destructive' : ''} />
                    {subledgerErrors.customerName && <p className="text-xs text-destructive mt-1">{subledgerErrors.customerName}</p>}
                  </div>
                </div>

                {/* Categories */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="sl-categories" className="text-sm font-semibold text-right w-32 shrink-0">
                    <span className="text-destructive mr-1">*</span>Categories
                  </Label>
                  <div className="flex-1">
                    <select id="sl-categories" name="categories" value={subledger.categories}
                      onChange={handleSubledgerChange}
                      className={sel(subledgerErrors.categories)}>
                      <option value="">--Select--</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {subledgerErrors.categories && <p className="text-xs text-destructive mt-1">{subledgerErrors.categories}</p>}
                  </div>
                </div>

                {/* SCAC Code */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="sl-scacCode" className="text-sm font-semibold text-right w-32 shrink-0">SCAC Code</Label>
                  <Input id="sl-scacCode" name="scacCode" value={subledger.scacCode}
                    onChange={handleSubledgerChange} className="flex-1" />
                </div>

                {/* Address */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="sl-address" className="text-sm font-semibold text-right w-32 shrink-0">
                    <span className="text-destructive mr-1">*</span>Address
                  </Label>
                  <div className="flex-1">
                    <Input id="sl-address" name="address" value={subledger.address}
                      onChange={handleSubledgerChange}
                      className={subledgerErrors.address ? 'border-destructive' : ''} />
                    {subledgerErrors.address && <p className="text-xs text-destructive mt-1">{subledgerErrors.address}</p>}
                  </div>
                </div>

                {/* Pin Code */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="sl-pinCode" className="text-sm font-semibold text-right w-32 shrink-0">Pin Code</Label>
                  <Input id="sl-pinCode" name="pinCode" value={subledger.pinCode}
                    onChange={handleSubledgerChange} className="flex-1" />
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="sl-phone" className="text-sm font-semibold text-right w-32 shrink-0">Phone</Label>
                  <Input id="sl-phone" name="phone" type="tel" value={subledger.phone}
                    onChange={handleSubledgerChange} className="flex-1" />
                </div>

                {/* Mobile */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="sl-mobile" className="text-sm font-semibold text-right w-32 shrink-0">Mobile</Label>
                  <Input id="sl-mobile" name="mobile" type="tel" value={subledger.mobile}
                    onChange={handleSubledgerChange} className="flex-1" />
                </div>

                {/* Email Id */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="sl-emailId" className="text-sm font-semibold text-right w-32 shrink-0">Email Id</Label>
                  <Input id="sl-emailId" name="emailId" type="email" value={subledger.emailId}
                    onChange={handleSubledgerChange} className="flex-1" />
                </div>

                {/* GST State */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="sl-gstState" className="text-sm font-semibold text-right w-32 shrink-0">GST State</Label>
                  <select id="sl-gstState" name="gstState" value={subledger.gstState}
                    onChange={handleSubledgerChange} className={`flex-1 ${sel()}`}>
                    <option value="">--Select--</option>
                    {GST_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* GST No */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="sl-gstNo" className="text-sm font-semibold text-right w-32 shrink-0">GST No</Label>
                  <Input id="sl-gstNo" name="gstNo" value={subledger.gstNo}
                    onChange={handleSubledgerChange} className="flex-1" />
                </div>

                {/* PAN No */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="sl-panNo" className="text-sm font-semibold text-right w-32 shrink-0">PAN No</Label>
                  <Input id="sl-panNo" name="panNo" value={subledger.panNo}
                    onChange={handleSubledgerChange} className="flex-1" />
                </div>

                {/* Country */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="sl-country" className="text-sm font-semibold text-right w-32 shrink-0">Country</Label>
                  <select id="sl-country" name="country" value={subledger.country}
                    onChange={handleSubledgerChange} className={`flex-1 ${sel()}`}>
                    <option value="">--Select--</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* COA */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="sl-coa" className="text-sm font-semibold text-right w-32 shrink-0">COA</Label>
                  <select id="sl-coa" name="coa" value={subledger.coa}
                    onChange={handleSubledgerChange} className={`flex-1 ${sel()}`}>
                    <option value="">--Select--</option>
                    {COA_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Payment Mode */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="sl-paymentMode" className="text-sm font-semibold text-right w-32 shrink-0">Payment Mode</Label>
                  <select id="sl-paymentMode" name="paymentMode" value={subledger.paymentMode}
                    onChange={handleSubledgerChange} className={`flex-1 ${sel()}`}>
                    {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                {/* Currency */}
                <div className="flex items-center gap-3">
                  <Label htmlFor="sl-currency" className="text-sm font-semibold text-right w-32 shrink-0">Currency</Label>
                  <select id="sl-currency" name="currency" value={subledger.currency}
                    onChange={handleSubledgerChange} className={`flex-1 ${sel()}`}>
                    <option value="">--Select--</option>
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t border-border shrink-0">
              <Button type="button" className="material-button text-black px-8"
                onClick={handleSubledgerCreate}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pb-4">
        <Button type="button" className="bg-red-400 text-black hover:bg-red-350" onClick={() => navigate('/operations')}>
          Cancel
        </Button>
        <Button type="button" className="material-button text-black" onClick={handleSave}>
          {isEdit ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default NewOperation;
