import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfitShareForm {
  type: string;
  toName: string;
  toNameDesc: string;
  percentage: string;
  profitAmount: string;
  jobProfit: string;
  note: string;
}

interface ProfitShareErrors {
  type?: string;
  toName?: string;
  percentage?: string;
  profitAmount?: string;
  jobProfit?: string;
}

interface Props {
  open: boolean;
  form: ProfitShareForm;
  errors: ProfitShareErrors;
  jobNo: string;
  jobDate: string;
  typeOptions: string[];
  toNameOptions: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onClose: () => void;
}

const ProfitShareModal = ({ 
  open, 
  form, 
  errors, 
  jobNo, 
  jobDate, 
  typeOptions, 
  toNameOptions, 
  onChange, 
  onSave, 
  onClose 
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#00BCD4]">
          <h3 className="text-white font-semibold text-sm">Profit Share</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 text-sm">
          {/* JOB No# and JOB Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-xs">JOB No#</label>
              <input
                type="text"
                value={jobNo}
                readOnly
                className="w-full px-3 py-1.5 border border-input rounded text-xs bg-muted cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-xs">JOB Date</label>
              <div className="relative">
                <input
                  type="text"
                  value={jobDate}
                  readOnly
                  className="w-full px-3 py-1.5 border border-input rounded text-xs bg-muted cursor-not-allowed pr-8"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-xs">
              <span className="text-destructive mr-1">*</span>Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={onChange}
              className={`w-full px-3 py-1.5 border rounded text-xs bg-background ${errors.type ? "border-destructive" : "border-input"}`}
            >
              <option value="">--Select--</option>
              {typeOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            {errors.type && <p className="text-xs text-destructive mt-0.5">{errors.type}</p>}
          </div>

          {/* To Name and To Name (Description) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-xs">
                <span className="text-destructive mr-1">*</span>To Name
              </label>
              <select
                name="toName"
                value={form.toName}
                onChange={onChange}
                className={`w-full px-3 py-1.5 border rounded text-xs bg-background ${errors.toName ? "border-destructive" : "border-input"}`}
              >
                <option value="">--Select--</option>
                {toNameOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              {errors.toName && <p className="text-xs text-destructive mt-0.5">{errors.toName}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-xs">
                <span className="text-destructive mr-1">*</span>To Name (Description)
              </label>
              <input
                type="text"
                name="toNameDesc"
                value={form.toNameDesc}
                onChange={onChange}
                className="w-full px-3 py-1.5 border border-input rounded text-xs bg-background"
              />
            </div>
          </div>

          {/* Percentage and Profit Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-xs">
                <span className="text-destructive mr-1">*</span>Percentage
              </label>
              <input
                type="text"
                name="percentage"
                value={form.percentage}
                onChange={onChange}
                placeholder="Enter percentage"
                className={`w-full px-3 py-1.5 border rounded text-xs bg-background ${errors.percentage ? "border-destructive" : "border-input"}`}
              />
              {errors.percentage && <p className="text-xs text-destructive mt-0.5">{errors.percentage}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-xs">
                <span className="text-destructive mr-1">*</span>Profit Amount
              </label>
              <input
                type="text"
                name="profitAmount"
                value={form.profitAmount}
                onChange={onChange}
                placeholder="Enter amount"
                className={`w-full px-3 py-1.5 border rounded text-xs bg-background ${errors.profitAmount ? "border-destructive" : "border-input"}`}
              />
              {errors.profitAmount && <p className="text-xs text-destructive mt-0.5">{errors.profitAmount}</p>}
            </div>
          </div>

          {/* Job Profit */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-xs">
              <span className="text-destructive mr-1">*</span>Job Profit
            </label>
            <input
              type="text"
              name="jobProfit"
              value={form.jobProfit}
              onChange={onChange}
              placeholder="Enter job profit"
              className={`w-full px-3 py-1.5 border rounded text-xs bg-background ${errors.jobProfit ? "border-destructive" : "border-input"}`}
            />
            {errors.jobProfit && <p className="text-xs text-destructive mt-0.5">{errors.jobProfit}</p>}
          </div>

          {/* Note */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-xs">Note</label>
            <textarea
              name="note"
              value={form.note}
              onChange={onChange}
              rows={4}
              className="w-full px-3 py-1.5 border border-input rounded text-xs bg-background resize-y"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border">
          <Button size="sm" variant="outline" onClick={onClose}>Cancel</Button>
          <Button size="sm" className="bg-background border border-input text-foreground hover:bg-muted font-semibold px-6" onClick={onSave}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfitShareModal;
