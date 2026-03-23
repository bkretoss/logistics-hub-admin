import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userStore, type User } from "./UserMasterList";
import { branchStore } from "./BranchMasterList";

interface UserFormData {
  userName: string;
  password: string;
  confirmPassword: string;
  branch: string;
  title: string;
  displayName: string;
  sex: string;
  designation: string;
  // Rights
  rightAdmin: boolean;
  rightMarketing: boolean;
  rightAccounts: boolean;
  rightQuotation: boolean;
  rightHR: boolean;
  rightManagement: boolean;
  rightDocumentation: boolean;
  rightSettings: boolean;
  // Job Status
  jobCreated: boolean;
  jobProcess: boolean;
  jobProcessCompleted: boolean;
  jobClosed: boolean;
  jobCancelled: boolean;
  jobReOpened: boolean;
  // Voucher Status
  voucherCreated: boolean;
  voucherApproved: boolean;
  voucherConfirmed: boolean;
  voucherCancelled: boolean;
  voucherDispute: boolean;
  status: "Active" | "Inactive";
}

const initialForm: UserFormData = {
  userName: "",
  password: "",
  confirmPassword: "",
  branch: "",
  title: "Mr",
  displayName: "",
  sex: "Male",
  designation: "",
  rightAdmin: false,
  rightMarketing: false,
  rightAccounts: false,
  rightQuotation: false,
  rightHR: false,
  rightManagement: false,
  rightDocumentation: false,
  rightSettings: false,
  jobCreated: false,
  jobProcess: false,
  jobProcessCompleted: false,
  jobClosed: false,
  jobCancelled: false,
  jobReOpened: false,
  voucherCreated: false,
  voucherApproved: false,
  voucherConfirmed: false,
  voucherCancelled: false,
  voucherDispute: false,
  status: "Active",
};

const DESIGNATIONS = [
  "System Administrator",
  "Operations Manager",
  "Accountant",
  "HR Manager",
  "Sales Executive",
  "Operator",
  "Viewer",
];

