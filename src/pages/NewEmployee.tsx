import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getEmployeeApi, createEmployeeApi, updateEmployeeApi, getCountriesApi, getDesignationsApi, getDepartmentsApi, getEmployeesApi, getCoasApi, API_BASE } from '@/services/api';

interface CountryOption { id: number; country_name: string; }
interface CurrencyOption { code: string; name: string; }
interface DesignationOption { id: number; name: string; }
interface DepartmentOption  { id: number; name: string; }
interface CoaOption         { id: number; name: string; }

// ── Static option lists ────────────────────────────────────────────────────────
const TITLES       = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'];
const SEXES        = ['Male', 'Female', 'Other'];
const MARITAL      = ['Single', 'Married', 'Divorced', 'Widowed'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// ── Date helpers ──────────────────────────────────────────────────────────────
// API returns DD-MM-YYYY → convert to YYYY-MM-DD for <input type="date">
const apiToInput = (d?: string | null): string => {
  if (!d) return '';
  const m = d.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : d; // already YYYY-MM-DD → pass through
};
// <input type="date"> gives YYYY-MM-DD → API expects YYYY-MM-DD (per cURL payload)
const inputToApi = (d: string): string | null => d || null;

// ── Types ──────────────────────────────────────────────────────────────────────
interface EmployeeForm {
  emp_id: string;
  login_id: string;
  position: string;
  identification_no: string;
  branch: string;
  name_title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  spouse_name: string;
  dob: string;
  place_of_birth: string;
  nationality: string;
  religion: string;
  sex: string;
  marital_status: string;
  marriage_date: string;
  blood_group: string;
  joining_date: string;
  confirmation_date: string;
  notification_date: string;
  leaving_date: string;
  ctc_currency: string;
  ctc_amount: string;
  contact_no: string;
  temporary_address: string;
  permanent_address: string;
  designation_id: string;
  designation: string;
  department_id: string;
  department: string;
  division: string;
  reporting_manager: string;
  job_description: string;
  note: string;
  incentive_coa: string;
  user_name: string;
  profile_image: string | null;
  status: number;
}

const EMPTY: EmployeeForm = {
  emp_id: '', login_id: '', position: '', identification_no: '', branch: '',
  name_title: 'Mr', first_name: '', middle_name: '', last_name: '',
  spouse_name: '', dob: '', place_of_birth: '', nationality: '',
  religion: '', sex: 'Male', marital_status: '', marriage_date: '',
  blood_group: '', joining_date: '', confirmation_date: '',
  notification_date: '', leaving_date: '', ctc_currency: '',
  ctc_amount: '', contact_no: '', temporary_address: '', permanent_address: '',
  designation_id: '', designation: '', department_id: '', department: '', division: '', reporting_manager: '',
  job_description: '', note: '', incentive_coa: '', user_name: '',
  profile_image: null, status: 1,
};

// ── Field layout helpers ───────────────────────────────────────────────────────
const Field = ({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <Label className="text-sm font-semibold text-foreground">
      {label}{required && <span className="text-destructive ml-1">*</span>}
    </Label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

const inputCls = (err?: string) =>
  `w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 ${err ? 'border-destructive' : 'border-input'}`;

// ── Section wrapper ────────────────────────────────────────────────────────────
const Section = ({ title, color, children }: { title: string; color: string; children: React.ReactNode }) => (
  <div className="material-card material-elevation-1 overflow-hidden">
    <div className={`${color} px-6 py-3`}>
      <h2 className="text-base font-bold text-white">{title}</h2>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
        {children}
      </div>
    </div>
  </div>
);

// ── Component ──────────────────────────────────────────────────────────────────
const NewEmployee = () => {
  const navigate   = useNavigate();
  const { id }     = useParams<{ id: string }>();
  const { toast }  = useToast();
  const isEdit     = !!id;
  const fileRef    = useRef<HTMLInputElement>(null);

  const [form, setForm]           = useState<EmployeeForm>(EMPTY);
  const [errors, setErrors]       = useState<Partial<Record<keyof EmployeeForm, string>>>({});
  const [saving, setSaving]       = useState(false);
  const [loadingEdit, setLoading] = useState(isEdit);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile]       = useState<File | null>(null);
  const [countries, setCountries]           = useState<CountryOption[]>([]);
  const [countriesError, setCountriesError]   = useState('');
  const [currencies, setCurrencies]           = useState<CurrencyOption[]>([]);
  const [currenciesError, setCurrenciesError] = useState('');
  const [designations, setDesignations]       = useState<DesignationOption[]>([]);
  const [departments, setDepartments]         = useState<DepartmentOption[]>([]);
  const [coas, setCoas]                       = useState<CoaOption[]>([]);

  // ── Load active countries (Nationality) + currencies from Country List API ──
  useEffect(() => {
    getCountriesApi()
      .then(res => {
        const raw: any[] = res.data?.data ?? res.data ?? [];
        const active = raw.filter(c => c.status === 1 || c.status === 'Active' || c.status === 'active');
        setCountries(active.map(c => ({ id: c.id, country_name: c.country_name })));
        const seen = new Set<string>();
        const currencyList: CurrencyOption[] = [];
        active.forEach(c => {
          if (c.currency_code && !seen.has(c.currency_code)) {
            seen.add(c.currency_code);
            currencyList.push({ code: c.currency_code, name: c.currency_name ?? '' });
          }
        });
        setCurrencies(currencyList);
      })
      .catch(() => {
        setCountriesError('Failed to load countries. Please try again.');
        setCurrenciesError('Failed to load currencies. Please try again.');
      });
  }, []);

  // ── Load active designations + employee data together ─────────────────────────
  useEffect(() => {
    const desigPromise = getDesignationsApi(1, 9999).then(res => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      const active = raw.filter(r => r.status === 1 || r.status === '1' || r.status === 'active');
      const list = active.map(r => ({ id: r.id, name: r.name }));
      setDesignations(list);
      return list;
    }).catch(() => [] as DesignationOption[]);

    const deptPromise = getDepartmentsApi(1, 9999).then(res => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      const active = raw.filter(r => r.status === 1 || r.status === '1' || r.status === 'active');
      const list = active.map(r => ({ id: r.id, name: r.name }));
      setDepartments(list);
      return list;
    }).catch(() => [] as DepartmentOption[]);

    getCoasApi(1, 9999).then(res => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setCoas(
        raw
          .filter(r => r.status === 1 || r.status === '1' || r.status === 'active')
          .map(r => ({ id: r.id, name: r.name }))
      );
    }).catch(() => {});

    if (!id) {
      Promise.all([
        desigPromise,
        deptPromise,
        getEmployeesApi().then(res => {
          const list: any[] = res.data?.data ?? res.data ?? [];
          const nums = list
            .map((e: any) => { const m = String(e.emp_id).match(/^EMP-(\d+)$/i); return m ? parseInt(m[1], 10) : 0; })
            .filter((n: number) => n > 0);
          const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
          setForm(prev => ({ ...prev, emp_id: `EMP-${String(next).padStart(3, '0')}` }));
        }).catch(() => setForm(prev => ({ ...prev, emp_id: 'EMP-001' }))),
      ]).then(() => { setErrors({}); setImagePreview(null); });
      return;
    }

    setLoading(true);
    Promise.all([getEmployeeApi(Number(id)), desigPromise, deptPromise])
      .then(([res]) => {
        const d = res.data?.data ?? res.data;
        setForm({
          emp_id:            d.emp_id            ?? '',
          login_id:          d.login_id          ?? '',
          position:          d.position          ?? '',
          identification_no: d.identification_no ?? '',
          branch:            d.branch            ?? '',
          name_title:        d.name_title        ?? 'Mr',
          first_name:        d.first_name        ?? '',
          middle_name:       d.middle_name       ?? '',
          last_name:         d.last_name         ?? '',
          spouse_name:       d.spouse_name       ?? '',
          dob:               apiToInput(d.dob),
          place_of_birth:    d.place_of_birth    ?? '',
          nationality:       String(d.nationality ?? ''),
          religion:          d.religion          ?? '',
          sex:               d.sex               ?? 'Male',
          marital_status:    d.marital_status    ?? '',
          marriage_date:     apiToInput(d.marriage_date),
          blood_group:       d.blood_group       ?? '',
          joining_date:      apiToInput(d.joining_date),
          confirmation_date: apiToInput(d.confirmation_date),
          notification_date: apiToInput(d.notification_date),
          leaving_date:      apiToInput(d.leaving_date),
          ctc_currency:      d.ctc_currency      ?? '',
          ctc_amount:        d.ctc_amount        ?? '',
          contact_no:        d.contact_no        ?? '',
          temporary_address: d.temporary_address ?? '',
          permanent_address: d.permanent_address ?? '',
          designation_id:    String(d.designation ?? ''),
          designation:       d.designation        ?? '',
          department_id:     String(d.department  ?? ''),
          department:        d.department         ?? '',
          division:          d.division          ?? '',
          reporting_manager: d.reporting_manager ?? '',
          job_description:   d.job_description   ?? '',
          note:              d.note              ?? '',
          incentive_coa:     d.incentive_coa     ?? '',
          user_name:         d.user_name         ?? '',
          profile_image:     d.profile_image     ?? null,
          status:            d.status            ?? 1,
        });
        if (d.profile_image) setImagePreview(d.profile_image.startsWith('http') ? d.profile_image : `${API_BASE}/${d.profile_image}`);
      })
      .catch(() => toast({ title: 'Error', description: 'Failed to load employee details.', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const set = (name: keyof EmployeeForm, value: string | number | null) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    set(e.target.name as keyof EmployeeForm, e.target.value);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setForm(prev => ({ ...prev, profile_image: null }));
    if (fileRef.current) fileRef.current.value = '';
  };

  const validate = () => {
    const e: Partial<Record<keyof EmployeeForm, string>> = {};
    if (!form.first_name.trim())        e.first_name        = 'First Name is required';
    if (!form.identification_no.trim()) e.identification_no = 'Identification No is required';
    if (!form.department_id)            e.department_id     = 'Department is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      const a = (k: string, v: string | number | null | undefined) => {
        if (v !== null && v !== undefined && v !== '') fd.append(k, String(v));
      };
      a('emp_id',            form.emp_id);
      a('login_id',          form.login_id);
      a('position',          form.position);
      a('identification_no', form.identification_no);
      a('branch',            form.branch);
      a('name_title',        form.name_title);
      a('first_name',        form.first_name);
      a('middle_name',       form.middle_name);
      a('last_name',         form.last_name);
      a('spouse_name',       form.spouse_name);
      a('dob',               inputToApi(form.dob) ?? '');
      a('place_of_birth',    form.place_of_birth);
      a('nationality',       form.nationality ? Number(form.nationality) : '');
      a('religion',          form.religion);
      a('sex',               form.sex);
      a('marital_status',    form.marital_status);
      a('marriage_date',     inputToApi(form.marriage_date) ?? '');
      a('blood_group',       form.blood_group);
      a('joining_date',      inputToApi(form.joining_date) ?? '');
      a('confirmation_date', inputToApi(form.confirmation_date) ?? '');
      a('notification_date', inputToApi(form.notification_date) ?? '');
      a('leaving_date',      inputToApi(form.leaving_date) ?? '');
      a('ctc_currency',      form.ctc_currency);
      a('ctc_amount',        form.ctc_amount ? parseFloat(form.ctc_amount) : '');
      a('contact_no',        form.contact_no);
      a('temporary_address', form.temporary_address);
      a('permanent_address', form.permanent_address);
      a('designation',       form.designation_id ? Number(form.designation_id) : '');
      a('department',        form.department_id  ? Number(form.department_id)  : '');
      a('division',          form.division);
      a('reporting_manager', form.reporting_manager);
      a('job_description',   form.job_description);
      a('note',              form.note);
      a('incentive_coa',     form.incentive_coa ? Number(form.incentive_coa) : '');
      a('user_name',         form.user_name);
      a('status',            form.status);
      if (imageFile) fd.append('profile_image', imageFile);

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (isEdit) {
        await updateEmployeeApi(Number(id), fd as any, config as any);
        toast({ title: 'Success', description: 'Employee updated successfully.', variant: 'success' });
      } else {
        await createEmployeeApi(fd as any, config as any);
        toast({ title: 'Success', description: 'Employee created successfully.', variant: 'success' });
      }
      navigate('/hr/employee-master');
    } catch {
      toast({ title: 'Error', description: `Failed to ${isEdit ? 'update' : 'create'} employee.`, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loadingEdit) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        <span className="inline-block w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
        Loading employee details...
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/hr/employee-master')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {isEdit ? 'Edit Sales Team Member' : 'New Sales Team Member'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isEdit ? 'Update sales team member information' : 'Create a new sales team member record'}
          </p>
        </div>
      </div>

      {/* ── Employee Details ─────────────────────────────────────────────────── */}
      <Section title="Employee Details" color="bg-[#4CAF50]">

        <Field label="EMP ID (Auto Generated)">
          <Input name="emp_id" value={form.emp_id} readOnly
            className={`${inputCls()} bg-muted cursor-not-allowed`} />
        </Field>

        <Field label="Login ID">
          <Input name="login_id" value={form.login_id} onChange={handleChange}
            placeholder="e.g. john.doe" className={inputCls()} />
        </Field>

        <Field label="Position">
          <Input name="position" value={form.position} onChange={handleChange}
            placeholder="e.g. Senior Manager" className={inputCls()} />
        </Field>

        <Field label="Identification No" required error={errors.identification_no}>
          <Input name="identification_no" value={form.identification_no} onChange={handleChange}
            placeholder="e.g. ID-987654321" className={inputCls(errors.identification_no)} />
        </Field>

        <Field label="Branch">
          <Input name="branch" value={form.branch} onChange={handleChange}
            placeholder="e.g. Head Office" className={inputCls()} />
        </Field>

        <Field label="Name Title">
          <select name="name_title" value={form.name_title} onChange={handleChange} className={inputCls()}>
            {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>

        <Field label="First Name" required error={errors.first_name}>
          <Input name="first_name" value={form.first_name} onChange={handleChange}
            placeholder="First name" className={inputCls(errors.first_name)} />
        </Field>

        <Field label="Middle Name">
          <Input name="middle_name" value={form.middle_name} onChange={handleChange}
            placeholder="Middle name" className={inputCls()} />
        </Field>

        <Field label="Last Name">
          <Input name="last_name" value={form.last_name} onChange={handleChange}
            placeholder="Last name" className={inputCls()} />
        </Field>

        <Field label="Spouse Name">
          <Input name="spouse_name" value={form.spouse_name} onChange={handleChange}
            placeholder="Spouse name" className={inputCls()} />
        </Field>

        <Field label="Date of Birth">
          <Input name="dob" type="date" value={form.dob} onChange={handleChange} className={inputCls()} />
        </Field>

        <Field label="Place of Birth">
          <Input name="place_of_birth" value={form.place_of_birth} onChange={handleChange}
            placeholder="e.g. New York" className={inputCls()} />
        </Field>

        <Field label="Nationality">
          <select name="nationality" value={form.nationality} onChange={handleChange} className={inputCls()}>
            <option value="">-- Select --</option>
            {countriesError
              ? <option disabled value="">{countriesError}</option>
              : countries.length === 0
                ? <option disabled value="">No Countries Available</option>
                : countries.map(c => <option key={c.id} value={String(c.id)}>{c.country_name}</option>)
            }
          </select>
        </Field>

        <Field label="Religion">
          <Input name="religion" value={form.religion} onChange={handleChange}
            placeholder="e.g. Christian" className={inputCls()} />
        </Field>

        <Field label="Sex">
          <select name="sex" value={form.sex} onChange={handleChange} className={inputCls()}>
            {SEXES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>

        <Field label="Marital Status">
          <select name="marital_status" value={form.marital_status} onChange={handleChange} className={inputCls()}>
            <option value="">-- Select --</option>
            {MARITAL.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>

        <Field label="Marriage Date">
          <Input name="marriage_date" type="date" value={form.marriage_date} onChange={handleChange} className={inputCls()} />
        </Field>

        <Field label="Blood Group">
          <select name="blood_group" value={form.blood_group} onChange={handleChange} className={inputCls()}>
            <option value="">-- Select --</option>
            {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>

        <Field label="Joining Date">
          <Input name="joining_date" type="date" value={form.joining_date} onChange={handleChange} className={inputCls()} />
        </Field>

        <Field label="Confirmation Date">
          <Input name="confirmation_date" type="date" value={form.confirmation_date} onChange={handleChange} className={inputCls()} />
        </Field>

        <Field label="Notification Date">
          <Input name="notification_date" type="date" value={form.notification_date} onChange={handleChange} className={inputCls()} />
        </Field>

        <Field label="Leaving Date">
          <Input name="leaving_date" type="date" value={form.leaving_date} onChange={handleChange} className={inputCls()} />
        </Field>

        <Field label="CTC Currency">
          <select name="ctc_currency" value={form.ctc_currency} onChange={handleChange} className={inputCls()}>
            <option value="">-- Select --</option>
            {currenciesError
              ? <option disabled value="">{currenciesError}</option>
              : currencies.length === 0
                ? <option disabled value="">No Currency Available</option>
                : currencies.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.name ? `${c.code} - ${c.name}` : c.code}
                    </option>
                  ))
            }
          </select>
        </Field>

        <Field label="CTC Amount">
          <Input name="ctc_amount" type="number" min="0" step="0.01"
            value={form.ctc_amount} onChange={handleChange}
            placeholder="e.g. 75000.00" className={inputCls()} />
        </Field>

        <Field label="Contact No">
          <Input name="contact_no" type="tel" value={form.contact_no} onChange={handleChange}
            placeholder="e.g. +1-555-123-4567" className={inputCls()} />
        </Field>

        {/* Temporary Address — spans full row on lg */}
        <div className="lg:col-span-1 flex flex-col gap-1.5">
          <Label className="text-sm font-semibold text-foreground">Temporary Address</Label>
          <Textarea name="temporary_address" value={form.temporary_address} onChange={handleChange}
            rows={3} className="resize-y" placeholder="Temporary address" />
        </div>

        <div className="lg:col-span-1 flex flex-col gap-1.5">
          <Label className="text-sm font-semibold text-foreground">Permanent Address</Label>
          <Textarea name="permanent_address" value={form.permanent_address} onChange={handleChange}
            rows={3} className="resize-y" placeholder="Permanent address" />
        </div>

      </Section>

      {/* ── Job Details ──────────────────────────────────────────────────────── */}
      <Section title="Job Details" color="bg-[#90A4AE]">

        <Field label="Designation">
          <select
            name="designation_id"
            value={form.designation_id}
            onChange={e => set('designation_id', e.target.value)}
            className={inputCls()}
          >
            <option value="">-- Select Designation --</option>
            {designations.map(d => (
              <option key={d.id} value={String(d.id)}>{d.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Department" required error={errors.department_id}>
          <select
            name="department_id"
            value={form.department_id}
            onChange={e => set('department_id', e.target.value)}
            className={inputCls(errors.department_id)}
          >
            <option value="">-- Select Department --</option>
            {departments.map(d => (
              <option key={d.id} value={String(d.id)}>{d.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Division">
          <Input name="division" value={form.division} onChange={handleChange}
            placeholder="e.g. Logistics" className={inputCls()} />
        </Field>

        <Field label="Reporting Manager">
          <Input name="reporting_manager" value={form.reporting_manager} onChange={handleChange}
            placeholder="e.g. Michael Smith" className={inputCls()} />
        </Field>

        <div className="lg:col-span-1 flex flex-col gap-1.5">
          <Label className="text-sm font-semibold text-foreground">Job Description</Label>
          <Textarea name="job_description" value={form.job_description} onChange={handleChange}
            rows={3} className="resize-y" placeholder="Describe the role..." />
        </div>

        <div className="lg:col-span-1 flex flex-col gap-1.5">
          <Label className="text-sm font-semibold text-foreground">Note</Label>
          <Textarea name="note" value={form.note} onChange={handleChange}
            rows={3} className="resize-y" placeholder="Additional notes..." />
        </div>

      </Section>

      {/* ── Additional Details ───────────────────────────────────────────────── */}
      <Section title="Additional Details" color="bg-[#00BCD4]">

        <Field label="Incentive COA">
          <select
            name="incentive_coa"
            value={form.incentive_coa}
            onChange={handleChange}
            className={inputCls()}
          >
            <option value="">-- Select Incentive COA --</option>
            {coas.map(c => (
              <option key={c.id} value={String(c.id)}>{c.name}</option>
            ))}
          </select>
        </Field>

        <Field label="User Name">
          <Input name="user_name" value={form.user_name} onChange={handleChange}
            placeholder="e.g. johndoe_admin" className={inputCls()} />
        </Field>

        <Field label="Status">
          <select
            value={form.status}
            onChange={e => set('status', Number(e.target.value))}
            className={inputCls()}
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </Field>

        {/* Profile Image */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <Label className="text-sm font-semibold text-foreground">Profile Image</Label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-border shrink-0">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center shrink-0">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg text-sm font-medium bg-background hover:bg-muted cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                {imagePreview ? 'Change Photo' : 'Upload Photo'}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImage}
                />
              </label>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
        </div>

      </Section>

      {/* ── Action buttons ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pb-4">
        <Button type="button" variant="outline" onClick={() => navigate('/hr/employee-master')}>
          Cancel
        </Button>
        <Button type="button" className="material-button text-black" onClick={handleSave} disabled={saving}>
          {saving
            ? <><span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />{isEdit ? 'Updating...' : 'Saving...'}</>
            : isEdit ? 'Update Employee' : 'Save Employee'
          }
        </Button>
      </div>

    </div>
  );
};

export default NewEmployee;
