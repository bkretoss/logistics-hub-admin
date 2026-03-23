import React from "react";
import { X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Customer } from "./CustomerMasterList";

const val = (v?: string | null) => (v && v.trim() ? v : "—");

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-3 py-2 border-b border-border/50 last:border-0">
    <span className="text-sm font-semibold text-muted-foreground w-48 shrink-0">{label}</span>
    <span className="text-sm text-foreground flex-1" style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
      {value}
    </span>
  </div>
);

const Row2 = ({ fields }: { fields: [string, string][] }) => (
  <div className="flex gap-6 py-2 border-b border-border/50 last:border-0">
    {fields.map(([label, value]) => (
      <div key={label} className="flex gap-3 flex-1 min-w-0">
        <span className="text-sm font-semibold text-muted-foreground w-40 shrink-0">{label}</span>
        <span className="text-sm text-foreground flex-1 min-w-0" style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
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
  customer: Customer;
  onClose: () => void;
  onEdit: () => void;
}

const CustomerViewModal: React.FC<Props> = ({ customer: c, onClose, onEdit }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div>
          <h3 className="text-lg font-bold text-primary">View Customer</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{val(c.name)} — {val(c.actualName)}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
        <Section title="Basic Information" color="bg-[#4CAF50]">
          <Row2 fields={[["Name", val(c.name)], ["Actual Name", val(c.actualName)]]} />
          <Row2 fields={[["Categories", val(c.categories)], ["Position", val(c.position)]]} />
          <Row2 fields={[["Sales Person", val(c.salesPerson)], ["Website", val(c.website)]]} />
          <Row2 fields={[["User Name", val(c.userName)], ["Interest Calculation", val(c.interestCalculation)]]} />
          <Row label="Status" value={c.status} />
        </Section>

        <Section title="Codes & Identifiers" color="bg-[#00BCD4]">
          <Row2 fields={[["SCAC Code", val(c.scacCode)], ["IEC Code", val(c.iecCode)]]} />
          <Row2 fields={[["IATA Code", val(c.iataCode)], ["Customer Logo", val(c.customerLogo)]]} />
        </Section>

        {c.notes && (
          <Section title="Notes" color="bg-[#90A4AE]">
            <Row label="Notes" value={val(c.notes)} />
          </Section>
        )}
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

export default CustomerViewModal;
