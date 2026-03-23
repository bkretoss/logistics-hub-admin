import React from 'react';
import { X, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { User } from './UserMasterList';

const val = (v?: string | null) => (v && v.trim() ? v : '—');

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-3 py-2 border-b border-border/50 last:border-0">
    <span className="text-sm font-semibold text-muted-foreground w-48 shrink-0">{label}</span>
    <span className="text-sm text-foreground flex-1" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
      {value}
    </span>
  </div>
);

const Row2 = ({ fields }: { fields: [string, string][] }) => (
  <div className="flex gap-6 py-2 border-b border-border/50 last:border-0">
    {fields.map(([label, value]) => (
      <div key={label} className="flex gap-3 flex-1 min-w-0">
        <span className="text-sm font-semibold text-muted-foreground w-40 shrink-0">{label}</span>
        <span className="text-sm text-foreground flex-1 min-w-0" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
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

const Badge = ({ active }: { active: boolean }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
    {active ? 'Yes' : 'No'}
  </span>
);

const CheckRow = ({ label, checked }: { label: string; checked: boolean }) => (
  <div className="flex items-center justify-between gap-2 py-1.5 border-b border-border/50 last:border-0">
    <span className="text-sm font-semibold text-muted-foreground">{label}</span>
    <Badge active={checked} />
  </div>
);

interface Props {
  user: User;
  onClose: () => void;
  onEdit: () => void;
}

const UserViewModal: React.FC<Props> = ({ user: u, onClose, onEdit }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div>
          <h3 className="text-lg font-bold text-primary">View User</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{val(u.displayName)} — {val(u.userName)}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

        <Section title="Basic Information" color="bg-[#4CAF50]">
          <Row2 fields={[['User Name', val(u.userName)], ['Branch', val(u.branch)]]} />
          <Row2 fields={[['Title', val(u.title)], ['Display Name', val(u.displayName)]]} />
          <Row2 fields={[['Sex', val(u.sex)], ['Designation', val(u.designation)]]} />
          <Row  label="Status" value={u.status} />
        </Section>

        {/* Rights · Job Status · Voucher Status — single row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Section title="Rights" color="bg-[#90A4AE]">
            <CheckRow label="Admin"         checked={u.rightAdmin} />
            <CheckRow label="Marketing"     checked={u.rightMarketing} />
            <CheckRow label="Accounts"      checked={u.rightAccounts} />
            <CheckRow label="Quotation"     checked={u.rightQuotation} />
            <CheckRow label="HR"            checked={u.rightHR} />
            <CheckRow label="Management"    checked={u.rightManagement} />
            <CheckRow label="Documentation" checked={u.rightDocumentation} />
            <CheckRow label="Settings"      checked={u.rightSettings} />
          </Section>

          <Section title="Job Status" color="bg-[#00BCD4]">
            <CheckRow label="Created"           checked={u.jobCreated} />
            <CheckRow label="Process"           checked={u.jobProcess} />
            <CheckRow label="Process Completed" checked={u.jobProcessCompleted} />
            <CheckRow label="Closed"            checked={u.jobClosed} />
            <CheckRow label="Cancelled"         checked={u.jobCancelled} />
            <CheckRow label="Re Opened"         checked={u.jobReOpened} />
          </Section>

          <Section title="Voucher Status" color="bg-[#FF9800]">
            <CheckRow label="Created"   checked={u.voucherCreated} />
            <CheckRow label="Approved"  checked={u.voucherApproved} />
            <CheckRow label="Confirmed" checked={u.voucherConfirmed} />
            <CheckRow label="Cancelled" checked={u.voucherCancelled} />
            <CheckRow label="Dispute"   checked={u.voucherDispute} />
          </Section>

        </div>

      </div>

      {/* Footer */}
      <div className="flex justify-end px-6 py-4 border-t border-border shrink-0 gap-3">
        <Button variant="outline" onClick={onEdit}>
          <Pencil className="w-4 h-4 mr-2" /> Edit
        </Button>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>

    </div>
  </div>
);

export default UserViewModal;
