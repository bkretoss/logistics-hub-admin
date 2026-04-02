import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getLeadApi, updateLeadApi } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { SHIPMENT_TYPES, TRANSPORT_MODES } from '@/pages/Leads';

type FieldErrors = Record<string, string>;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM = {
  customer: '', target: '', lead_source: '',
  date: new Date().toISOString().split('T')[0],
  lead_owner: '', company: 'Relay Logistics (Private Limited)',
  sales_team: '', status: 'Open', shipment_type: '', transport_mode: '',
  origin_port: '', target_date: '', business_service: '', destination_port: '',
  expected_annual_revenue: '', expected_annual_revenue_currency: 'USD',
  expected_annual_volume_commodity: '', nature_of_business: '',
  company_turnover: '', company_turnover_currency: 'USD', remarks: '',
  address: '', state: '', city: '', zip: '', contact_person: '',
  email: '', telephone_no: '', mobile_no: '', designation: '',
  department: '', notes: '',
};

const EditLead = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [rating, setRating] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [globalError, setGlobalError] = useState('');

  // ── Load existing lead ──────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setFetching(true);
        const res = await getLeadApi(id!);
        const l = res.data?.data ?? res.data;
        setRating(l.rating ?? null);
        setFormData({
          customer:                        l.customer                        ?? '',
          target:                          l.target                          ?? '',
          lead_source:                     l.lead_source                     ?? '',
          date:                            l.date ? l.date.split('-').reverse().join('-') : new Date().toISOString().split('T')[0],
          lead_owner:                      l.lead_owner                      ?? '',
          company:                         l.company                         ?? '',
          sales_team:                      l.sales_team                      ?? '',
          status:                          l.status                          ?? '',
          shipment_type:                   l.shipment_type                   ?? '',
          transport_mode:                  l.transport_mode                  ?? '',
          origin_port:                     l.origin_port                     ?? '',
          target_date:                     l.target_date ? l.target_date.split('-').reverse().join('-') : '',
          business_service:                l.business_service                ?? '',
          destination_port:                l.destination_port                ?? '',
          expected_annual_revenue:         l.expected_annual_revenue         != null ? String(l.expected_annual_revenue) : '',
          expected_annual_revenue_currency:l.expected_annual_revenue_currency ?? 'USD',
          expected_annual_volume_commodity:l.expected_annual_volume_commodity ?? '',
          nature_of_business:              l.nature_of_business              ?? '',
          company_turnover:                l.company_turnover                != null ? String(l.company_turnover) : '',
          company_turnover_currency:       l.company_turnover_currency       ?? 'USD',
          remarks:                         l.remarks                         ?? '',
          address:                         l.address                         ?? '',
          state:                           l.state                           ?? '',
          city:                            l.city                            ?? '',
          zip:                             l.zip                             ?? '',
          contact_person:                  l.contact_person                  ?? '',
          email:                           l.email                           ?? '',
          telephone_no:                    l.telephone_no                    ?? '',
          mobile_no:                       l.mobile_no                       ?? '',
          designation:                     l.designation                     ?? '',
          department:                      l.department                      ?? '',
          notes:                           l.notes                           ?? '',
        });
      } catch {
        setFetchError('Failed to load lead data. Please go back and try again.');
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id]);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!formData.customer.trim())  errs.customer    = 'Customer is required.';
    if (!formData.date)             errs.date        = 'Date is required.';
    if (!formData.status)           errs.status      = 'Status is required.';
    if (!formData.target_date)      errs.target_date = 'Target Date is required.';
    if (formData.email && !EMAIL_RE.test(formData.email))
                                    errs.email       = 'Enter a valid email address.';
    if (formData.expected_annual_revenue && isNaN(Number(formData.expected_annual_revenue)))
                                    errs.expected_annual_revenue = 'Must be a valid number.';
    if (formData.company_turnover && isNaN(Number(formData.company_turnover)))
                                    errs.company_turnover = 'Must be a valid number.';
    return errs;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      document.getElementById(Object.keys(errs)[0])?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setLoading(true);
    setGlobalError('');
    setFieldErrors({});
    try {
      await updateLeadApi(id!, {
        ...formData,
        expected_annual_revenue: formData.expected_annual_revenue ? Number(formData.expected_annual_revenue) : undefined,
        company_turnover: formData.company_turnover ? Number(formData.company_turnover) : undefined,
        ...(rating !== null && { rating }),
      });
      toast({ title: 'Success', description: 'Lead updated successfully!', variant: 'success' });
      navigate('/sales/leads');
      window.scrollTo(0, 0);
    } catch (err: unknown) {
      const axiosErr = err as any;
      const res    = axiosErr?.response?.data;
      const status = axiosErr?.response?.status;
      if (!axiosErr?.response) { setGlobalError('Cannot connect to server. Make sure the backend is running.'); return; }
      if (status === 401)       { setGlobalError('Session expired. Please log in again.'); return; }
      if (status === 422 && res?.errors) {
        const mapped: FieldErrors = {};
        Object.entries(res.errors).forEach(([k, v]) => {
          mapped[k] = Array.isArray(v) ? (v as string[])[0] : String(v);
        });
        setFieldErrors(mapped);
        document.getElementById(Object.keys(mapped)[0])?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      setGlobalError(res?.message || res?.error || `Server error ${status ?? ''}`.trim());
    } finally {
      setLoading(false);
    }
  };

  // ── Change handler ──────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
    if (globalError) setGlobalError('');
  };

  const ErrMsg = ({ field }: { field: string }) =>
    fieldErrors[field] ? (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <span className="inline-block w-1 h-1 rounded-full bg-red-500 shrink-0" />
        {fieldErrors[field]}
      </p>
    ) : null;

  const errBorder = (field: string) => fieldErrors[field] ? 'border-red-400 focus:ring-red-300' : '';
  const selectErr = (field: string) => fieldErrors[field] ? 'border-red-400' : 'border-input';

  // ── Loading / error state ───────────────────────────────────────────────────
  if (fetching) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="ml-3 text-muted-foreground">Loading lead data...</span>
    </div>
  );

  if (fetchError) return (
    <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{fetchError}</div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/sales/leads')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Edit Lead</h1>
          <p className="text-muted-foreground text-sm mt-1">Update lead information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="material-card material-elevation-1 p-6 space-y-8">

          {globalError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 text-sm">
              {globalError}
            </div>
          )}

          {/* ── Basic Information ── */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <Label htmlFor="customer" className="text-sm font-semibold">Customer <span className="text-destructive">*</span></Label>
                <Input id="customer" name="customer" value={formData.customer} onChange={handleChange} placeholder="Enter customer name" className={errBorder('customer')} />
                <ErrMsg field="customer" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="date" className="text-sm font-semibold">Date <span className="text-destructive">*</span></Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} className={errBorder('date')} />
                <ErrMsg field="date" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="target" className="text-sm font-semibold">Target</Label>
                <Input id="target" name="target" value={formData.target} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lead_owner" className="text-sm font-semibold">Lead Owner</Label>
                <Input id="lead_owner" name="lead_owner" value={formData.lead_owner} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lead_source" className="text-sm font-semibold">Lead Source</Label>
                <Input id="lead_source" name="lead_source" value={formData.lead_source} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="company" className="text-sm font-semibold">Company</Label>
                <Input id="company" name="company" value={formData.company} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sales_team" className="text-sm font-semibold">Sales Team</Label>
                <select id="sales_team" name="sales_team" value={formData.sales_team} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${selectErr('sales_team')}`}>
                  <option value="">Select</option>
                  <option value="Team A">Team A</option>
                  <option value="Team B">Team B</option>
                  <option value="North America">North America</option>
                </select>
                <ErrMsg field="sales_team" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="status" className="text-sm font-semibold">Status <span className="text-destructive">*</span></Label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg ${selectErr('status')}`}>
                  <option value="">Select</option>
                  <option value="Open">Open</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Quote">Quote</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                  <option value="Future Prospect">Future Prospect</option>
                </select>
                <ErrMsg field="status" />
              </div>
            </div>
          </div>

          {/* ── Business Lead ── */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Business Lead</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <Label htmlFor="shipment_type" className="text-sm font-semibold">Shipment Type</Label>
                <select id="shipment_type" name="shipment_type" value={formData.shipment_type} onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  {SHIPMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="target_date" className="text-sm font-semibold">Target Date <span className="text-destructive">*</span></Label>
                <Input id="target_date" name="target_date" type="date" value={formData.target_date} onChange={handleChange} className={errBorder('target_date')} />
                <ErrMsg field="target_date" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="transport_mode" className="text-sm font-semibold">Transport Mode</Label>
                <select id="transport_mode" name="transport_mode" value={formData.transport_mode} onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select Transport Mode</option>
                  {TRANSPORT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="business_service" className="text-sm font-semibold">Business Service</Label>
                <Input id="business_service" name="business_service" value={formData.business_service} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="origin_port" className="text-sm font-semibold">Origin Port</Label>
                <Input id="origin_port" name="origin_port" value={formData.origin_port} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="destination_port" className="text-sm font-semibold">Destination Port</Label>
                <Input id="destination_port" name="destination_port" value={formData.destination_port} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="expected_annual_revenue" className="text-sm font-semibold">Expected Annual Revenue</Label>
                <div className="flex gap-2">
                  <select name="expected_annual_revenue_currency" value={formData.expected_annual_revenue_currency} onChange={handleChange} className="w-20 px-3 py-2 border border-input rounded-lg">
                    <option>USD</option><option>INR</option>
                  </select>
                  <Input id="expected_annual_revenue" name="expected_annual_revenue" value={formData.expected_annual_revenue} onChange={handleChange} className={`flex-1 ${errBorder('expected_annual_revenue')}`} />
                </div>
                <ErrMsg field="expected_annual_revenue" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="expected_annual_volume_commodity" className="text-sm font-semibold">Expected Annual Volume Commodity</Label>
                <Input id="expected_annual_volume_commodity" name="expected_annual_volume_commodity" value={formData.expected_annual_volume_commodity} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* ── Revenue & Volume ── */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Revenue & Volume</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <Label htmlFor="company_turnover" className="text-sm font-semibold">Company Turnover</Label>
                <div className="flex gap-2">
                  <select name="company_turnover_currency" value={formData.company_turnover_currency} onChange={handleChange} className="w-20 px-3 py-2 border border-input rounded-lg">
                    <option>USD</option><option>INR</option>
                  </select>
                  <Input id="company_turnover" name="company_turnover" value={formData.company_turnover} onChange={handleChange} className={`flex-1 ${errBorder('company_turnover')}`} />
                </div>
                <ErrMsg field="company_turnover" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="nature_of_business" className="text-sm font-semibold">Nature Of Business</Label>
                <Textarea id="nature_of_business" name="nature_of_business" value={formData.nature_of_business} onChange={handleChange} rows={3} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="remarks" className="text-sm font-semibold">Remarks</Label>
                <Textarea id="remarks" name="remarks" value={formData.remarks} onChange={handleChange} rows={3} />
              </div>
            </div>
          </div>

          {/* ── Contact Information ── */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <Label htmlFor="contact_person" className="text-sm font-semibold">Contact Person</Label>
                <Input id="contact_person" name="contact_person" value={formData.contact_person} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={errBorder('email')} />
                <ErrMsg field="email" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="telephone_no" className="text-sm font-semibold">Telephone No</Label>
                <Input id="telephone_no" name="telephone_no" value={formData.telephone_no} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="mobile_no" className="text-sm font-semibold">Mobile No</Label>
                <Input id="mobile_no" name="mobile_no" value={formData.mobile_no} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="state" className="text-sm font-semibold">State</Label>
                <Input id="state" name="state" value={formData.state} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="city" className="text-sm font-semibold">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="zip" className="text-sm font-semibold">ZIP</Label>
                <Input id="zip" name="zip" value={formData.zip} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="designation" className="text-sm font-semibold">Designation</Label>
                <Input id="designation" name="designation" value={formData.designation} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="department" className="text-sm font-semibold">Department</Label>
                <Input id="department" name="department" value={formData.department} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="address" className="text-sm font-semibold">Address</Label>
                <Textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={2} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="notes" className="text-sm font-semibold">Notes</Label>
                <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={2} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" className="bg-red-400 text-black hover:bg-red-350" onClick={() => navigate('/sales/leads')} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="material-button text-black" disabled={loading}>
              {loading ? 'Updating...' : 'Update Lead'}
            </Button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default EditLead;
