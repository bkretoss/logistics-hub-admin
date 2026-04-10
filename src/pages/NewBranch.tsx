import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import BranchFormBody, { type BranchFormData, initialBranchForm } from './BranchFormBody';
import api from '@/services/api';

const EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEBSITE_RE = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,}([-a-zA-Z0-9@:%_+.~#?&/=]*)$/;
const PHONE_RE   = /^\+?[0-9 ]{10,20}$/;
const countDigits = (v: string) => v.replace(/\D/g, '').length;

const validateField = (name: string, value: string): string => {
  switch (name) {
    case 'phone':
    case 'mobile':
      if (!value) return '';
      if (!PHONE_RE.test(value)) return 'Only digits, spaces, and a leading "+" are allowed';
      if (countDigits(value) < 10 || countDigits(value) > 15) return 'Total digits must be between 10 and 15';
      return '';
    case 'email':
      if (value && !EMAIL_RE.test(value)) return 'Enter a valid email (e.g. user@example.com)';
      return '';
    case 'website':
      if (value && !WEBSITE_RE.test(value)) return 'Enter a valid URL (e.g. https://example.com)';
      return '';
    default:
      return '';
  }
};

const branchToForm = (b: any): BranchFormData => ({
  ...initialBranchForm,
  branchCode:            b.branch_code           ?? '',
  name:                  b.name                  ?? '',
  position:              b.position              ?? '',
  currency:              b.currency              ?? '',
  billingState:          b.billing_state         ?? '',
  gstinNo:               b.gstin_no              ?? '',
  notes:                 b.notes                 ?? '',
  voucher_identify:      b.voucher_identify      ?? '',
  interest_calculation:  b.interest_calculation  ?? 'No',
  debit_note:            b.debit_note            ?? '',
  incentive_calculation: b.incentive_calculation ?? 'No',
  incentive_percentage:  b.incentive_percentage  ?? '',
  time_sheet_enable:     b.time_sheet_enable     ?? 'No',
  address:               b.address               ?? '',
  city:                  b.city                  ?? '',
  state:                 b.state                 ?? '',
  zipCode:               b.zip_code              ?? '',
  country:               b.country               ?? '',
  phone:                 b.phone                 ?? '',
  mobile:                b.mobile                ?? '',
  fax:                   b.fax                   ?? '',
  email:                 b.email                 ?? '',
  website:               b.website               ?? '',
  logoLink:              b.logo_link             ?? '',
  branchLogo:            b.branch_logo           ?? '',
  branchLogoFile:        null,
  status:                b.status !== null && b.status !== undefined ? String(b.status) : '1',
});

const buildFormData = (form: BranchFormData): FormData => {
  const fd = new FormData();
  const append = (key: string, val: string | null | undefined) => {
    if (val !== null && val !== undefined) fd.append(key, val);
  };
  append('branch_code',           form.branchCode);
  append('name',                  form.name);
  append('position',              form.position);
  append('currency',              form.currency);
  append('billing_state',         form.billingState);
  append('gstin_no',              form.gstinNo);
  append('notes',                 form.notes);
  append('voucher_identify',      form.voucher_identify);
  append('interest_calculation',  form.interest_calculation);
  append('debit_note',            form.debit_note);
  append('incentive_calculation', form.incentive_calculation);
  append('incentive_percentage',  form.incentive_percentage);
  append('time_sheet_enable',     form.time_sheet_enable);
  append('address',               form.address);
  append('city',                  form.city);
  append('state',                 form.state);
  append('zip_code',              form.zipCode);
  append('country',               form.country);
  append('phone',                 form.phone);
  append('mobile',                form.mobile);
  append('fax',                   form.fax);
  append('email',                 form.email);
  append('website',               form.website);
  append('logo_link',             form.logoLink);
  append('status',                form.status);
  if (form.branchLogoFile) fd.append('branch_logo', form.branchLogoFile);
  return fd;
};

const NewBranch = () => {
  const navigate  = useNavigate();
  const { id }    = useParams<{ id: string }>();
  const { toast } = useToast();
  const isEdit    = !!id;

  const [form, setForm]     = useState<BranchFormData>(initialBranchForm);
  const [errors, setErrors] = useState<Partial<Record<keyof BranchFormData, string>>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/branches/${id}`)
      .then(res => setForm(branchToForm(res.data.data ?? res.data)))
      .catch(() => toast({ title: 'Error', description: 'Failed to load branch', variant: 'destructive' }));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone' || name === 'mobile') {
      if (value !== '' && !/^\+?[0-9 ]*$/.test(value)) return;
      if ((value.match(/\+/g) || []).length > 1) return;
      if (value.includes('+') && !value.startsWith('+')) return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
    // clear error when user types
    let msg = validateField(name, value);
    if (name === 'branchCode')           msg = !value.trim() ? 'Branch Code is required' : '';
    if (name === 'name')                 msg = !value.trim() ? 'Name is required' : '';
    if (name === 'incentive_percentage') msg = !value.trim() ? 'Incentive Percentage is required' : '';
    setErrors(prev => ({ ...prev, [name]: msg }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let msg = validateField(name, value);
    if (name === 'branchCode')           msg = !value.trim() ? 'Branch Code is required' : '';
    if (name === 'name')                 msg = !value.trim() ? 'Name is required' : '';
    if (name === 'incentive_percentage') msg = !value.trim() ? 'Incentive Percentage is required' : '';
    setErrors(prev => ({ ...prev, [name]: msg }));
  };

  const validate = () => {
    const e: Partial<Record<keyof BranchFormData, string>> = {};
    if (!form.branchCode.trim())       e.branchCode           = 'Branch Code is required';
    if (!form.name.trim())             e.name                 = 'Name is required';
    if (!form.incentive_percentage.toString().trim()) e.incentive_percentage = 'Incentive Percentage is required';
    (['phone', 'mobile', 'email', 'website'] as const).forEach(f => {
      const msg = validateField(f, form[f] as string);
      if (msg) e[f] = msg;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      // scroll to first error
      setTimeout(() => {
        const el = document.querySelector('[data-error="true"]');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }
    setSaving(true);
    try {
      const fd = buildFormData(form);
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (isEdit) {
        await api.put(`/branches/${id}`, fd, config);
        toast({ title: 'Updated', description: 'Branch updated successfully', variant: 'success' });
      } else {
        await api.post('/branches', fd, config);
        toast({ title: 'Created', description: 'Branch created successfully', variant: 'success' });
      }
      navigate('/admin/branch-master');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to save branch';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/branch-master')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {isEdit ? 'Edit Branch' : 'New Branch'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isEdit ? 'Update branch details' : 'Create a new branch location'}
          </p>
        </div>
      </div>

      <BranchFormBody
        form={form}
        readonly={false}
        errors={errors}
        onChange={handleChange}
        onBlur={handleBlur}
        onLogoChange={fileName => setForm(prev => ({ ...prev, branchLogo: fileName }))}
        onLogoFileChange={file => setForm(prev => ({ ...prev, branchLogoFile: file }))}
      />

      <div className="flex items-center justify-end gap-3 pb-4">
        <Button type="button" className="bg-red-400 text-black hover:bg-red-350"
          onClick={() => navigate('/admin/branch-master')}>
          Cancel
        </Button>
        <Button type="button" className="material-button text-black"
          onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default NewBranch;
