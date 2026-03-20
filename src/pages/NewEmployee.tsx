import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { employeeStore, type Employee } from './EmployeeMasterList';

const TITLES        = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'];
const SEXES         = ['Male', 'Female', 'Other'];
const MARITAL       = ['--Select--', 'Single', 'Married', 'Divorced', 'Widowed'];
const NATIONALITIES = ['--Select--', 'Indian', 'American', 'British', 'Emirati', 'Singaporean', 'Canadian', 'Australian'];
const CURRENCIES    = ['--Select--', 'INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'];
const POSITIONS     = ['--Select--', 'Logistics Manager', 'Operations Executive', 'Warehouse Supervisor', 'HR Coordinator', 'Finance Analyst', 'Sales Executive', 'IT Administrator'];
const DESIGNATIONS  = ['--Select--', 'Manager', 'Senior Executive', 'Executive', 'Supervisor', 'Analyst', 'Coordinator', 'Assistant'];
const DEPARTMENTS   = ['--Select--', 'Operations', 'HR', 'Finance', 'Sales', 'IT', 'Procurement', 'Accounting'];
const INCENTIVE_COA = ['--Select--', 'Accounts Receivable', 'Accounts Payable', 'Cash', 'Bank', 'Revenue', 'Expense', 'Salary Payable'];
const USERNAMES     = ['--Select--', 'admin', 'hr_user', 'ops_user', 'finance_user', 'sales_user'];

type EmployeeForm = Omit<Employee, 'id'>;

const EMPTY_FORM: EmployeeForm = {
  empId: '', loginId: '', position: '', identificationNo: '', branch: '',
  nameTitle: 'Mr', firstName: '', middleName: '', lastName: '',
  spouseName: '', dob: '', placeOfBirth: '', nationality: '--Select--',
  religion: '', sex: 'Male', maritalStatus: '--Select--', marriageDate: '',
  bloodGroup: '', joiningDate: '', confirmationDate: '',
  notificationDate: '', leavingDate: '', ctcCurrency: '--Select--',
  ctcAmount: '', contactNo: '', temporaryAddress: '', permanentAddress: '',
  designation: '--Select--', jobDescription: '', department: '--Select--',
  division: '', reportingManager: '', note: '',
  incentiveCoa: '--Select--', userName: '--Select--', employeePhoto: '',
};

// Map Employee record → form (all fields align 1:1 since EmployeeForm = Omit<Employee,'id'>)
const employeeToForm = (emp: Employee): EmployeeForm => {
  const { id: _id, ...rest } = emp;
  return {
    ...EMPTY_FORM,
    ...rest,
    // Restore '--Select--' sentinel for fields that were stored as empty
    position:     rest.position     || '--Select--',
    nationality:  rest.nationality  || '--Select--',
    maritalStatus:rest.maritalStatus|| '--Select--',
    ctcCurrency:  rest.ctcCurrency  || '--Select--',
    designation:  rest.designation  || '--Select--',
    department:   rest.department   || '--Select--',
    incentiveCoa: rest.incentiveCoa || '--Select--',
    userName:     rest.userName     || '--Select--',
  };
};