const NewUser = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const editUser = id ? userStore.data.find((u) => u.id === Number(id)) : undefined;
  const isEdit = !!editUser;

  const [form, setForm] = useState<UserFormData>(() =>
    editUser ? { ...initialForm, ...editUser, password: "", confirmPassword: "" } : initialForm,
  );
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [branches, setBranches] = useState(() => branchStore.data.map((b) => b.name));

  useEffect(() => {
    const refresh = () => setBranches(branchStore.data.map((b) => b.name));
    branchStore.listeners.add(refresh);
    return () => {
      branchStore.listeners.delete(refresh);
    };
  }, []);

  useEffect(() => {
    if (editUser) setForm({ ...initialForm, ...editUser, password: "", confirmPassword: "" });
  }, [id]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "userName":
        return !value.trim() ? "User Name is required" : "";
      case "branch":
        return !value ? "Branch is required" : "";
      case "displayName":
        return !value.trim() ? "Display Name is required" : "";
      case "designation":
        return !value ? "Designation is required" : "";
      case "password":
        if (!isEdit && !value) return "Password is required";
        if (value && value.length < 6) return "Minimum 6 characters";
        return "";
      case "confirmPassword":
        if (!isEdit && !value) return "Please confirm password";
        if (value && value !== form.password) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (type !== "checkbox") setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validate = () => {
    const e: Partial<Record<string, string>> = {};
    ["userName", "branch", "displayName", "designation", "password", "confirmPassword"].forEach((k) => {
      const msg = validateField(k, form[k as keyof UserFormData] as string);
      if (msg) e[k] = msg;
    });
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    // At least one right required
    const hasRight = [
      form.rightAdmin,
      form.rightMarketing,
      form.rightAccounts,
      form.rightQuotation,
      form.rightHR,
      form.rightManagement,
      form.rightDocumentation,
      form.rightSettings,
    ].some(Boolean);
    if (!hasRight) e.rights = "Select at least one right";
    // At least one job status required
    const hasJob = [
      form.jobCreated,
      form.jobProcess,
      form.jobProcessCompleted,
      form.jobClosed,
      form.jobCancelled,
      form.jobReOpened,
    ].some(Boolean);
    if (!hasJob) e.jobStatus = "Select at least one job status";
    // At least one voucher status required
    const hasVoucher = [
      form.voucherCreated,
      form.voucherApproved,
      form.voucherConfirmed,
      form.voucherCancelled,
      form.voucherDispute,
    ].some(Boolean);
    if (!hasVoucher) e.voucherStatus = "Select at least one voucher status";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const record: User = {
      id: isEdit && editUser ? editUser.id : Date.now(),
      userName: form.userName,
      password: form.password || (editUser?.password ?? ""),
      branch: form.branch,
      title: form.title,
      displayName: form.displayName,
      sex: form.sex,
      designation: form.designation,
      rightAdmin: form.rightAdmin,
      rightMarketing: form.rightMarketing,
      rightAccounts: form.rightAccounts,
      rightQuotation: form.rightQuotation,
      rightHR: form.rightHR,
      rightManagement: form.rightManagement,
      rightDocumentation: form.rightDocumentation,
      rightSettings: form.rightSettings,
      jobCreated: form.jobCreated,
      jobProcess: form.jobProcess,
      jobProcessCompleted: form.jobProcessCompleted,
      jobClosed: form.jobClosed,
      jobCancelled: form.jobCancelled,
      jobReOpened: form.jobReOpened,
      voucherCreated: form.voucherCreated,
      voucherApproved: form.voucherApproved,
      voucherConfirmed: form.voucherConfirmed,
      voucherCancelled: form.voucherCancelled,
      voucherDispute: form.voucherDispute,
      status: form.status,
    };
    if (isEdit && editUser) {
      const idx = userStore.data.findIndex((u) => u.id === editUser.id);
      if (idx !== -1) {
        const updated = [...userStore.data];
        updated[idx] = record;
        userStore.set(updated);
      }
    } else {
      userStore.set([...userStore.data, record]);
    }
    navigate("/admin/user-master");
  };

  // Reusable text input
  const textField = (label: string, name: keyof UserFormData, type = "text", required = false) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={form[name] as string}
        onChange={handleChange}
        className={`w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 ${
          errors[name] ? "border-red-400" : "border-input"
        }`}
      />
      {errors[name] && <p className="text-xs text-red-500">{errors[name]}</p>}
    </div>
  );

  // Reusable select
  const selectField = (label: string, name: keyof UserFormData, options: string[], required = false) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        name={name}
        value={form[name] as string}
        onChange={handleChange}
        className={`w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 ${
          errors[name] ? "border-red-400" : "border-input"
        }`}
      >
        {name === "branch" && <option value="">-- Select Branch --</option>}
        {name === "designation" && <option value="">-- Select --</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {errors[name] && <p className="text-xs text-red-500">{errors[name]}</p>}
    </div>
  );

  // Reusable checkbox
  const checkBox = (label: string, name: keyof UserFormData, colorClass = "") => (
    <label key={name} className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        name={name}
        checked={form[name] as boolean}
        onChange={handleChange}
        className="w-4 h-4 rounded border-input accent-primary"
      />
      <span className={`text-sm ${colorClass}`}>{label}</span>
    </label>
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/admin/user-master")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{isEdit ? "Edit User" : "New User"}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isEdit ? `Editing ${editUser?.userName}` : "Create a new system user"}
          </p>
        </div>
      </div>

      <div className="material-card material-elevation-1 p-6 space-y-6">
        {/* Row 1: User Name | Password | Confirm Password | Branch */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {textField("User Name", "userName", "text", true)}
          {textField("Password", "password", "password", !isEdit)}
          {textField("Confirm Password", "confirmPassword", "password", !isEdit)}
          {selectField("Branch", "branch", branches, true)}
        </div>

        {/* Row 2: Title | Display Name | Sex | Designation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {selectField("Title", "title", ["Mr", "Mrs", "Ms", "Dr"], true)}
          <div className="md:col-span-1">{textField("Display Name", "displayName", "text", true)}</div>
          {selectField("Sex", "sex", ["Male", "Female", "Other"], true)}
          {selectField("Designation", "designation", DESIGNATIONS, true)}
        </div>

        {/* Row 3: Rights | Job Status | Voucher Status | Info Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Rights */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">
              Rights<span className="text-red-500 ml-0.5">*</span>
            </p>
            <div className="space-y-1.5">
              {checkBox("Admin", "rightAdmin")}
              {checkBox("Marketing", "rightMarketing")}
              {checkBox("Accounts", "rightAccounts")}
              {checkBox("Quotation", "rightQuotation")}
              {checkBox("HR", "rightHR")}
              {checkBox("Management", "rightManagement")}
              {checkBox("Documentation", "rightDocumentation")}
              {checkBox("Settings", "rightSettings")}
            </div>
            {errors.rights && <p className="text-xs text-red-500">{errors.rights}</p>}
          </div>

          {/* Job Status */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">
              Job Status<span className="text-red-500 ml-0.5">*</span>
            </p>
            <div className="space-y-1.5">
              {checkBox("Created", "jobCreated")}
              {checkBox("Process", "jobProcess")}
              {checkBox("Process Completed", "jobProcessCompleted")}
              {checkBox("Closed", "jobClosed")}
              {checkBox("Cancelled", "jobCancelled")}
              {checkBox("Re opened", "jobReOpened")}
            </div>
            {errors.jobStatus && <p className="text-xs text-red-500">{errors.jobStatus}</p>}
          </div>

          {/* Voucher Status */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">
              Voucher Status<span className="text-red-500 ml-0.5">*</span>
            </p>
            <div className="space-y-1.5">
              {checkBox("Created", "voucherCreated")}
              {checkBox("Approved", "voucherApproved")}
              {checkBox("Confirmed", "voucherConfirmed")}
              {checkBox("Cancelled", "voucherCancelled")}
              {checkBox("Dispute", "voucherDispute")}
            </div>
            {errors.voucherStatus && <p className="text-xs text-red-500">{errors.voucherStatus}</p>}
          </div>

          {/* Info Panel */}
          <div className="bg-white border border-border rounded-lg p-4 space-y-3 text-sm">
            <p className="font-semibold text-foreground">Dear Admin,</p>
            <p className="text-green-600">
              Welcome to the user rights page,
              <br />
              While creating a new user please make sure you are providing the rights according to the needs of your
              organisation,
            </p>
            <p className="text-green-600">
              Eg:- admin will have all the rights by default.
              <br />
              So while creating a new user admin will have the ability to give rights to the new user by selecting the
              check box
              <br />
              If you need any further clarifications please click here
            </p>
            <p className="text-green-600 font-medium">From Team Relay Logistics</p>
          </div>
        </div>

        {/* Status */}
        {/* <div className="flex items-center gap-6 pt-2 border-t border-border">
          <p className="text-sm font-semibold text-foreground">
            Status<span className="text-red-500 ml-0.5">*</span>
          </p>
          {(["Active", "Inactive"] as const).map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value={s}
                checked={form.status === s}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">{s}</span>
            </label>
          ))}
        </div> */}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-4">
        <Button
          type="button"
          className="bg-red-400 text-black hover:bg-red-350"
          onClick={() => navigate("/admin/user-master")}
        >
          Cancel
        </Button>
        <Button type="button" className="material-button text-black" onClick={handleSave}>
          {isEdit ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default NewUser;
