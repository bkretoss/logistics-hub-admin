import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown } from 'lucide-react';
import { getCitiesApi, getCountriesApi, getStatesApi } from '@/services/api';

export const CURRENCIES = ['', 'INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'JPY'];
export const COUNTRIES  = [
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
  voucher_identify: string;
  interest_calculation: string;
  debit_note: string;
  incentive_calculation: string;
  incentive_percentage: string;
  time_sheet_enable: string;
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
  branchLogoFile: File | null;
  branchLogo: string;
  status: string;
}

export const initialBranchForm: BranchFormData = {
  branchCode: '', name: '', position: '',
  currency: '', billingState: '', gstinNo: '',
  notes: '', voucher_identify: '',
  interest_calculation: 'No', debit_note: '',
  incentive_calculation: 'No', incentive_percentage: '', time_sheet_enable: 'No',
  address: '', city: '', state: '',
  zipCode: '', country: '', phone: '',
  mobile: '', fax: '', email: '',
  website: '', logoLink: '', branchLogoFile: null, branchLogo: '', status: '1',
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
  onLogoFileChange?: (file: File) => void;
}

// ── Searchable Select ────────────────────────────────────────────────────────
const SearchableSelect: React.FC<{
  name: string;
  value: string;
  options: string[];
  readonly: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ name, value, options, readonly, onChange }) => {
  const [search, setSearch] = useState('');
  const [open, setOpen]     = useState(false);
  const ref                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  const select = (opt: string) => {
    const syntheticEvent = { target: { name, value: opt } } as React.ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
    setOpen(false);
    setSearch('');
  };

  if (readonly) {
    return (
      <div className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-muted/40 text-foreground pointer-events-none">
        {value || '—'}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 border border-input rounded-lg text-sm bg-background text-left"
      >
        <span className={value ? 'text-foreground' : 'text-muted-foreground'}>{value || '-- Select --'}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-background border border-input rounded-lg shadow-lg">
          <div className="p-2">
            <input
              autoFocus
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 border border-input rounded-md text-sm bg-background outline-none"
            />
          </div>
          <ul className="max-h-48 overflow-y-auto">
            <li
              className="px-3 py-2 text-sm text-muted-foreground hover:bg-muted cursor-pointer"
              onClick={() => select('')}
            >-- Select --</li>
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">No results</li>
            ) : filtered.map(opt => (
              <li
                key={opt}
                onClick={() => select(opt)}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-muted ${
                  opt === value ? 'bg-primary/10 font-semibold' : ''
                }`}
              >{opt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const ro = (readonly: boolean) =>
  readonly ? 'pointer-events-none bg-muted/40 text-foreground' : '';

const selCls = (readonly: boolean, err?: string) =>
  `w-full px-3 py-2 border rounded-lg text-sm ${
    readonly ? 'bg-muted/40 text-foreground pointer-events-none' : 'bg-background'
  } ${err ? 'border-destructive' : 'border-input'}`;

// ── Component ────────────────────────────────────────────────────────────────
const BranchFormBody: React.FC<BranchFormBodyProps> = ({
  form, readonly, errors = {}, onChange, onBlur, onLogoChange, onLogoFileChange,
}) => {
  const noop = () => {};
  const [cities,     setCities]     = useState<{ id: number; name: string; country_id: number; state_id: number }[]>([]);
  const [currencies, setCurrencies] = useState<{ id: number; name: string; code: string }[]>([]);
  const [countries,  setCountries]  = useState<{ id: number; name: string }[]>([]);
  const [states,     setStates]     = useState<{ id: number; name: string; country_id: number }[]>([]);

  useEffect(() => {
    getCitiesApi()
      .then(res => {
        const raw: any[] = res.data?.data ?? res.data ?? [];
        setCities(raw.map(r => ({ id: r.id, name: r.name, country_id: Number(r.country_id), state_id: Number(r.state_id) })));
      })
      .catch(() => {});
    getStatesApi(1, 9999)
      .then(res => {
        const raw: any[] = res.data?.data ?? res.data ?? [];
        setStates(raw.map(r => ({ id: r.id, name: r.name, country_id: Number(r.country_id) })));
      })
      .catch(() => {});
    getCountriesApi()
      .then(res => {
        const raw: any[] = res.data?.data ?? res.data ?? [];
        const seen = new Set<string>();
        const list: { id: number; name: string; code: string }[] = [];
        raw.forEach(r => {
          if (r.currency_code && !seen.has(r.currency_code)) {
            seen.add(r.currency_code);
            list.push({ id: r.id, name: r.currency_name || r.currency_code, code: r.currency_code });
          }
        });
        setCurrencies(list);
        setCountries(raw.map(r => ({ id: r.id, name: r.country_name })));
      })
      .catch(() => {});
  }, []);

  const selectedCountryId = Number(form.country) || 0;
  const selectedStateId   = Number(form.state)   || 0;
  const filteredStates    = selectedCountryId ? states.filter(s => s.country_id === selectedCountryId) : states;
  const filteredCities    = selectedStateId   ? cities.filter(c => c.state_id  === selectedStateId)   :
                            selectedCountryId  ? cities.filter(c => c.country_id === selectedCountryId) : cities;

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
                onBlur={readonly ? noop : onBlur}
                readOnly={readonly}
                data-error={!!errors.branchCode}
                className={`${errors.branchCode ? 'border-destructive' : ''} ${ro(readonly)}`} />
            </Field>

            <Field label="Name" required={!readonly} error={errors.name}>
              <Input name="name" value={form.name}
                onChange={readonly ? noop : onChange!}
                onBlur={readonly ? noop : onBlur}
                readOnly={readonly}
                data-error={!!errors.name}
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
                {currencies.map(c => <option key={c.id} value={c.code}>{c.name} ({c.code})</option>)}
              </select>
            </Field>

            <Field label="Billing State">
              <SearchableSelect
                name="billingState"
                value={form.billingState}
                options={cities.map(c => c.name)}
                readonly={readonly}
                onChange={readonly ? noop : onChange!}
              />
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
              <Input name="voucher_identify" value={form.voucher_identify}
                onChange={readonly ? noop : onChange!}
                readOnly={readonly}
                className={ro(readonly)} />
            </Field>

            <Field label="Interest Calculation">
              <select name="interest_calculation" value={form.interest_calculation}
                onChange={readonly ? noop : onChange!}
                disabled={readonly}
                className={selCls(readonly)}>
                {YES_NO.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>

            <Field label="Debit Note">
              <Input name="debit_note" value={form.debit_note}
                onChange={readonly ? noop : onChange!}
                readOnly={readonly}
                className={ro(readonly)} />
            </Field>

            <div />

            <Field label="Incentive Calculation">
              <select name="incentive_calculation" value={form.incentive_calculation}
                onChange={readonly ? noop : onChange!}
                disabled={readonly}
                className={selCls(readonly)}>
                {YES_NO.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>

            <Field label="Incentive Percentage" required={!readonly} error={errors.incentive_percentage}>
              <Input name="incentive_percentage" value={form.incentive_percentage}
                onChange={readonly ? noop : onChange!}
                readOnly={readonly}
                type="number" min="0" max="100"
                className={`${errors.incentive_percentage ? 'border-destructive' : ''} ${ro(readonly)}`} />
            </Field>

            <Field label="Time Sheet Enable">
              <select name="time_sheet_enable" value={form.time_sheet_enable}
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

            <Field label="Country">
              <select name="country" value={form.country}
                onChange={e => {
                  if (!readonly) {
                    onChange!(e);
                    // reset state and city when country changes
                    onChange!({ target: { name: 'state', value: '' } } as React.ChangeEvent<HTMLSelectElement>);
                    onChange!({ target: { name: 'city',  value: '' } } as React.ChangeEvent<HTMLSelectElement>);
                  }
                }}
                disabled={readonly}
                className={selCls(readonly)}>
                <option value="">-- Select --</option>
                {countries.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
              </select>
            </Field>

            <Field label="State">
              <select name="state" value={form.state}
                onChange={e => {
                  if (!readonly) {
                    onChange!(e);
                    onChange!({ target: { name: 'city', value: '' } } as React.ChangeEvent<HTMLSelectElement>);
                  }
                }}
                disabled={readonly || !selectedCountryId}
                className={selCls(readonly)}>
                <option value="">{selectedCountryId ? '-- Select --' : 'Select Country first'}</option>
                {filteredStates.map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
              </select>
            </Field>

            <Field label="City">
              <select name="city" value={form.city}
                onChange={readonly ? noop : onChange!}
                disabled={readonly || !selectedStateId}
                className={selCls(readonly)}>
                <option value="">{selectedStateId ? '-- Select --' : 'Select State first'}</option>
                {filteredCities.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
              </select>
            </Field>

            <Field label="Zip Code">
              <Input name="zipCode" value={form.zipCode}
                onChange={readonly ? noop : onChange!}
                readOnly={readonly}
                className={ro(readonly)} />
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

            <Field label="Status">
              <select name="status" value={form.status}
                onChange={readonly ? noop : onChange!}
                disabled={readonly}
                className={selCls(readonly)}>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </Field>

            <div className="flex items-center gap-4 md:col-span-3">
              <Label className="text-sm font-semibold w-44 shrink-0">Branch Logo</Label>
              <div className="flex items-center gap-4 flex-1">
                {/* Preview */}
                {(form.branchLogo || form.branchLogoFile) && (
                  <img
                    src={form.branchLogoFile ? URL.createObjectURL(form.branchLogoFile) : form.branchLogo}
                    alt="Branch Logo"
                    className="w-14 h-14 rounded-lg object-cover border border-border"
                  />
                )}
                {readonly ? (
                  !form.branchLogo && !form.branchLogoFile && <span className="text-sm text-muted-foreground">—</span>
                ) : (
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#F9C74F] text-black text-sm font-semibold rounded-lg cursor-pointer hover:bg-[#f0b429] transition-colors">
                    {form.branchLogo || form.branchLogoFile ? 'Change Logo' : 'Branch Logo'}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (onLogoFileChange) onLogoFileChange(file);
                          if (onLogoChange) onLogoChange(file.name);
                        }
                      }} />
                  </label>
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
