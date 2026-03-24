import React from 'react';
import { X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface COARow {
  id: number;
  lineNo: string;
  customerCOA: string;
  paymentMode: string;
  creditApprover: string;
  osCollector: string;
  currency: string;
  approvedCreditPeriod: string;
  approvedCreditAmount: string;
  alertCreditDays: string;
  alertCreditAmount: string;
  alertToEmail: string;
  alertCCEmail: string;
  alertBCCEmail: string;
  notes: string;
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
  coa: COARow;
  onClose: () => void;
}

const COAViewModal: React.FC<Props> = ({ coa: c, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#1a9fd4]/10 flex items-center justify-center shrink-0 ring-2 ring-[#1a9fd4]/20">
            <FileText className="w-6 h-6 text-[#1a9fd4]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">View COA</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {val(c.customerCOA)} — Line {val(c.lineNo)}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

        <Section title="COA Details" color="bg-[#1a9fd4]">
          <Row2 fields={[['Line No', val(c.lineNo)], ['Customer COA', val(c.customerCOA)]]} />
          <Row2 fields={[['Payment Mode', val(c.paymentMode)], ['Credit Approver', val(c.creditApprover)]]} />
          <Row2 fields={[['O/S Collector', val(c.osCollector)], ['Currency', val(c.currency)]]} />
          <Row2 fields={[['Approved Credit Period', val(c.approvedCreditPeriod)], ['Approved Credit Amount', val(c.approvedCreditAmount)]]} />
          <Row2 fields={[['Alert Credit Days', val(c.alertCreditDays)], ['Alert Credit Amount', val(c.alertCreditAmount)]]} />
        </Section>

        <Section title="Alert Details" color="bg-[#90A4AE]">
          <Row label="Alert To Email"  value={val(c.alertToEmail)} />
          <Row label="Alert CC Email"  value={val(c.alertCCEmail)} />
          <Row label="Alert BCC Email" value={val(c.alertBCCEmail)} />
          <Row label="Notes"           value={val(c.notes)} />
        </Section>

      </div>

      {/* Footer */}
      <div className="flex justify-end px-6 py-4 border-t border-border shrink-0">
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>

    </div>
  </div>
);

export default COAViewModal;
