import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Employee } from './EmployeeMasterList';

const v = (val?: string | null) => (val && val.trim() ? val.trim() : '—');

const TITLE_MAP: Record<string, string> = {
  Mr: 'Mr.', Mrs: 'Mrs.', Ms: 'Ms.', Miss: 'Miss', Dr: 'Dr.', Prof: 'Prof.',
};

const Row2 = ({ fields }: { fields: [string, string][] }) => (
  <div className="flex gap-6 py-2 border-b border-border/50 last:border-0">
    {fields.map(([label, value]) => (
      <div key={label} className="flex gap-3 flex-1 min-w-0">
        <span className="text-sm font-semibold text-muted-foreground w-40 shrink-0">{label}</span>
        <span className="text-sm text-foreground flex-1 min-w-0" style={{ wordBreak: 'break-word' }}>{value}</span>
      </div>
    ))}
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-3 py-2 border-b border-border/50 last:border-0">
    <span className="text-sm font-semibold text-muted-foreground w-48 shrink-0">{label}</span>
    <span className="text-sm text-foreground flex-1" style={{ wordBreak: 'break-word' }}>{value}</span>
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

const getImageUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `http://localhost:8001/${path}`;
};

const DefaultAvatar = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="50" cy="50" r="50" fill="#E2E8F0" />
    <circle cx="50" cy="38" r="16" fill="#94A3B8" />
    <ellipse cx="50" cy="80" rx="26" ry="18" fill="#94A3B8" />
  </svg>
);

interface Props {
  employee: Employee;
  onClose: () => void;
}

const EmployeeViewModal: React.FC<Props> = ({ employee: e, onClose }) => {
  const navigate = useNavigate();
  const title = TITLE_MAP[e.name_title ?? ''] ?? e.name_title ?? '';
  const fullName = [title, e.first_name, e.middle_name, e.last_name].filter(Boolean).join(' ') || '—';
  const isActive = e.status === 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-lg shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 ring-2 ring-border shadow-sm bg-muted">
              {e.profile_image
                ? <img src={getImageUrl(e.profile_image)!} alt={fullName} className="w-full h-full object-cover" onError={ev => { (ev.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                : <DefaultAvatar />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary">View Employee</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{fullName} — {v(e.emp_id)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isActive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-orange-50 border-orange-200 text-orange-600'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-orange-400'}`} />
              {isActive ? 'Active' : 'Inactive'}
            </span>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          <Section title="Employee Details" color="bg-[#4CAF50]">
            <Row2 fields={[['EMP ID', v(e.emp_id)], ['Login ID', v(e.login_id)]]} />
            <Row2 fields={[['Position', v(e.position)], ['Branch', v(e.branch)]]} />
            <Row2 fields={[['Identification No', v(e.identification_no)], ['Name Title', TITLE_MAP[e.name_title ?? ''] ?? v(e.name_title)]]} />
            <Row2 fields={[['First Name', v(e.first_name)], ['Middle Name', v(e.middle_name)]]} />
            <Row2 fields={[['Last Name', v(e.last_name)], ['Spouse Name', v(e.spouse_name)]]} />
            <Row2 fields={[['Date of Birth', v(e.dob)], ['Place of Birth', v(e.place_of_birth)]]} />
            <Row2 fields={[['Nationality', v(e.nationality)], ['Religion', v(e.religion)]]} />
            <Row2 fields={[['Sex', v(e.sex)], ['Marital Status', v(e.marital_status)]]} />
            <Row2 fields={[['Marriage Date', v(e.marriage_date)], ['Blood Group', v(e.blood_group)]]} />
            <Row2 fields={[['Joining Date', v(e.joining_date)], ['Confirmation Date', v(e.confirmation_date)]]} />
            <Row2 fields={[['Notification Date', v(e.notification_date)], ['Leaving Date', v(e.leaving_date)]]} />
            <Row2 fields={[['CTC Currency', v(e.ctc_currency)], ['CTC Amount', v(e.ctc_amount)]]} />
            <Row2 fields={[['Contact No', v(e.contact_no)], ['User Name', v(e.user_name)]]} />
            <Row label="Temporary Address" value={v(e.temporary_address)} />
            <Row label="Permanent Address" value={v(e.permanent_address)} />
          </Section>

          <Section title="Job Details" color="bg-[#90A4AE]">
            <Row2 fields={[['Designation', v(e.designation)], ['Department', v(e.department)]]} />
            <Row2 fields={[['Division', v(e.division)], ['Reporting Manager', v(e.reporting_manager)]]} />
            <Row label="Job Description" value={v(e.job_description)} />
            <Row label="Note" value={v(e.note)} />
          </Section>

          <Section title="Additional Details" color="bg-[#00BCD4]">
            <Row2 fields={[['Incentive COA', v(e.incentive_coa)], ['Created At', v(e.created_at)]]} />
            {e.profile_image && (
              <div className="flex gap-3 py-2">
                <span className="text-sm font-semibold text-muted-foreground w-48 shrink-0">Profile Image</span>
                <img
                  src={getImageUrl(e.profile_image)!}
                  alt={fullName}
                  className="w-24 h-24 rounded-lg object-cover border border-border"
                  onError={ev => { (ev.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
          </Section>

        </div>

        {/* Footer */}
        <div className="flex justify-between px-6 py-4 border-t border-border shrink-0">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button
            className="gap-2 material-button text-black"
            onClick={() => { onClose(); navigate(`/hr/employee-master/edit/${e.id}`); }}
          >
            <Pencil className="w-4 h-4" /> Edit Employee
          </Button>
        </div>

      </div>
    </div>
  );
};

export default EmployeeViewModal;
