import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createCustomerVisitApi, getSalesAgentsApi, getCustomerVisitsApi } from '@/services/api';

type FieldErrors = Record<string, string>;

const NewCustomerVisit = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: '',
    sales_agent_id: '' as number | '',
    visit_date: new Date().toISOString().split('T')[0],
    visit_purpose: '',
    location: '',
    outcome: '',
    follow_up_date: '',
    notes: '',
    status: 'Scheduled',
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const [salesAgents, setSalesAgents] = useState<{ id: number; name: string }[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      setAgentsLoading(true);
      try {
        const res = await getSalesAgentsApi(1, 9999);
        const raw: any[] = res.data?.data ?? res.data ?? [];
        setSalesAgents(
          raw
            .filter(r => r.status === 1 || r.status === '1' || r.status === 'active')
            .map(r => ({ id: r.id, name: r.name }))
        );
      } catch {
        // silently fail — agent dropdown will be empty
      } finally {
        setAgentsLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!formData.customer_name.trim()) errs.customer_name = 'Customer name is required.';
    if (!formData.visit_date)           errs.visit_date    = 'Visit date is required.';
    if (!formData.visit_purpose.trim()) errs.visit_purpose = 'Visit purpose is required.';
    if (!formData.status)               errs.status        = 'Status is required.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    setGlobalError('');
    setFieldErrors({});

    try {
      const payload: Record<string, unknown> = {
        customer_name:  formData.customer_name.trim(),
        visit_date:     formData.visit_date,
        visit_purpose:  formData.visit_purpose.trim(),
        location:       formData.location.trim() || undefined,
        outcome:        formData.outcome.trim() || undefined,
        follow_up_date: formData.follow_up_date || undefined,
        notes:          formData.notes.trim() || undefined,
        status:         formData.status,
      };
      if (formData.sales_agent_id !== '') payload.sales_agent_id = Number(formData.sales_agent_id);

      await createCustomerVisitApi(payload);
      navigate('/sales/customer-visits?success=1');
      window.scrollTo(0, 0);
    } catch (err: unknown) {
      const axiosErr = err as any;
      const res      = axiosErr?.response?.data;
      const status   = axiosErr?.response?.status;

      if (!axiosErr?.response) {
        setGlobalError('Cannot connect to server. Make sure the backend is running.');
        return;
      }
      if (status === 401) {
        setGlobalError('Session expired. Please log in again.');
        return;
      }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sales_agent_id' ? (value === '' ? '' : Number(value)) : value,
    }));
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/sales/customer-visits')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">New Customer Visit</h1>
          <p className="text-muted-foreground text-sm mt-1">Record a new customer visit</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="material-card material-elevation-1 p-6 space-y-8">

          {globalError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 text-sm">
              {globalError}
            </div>
          )}

          {/* Visit Details */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Visit Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

              <div className="space-y-1">
                <Label htmlFor="customer_name" className="text-sm font-semibold">
                  Customer Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="customer_name" name="customer_name"
                  value={formData.customer_name} onChange={handleChange}
                  placeholder="Enter customer name"
                  className={errBorder('customer_name')}
                />
                <ErrMsg field="customer_name" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="sales_agent_id" className="text-sm font-semibold">Sales Agent</Label>
                <select
                  id="sales_agent_id" name="sales_agent_id"
                  value={formData.sales_agent_id} onChange={handleChange}
                  disabled={agentsLoading}
                  className={`w-full px-3 py-2 border rounded-lg disabled:opacity-60 ${selectErr('sales_agent_id')}`}
                >
                  <option value="">{agentsLoading ? 'Loading...' : 'Select Sales Agent'}</option>
                  {salesAgents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                <ErrMsg field="sales_agent_id" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="visit_date" className="text-sm font-semibold">
                  Visit Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="visit_date" name="visit_date" type="date"
                  value={formData.visit_date} onChange={handleChange}
                  className={errBorder('visit_date')}
                />
                <ErrMsg field="visit_date" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="status" className="text-sm font-semibold">
                  Status <span className="text-destructive">*</span>
                </Label>
                <select
                  id="status" name="status"
                  value={formData.status} onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${selectErr('status')}`}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Rescheduled">Rescheduled</option>
                </select>
                <ErrMsg field="status" />
              </div>

              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="visit_purpose" className="text-sm font-semibold">
                  Visit Purpose <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="visit_purpose" name="visit_purpose"
                  value={formData.visit_purpose} onChange={handleChange}
                  placeholder="e.g. Product demo, Follow-up, Contract discussion"
                  className={errBorder('visit_purpose')}
                />
                <ErrMsg field="visit_purpose" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="location" className="text-sm font-semibold">Location</Label>
                <Input
                  id="location" name="location"
                  value={formData.location} onChange={handleChange}
                  placeholder="Visit location"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="follow_up_date" className="text-sm font-semibold">Follow-up Date</Label>
                <Input
                  id="follow_up_date" name="follow_up_date" type="date"
                  value={formData.follow_up_date} onChange={handleChange}
                />
              </div>

            </div>
          </div>

          {/* Outcome & Notes */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Outcome & Notes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-1">
                <Label htmlFor="outcome" className="text-sm font-semibold">Outcome</Label>
                <Textarea
                  id="outcome" name="outcome"
                  value={formData.outcome} onChange={handleChange}
                  placeholder="Describe the outcome of the visit"
                  rows={3}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="notes" className="text-sm font-semibold">Notes</Label>
                <Textarea
                  id="notes" name="notes"
                  value={formData.notes} onChange={handleChange}
                  placeholder="Additional notes"
                  rows={3}
                />
              </div>

            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              className="bg-red-400 text-black hover:bg-red-350"
              onClick={() => navigate('/sales/customer-visits')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="material-button text-black" disabled={loading}>
              {loading ? 'Saving...' : 'Save Visit'}
            </Button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default NewCustomerVisit;
