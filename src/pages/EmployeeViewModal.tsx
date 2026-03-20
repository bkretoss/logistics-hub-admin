import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Employee } from './EmployeeMasterList';

// Returns display value: strips '--Select--' sentinels, trims, falls back to '—'
const val = (v?: string | null): string =>
  v && v.trim() && v !== '--Select--' ? v.trim() : '—';

// Maps stored title codes → display labels with proper punctuation
const TITLE_DISPLAY: Record<string, string> = {
  Mr: 'Mr.', Mrs: 'Mrs.', Ms: 'Ms.', Miss: 'Miss', Dr: 'Dr.', Prof: 'Prof.',
};
const fmtTitle = (v?: string | null): string => {
  const s = val(v);
  return s === '—' ? s : (TITLE_DISPLAY[s] ?? s);
};

// Formats ISO date 'YYYY-MM-DD' → 'DD-MM-YYYY', leaves other strings as-is
const fmtDate = (v?: string | null): string => {
  const s = val(v);
  if (s === '—') return s;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : s;
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-3 py-2 border-b border-border/50 last:border-0">
    <span className="text-sm font-semibold text-muted-foreground w-48 shrink-0">{label}</span>
    <span
      className="text-sm text-foreground flex-1"
      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal' }}
    >
      {value}
    </span>
  </div>
);

const Row2 = ({ fields }: { fields: [string, string][] }) => (
  <div className="flex gap-6 py-2 border-b border-border/50 last:border-0">
    {fields.map(([label, value]) => (
      <div key={label} className="flex gap-3 flex-1 min-w-0">
        <span className="text-sm font-semibold text-muted-foreground w-40 shrink-0">{label}</span>
        <span
          className="text-sm text-foreground flex-1 min-w-0"
          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal' }}
        >
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
  employee: Employee;
  onClose: () => void;
}

// Inline SVG default avatar — no external asset needed
const DefaultAvatar = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="50" cy="50" r="50" fill="#E2E8F0" />
    <circle cx="50" cy="38" r="16" fill="#94A3B8" />
    <ellipse cx="50" cy="80" rx="26" ry="18" fill="#94A3B8" />
  </svg>
);

const EmployeeViewModal: React.FC<Props> = ({ employee: e, onClose }) => {
  const fullName = [e.nameTitle, e.firstName, e.middleName, e.lastName]
    .map((p, i) => i === 0 ? (p?.trim() && p !== '--Select--' ? (TITLE_DISPLAY[p.trim()] ?? p.trim()) : '') : p?.trim())
    .filter(Boolean)
    .join(' ') || '—';

  // employeePhoto holds a filename/URL when set; treat bare filenames as unavailable (no real src)
  const photoSrc = e.employeePhoto && e.employeePhoto.trim() && !e.employeePhoto.startsWith('No file')
    ? e.employeePhoto
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-4">
            {/* Profile photo */}
            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 ring-2 ring-border shadow-sm bg-muted">
              {photoSrc
                ? <img src={photoSrc} alt={fullName} className="w-full h-full object-cover"
                    onError={ev => { (ev.currentTarget as HTMLImageElement).style.display = 'none';
                      (ev.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'flex'); }} />
                : null}
              {/* Fallback always rendered; hidden when real image loads successfully */}
              <div className={`w-full h-full ${photoSrc ? 'hidden' : 'flex'} items-center justify-center`}>
                <DefaultAvatar />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary">View Employee</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{fullName} — {val(e.empId)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* ── Employee Details ── */}
          <Section title="Employee Details" color="bg-[#4CAF50]">
            <Row2 fields={[['Login ID',         val(e.loginId)],         ['Position',    val(e.position)]]} />
            <Row2 fields={[['Identification No', val(e.identificationNo)],['Branch',      val(e.branch)]]} />
            <Row2 fields={[['Name Title',        fmtTitle(e.nameTitle)],  ['First Name',  val(e.firstName)]]} />
            <Row2 fields={[['Middle Name',        val(e.middleName)],      ['Last Name',   val(e.lastName)]]} />
            <Row2 fields={[['Spouse Name',        val(e.spouseName)],      ['DOB',         fmtDate(e.dob)]]} />
            <Row2 fields={[['Place of Birth',     val(e.placeOfBirth)],    ['Nationality', val(e.nationality)]]} />
            <Row2 fields={[['Religion',           val(e.religion)],        ['Sex',         val(e.sex)]]} />
            <Row2 fields={[['Marital Status',     val(e.maritalStatus)],   ['Marriage Date', fmtDate(e.marriageDate)]]} />
            <Row2 fields={[['Blood Group',        val(e.bloodGroup)],      ['Joining Date',  fmtDate(e.joiningDate)]]} />
            <Row2 fields={[['Confirmation Date',  fmtDate(e.confirmationDate)], ['Notification Date', fmtDate(e.notificationDate)]]} />
            <Row2 fields={[['Leaving Date',       fmtDate(e.leavingDate)], ['CTC Currency', val(e.ctcCurrency)]]} />
            <Row2 fields={[['CTC Amount',         val(e.ctcAmount)],       ['Contact No',   val(e.contactNo)]]} />
            <Row  label="Temporary Address" value={val(e.temporaryAddress)} />
            <Row  label="Permanent Address" value={val(e.permanentAddress)} />
          </Section>

          {/* ── Job Details ── */}
          <Section title="Job Details" color="bg-[#90A4AE]">
            <Row2 fields={[['Designation',      val(e.designation)],      ['Department',        val(e.department)]]} />
            <Row2 fields={[['Division',          val(e.division)],         ['Reporting Manager', val(e.reportingManager)]]} />
            <Row  label="Job Description" value={val(e.jobDescription)} />
            <Row  label="Note"            value={val(e.note)} />
          </Section>

          {/* ── Additional Details ── */}
          <Section title="Additional Details" color="bg-[#00BCD4]">
            <Row2 fields={[['Incentive COA', val(e.incentiveCoa)], ['User Name', val(e.userName)]]} />
          </Section>

        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-border shrink-0">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>

      </div>
    </div>
  );
};

export default EmployeeViewModal;
