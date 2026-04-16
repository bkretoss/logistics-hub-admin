import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkingTeamForm {
  employee: string;
  department: string;
  followupRequired: string;
  note: string;
}

interface Props {
  open: boolean;
  form: WorkingTeamForm;
  error: string;
  employeeOptions: string[];
  deptOptions: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onClose: () => void;
}

const WorkingTeamModal = ({ open, form, error, employeeOptions, deptOptions, onChange, onSave, onClose }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#00BCD4]">
          <h3 className="text-white font-semibold text-sm">Job Working Team</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 text-sm">
          {/* Employee */}
          <div className="flex items-center gap-3">
            <label className="w-32 shrink-0 font-semibold text-xs">
              <span className="text-destructive mr-1">*</span>Employee
            </label>
            <div className="flex-1">
              <select
                name="employee"
                value={form.employee}
                onChange={onChange}
                className={`w-full px-3 py-1.5 border rounded text-xs bg-background ${error ? "border-destructive" : "border-input"}`}
              >
                <option value="">--Select--</option>
                {employeeOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              {error && <p className="text-xs text-destructive mt-0.5">{error}</p>}
            </div>
          </div>

          {/* Department + Followup Required */}
          <div className="flex items-center gap-3">
            <label className="w-32 shrink-0 font-semibold text-xs">
              <span className="text-destructive mr-1">*</span>Department(Sec)
            </label>
            <select
              name="department"
              value={form.department}
              onChange={onChange}
              className="w-36 px-3 py-1.5 border border-input rounded text-xs bg-background"
            >
              <option value=""></option>
              {deptOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>

            <label className="ml-4 font-semibold text-xs shrink-0">Followup Required</label>
            <div className="flex border border-input rounded overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => onChange({ target: { name: "followupRequired", value: "No" } } as any)}
                className={`px-4 py-1.5 ${form.followupRequired === "No" ? "bg-muted font-semibold" : "bg-background"}`}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => onChange({ target: { name: "followupRequired", value: "Yes" } } as any)}
                className={`px-4 py-1.5 border-l border-input ${form.followupRequired === "Yes" ? "bg-muted font-semibold" : "bg-background"}`}
              >
                Yes
              </button>
            </div>
          </div>

          {/* Note */}
          <div className="flex items-start gap-3">
            <label className="w-32 shrink-0 font-semibold text-xs pt-1">Note</label>
            <textarea
              name="note"
              value={form.note}
              onChange={onChange}
              rows={3}
              className="flex-1 px-3 py-1.5 border border-input rounded text-xs bg-background resize-y"
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

export default WorkingTeamModal;