// ── Field wrappers ────────────────────────────────────────────────────────────
const Field = ({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) => (
  <div className="flex items-center gap-3">
    <Label className="text-sm font-semibold w-36 shrink-0">
      {label}{required && <span className="text-destructive ml-1">*</span>}
    </Label>
    <div className="flex-1">
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  </div>
);

const FieldTop = ({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <Label className="text-sm font-semibold w-36 shrink-0 pt-2">
      {label}{required && <span className="text-destructive ml-1">*</span>}
    </Label>
    <div className="flex-1">
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  </div>
);

const sel = (err?: string) =>
  `w-full px-3 py-2 border rounded-lg text-sm bg-background ${err ? 'border-destructive' : 'border-input'}`;

// ── Component ─────────────────────────────────────────────────────────────────
const NewEmployee = () => {
  const navigate      = useNavigate();
  const { id }        = useParams<{ id: string }>();
  const editEmployee  = id ? employeeStore.data.find(e => e.id === Number(id)) : undefined;
  const isEdit        = !!editEmployee;

  const [form, setForm]     = useState<EmployeeForm>(() => editEmployee ? employeeToForm(editEmployee) : EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeForm, string>>>({});

  // Re-sync if navigating between edit routes without unmounting
  useEffect(() => {
    if (editEmployee) setForm(employeeToForm(editEmployee));
    else              setForm(EMPTY_FORM);
    setErrors({});
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof EmployeeForm])
      setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e: Partial<Record<keyof EmployeeForm, string>> = {};
    if (!form.position || form.position === '--Select--') e.position         = 'Position is required';
    if (!form.identificationNo.trim())                    e.identificationNo = 'Identification No is required';
    if (!form.firstName.trim())                           e.firstName        = 'First Name is required';
    if (!form.department || form.department === '--Select--') e.department   = 'Department is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (isEdit && editEmployee) {
      // Update existing record in store
      const updated = employeeStore.data.map(e =>
        e.id === editEmployee.id ? { ...form, id: editEmployee.id } : e
      );
      employeeStore.set(updated);
    } else {
      // Add new record — generate empId and id
      const nextId    = Math.max(0, ...employeeStore.data.map(e => e.id)) + 1;
      const newEmpId  = form.empId.trim() || `EMP${String(nextId).padStart(3, '0')}`;
      employeeStore.set([...employeeStore.data, { ...form, id: nextId, empId: newEmpId }]);
    }

    navigate('/hr/employee-master');
    window.scrollTo(0, 0);
  };

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/hr/employee-master')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {isEdit ? 'Edit Employee' : 'New Employee'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isEdit
              ? `Editing ${[editEmployee?.nameTitle, editEmployee?.firstName, editEmployee?.lastName].filter(Boolean).join(' ')}`
              : 'Create a new employee record'}
          </p>
        </div>
      </div>

      {/* ── Employee Details ── */}
      <div className="material-card material-elevation-1 overflow-hidden">
        <div className="bg-[#4CAF50] px-6 py-3">
          <h2 className="text-base font-bold text-white">Employee Details</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">

            <Field label="EMP ID">
              <Input name="empId" value={form.empId} onChange={handleChange}
                placeholder={isEdit ? '' : 'Auto-generated if blank'} />
            </Field>

            <Field label="Login ID">
              <Input name="loginId" value={form.loginId} onChange={handleChange} />
            </Field>

            <Field label="Position" required error={errors.position}>
              <select name="position" value={form.position} onChange={handleChange} className={sel(errors.position)}>
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>

            <Field label="Identification No" required error={errors.identificationNo}>
              <Input name="identificationNo" value={form.identificationNo} onChange={handleChange}
                className={errors.identificationNo ? 'border-destructive' : ''} />
            </Field>

            <Field label="Branch">
              <Input name="branch" value={form.branch} onChange={handleChange} />
            </Field>

            <Field label="Name Title">
              <select name="nameTitle" value={form.nameTitle} onChange={handleChange} className={sel()}>
                {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>

            <Field label="First Name" required error={errors.firstName}>
              <Input name="firstName" value={form.firstName} onChange={handleChange}
                className={errors.firstName ? 'border-destructive' : ''} />
            </Field>

            <Field label="Middle Name">
              <Input name="middleName" value={form.middleName} onChange={handleChange} />
            </Field>

            <Field label="Last Name">
              <Input name="lastName" value={form.lastName} onChange={handleChange} />
            </Field>

            <Field label="Spouse Name">
              <Input name="spouseName" value={form.spouseName} onChange={handleChange} />
            </Field>

            <Field label="DOB">
              <Input name="dob" type="date" value={form.dob} onChange={handleChange} />
            </Field>

            <Field label="Place of Birth">
              <Input name="placeOfBirth" value={form.placeOfBirth} onChange={handleChange} />
            </Field>

            <Field label="Nationality">
              <select name="nationality" value={form.nationality} onChange={handleChange} className={sel()}>
                {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>

            <Field label="Religion">
              <Input name="religion" value={form.religion} onChange={handleChange} />
            </Field>

            <Field label="Sex" required>
              <select name="sex" value={form.sex} onChange={handleChange} className={sel()}>
                {SEXES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>

            <Field label="Marital Status">
              <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange} className={sel()}>
                {MARITAL.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>

            <Field label="Marriage Date">
              <Input name="marriageDate" type="date" value={form.marriageDate} onChange={handleChange} />
            </Field>

            <Field label="Blood Group">
              <Input name="bloodGroup" value={form.bloodGroup} onChange={handleChange} placeholder="e.g. O+" />
            </Field>

            <Field label="Joining Date">
              <Input name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} />
            </Field>

            <Field label="Confirmation Date">
              <Input name="confirmationDate" type="date" value={form.confirmationDate} onChange={handleChange} />
            </Field>

            <Field label="Notification Date">
              <Input name="notificationDate" type="date" value={form.notificationDate} onChange={handleChange} />
            </Field>

            <Field label="Leaving Date">
              <Input name="leavingDate" type="date" value={form.leavingDate} onChange={handleChange} />
            </Field>

            <Field label="CTC Currency">
              <select name="ctcCurrency" value={form.ctcCurrency} onChange={handleChange} className={sel()}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="CTC Amount">
              <Input name="ctcAmount" type="number" min="0" value={form.ctcAmount} onChange={handleChange} />
            </Field>

            <Field label="Contact No">
              <Input name="contactNo" type="tel" value={form.contactNo} onChange={handleChange} />
            </Field>

            <FieldTop label="Temporary Address">
              <Textarea name="temporaryAddress" value={form.temporaryAddress} onChange={handleChange} rows={3} className="resize-y" />
            </FieldTop>

            <FieldTop label="Permanent Address">
              <Textarea name="permanentAddress" value={form.permanentAddress} onChange={handleChange} rows={3} className="resize-y" />
            </FieldTop>

          </div>
        </div>
      </div>

      {/* ── Job Details ── */}
      <div className="material-card material-elevation-1 overflow-hidden">
        <div className="bg-[#90A4AE] px-6 py-3">
          <h2 className="text-base font-bold text-white">Job Details</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">

            <Field label="Designation">
              <select name="designation" value={form.designation} onChange={handleChange} className={sel()}>
                {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>

            <Field label="Department" required error={errors.department}>
              <select name="department" value={form.department} onChange={handleChange} className={sel(errors.department)}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>

            <Field label="Division">
              <Input name="division" value={form.division} onChange={handleChange} />
            </Field>

            <Field label="Reporting Manager">
              <Input name="reportingManager" value={form.reportingManager} onChange={handleChange} />
            </Field>

            <FieldTop label="Job Description">
              <Textarea name="jobDescription" value={form.jobDescription} onChange={handleChange} rows={3} className="resize-y" />
            </FieldTop>

            <FieldTop label="Note">
              <Textarea name="note" value={form.note} onChange={handleChange} rows={3} className="resize-y" />
            </FieldTop>

          </div>
        </div>
      </div>

      {/* ── Additional Details ── */}
      <div className="material-card material-elevation-1 overflow-hidden">
        <div className="bg-[#00BCD4] px-6 py-3">
          <h2 className="text-base font-bold text-white">Additional Details</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">

            <Field label="Incentive COA">
              <select name="incentiveCoa" value={form.incentiveCoa} onChange={handleChange} className={sel()}>
                {INCENTIVE_COA.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="User Name">
              <select name="userName" value={form.userName} onChange={handleChange} className={sel()}>
                {USERNAMES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </Field>

            <div className="flex items-center gap-3">
              <Label className="text-sm font-semibold w-36 shrink-0">Employee Photo</Label>
              <div className="flex items-center gap-3 flex-1">
                <label className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg text-sm font-medium bg-background hover:bg-muted cursor-pointer transition-colors whitespace-nowrap">
                  Choose File
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      setForm(prev => ({ ...prev, employeePhoto: file ? file.name : '' }));
                    }} />
                </label>
                <span className="text-sm text-muted-foreground truncate">
                  {form.employeePhoto || 'No file chosen'}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pb-4">
        <Button type="button" className="bg-red-400 text-black hover:bg-red-350"
          onClick={() => navigate('/hr/employee-master')}>
          Cancel
        </Button>
        <Button type="button" className="material-button text-black" onClick={handleSave}>
          {isEdit ? 'Update' : 'Save'}
        </Button>
      </div>

    </div>
  );
};

export default NewEmployee;
