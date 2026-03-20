import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EmployeeViewModal from './EmployeeViewModal';

export interface Employee {
  id: number;
  empId: string;
  // Employee Details
  loginId: string;
  position: string;
  identificationNo: string;
  branch: string;
  nameTitle: string;
  firstName: string;
  middleName: string;
  lastName: string;
  spouseName: string;
  dob: string;
  placeOfBirth: string;
  nationality: string;
  religion: string;
  sex: string;
  maritalStatus: string;
  marriageDate: string;
  bloodGroup: string;
  joiningDate: string;
  confirmationDate: string;
  notificationDate: string;
  leavingDate: string;
  ctcCurrency: string;
  ctcAmount: string;
  contactNo: string;
  temporaryAddress: string;
  permanentAddress: string;
  // Job Details
  designation: string;
  jobDescription: string;
  department: string;
  division: string;
  reportingManager: string;
  note: string;
  // Additional Details
  incentiveCoa: string;
  userName: string;
  employeePhoto: string;
}

const E = (overrides: Partial<Employee> & { id: number; empId: string }): Employee => ({
  loginId: '', position: '', identificationNo: '', branch: '',
  nameTitle: '', firstName: '', middleName: '', lastName: '',
  spouseName: '', dob: '', placeOfBirth: '', nationality: '',
  religion: '', sex: '', maritalStatus: '', marriageDate: '',
  bloodGroup: '', joiningDate: '', confirmationDate: '',
  notificationDate: '', leavingDate: '', ctcCurrency: '',
  ctcAmount: '', contactNo: '', temporaryAddress: '', permanentAddress: '',
  designation: '', jobDescription: '', department: '', division: '',
  reportingManager: '', note: '', incentiveCoa: '', userName: '', employeePhoto: '',
  ...overrides,
});

// Module-level store — shared with NewEmployee (same pattern as branchStore)
export const employeeStore = {
  data: [] as Employee[],
  listeners: new Set<() => void>(),
  set(next: Employee[]) {
    this.data = next;
    this.listeners.forEach(fn => fn());
  },
};

const INITIAL_EMPLOYEES: Employee[] = [
  E({ id: 1, empId: 'EMP001', nameTitle: 'Mr',  firstName: 'John',  lastName: 'Smith',   dob: '1990-05-14', religion: 'Christian', sex: 'Male',   maritalStatus: 'Married',  bloodGroup: 'O+',  contactNo: '+971501234567', position: 'Logistics Manager',    branch: 'HQ',    nationality: 'British',    designation: 'Manager',           department: 'Operations', division: 'Freight',    reportingManager: 'CEO',         joiningDate: '2018-01-15', confirmationDate: '2018-07-15', ctcCurrency: 'AED', ctcAmount: '15000', note: 'Senior staff member',    userName: 'admin',     incentiveCoa: 'Revenue', identificationNo: 'P1234567', placeOfBirth: 'London',    temporaryAddress: 'Dubai Marina, Dubai',          permanentAddress: '12 Baker St, London',         jobDescription: 'Oversee logistics operations' }),
  E({ id: 2, empId: 'EMP002', nameTitle: 'Ms',  firstName: 'Priya', lastName: 'Sharma',  dob: '1993-08-22', religion: 'Hindu',     sex: 'Female', maritalStatus: 'Single',   bloodGroup: 'A+',  contactNo: '+971509876543', position: 'Operations Executive', branch: 'BOM',   nationality: 'Indian',     designation: 'Senior Executive',  department: 'Operations', division: 'Customs',    reportingManager: 'John Smith',  joiningDate: '2020-03-01', confirmationDate: '2020-09-01', ctcCurrency: 'INR', ctcAmount: '80000', note: 'Operations lead',         userName: 'ops_user',  incentiveCoa: 'Expense', identificationNo: 'A9876543', placeOfBirth: 'Mumbai',    temporaryAddress: 'Andheri East, Mumbai',         permanentAddress: 'Bandra West, Mumbai',         jobDescription: 'Manage daily operations'       }),
  E({ id: 3, empId: 'EMP003', nameTitle: 'Mr',  firstName: 'Ali',   lastName: 'Hassan',  dob: '1988-03-10', religion: 'Islam',     sex: 'Male',   maritalStatus: 'Married',  bloodGroup: 'B+',  contactNo: '+971507654321', position: 'Warehouse Supervisor', branch: 'HQ',    nationality: 'Emirati',    designation: 'Supervisor',        department: 'Operations', division: 'Warehouse',  reportingManager: 'John Smith',  joiningDate: '2015-06-20', confirmationDate: '2015-12-20', ctcCurrency: 'AED', ctcAmount: '12000', note: '',                        userName: 'ops_user',  incentiveCoa: '',        identificationNo: 'E7654321', placeOfBirth: 'Abu Dhabi', temporaryAddress: 'Deira, Dubai',                 permanentAddress: 'Sharjah, UAE',                jobDescription: 'Supervise warehouse staff'     }),
  E({ id: 4, empId: 'EMP004', nameTitle: 'Mrs', firstName: 'Sarah', lastName: 'Johnson', dob: '1995-11-30', religion: 'Christian', sex: 'Female', maritalStatus: 'Married',  bloodGroup: 'AB-', contactNo: '+971502345678', position: 'HR Coordinator',       branch: 'DEL',   nationality: 'American',   designation: 'Coordinator',       department: 'HR',         division: 'Recruitment', reportingManager: 'HR Manager',  joiningDate: '2021-09-01', confirmationDate: '2022-03-01', ctcCurrency: 'USD', ctcAmount: '5000',  note: 'Remote employee',         userName: 'hr_user',   incentiveCoa: '',        identificationNo: 'US123456', placeOfBirth: 'New York',  temporaryAddress: 'Connaught Place, New Delhi',   permanentAddress: '45 5th Ave, New York',        jobDescription: 'Handle HR and recruitment'    }),
  E({ id: 5, empId: 'EMP005', nameTitle: 'Mr',  firstName: 'Raj',   lastName: 'Patel',   dob: '1985-07-19', religion: 'Hindu',     sex: 'Male',   maritalStatus: 'Divorced', bloodGroup: 'O-',  contactNo: '+971508765432', position: 'Finance Analyst',      branch: 'BOM',   nationality: 'Indian',     designation: 'Analyst',           department: 'Finance',    division: 'Accounts',   reportingManager: 'CFO',         joiningDate: '2019-04-10', confirmationDate: '2019-10-10', ctcCurrency: 'INR', ctcAmount: '95000', note: 'On probation period',     userName: 'finance_user', incentiveCoa: 'Accounts Payable', identificationNo: 'B2345678', placeOfBirth: 'Ahmedabad', temporaryAddress: 'Powai, Mumbai',                permanentAddress: 'Navrangpura, Ahmedabad',      jobDescription: 'Financial analysis and reporting' }),
];

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

