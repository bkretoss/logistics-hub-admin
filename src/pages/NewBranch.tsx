import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { branchStore, type Branch } from './BranchMasterList';
import BranchFormBody, {
  type BranchFormData,
  initialBranchForm,
} from './BranchFormBody';

const EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEBSITE_RE = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,}([-a-zA-Z0-9@:%_+.~#?&/=]*)$/;
const PHONE_RE   = /^\+?[0-9 ]{10,20}$/;

const countDigits = (v: string) => v.replace(/\D/g, '').length;

const validateField = (name: string, value: string): string => {
  switch (name) {
    case 'phone':
    case 'mobile': {
      if (!value) return '';
      if (!PHONE_RE.test(value)) return 'Only digits, spaces, and a leading "+" are allowed';
      const digits = countDigits(value);
      if (digits < 10 || digits > 15) return 'Total digits must be between 10 and 15';
      return '';
    }
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

const branchToForm = (b: Branch): BranchFormData => ({
  ...initialBranchForm,
  branchCode: b.code,
  name:       b.name,
  address:    b.address,
  position:   b.position,
  notes:      b.notes,
  currency:   b.currency,
  city:       b.city,
  country:    b.country,
  phone:      b.phone,
  email:      b.email,
});

const NewBranch = () => {
  const navigate   = useNavigate();
  const { id }     = useParams<{ id: string }>();
  const editBranch = id ? branchStore.data.find(b => b.id === Number(id)) : undefined;
  const isEdit     = !!editBranch;

  const [form, setForm]     = useState<BranchFormData>(() => editBranch ? branchToForm(editBranch) : initialBranchForm);
  const [errors, setErrors] = useState<Partial<Record<keyof BranchFormData, string>>>({});

  useEffect(() => {
    if (editBranch) setForm(branchToForm(editBranch));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'phone' || name === 'mobile') {
      if (value !== '' && !/^\+?[0-9 ]*$/.test(value)) return;
      if ((value.match(/\+/g) || []).length > 1) return;
      if (value.includes('+') && !value.startsWith('+')) return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const msg = validateField(name, value);
    if (msg) setErrors(prev => ({ ...prev, [name]: msg }));
  };

  const validate = () => {
    const e: Partial<Record<keyof BranchFormData, string>> = {};
    if (!form.branchCode.trim()) e.branchCode = 'Branch Code is required';
    if (!form.name.trim())       e.name       = 'Name is required';
    (['phone', 'mobile', 'email', 'website'] as const).forEach(f => {
      const msg = validateField(f, form[f]);
      if (msg) e[f] = msg;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const handleSave = () => {
    if (!validate()) return;
    const record: Branch = {
      id:       isEdit && editBranch ? editBranch.id : Date.now(),
      code:     form.branchCode,
      name:     form.name,
      address:  form.address,
      position: form.position,
      notes:    form.notes,
      currency: form.currency,
      city:     form.city,
      country:  form.country,
      phone:    form.phone,
      email:    form.email,
      status:   'Active',
    };
    if (isEdit && editBranch) {
      const idx = branchStore.data.findIndex(b => b.id === editBranch.id);
      if (idx !== -1) {
        const updated = [...branchStore.data];
        updated[idx] = record;
        branchStore.set(updated);
      }
    } else {
      branchStore.set([...branchStore.data, record]);
    }
    navigate('/admin/branch-master');
    window.scrollTo(0, 0);
  };

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/branch-master')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {isEdit ? 'Edit Branch' : 'New Branch'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isEdit ? `Editing ${editBranch?.name || 'branch'}` : 'Create a new branch location'}
          </p>
        </div>
      </div>

      {/* Shared form body — editable mode */}
      <BranchFormBody
        form={form}
        readonly={false}
        errors={errors}
        onChange={handleChange}
        onBlur={handleBlur}
        onLogoChange={fileName => setForm(prev => ({ ...prev, branchLogo: fileName }))}
      />

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pb-4">
        <Button type="button" className="bg-red-400 text-black hover:bg-red-350"
          onClick={() => navigate('/admin/branch-master')}>
          Cancel
        </Button>
        <Button type="button" className="material-button text-black"
          onClick={handleSave} disabled={hasErrors}>
          {isEdit ? 'Update' : 'Save'}
        </Button>
      </div>

    </div>
  );
};

export default NewBranch;
