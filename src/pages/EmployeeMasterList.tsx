import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getEmployeesApi, deleteEmployeeApi } from '@/services/api';
import EmployeeViewModal from './EmployeeViewModal';

export interface Employee {
  id: number;
  emp_id: string;
  login_id: string;
  position: string;
  identification_no: string;
  branch: string;
  name_title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  spouse_name: string;
  dob: string;
  place_of_birth: string;
  nationality: string;
  religion: string;
  sex: string;
  marital_status: string;
  marriage_date: string;
  blood_group: string;
  joining_date: string;
  confirmation_date: string;
  notification_date: string;
  leaving_date: string | null;
  ctc_currency: string;
  ctc_amount: string;
  contact_no: string;
  temporary_address: string;
  permanent_address: string;
  designation: string;
  department: string;
  division: string;
  reporting_manager: string;
  job_description: string;
  note: string;
  incentive_coa: string;
  user_name: string;
  profile_image: string | null;
  status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const COLUMNS = ['EMPLOYEE NAME', 'EMPLOYEE CODE', 'LOGIN / EMAIL', 'PHONE', 'DEPARTMENT', 'STATUS', 'ACTIONS'];

const EmployeeMasterList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading]     = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage]             = useState(1);
  const [pageSize, setPageSize]     = useState(10);
  const [viewEmp, setViewEmp]         = useState<Employee | null>(null);
  const [deleteId, setDeleteId]       = useState<number | null>(null);
  const [deleting, setDeleting]       = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getEmployeesApi();
      setEmployees(res.data?.data ?? []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load employees. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = employees.filter(e => {
    const q = searchTerm.toLowerCase();
    return !q ||
      e.emp_id.toLowerCase().includes(q) ||
      `${e.first_name} ${e.last_name}`.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q) ||
      (e.contact_no ?? '').toLowerCase().includes(q) ||
      (e.login_id ?? '').toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = async () => {
    if (deleteId === null) return;
    setDeleting(true);
    try {
      await deleteEmployeeApi(deleteId);
      setEmployees(prev => prev.filter(e => e.id !== deleteId));
      toast({ title: 'Deleted', description: 'Employee deleted successfully.', variant: 'success' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete employee. Please try again.', variant: 'destructive' });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

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
          { label: 'TOTAL',       value: employees.length,                                  color: 'text-blue-500',   bg: 'bg-blue-50'   },
          { label: 'ACTIVE',      value: employees.filter(e => e.status === 1).length,      color: 'text-green-500',  bg: 'bg-green-50'  },
          { label: 'INACTIVE',    value: employees.filter(e => e.status !== 1).length,      color: 'text-red-500',    bg: 'bg-red-50'    },
          { label: 'DEPARTMENTS', value: new Set(employees.map(e => e.department).filter(Boolean)).size, color: 'text-purple-500', bg: 'bg-purple-50' },
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
              placeholder="Search by name, code, department, phone..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-2.5 border border-input rounded-xl text-sm bg-background"
            />
          </div>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground border border-input rounded-xl px-3 py-1.5">
            Rows
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="bg-transparent font-semibold text-foreground outline-none cursor-pointer">
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
                  <th key={h} className={`p-4 text-xs font-semibold text-muted-foreground tracking-wide whitespace-nowrap ${i === COLUMNS.length - 1 ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="p-8 text-center text-muted-foreground text-sm">
                    <span className="inline-block w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2 align-middle" />
                    Loading employees...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="p-8 text-center text-muted-foreground text-sm">
                    No Employees Found
                  </td>
                </tr>
              ) : paginated.map((e) => (
                <tr key={e.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground whitespace-nowrap">
                    {[e.first_name, e.last_name].filter(Boolean).join(' ') || '—'}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{e.emp_id || '—'}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{e.login_id || '—'}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{e.contact_no || '—'}</td>
                  <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{e.department || '—'}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      e.status === 1
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-orange-50 border-orange-200 text-orange-600'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${e.status === 1 ? 'bg-green-500' : 'bg-orange-400'}`} />
                      {e.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors" title="View" onClick={() => setViewEmp(e)}>
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                      <button className="p-1.5 hover:bg-green-50 rounded-lg transition-colors" title="Edit" onClick={() => navigate(`/hr/employee-master/edit/${e.id}`)}>
                        <Pencil className="w-4 h-4 text-green-500" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Delete" onClick={() => setDeleteId(e.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
      {viewEmp && <EmployeeViewModal employee={viewEmp} onClose={() => setViewEmp(null)} />}

      {/* Delete Confirmation */}
      <Dialog open={deleteId !== null} onOpenChange={open => { if (!open) setDeleteId(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this employee? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete} disabled={deleting}>
              {deleting ? <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Deleting...</> : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default EmployeeMasterList;
