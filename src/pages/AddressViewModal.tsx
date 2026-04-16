import React from 'react';
import { X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AddressRow {
  id: number;        // local UI key
  savedId?: number;  // server-side id (set after save)
  addressType: string;
  position: string;
  address: string;
  city: string;
  panNo: string;
  pinNo: string;
  gstinNo: string;
  phoneNo: string;
  sezZone: 'No' | 'Yes';
  faxNo: string;
  state: string;
  mobileNo: string;
  emailId: string;
  country: string;
  contactPerson: string;
  personDesignation: string;
  department: string;
  taxRegistrationType: string;
  whatsApp: string;
  branchName: string;
  notes: string;
  einNo: string;
  businessNo: string;
}

const val = (v?: string | null): string =>
  v && v.trim() && v !== '--Select--' ? v.trim() : '—';

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-3 py-2 border-b border-border/50 last:border-0">
    <span className="text-sm font-semibold text-muted-foreground w-48 shrink-0">{label}</span>
    <span className="text-sm text-foreground flex-1" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal' }}>
      {value}
    </span>
  </div>
);

const Row2 = ({ fields }: { fields: [string, string][] }) => (
  <div className="flex gap-6 py-2 border-b border-border/50 last:border-0">
    {fields.map(([label, value]) => (
      <div key={label} className="flex gap-3 flex-1 min-w-0">
        <span className="text-sm font-semibold text-muted-foreground w-40 shrink-0">{label}</span>
        <span className="text-sm text-foreground flex-1 min-w-0" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal' }}>
          {value}
        </span>
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
  address: AddressRow;
  onClose: () => void;
}

const AddressViewModal: React.FC<Props> = ({ address: a, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#1a9fd4]/10 flex items-center justify-center shrink-0 ring-2 ring-[#1a9fd4]/20">
            <MapPin className="w-6 h-6 text-[#1a9fd4]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">View Address</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {val(a.addressType)} — {val(a.city)}{a.country ? `, ${val(a.country)}` : ''}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

        <Section title="Address Details" color="bg-[#1a9fd4]">
          <Row2 fields={[['Address Type', val(a.addressType)], ['Position', val(a.position)]]} />
          <Row  label="Address" value={val(a.address)} />
          <Row2 fields={[['City', val(a.city)], ['PAN No', val(a.panNo)]]} />
          <Row2 fields={[['PIN No', val(a.pinNo)], ['GSTIN No#', val(a.gstinNo)]]} />
          <Row2 fields={[['Phone No', val(a.phoneNo)], ['State', val(a.state)]]} />
          <Row2 fields={[['Fax No', val(a.faxNo)], ['Mobile No', val(a.mobileNo)]]} />
          <Row2 fields={[['Email ID', val(a.emailId)], ['Country', val(a.country)]]} />
          {a.country === 'USA' && <Row  label="EIN No" value={val(a.einNo)} />}
          {a.country === 'Canada' && <Row  label="Business No" value={val(a.businessNo)} />}
        </Section>

        <Section title="Contact Details" color="bg-[#90A4AE]">
          <Row2 fields={[['Contact Person', val(a.contactPerson)], ['Person Designation', val(a.personDesignation)]]} />
          <Row2 fields={[['Department', val(a.department)], ['WhatsApp', val(a.whatsApp)]]} />
          <Row  label="Bank Name" value={val(a.bankName)} />
          <Row  label="TAX Registration Type" value={val(a.taxRegistrationType)} />
          <Row  label="Notes" value={val(a.notes)} />
        </Section>

      </div>

      {/* Footer */}
      <div className="flex justify-end px-6 py-4 border-t border-border shrink-0">
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>

    </div>
  </div>
);

export default AddressViewModal;