const fmtDate = (v?: string | null): string => {
  const s = val(v);
  if (s === '—') return s;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : s;
};

// Seed store once on module load
if (employeeStore.data.length === 0) employeeStore.set(INITIAL_EMPLOYEES);

const EmployeeMasterList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>(() => employeeStore.data);

  useEffect(() => {
    const refresh = () => setEmployees([...employeeStore.data]);
    employeeStore.listeners.add(refresh);
    return () => { employeeStore.listeners.delete(refresh); };
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage]             = useState(1);
  const [pageSize, setPageSize]     = useState(5);
  const [deleteId, setDeleteId]     = useState<number | null>(null);
  const [viewEmp, setViewEmp]       = useState<Employee | null>(null);

  const filtered = employees.filter(e => {
    const q = searchTerm.toLowerCase();
    return !q ||
      e.empId.toLowerCase().includes(q) ||
      e.firstName.toLowerCase().includes(q) ||
      e.position.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = () => {
    if (deleteId !== null) {
      const updated = employees.filter(e => e.id !== deleteId);
      employeeStore.set(updated);
      setDeleteId(null);
    }
  };

  const COLUMNS = ['EMP ID', 'TITLE', 'FIRST NAME', 'DOB', 'RELIGION', 'SEX', 'MARITAL STATUS', 'BLOOD GROUP', 'CONTACT NO', 'NOTE', 'POSITION', 'ACTIONS'];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Employee Master</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and configure your employee records</p>
        </div>
        <Button className="gap-2 material-button material-elevation-2 hover:material-elevation-3 text-black"
          onClick={() => navigate('/hr/employee-master/new')}>
          <Plus className="w-4 h-4" /> Add Employee
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL',    value: employees.length,                                          color: 'text-blue-500',   bg: 'bg-blue-50'   },
          { label: 'MALE',     value: employees.filter(e => e.sex === 'Male').length,            color: 'text-green-500',  bg: 'bg-green-50'  },
          { label: 'FEMALE',   value: employees.filter(e => e.sex === 'Female').length,          color: 'text-pink-500',   bg: 'bg-pink-50'   },
          { label: 'POSITIONS',value: new Set(employees.map(e => e.position)).size,              color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-xl p-5 material-elevation-1 hover:material-elevation-2 transition-all duration-300">
            <div className={`${s.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="material-card material-elevation-1 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by EMP ID, name, position..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-2.5 border border-input rounded-xl text-sm bg-background"
            />
          </div>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground border border-input rounded-xl px-3 py-1.5">
            Rows
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="bg-transparent font-semibold text-foreground outline-none cursor-pointer"
            >
              {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="material-card material-elevation-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                {COLUMNS.map((h, i) => (
                  <th
                    key={h}
                    className={`p-4 text-xs font-semibold text-muted-foreground tracking-wide whitespace-nowrap ${i === COLUMNS.length - 1 ? 'text-right' : 'text-left'}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(e => (
                <tr key={e.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground whitespace-nowrap">{val(e.empId)}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{fmtTitle(e.nameTitle)}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                    {[e.firstName, e.lastName].filter(p => p?.trim()).join(' ') || '—'}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{fmtDate(e.dob)}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{val(e.religion)}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{val(e.sex)}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{val(e.maritalStatus)}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{val(e.bloodGroup)}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{val(e.contactNo)}</td>
                  <td className="p-4 text-sm text-muted-foreground max-w-[160px] truncate" title={e.note}>{val(e.note)}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{val(e.position)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="View" onClick={() => setViewEmp(e)}>
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Edit" onClick={() => navigate(`/hr/employee-master/edit/${e.id}`)  }>
                        <Pencil className="w-4 h-4 text-green-500" />
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Delete" onClick={() => setDeleteId(e.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length} className="p-8 text-center text-muted-foreground text-sm">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} records
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${n === page ? 'bg-primary text-black' : 'hover:bg-muted text-muted-foreground'}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-lg hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewEmp && (
        <EmployeeViewModal employee={viewEmp} onClose={() => setViewEmp(null)} />
      )}

      {/* Delete Confirmation */}
      <Dialog open={deleteId !== null} onOpenChange={open => { if (!open) setDeleteId(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this employee? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default EmployeeMasterList;
