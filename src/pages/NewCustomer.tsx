import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { customerStore, type Customer } from "./CustomerMasterList";

interface CustomerFormData {
  name: string;
  actualName: string;
  customerLogo: string;
  scacCode: string;
  iecCode: string;
  categories: string;
  salesPerson: string;
  userName: string;
  interestCalculation: string;
  iataCode: string;
  position: string;
  website: string;
  password: string;
  notes: string;
  status: "Active" | "Inactive";
}

const initialForm: CustomerFormData = {
  name: "",
  actualName: "",
  customerLogo: "",
  scacCode: "",
  iecCode: "",
  categories: "",
  salesPerson: "",
  userName: "",
  interestCalculation: "No",
  iataCode: "",
  position: "Opened",
  website: "",
  password: "",
  notes: "",
  status: "Active",
};

const SALES_PERSONS = ["--Select--", "John Smith", "Sara Lee", "Mike Johnson", "Emily Davis"];
const POSITIONS = ["Opened", "Closed", "Pending", "Suspended"];
const INTEREST_OPTIONS = ["No", "Yes"];

const NewCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const editCustomer = id ? customerStore.data.find((c) => c.id === Number(id)) : undefined;
  const isEdit = !!editCustomer;

  const [form, setForm] = useState<CustomerFormData>(() =>
    editCustomer ? { ...initialForm, ...editCustomer } : initialForm,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});
  const [logoFileName, setLogoFileName] = useState<string>("");

  useEffect(() => {
    if (editCustomer) setForm({ ...initialForm, ...editCustomer });
  }, [id]);

  const validateField = (name: keyof CustomerFormData, value: string): string => {
    if (name === "name") return !value.trim() ? "Name is required" : "";
    if (name === "actualName") return !value.trim() ? "Actual Name is required" : "";
    if (name === "categories") return !value.trim() ? "Categories is required" : "";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name as keyof CustomerFormData, value) }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setLogoFileName(file ? file.name : "");
    setForm((prev) => ({ ...prev, customerLogo: file ? file.name : "" }));
  };

  const validate = () => {
    const e: Partial<Record<keyof CustomerFormData, string>> = {};
    (["name", "actualName", "categories"] as (keyof CustomerFormData)[]).forEach((k) => {
      const msg = validateField(k, form[k] as string);
      if (msg) e[k] = msg;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const record: Customer = {
      id: isEdit && editCustomer ? editCustomer.id : Date.now(),
      ...form,
    };
    if (isEdit && editCustomer) {
      const idx = customerStore.data.findIndex((c) => c.id === editCustomer.id);
      if (idx !== -1) {
        const updated = [...customerStore.data];
        updated[idx] = record;
        customerStore.set(updated);
      }
    } else {
      customerStore.set([...customerStore.data, record]);
    }
    navigate("/setting/customer-master");
  };

  const textField = (label: string, name: keyof CustomerFormData, required = false, type = "text") => (
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
        className={`w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors[name] ? "border-red-400" : "border-input"}`}
      />
      {errors[name] && <p className="text-xs text-red-500">{errors[name]}</p>}
    </div>
  );

  const selectField = (label: string, name: keyof CustomerFormData, options: string[], required = false) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        name={name}
        value={form[name] as string}
        onChange={handleChange}
        className={`w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors[name] ? "border-red-400" : "border-input"}`}
      >
        {options.map((o) => (
          <option key={o} value={o === "--Select--" ? "" : o}>
            {o}
          </option>
        ))}
      </select>
      {errors[name] && <p className="text-xs text-red-500">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/setting/customer-master")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {isEdit ? "Edit Customer" : "New Customer"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isEdit ? `Editing ${editCustomer?.name}` : "Create a new customer record"}
          </p>
        </div>
      </div>

      <div className="material-card material-elevation-1 p-6 space-y-5">
        {/* Row 1: Name | Categories | Position */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {textField("Name", "name", true)}
          {textField("Categories", "categories", true)}
          {selectField("Position", "position", POSITIONS)}
        </div>

        {/* Row 2: Actual Name | Sales Person | Website */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {textField("Actual Name", "actualName", true)}
          {selectField("Sales Person", "salesPerson", SALES_PERSONS)}
          {textField("Website", "website")}
        </div>

        {/* Row 3: Customer Logo | User Name | Password */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Customer Logo */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Customer Logo</label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer px-3 py-2 border border-input rounded-lg text-sm bg-background hover:bg-muted transition-colors whitespace-nowrap">
                Choose File
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </label>
              <span className="text-sm text-muted-foreground truncate">
                {logoFileName || (form.customerLogo ? form.customerLogo : "No file chosen")}
              </span>
            </div>
          </div>
          {textField("User Name", "userName")}
          {textField("Password", "password", false, "password")}
        </div>

        {/* Row 4: SCAC Code | Interest Calculation | Notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {textField("SCAC Code", "scacCode")}
          {selectField("Interest Calculation", "interestCalculation", INTEREST_OPTIONS)}
          {/* Notes spans full height */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
            />
          </div>
        </div>

        {/* Row 5: IEC Code | IATA Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {textField("IEC Code", "iecCode")}
          {textField("IATA Code", "iataCode")}
          <div /> {/* empty cell to maintain 3-col grid */}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-4">
        <Button
          type="button"
          className="bg-red-400 text-black hover:bg-red-350"
          onClick={() => navigate("/setting/customer-master")}
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

export default NewCustomer;
