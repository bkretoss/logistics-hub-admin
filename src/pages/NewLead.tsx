import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createLeadApi, getShipmentTypesApi, getTransportModesApi, getCurrenciesApi, getCountriesApi, getEmployeesApi } from '@/services/api';

type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NewLead = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer: '',
    target: '',
    lead_source: '',
    date: new Date().toISOString().split('T')[0],
    lead_owner: '',
    company: 'Relay Logistics (Private Limited)',
    sales_team: '' as number | '',
    status: '',
    shipment_type: '',
    shipment_type_id: '' as number | '',
    transport_mode: '',
    transport_mode_id: '' as number | '',
    origin_port: '',
    target_date: '',
    business_service: '',
    destination_port: '',
    expected_annual_revenue: '',
    expected_annual_revenue_currency: '' as number | '',
    expected_annual_volume_commodity: '',
    nature_of_business: '',
    company_turnover: '',
    company_turnover_currency: '' as number | '',
    remarks: '',
    address: '',
    state: '',
    city: '',
    zip: '',
    contact_person: '',
    email: '',
    telephone_no: '',
    mobile_no: '',
    designation: '',
    department: '',
    notes: '',
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const [employees, setEmployees]               = useState<{ id: number; name: string }[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [employeesError, setEmployeesError]     = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmployeesLoading(true);
      try {
        const res = await getEmployeesApi();
        const raw: any[] = res.data?.data ?? res.data ?? [];
        setEmployees(
          raw
            .filter(r => r.status === 1)
            .map(r => ({ id: r.id, name: [r.first_name, r.last_name].filter(Boolean).join(' ') }))
        );
      } catch {
        setEmployeesError('Unable to load employee list');
      } finally {
        setEmployeesLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const [shipmentTypes, setShipmentTypes]           = useState<{ id: number; name: string }[]>([]);
  const [shipmentTypesLoading, setShipmentTypesLoading] = useState(false);
  const [shipmentTypesError, setShipmentTypesError]     = useState('');

  useEffect(() => {
    const fetchShipmentTypes = async () => {
      setShipmentTypesLoading(true);
      try {
        const res = await getShipmentTypesApi();
        const raw: any[] = res.data?.data ?? res.data ?? [];
        setShipmentTypes(
          raw
            .filter(r => r.status === 1 || r.status === 'active' || r.status === 'Active')
            .map(r => ({ id: r.id, name: r.name }))
        );
      } catch {
        setShipmentTypesError('Failed to load shipment types.');
      } finally {
        setShipmentTypesLoading(false);
      }
    };
    fetchShipmentTypes();
  }, []);

  const [transportModes, setTransportModes]               = useState<{ id: number; name: string }[]>([]);
  const [transportModesLoading, setTransportModesLoading] = useState(false);
  const [transportModesError, setTransportModesError]     = useState('');

  const [currencies, setCurrencies]           = useState<{ id: number; code: string }[]>([]);
  const [currenciesLoading, setCurrenciesLoading] = useState(false);

  const [countryCurrencies, setCountryCurrencies]           = useState<{ id: number; currency_code: string }[]>([]);
  const [countryCurrenciesLoading, setCountryCurrenciesLoading] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      setCurrenciesLoading(true);
      try {
        const res = await getCurrenciesApi();
        const raw: any[] = res.data?.data ?? res.data ?? [];
        const active = raw
          .filter(r => r.status === 1 || r.status === 'active' || r.status === 'Active')
          .map(r => ({ id: r.id, code: r.code }));
        setCurrencies(active);
      } catch {
        // silently fall back to hardcoded default
      } finally {
        setCurrenciesLoading(false);
      }
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    const fetchCountryCurrencies = async () => {
      setCountryCurrenciesLoading(true);
      try {
        const res = await getCountriesApi();
        const raw: any[] = res.data?.data ?? res.data ?? [];
        const active = raw
          .filter(r => r.status === 1 || r.status === 'active' || r.status === 'Active')
          .filter(r => r.currency_code)
          .map(r => ({ id: r.id, currency_code: r.currency_code }));
        setCountryCurrencies(active);

      } catch {
        // silently fall back
      } finally {
        setCountryCurrenciesLoading(false);
      }
    };
    fetchCountryCurrencies();
  }, []);

  useEffect(() => {
    const fetchTransportModes = async () => {
      setTransportModesLoading(true);
      try {
        const res = await getTransportModesApi();
        const raw: any[] = res.data?.data ?? res.data ?? [];
        setTransportModes(
          raw
            .filter(r => r.status === 1 || r.status === 'active' || r.status === 'Active')
            .map(r => ({ id: r.id, name: r.name }))
        );
      } catch {
        setTransportModesError('Failed to load transport modes.');
      } finally {
        setTransportModesLoading(false);
      }
    };
    fetchTransportModes();
  }, []);

  // ── Validation rules ────────────────────────────────────────────────────────
  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!formData.customer.trim())   errs.customer          = 'Customer is required.';
    if (!formData.date)              errs.date              = 'Date is required.';
    if (!formData.status)            errs.status            = 'Status is required.';
    if (!formData.target_date)       errs.target_date       = 'Target Date is required.';
    if (!formData.transport_mode_id) errs.transport_mode_id = 'Transport Mode is required.';
    if (formData.email && !EMAIL_RE.test(formData.email))
                                     errs.email      = 'Enter a valid email address.';
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
      // Scroll to first error
      const firstKey = Object.keys(errs)[0];
      document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setLoading(true);
    setGlobalError('');
    setFieldErrors({});
    try {
      await createLeadApi({
        ...formData,
        expected_annual_revenue: formData.expected_annual_revenue ? Number(formData.expected_annual_revenue) : undefined,
        company_turnover: formData.company_turnover ? Number(formData.company_turnover) : undefined,
      });
      navigate('/sales/leads?success=1');
      window.scrollTo(0, 0);
    } catch (err: unknown) {
      const axiosErr = err as any;
      const res      = axiosErr?.response?.data;
      const status   = axiosErr?.response?.status;

      // No response at all — network/CORS/server down
      if (!axiosErr?.response) {
        setGlobalError('Cannot connect to server (http://localhost:8001). Make sure the backend is running.');
        return;
      }

      // 401 — token missing or expired
      if (status === 401) {
        setGlobalError('Session expired. Please log in again.');
        return;
      }

      // 422 — Laravel field validation errors
      if (status === 422 && res?.errors && typeof res.errors === 'object') {
        const mapped: FieldErrors = {};
        Object.entries(res.errors).forEach(([k, v]) => {
          mapped[k] = Array.isArray(v) ? (v as string[])[0] : String(v);
        });
        setFieldErrors(mapped);
        const firstKey = Object.keys(mapped)[0];
        document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Everything else — show exact message from API
      const msg =
        res?.message ||
        res?.error ||
        (typeof res === 'string' ? res : null) ||
        `Server error ${status ?? ''}`.trim();
      setGlobalError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Change handler — clears per-field error on edit ─────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sales_team' || name === 'expected_annual_revenue_currency' || name === 'company_turnover_currency' ? (value === '' ? '' : Number(value)) : value,
      // keep shipment_type_id in sync when shipment_type name changes
      ...(name === 'shipment_type'
        ? { shipment_type_id: shipmentTypes.find(s => s.name === value)?.id ?? '' }
        : name === 'transport_mode'
        ? { transport_mode_id: transportModes.find(m => m.name === value)?.id ?? '' }
        : {}),
    }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
    if (globalError) setGlobalError('');
  };

  // ── Helper: error message below field ───────────────────────────────────────
  const ErrMsg = ({ field }: { field: string }) =>
    fieldErrors[field] ? (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <span className="inline-block w-1 h-1 rounded-full bg-red-500 shrink-0" />
        {fieldErrors[field]}
      </p>
    ) : null;

  // ── Helper: error border class ───────────────────────────────────────────────
  const errBorder = (field: string) =>
    fieldErrors[field] ? 'border-red-400 focus:ring-red-300' : '';

  const selectErrClass = (field: string) =>
    fieldErrors[field] ? 'border-red-400' : 'border-input';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/sales/leads')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">New Lead</h1>
          <p className="text-muted-foreground text-sm mt-1">Create a new lead entry</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="material-card material-elevation-1 p-6 space-y-8">

          {/* Global error banner */}
          {globalError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 text-sm">
              {globalError}
            </div>
          )}

          {/* ── Basic Information ── */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

              <div className="space-y-1">
                <Label htmlFor="customer" className="text-sm font-semibold">
                  Customer <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="customer" name="customer" value={formData.customer}
                  onChange={handleChange} placeholder="Enter customer name"
                  className={errBorder('customer')}
                />
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
                <select id="sales_team" name="sales_team" value={formData.sales_team} onChange={handleChange}
                  disabled={employeesLoading}
                  className={`w-full px-3 py-2 border rounded-lg disabled:opacity-60 ${selectErrClass('sales_team')}`}>
                  <option value="">{employeesLoading ? 'Loading...' : 'Select Employee'}</option>
                  {!employeesLoading && employees.length === 0 && !employeesError && (
                    <option disabled>No Sales Team Members Available</option>
                  )}
                  {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </select>
                {employeesError && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500 shrink-0" />
                    {employeesError}
                  </p>
                )}
                <ErrMsg field="sales_team" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="status" className="text-sm font-semibold">
                  Status <span className="text-destructive">*</span>
                </Label>
                <select id="status" name="status" value={formData.status} onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${selectErrClass('status')}`}>
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
                  disabled={shipmentTypesLoading}
                  className="w-full px-3 py-2 border border-input rounded-lg disabled:opacity-60">
                  <option value="">
                    {shipmentTypesLoading ? 'Loading...' : 'Select'}
                  </option>
                  {shipmentTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
                {shipmentTypesError && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500 shrink-0" />
                    {shipmentTypesError}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="target_date" className="text-sm font-semibold">Target Date <span className="text-destructive">*</span></Label>
                <Input id="target_date" name="target_date" type="date" value={formData.target_date}
                  onChange={handleChange} className={errBorder('target_date')} />
                <ErrMsg field="target_date" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="transport_mode" className="text-sm font-semibold">Transport Mode <span className="text-destructive">*</span></Label>
                <select id="transport_mode" name="transport_mode" value={formData.transport_mode} onChange={handleChange}
                  disabled={transportModesLoading}
                  className={`w-full px-3 py-2 border rounded-lg disabled:opacity-60 ${selectErrClass('transport_mode_id')}`}>
                  <option value="">{transportModesLoading ? 'Loading...' : 'Select Transport Mode'}</option>
                  {transportModes.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
                {transportModesError && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500 shrink-0" />
                    {transportModesError}
                  </p>
                )}
                <ErrMsg field="transport_mode_id" />
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
                <Label htmlFor="expected_annual_revenue" className="text-sm font-semibold">
                  Expected Annual Revenue
                  {formData.expected_annual_revenue_currency && (
                    <span className="ml-1 text-muted-foreground font-normal">({currencies.find(c => c.id === formData.expected_annual_revenue_currency)?.code})</span>
                  )}
                </Label>
                <div className="flex gap-2">
                  <select
                    name="expected_annual_revenue_currency"
                    value={formData.expected_annual_revenue_currency}
                    onChange={handleChange}
                    disabled={countryCurrenciesLoading}
                    className="w-24 px-2 py-2 border border-input rounded-lg text-sm bg-background disabled:opacity-60"
                  >
                    {currenciesLoading
                      ? <option>...</option>
                      : currencies.map(c => <option key={c.id} value={c.id}>{c.code}</option>)
                    }
                  </select>
                  <Input id="expected_annual_revenue" name="expected_annual_revenue"
                    value={formData.expected_annual_revenue} onChange={handleChange}
                    className={`flex-1 ${errBorder('expected_annual_revenue')}`} />
                </div>
                <ErrMsg field="expected_annual_revenue" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="expected_annual_volume_commodity" className="text-sm font-semibold">Expected Annual Volume Commodity</Label>
                <Input id="expected_annual_volume_commodity" name="expected_annual_volume_commodity"
                  value={formData.expected_annual_volume_commodity} onChange={handleChange} />
              </div>

            </div>
          </div>

          {/* ── Revenue & Volume ── */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Revenue & Volume</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

              <div className="space-y-1">
                <Label htmlFor="company_turnover" className="text-sm font-semibold">
                  Company Turnover
                  {formData.company_turnover_currency && (
                    <span className="ml-1 text-muted-foreground font-normal">({currencies.find(c => c.id === formData.company_turnover_currency)?.code})</span>
                  )}
                </Label>
                <div className="flex gap-2">
                  <select
                    name="company_turnover_currency"
                    value={formData.company_turnover_currency}
                    onChange={handleChange}
                    disabled={countryCurrenciesLoading}
                    className="w-24 px-2 py-2 border border-input rounded-lg text-sm bg-background disabled:opacity-60"
                  >
                    {currenciesLoading
                      ? <option>...</option>
                      : currencies.map(c => <option key={c.id} value={c.id}>{c.code}</option>)
                    }
                  </select>
                  <Input id="company_turnover" name="company_turnover"
                    value={formData.company_turnover} onChange={handleChange}
                    className={`flex-1 ${errBorder('company_turnover')}`} />
                </div>
                <ErrMsg field="company_turnover" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="nature_of_business" className="text-sm font-semibold">Nature Of Business</Label>
                <Textarea id="nature_of_business" name="nature_of_business"
                  value={formData.nature_of_business} onChange={handleChange} rows={3} />
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
                <Input id="email" name="email" type="email" value={formData.email}
                  onChange={handleChange} className={errBorder('email')} />
                <ErrMsg field="email" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="telephone_no" className="text-sm font-semibold">Telephone No</Label>
                <Input id="telephone_no" name="telephone_no" value={formData.telephone_no}
                  onChange={handleChange} className={errBorder('telephone_no')} />
                <ErrMsg field="telephone_no" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="mobile_no" className="text-sm font-semibold">Mobile No</Label>
                <Input id="mobile_no" name="mobile_no" value={formData.mobile_no}
                  onChange={handleChange} className={errBorder('mobile_no')} />
                <ErrMsg field="mobile_no" />
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
            <Button type="button" className="bg-red-400 text-black hover:bg-red-350"
              onClick={() => navigate('/sales/leads')} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="material-button text-black" disabled={loading}>
              {loading ? 'Saving...' : 'Save Lead'}
            </Button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default NewLead;
