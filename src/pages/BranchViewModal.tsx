import React, { useState, useEffect } from 'react';
import { X, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCountriesApi, getStatesApi, getCitiesApi, API_BASE } from '@/services/api';
import type { Branch } from './BranchMasterList';

const val = (v?: string | number | null) => (v !== undefined && v !== null && String(v).trim() ? String(v) : '—');

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-3 py-2 border-b border-border/50 last:border-0">
    <span className="text-sm font-semibold text-muted-foreground w-48 shrink-0">{label}</span>
    <span className="text-sm text-foreground flex-1" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{value}</span>
  </div>
);

const Row2 = ({ fields }: { fields: [string, string][] }) => (
  <div className="flex gap-6 py-2 border-b border-border/50 last:border-0">
    {fields.map(([label, value]) => (
      <div key={label} className="flex gap-3 flex-1 min-w-0">
        <span className="text-sm font-semibold text-muted-foreground w-40 shrink-0">{label}</span>
        <span className="text-sm text-foreground flex-1 min-w-0" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{value}</span>
      </div>
    ))}
  </div>
);

const Section = ({ title, color, children }: { title: string; color: string; children: React.ReactNode }) => (
  <div className="material-card material-elevation-1 overflow-hidden">
    <div className={`${color} px-6 py-3`}>
      <h2 className="text-base font-bold text-white">{title}</h2>
    </div>
    <div className="px-6 py-2">{children}</div>
  </div>
);

interface Props {
  branch: Branch;
  onClose: () => void;
  onEdit: () => void;
}

const BranchViewModal: React.FC<Props> = ({ branch, onClose, onEdit }) => {
  const [countryName, setCountryName] = useState('—');
  const [stateName,   setStateName]   = useState('—');
  const [cityName,    setCityName]    = useState('—');

  useEffect(() => {
    getCountriesApi().then(res => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      const found = raw.find(r => String(r.id) === String(branch.country));
      setCountryName(found?.country_name ?? val(branch.country));
    }).catch(() => setCountryName(val(branch.country)));

    getStatesApi(1, 9999).then(res => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      const found = raw.find(r => String(r.id) === String(branch.state));
      setStateName(found?.name ?? val(branch.state));
    }).catch(() => setStateName(val(branch.state)));

    getCitiesApi().then(res => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      const found = raw.find(r => String(r.id) === String(branch.city));
      setCityName(found?.name ?? val(branch.city));
    }).catch(() => setCityName(val(branch.city)));
  }, [branch.country, branch.state, branch.city]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">

        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h3 className="text-lg font-bold text-primary">View Branch</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{branch.name} — {branch.branch_code}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Info Section */}
          <Section title="Info" color="bg-[#4CAF50]">
            <Row2 fields={[['Branch Code', val(branch.branch_code)], ['Name', val(branch.name)]]} />
            <Row2 fields={[['Position', val(branch.position)], ['Currency', val(branch.currency)]]} />
            <Row2 fields={[['Billing State', val(branch.billing_state)], ['GSTIN No#', val(branch.gstin_no)]]} />
            <Row  label="Notes" value={val(branch.notes)} />
            <Row2 fields={[['Voucher Identify', val(branch.voucher_identify)], ['Interest Calculation', val(branch.interest_calculation)]]} />
            <Row2 fields={[['Debit Note', val(branch.debit_note)], ['Incentive Calculation', val(branch.incentive_calculation)]]} />
            <Row2 fields={[['Incentive Percentage', val(branch.incentive_percentage)], ['Time Sheet Enable', val(branch.time_sheet_enable)]]} />
            <Row2 fields={[['Status', branch.status === 1 ? 'Active' : 'Inactive'], ['Created At', val(branch.created_at)]]} />
          </Section>

          {/* Branch Address Section */}
          <Section title="Branch Address" color="bg-[#90A4AE]">
            <Row  label="Address"  value={val(branch.address)} />
            <Row2 fields={[['Country', countryName], ['State', stateName]]} />
            <Row2 fields={[['City', cityName], ['Zip Code', val(branch.zip_code)]]} />
            <Row2 fields={[['Phone', val(branch.phone)], ['Mobile', val(branch.mobile)]]} />
            <Row2 fields={[['Fax', val(branch.fax)], ['Email', val(branch.email)]]} />
            <Row  label="Website"    value={val(branch.website)} />
            <Row  label="Logo Link"   value={val(branch.logo_link)} />
            <div className="flex gap-3 py-2 border-b border-border/50">
              <span className="text-sm font-semibold text-muted-foreground w-48 shrink-0">Branch Logo</span>
              <div className="flex-1">
                {branch.branch_logo
                  ? <img src={branch.branch_logo.startsWith('http') ? branch.branch_logo : `${API_BASE}/${branch.branch_logo}`} alt="Branch Logo" className="w-20 h-20 rounded-lg object-cover border border-border" />
                  : <span className="text-sm text-foreground">—</span>
                }
              </div>
            </div>
          </Section>

        </div>

        <div className="flex justify-end px-6 py-4 border-t border-border shrink-0 gap-3">
          <Button variant="outline" onClick={onEdit}>
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </Button>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>

      </div>
    </div>
  );
};

export default BranchViewModal;
