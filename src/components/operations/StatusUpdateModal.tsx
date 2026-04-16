import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatusUpdateForm {
  lineNo: string;
  updateTo: string;
  position: string;
  subject: string;
  from: string;
  to: string;
  bcc: string;
  cc: string;
  header: string;
  body: string;
  footer: string;
  notes: string;
}

interface Props {
  open: boolean;
  form: StatusUpdateForm;
  updateToOptions: string[];
  positionOptions: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onClose: () => void;
}

const StatusUpdateModal = ({ 
  open, 
  form, 
  updateToOptions, 
  positionOptions, 
  onChange, 
  onSave, 
  onClose 
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#00BCD4] shrink-0">
          <h3 className="text-white font-semibold text-sm">Status Update</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4 text-sm">
          {/* Line No# and Update To (Type) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-xs">Line No#</label>
              <input
                type="text"
                name="lineNo"
                value={form.lineNo}
                onChange={onChange}
                className="w-full px-3 py-1.5 border border-input rounded text-xs bg-background"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-xs">Update To (Type)</label>
              <select
                name="updateTo"
                value={form.updateTo}
                onChange={onChange}
                className="w-full px-3 py-1.5 border border-input rounded text-xs bg-background"
              >
                <option value="">--Select--</option>
                {updateToOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Position */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-xs">
              <span className="text-destructive mr-1">*</span>Position
            </label>
            <select
              name="position"
              value={form.position}
              onChange={onChange}
              className="w-full px-3 py-1.5 border border-input rounded text-xs bg-background"
            >
              {positionOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-xs">Subject</label>
            <textarea
              name="subject"
              value={form.subject}
              onChange={onChange}
              rows={3}
              className="w-full px-3 py-1.5 border border-input rounded text-xs bg-background resize-y"
            />
          </div>

          {/* From */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-xs">From</label>
            <input
              type="text"
              name="from"
              value={form.from}
              onChange={onChange}
              className="w-full px-3 py-1.5 border border-input rounded text-xs bg-background"
            />
          </div>

          {/* To */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-xs">To</label>
            <input
              type="text"
              name="to"
              value={form.to}
              onChange={onChange}
              className="w-full px-3 py-1.5 border border-input rounded text-xs bg-background"
            />
          </div>

          {/* Bcc */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-xs">Bcc</label>
            <input
              type="text"
              name="bcc"
              value={form.bcc}
              onChange={onChange}
              className="w-full px-3 py-1.5 border border-input rounded text-xs bg-background"
            />
          </div>

          {/* Cc */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-xs">Cc</label>
            <input
              type="text"
              name="cc"
              value={form.cc}
              onChange={onChange}
              className="w-full px-3 py-1.5 border border-input rounded text-xs bg-background"
            />
          </div>

          {/* Header */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-xs">Header</label>
            <textarea
              name="header"
              value={form.header}
              onChange={onChange}
              rows={3}
              className="w-full px-3 py-1.5 border border-input rounded text-xs bg-background resize-y"
            />
          </div>

          {/* Body */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-xs">Body</label>
            <textarea
              name="body"
              value={form.body}
              onChange={onChange}
              rows={3}
              className="w-full px-3 py-1.5 border border-input rounded text-xs bg-background resize-y"
            />
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-xs">Footer</label>
            <textarea
              name="footer"
              value={form.footer}
              onChange={onChange}
              rows={3}
              className="w-full px-3 py-1.5 border border-input rounded text-xs bg-background resize-y"
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-xs">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={onChange}
              rows={3}
              className="w-full px-3 py-1.5 border border-input rounded text-xs bg-background resize-y"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border shrink-0">
          <Button size="sm" variant="outline" onClick={onClose}>Cancel</Button>
          <Button size="sm" className="bg-background border border-input text-foreground hover:bg-muted font-semibold px-6" onClick={onSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
