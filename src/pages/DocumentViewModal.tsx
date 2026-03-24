import React from 'react';
import { X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DocumentRow } from './NewCustomer';

const val = (v?: string | null): string =>
  v && v.trim() && v !== '--Select--' ? v.trim() : '—';

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

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-3 py-2 border-b border-border/50 last:border-0">
    <span className="text-sm font-semibold text-muted-foreground w-48 shrink-0">{label}</span>
    <span className="text-sm text-foreground flex-1" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{value}</span>
  </div>
);

interface Props {
  document: DocumentRow;
  onClose: () => void;
}

const DocumentViewModal: React.FC<Props> = ({ document: d, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#1a9fd4]/10 flex items-center justify-center shrink-0 ring-2 ring-[#1a9fd4]/20">
            <FileText className="w-6 h-6 text-[#1a9fd4]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">View Document</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{val(d.documentType)} — Line {val(d.lineNo)}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1 px-6 py-5">
        <div className="material-card material-elevation-1 overflow-hidden">
          <div className="bg-[#1a9fd4] px-6 py-3">
            <h2 className="text-base font-bold text-white">Document Details</h2>
          </div>
          <div className="px-6 py-2">
            <Row2 fields={[['Line No', val(d.lineNo)], ['Position', val(d.position)]]} />
            <Row2 fields={[['Document Type', val(d.documentType)], ['Document No', val(d.documentNo)]]} />
            <Row2 fields={[['Issued Place', val(d.issuedPlace)], ['Issued By', val(d.issuedBy)]]} />
            <Row2 fields={[['Issued Date', val(d.issuedDate)], ['Expiry Date', val(d.expiryDate)]]} />
            <Row2 fields={[['File Name', val(d.fileName)], ['Attachment', val(d.attachment)]]} />
            <Row label="Note" value={val(d.note)} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end px-6 py-4 border-t border-border shrink-0">
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    </div>
  </div>
);

export default DocumentViewModal;
