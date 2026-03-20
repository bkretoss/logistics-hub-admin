import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const CURRENCIES     = ['', 'INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'JPY'];
export const BILLING_STATES = [
  'Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Maharashtra',
  'Tamil Nadu', 'Telangana', 'West Bengal', 'Rajasthan', 'Kerala',
];
export const COUNTRIES = [
  'India', 'USA', 'UAE', 'Singapore', 'UK', 'China', 'Germany',
  'Japan', 'Canada', 'Australia',
];
export const YES_NO = ['No', 'Yes'];

export interface BranchFormData {
  branchCode: string;
  name: string;
  position: string;
  currency: string;
  billingState: string;
  gstinNo: string;
  notes: string;
  voucherIdentify: string;
  interestCalculation: string;
  debitNote: string;
  incentiveCalculation: string;
  incentivePercentage: string;
  timeSheetEnable: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  mobile: string;
  fax: string;
  email: string;
  website: string;
  logoLink: string;
  branchLogo: string;
}

export const initialBranchForm: BranchFormData = {
  branchCode: '', name: '', position: '',
  currency: '', billingState: '', gstinNo: '',
  notes: '', voucherIdentify: '',
  interestCalculation: 'No', debitNote: '',
  incentiveCalculation: 'No', incentivePercentage: '', timeSheetEnable: 'No',
  address: '', city: '', state: '',
  zipCode: '', country: '', phone: '',
  mobile: '', fax: '', email: '',
  website: '', logoLink: '', branchLogo: '',
};

// ── Field wrapper — same layout for both editable and read-only ──────────────
export const Field = ({
  label, required, error, children, colSpan2,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  colSpan2?: boolean;
}) => (
  <div className={`flex items-center gap-4${colSpan2 ? ' md:col-span-2' : ''}`}>
    <Label className="text-sm font-semibold w-44 shrink-0">
      {label}{required && <span className="text-destructive ml-1">*</span>}
    </Label>
    <div className="flex-1">
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  </div>
);

// ── Props ────────────────────────────────────────────────────────────────────
interface BranchFormBodyProps {
  form: BranchFormData;
  readonly: boolean;
  errors?: Partial<Record<keyof BranchFormData, string>>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onLogoChange?: (fileName: string) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const ro = (readonly: boolean) =>
  readonly ? 'pointer-events-none bg-muted/40 text-foreground' : '';

const selCls = (readonly: boolean, err?: string) =>
  `w-full px-3 py-2 border rounded-lg text-sm ${
    readonly ? 'bg-muted/40 text-foreground pointer-events-none' : 'bg-background'
  } ${err ? 'border-destructive' : 'border-input'}`;

// ── Component ────────────────────────────────────────────────────────────────
const BranchFormBody: React.FC<BranchFormBodyProps> = ({
  form, readonly, errors = {}, onChange, onBlur, onLogoChange,
}) => {
  const noop = () => {};

  return (
    <div className="space-y-6">

      {/* ── Info Section ── */}
      <div className="material-card material-elevation-1 overflow-hidden">
        <div className="bg-[#4CAF50] px-6 py-3">
          <h2 className="text-base font-bold text-white">Info</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">

            <Field label="Branch Code" required={!readonly} error={errors.branchCode}>
              <Input name="branchCode" value={form.branchCode}
                onChange={readonly ? noop : onChange!}
                readOnly={readonly}
                className={`${errors.branchCode ? 'border-destructive' : ''} ${ro(readonly)}`} />
            </Field>

            <Field label="Name" required={!readonly} error={errors.name}>
              <Input name="name" value={form.name}
                onChange={readonly ? noop : onChange!}
                readOnly={readonly}
                className={`${errors.name ? 'border-destructive' : ''} ${ro(readonly)}`} />
            </Field>

            <Field label="Position">
              <Input name="position" value={form.position}
                onChange={readonly ? noop : onChange!}
                readOnly={readonly}
                className={ro(readonly)} />
            </Field>

            <Field label="Currency">
              <select name="currency" value={form.currency}
                onChange={readonly ? noop : onChange!}
                disabled={readonly}
                className={selCls(readonly)}>
                <option value="">-- Select --</option>
                {CURRENCIES.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Billing State">
              <select name="billingState" value={form.billingState}
                onChange={readonly ? noop : onChange!}
                disabled={readonly}
                className={selCls(readonly)}>
                <option value="">-- Select --</option>
                {BILLING_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>

            <Field label="GSTIN No#">
              <Input name="gstinNo" value={form.gstinNo}
                onChange={readonly ? noop : onChange!}
                readOnly={readonly}
                className={ro(readonly)} />
            </Field>

            <div className="flex items-start gap-4 md:col-span-2">
              <Label className="text-sm font-semibold w-44 shrink-0 pt-2">Notes</Label>
              <Textarea name="notes" value={form.notes}
                onChange={readonly ? noop : onChange!}
                readOnly={readonly}
                rows={3}
                className={`flex-1 resize-y ${ro(readonly)}`} />
            </div>

            <Field label="Voucher Identify">
              <Input name="voucherIdentify" value={form.voucherIdentify}
                onChange={readonly ? noop : onChange!}
                readOnly={readonly}
                className={ro(readonly)} />
            </Field>

            <Field label="Interest Calculation">
              <select name="interestCalculation" value={form.interestCalculation}
                onChange={readonly ? noop : onChange!}
                disabled={readonly}
                className={selCls(readonly)}>
                {YES_NO.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>

            <Field label="Debit Note">
              <Input name="debitNote" value={form.debitNote}
                onChange={readonly ? noop : onChange!}
                readOnly={readonly}
                className={ro(readonly)} />
            </Field>

            <div />

            <Field label="Incentive Calculation">
              <select name="incentiveCalculation" value={form.incentiveCalculation}
                onChange={readonly ? noop : onChange!}
                disabled={readonly}
                className={selCls(readonly)}>
                {YES_NO.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>

            <Field label="Incentive Percentage">
              <Input name="incentivePercentage" value={form.incentivePercentage}
                onChange={readonly ? noop : onChange!}
                readOnly={readonly}
                type="number" min="0" max="100"
                className={ro(readonly)} />
            </Field>

            <Field label="Time Sheet Enable">
              <select name="timeSheetEnable" value={form.timeSheetEnable}
                onChange={readonly ? noop : onChange!}
                disabled={readonly}
                className={selCls(readonly)}>
                {YES_NO.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>

          </div>
        </div>
      </div>

      {/* ── Branch Address Section ── */}
      <div className="material-card material-elevation-1 overflow-hidden">
        <div className="bg-[#90A4AE] px-6 py-3">
          <h2 className="text-base font-bold text-white">Branch Address</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">

            <Field label="Address">
              <Input name="address" value={form.address}
                onChange={readonly ? noop : onChange!}
                readOnly={readonly}
                className={ro(readonly)} />
            </Field>

            <Field label="City">
              <Input name="city" value={form.city}
                onChange={readonly ? noop : onChange!}
                readOnly={readonly}
                className={ro(readonly)} />
            </Field>

            <Field label="State">
              <Input name="state" value={form.state}
                onChange={readonly ? noop : onChange!}
                readOnly={readonly}
                className={ro(readonly)} />
            </Field>

            <Field label="Zip Code">
              <Input name="zipCode" value={form.zipCode}
                onChange={readonly ? noop : onChange!}
                readOnly={readonly}
                className={ro(readonly)} />
            </Field>

            <Field label="Country">
              <select name="country" value={form.country}
                onChange={readonly ? noop : onChange!}
                disabled={readonly}
                className={selCls(readonly)}>
                <option value="">-- Select --</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Phone" error={errors.phone}>
              <Input name="phone" type="tel" inputMode="numeric" value={form.phone}
                onChange={readonly ? noop : onChange!}
                onBlur={readonly ? noop : onBlur}
                readOnly={readonly}
                className={`${errors.phone ? 'border-destructive' : ''} ${ro(readonly)}`} />
            </Field>

            <Field label="Mobile" error={errors.mobile}>
              <Input name="mobile" type="tel" inputMode="numeric" value={form.mobile}
                onChange={readonly ? noop : onChange!}
                onBlur={readonly ? noop : onBlur}
                readOnly={readonly}
                className={`${errors.mobile ? 'border-destructive' : ''} ${ro(readonly)}`} />
            </Field>

            <Field label="Fax">
              <Input name="fax" value={form.fax}
                onChange={readonly ? noop : onChange!}
                readOnly={readonly}
                className={ro(readonly)} />
            </Field>

            <Field label="Email" error={errors.email}>
              <Input name="email" type="email" value={form.email}
                onChange={readonly ? noop : onChange!}
                onBlur={readonly ? noop : onBlur}
                readOnly={readonly}
                className={`${errors.email ? 'border-destructive' : ''} ${ro(readonly)}`} />
            </Field>

            <div className="flex items-center gap-4 md:col-span-2">
              <Label className="text-sm font-semibold w-44 shrink-0">Website</Label>
              <div className="flex-1">
                <Input name="website" type="text" value={form.website}
                  onChange={readonly ? noop : onChange!}
                  onBlur={readonly ? noop : onBlur}
                  readOnly={readonly}
                  placeholder={readonly ? '' : 'https://example.com'}
                  className={`w-full ${errors.website ? 'border-destructive' : ''} ${ro(readonly)}`} />
                {errors.website && <p className="text-xs text-destructive mt-1">{errors.website}</p>}
              </div>
            </div>

            <Field label="Logo Link">
              <Input name="logoLink" value={form.logoLink}
                onChange={readonly ? noop : onChange!}
                readOnly={readonly}
                className={ro(readonly)} />
            </Field>

            <div className="flex items-center gap-4 md:col-span-3">
              <Label className="text-sm font-semibold w-44 shrink-0">Branch Logo</Label>
              <div className="flex-1">
                {readonly ? (
                  <span className="text-sm text-muted-foreground">{form.branchLogo || '—'}</span>
                ) : (
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#F9C74F] text-black text-sm font-semibold rounded-lg cursor-pointer hover:bg-[#f0b429] transition-colors">
                    Branch Logo
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file && onLogoChange) onLogoChange(file.name);
                      }} />
                  </label>
                )}
                {!readonly && form.branchLogo && (
                  <span className="ml-3 text-sm text-muted-foreground">{form.branchLogo}</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default BranchFormBody;
