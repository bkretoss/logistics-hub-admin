import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getBranchesApi, getDesignationsApi, getUserMasterApi, createUserMasterApi, updateUserMasterApi } from "@/services/api";

const ALL_RIGHTS  = ["Admin", "Marketing", "Accounts", "Quotation", "HR", "Management", "Documentation", "Settings"];
const ALL_JOB     = ["Created", "Process", "Process Completed", "Closed", "Cancelled", "Re opened"];
const ALL_VOUCHER = ["Created", "Approved", "Confirmed", "Cancelled", "Dispute"];

interface UserForm {
  username: string;
  password: string;
  confirm_password: string;
  branch_id: string;
  title: string;
  display_name: string;
  sex: string;
  designation_id: string;
  description: string;
  status: string;
  rights: string[];
  job_status: string[];
  voucher_status: string[];
}

const EMPTY: UserForm = {
  username: "", password: "", confirm_password: "",
  branch_id: "", title: "Mr", display_name: "", sex: "Male",
  designation_id: "", description: "", status: "1",
  rights: [], job_status: [], voucher_status: [],
};

const inputCls = (err?: string) =>
  `w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 ${err ? "border-red-400" : "border-input"}`;

const NewUser = () => {
  const navigate  = useNavigate();
  const { id }    = useParams<{ id: string }>();
  const { toast } = useToast();
  const isEdit    = !!id;

  const [form, setForm]     = useState<UserForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [saving, setSaving] = useState(false);
  const [branches, setBranches]         = useState<{ id: number; name: string }[]>([]);
  const [designations, setDesignations] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    getBranchesApi(1, 100).then(res => setBranches(res.data.data ?? [])).catch(() => {});
    getDesignationsApi(1, 9999).then(res => {
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setDesignations(raw.map(r => ({ id: r.id, name: r.name })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    getUserMasterApi(Number(id)).then(res => {
      const d = res.data.data ?? res.data;
      setForm({
        username:         d.username        ?? "",
        password:         "",
        confirm_password: "",
        branch_id:        String(d.branch_id      ?? ""),
        title:            d.title           ?? "Mr",
        display_name:     d.display_name    ?? "",
        sex:              d.sex             ?? "Male",
        designation_id:   String(d.designation_id ?? ""),
        description:      d.description     ?? "",
        status:           String(d.status   ?? "1"),
        rights:           d.rights          ?? [],
        job_status:       d.job_status      ?? [],
        voucher_status:   d.voucher_status  ?? [],
      });
    }).catch(() => toast({ title: "Error", description: "Failed to load user", variant: "destructive" }));
  }, [id]);

  const set = (name: keyof UserForm, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const toggleArr = (key: "rights" | "job_status" | "voucher_status", val: string) => {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter(v => v !== val) : [...prev[key], val],
    }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e: Partial<Record<string, string>> = {};
    if (!form.username.trim())     e.username       = "Username is required";
    if (!form.display_name.trim()) e.display_name   = "Display Name is required";
    if (!form.branch_id)           e.branch_id      = "Branch is required";
    if (!form.designation_id)      e.designation_id = "Designation is required";
    if (!isEdit && !form.password)          e.password         = "Password is required";
    if (!isEdit && !form.confirm_password)  e.confirm_password = "Please confirm password";
    if (form.password && form.password.length < 6) e.password = "Minimum 6 characters";
    if (form.password && form.confirm_password && form.password !== form.confirm_password)
      e.confirm_password = "Passwords do not match";
    if (!form.rights.length)         e.rights         = "Select at least one right";
    if (!form.job_status.length)     e.job_status     = "Select at least one job status";
    if (!form.voucher_status.length) e.voucher_status = "Select at least one voucher status";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        username:       form.username,
        branch_id:      Number(form.branch_id),
        title:          form.title,
        display_name:   form.display_name,
        sex:            form.sex,
        designation_id: Number(form.designation_id),
        name:           form.display_name,
        description:    form.description,
        status:         Number(form.status),
        rights:         form.rights,
        job_status:     form.job_status,
        voucher_status: form.voucher_status,
      };
      if (!isEdit || form.password) {
        payload.password         = form.password;
        payload.confirm_password = form.confirm_password;
      }
      if (isEdit) {
        await updateUserMasterApi(Number(id), payload);
        toast({ title: "Updated", description: "User updated successfully", variant: "success" });
      } else {
        await createUserMasterApi(payload);
        toast({ title: "Created", description: "User created successfully", variant: "success" });
      }
      navigate("/admin/user-master");
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to save user", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/admin/user-master")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{isEdit ? "Edit User" : "New User"}</h1>
          <p className="text-muted-foreground text-sm mt-1">{isEdit ? "Update user details" : "Create a new system user"}</p>
        </div>
      </div>

      <div className="material-card material-elevation-1 p-6 space-y-6">

        {/* Row 1: Username | Password | Confirm Password | Branch */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Username<span className="text-red-500 ml-0.5">*</span></label>
            <input type="text" value={form.username} onChange={e => set("username", e.target.value)} className={inputCls(errors.username)} />
            {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Password{!isEdit && <span className="text-red-500 ml-0.5">*</span>}</label>
            <input type="password" value={form.password} onChange={e => set("password", e.target.value)} className={inputCls(errors.password)} />
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Confirm Password{!isEdit && <span className="text-red-500 ml-0.5">*</span>}</label>
            <input type="password" value={form.confirm_password} onChange={e => set("confirm_password", e.target.value)} className={inputCls(errors.confirm_password)} />
            {errors.confirm_password && <p className="text-xs text-red-500">{errors.confirm_password}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Branch<span className="text-red-500 ml-0.5">*</span></label>
            <select value={form.branch_id} onChange={e => set("branch_id", e.target.value)} className={inputCls(errors.branch_id)}>
              <option value="">-- Select --</option>
              {branches.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
            </select>
            {errors.branch_id && <p className="text-xs text-red-500">{errors.branch_id}</p>}
          </div>
        </div>

        {/* Row 2: Title | Display Name | Sex | Designation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Title<span className="text-red-500 ml-0.5">*</span></label>
            <select value={form.title} onChange={e => set("title", e.target.value)} className={inputCls()}>
              {["Mr","Mrs","Ms","Dr"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Display Name<span className="text-red-500 ml-0.5">*</span></label>
            <input type="text" value={form.display_name} onChange={e => set("display_name", e.target.value)} className={inputCls(errors.display_name)} />
            {errors.display_name && <p className="text-xs text-red-500">{errors.display_name}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Sex<span className="text-red-500 ml-0.5">*</span></label>
            <select value={form.sex} onChange={e => set("sex", e.target.value)} className={inputCls()}>
              {["Male","Female","Other"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Designation<span className="text-red-500 ml-0.5">*</span></label>
            <select value={form.designation_id} onChange={e => set("designation_id", e.target.value)} className={inputCls(errors.designation_id)}>
              <option value="">-- Select --</option>
              {designations.map(d => <option key={d.id} value={String(d.id)}>{d.name}</option>)}
            </select>
            {errors.designation_id && <p className="text-xs text-red-500">{errors.designation_id}</p>}
          </div>
        </div>

        {/* Row 3: Description | Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea value={form.description} rows={3}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background resize-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Status</label>
            <select value={form.status} onChange={e => set("status", e.target.value)} className={inputCls()}>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
        </div>

        {/* Row 4: Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* Rights */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Rights<span className="text-red-500 ml-0.5">*</span></p>
            <div className="space-y-1.5">
              {ALL_RIGHTS.map(item => (
                <label key={item} className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={form.rights.includes(item)}
                    onChange={() => toggleArr("rights", item)}
                    className="w-4 h-4 rounded border-input accent-primary" />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
            {errors.rights && <p className="text-xs text-red-500">{errors.rights}</p>}
          </div>

          {/* Job Status */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Job Status<span className="text-red-500 ml-0.5">*</span></p>
            <div className="space-y-1.5">
              {ALL_JOB.map(item => (
                <label key={item} className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={form.job_status.includes(item)}
                    onChange={() => toggleArr("job_status", item)}
                    className="w-4 h-4 rounded border-input accent-primary" />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
            {errors.job_status && <p className="text-xs text-red-500">{errors.job_status}</p>}
          </div>

          {/* Voucher Status */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Voucher Status<span className="text-red-500 ml-0.5">*</span></p>
            <div className="space-y-1.5">
              {ALL_VOUCHER.map(item => (
                <label key={item} className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={form.voucher_status.includes(item)}
                    onChange={() => toggleArr("voucher_status", item)}
                    className="w-4 h-4 rounded border-input accent-primary" />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
            {errors.voucher_status && <p className="text-xs text-red-500">{errors.voucher_status}</p>}
          </div>

          {/* Info Panel */}
          <div className="bg-white border border-border rounded-lg p-4 space-y-3 text-sm">
            <p className="font-semibold text-foreground">Dear Admin,</p>
            <p className="text-green-600">
              Welcome to the user rights page,<br />
              While creating a new user please make sure you are providing the rights according to the needs of your organisation,
            </p>
            <p className="text-green-600 font-medium">From Team Relay Logistics</p>
          </div>

        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pb-4">
        <Button type="button" className="bg-red-400 text-black hover:bg-red-350"
          onClick={() => navigate("/admin/user-master")}>Cancel</Button>
        <Button type="button" className="material-button text-black"
          onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default NewUser;
