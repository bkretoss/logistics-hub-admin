import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, X, Eye, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { customerStore, type Customer } from "./CustomerMasterList";
import AddressViewModal from "./AddressViewModal";
import COAViewModal from "./COAViewModal";

import type { AddressRow } from "./AddressViewModal";
import type { COARow } from "./COAViewModal";

const emptyAddress = (): AddressRow => ({
  id: Date.now(),
  addressType: "",
  position: "Opened",
  address: "",
  city: "",
  panNo: "",
  pinNo: "",
  gstinNo: "",
  phoneNo: "",
  gstStateCode: "",
  sezZone: "No",
  faxNo: "",
  state: "",
  mobileNo: "",
  emailId: "",
  country: "",
  contactPerson: "",
  personDesignation: "",
  department: "",
  taxRegistrationType: "",
  whatsApp: "",
  notes: "",
});



interface DocumentRow {
  id: number;
  documentType: string;
  documentFile: string;
  remarks: string;
}

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
  addresses: AddressRow[];
  coas: COARow[];
  documents: DocumentRow[];
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
  addresses: [],
  coas: [],
  documents: [],
};

const SALES_PERSONS = ["--Select--", "John Smith", "Sara Lee", "Mike Johnson", "Emily Davis"];
const POSITIONS = ["Opened", "Closed", "Pending", "Suspended"];
const INTEREST_OPTIONS = ["No", "Yes"];
const ADDRESS_TYPES = ["--Select--", "Primary", "Secondary", "OFFICE", "HOME", "WAREHOUSE", "BILLING"];
const GST_STATE_CODES = ["--Select--", "01-Jammu & Kashmir", "02-Himachal Pradesh", "03-Punjab", "04-Chandigarh", "05-Uttarakhand", "06-Haryana", "07-Delhi", "08-Rajasthan", "09-Uttar Pradesh", "10-Bihar", "96-Other Country"];
const COUNTRIES = ["--Select--", "India", "USA", "UK", "UAE", "Singapore", "China", "Other"];
const PAYMENT_MODES = ["--Select--", "Cash", "Credit", "Cheque", "Online", "NEFT", "RTGS"];
const CURRENCIES = ["--Select--", "INR - INDIAN RUPEE", "USD - US DOLLAR", "EUR - EURO", "GBP - POUND", "AED - UAE DIRHAM", "SGD - SINGAPORE DOLLAR"];
const DOCUMENT_TYPES = ["--Select--", "License", "Certificate", "Contract", "Agreement", "Other"];

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
  const [activeTab, setActiveTab] = useState<"address" | "coa" | "documents">("address");
  const [addressModal, setAddressModal] = useState(false);
  const [addressDraft, setAddressDraft] = useState<AddressRow>(emptyAddress);
  const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof AddressRow, string>>>({});
  const [addressModalMode, setAddressModalMode] = useState<"add" | "edit">("add");
  const [viewingAddress, setViewingAddress] = useState<AddressRow | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const emptyCOA = (): COARow => ({
    id: Date.now(),
    lineNo: String(form.coas.length + 1),
    customerCOA: "",
    paymentMode: "",
    creditApprover: "",
    osCollector: "",
    currency: "",
    approvedCreditPeriod: "",
    approvedCreditAmount: "",
    alertCreditDays: "",
    alertCreditAmount: "",
    alertToEmail: "",
    alertCCEmail: "",
    alertBCCEmail: "",
    notes: "",
  });

  const [coaModal, setCOAModal] = useState(false);
  const [coaDraft, setCOADraft] = useState<COARow>(emptyCOA);
  const [coaErrors, setCOAErrors] = useState<Partial<Record<keyof COARow, string>>>({});
  const [coaModalMode, setCOAModalMode] = useState<"add" | "edit">("add");
  const [viewingCOA, setViewingCOA] = useState<COARow | null>(null);
  const [deleteCOAConfirmId, setDeleteCOAConfirmId] = useState<number | null>(null);

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

  const openAddressModal = () => {
    setAddressDraft(emptyAddress());
    setAddressErrors({});
    setAddressModalMode("add");
    setAddressModal(true);
  };

  const openEditAddressModal = (address: AddressRow) => {
    setAddressDraft({ ...address });
    setAddressErrors({});
    setAddressModalMode("edit");
    setAddressModal(true);
  };

  const openViewAddressModal = (address: AddressRow) => setViewingAddress(address);

  const handleAddressDraftChange = (field: keyof AddressRow, value: string) => {
    setAddressDraft((prev) => ({ ...prev, [field]: value }));
    if (addressErrors[field]) setAddressErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateAddressDraft = () => {
    const e: Partial<Record<keyof AddressRow, string>> = {};
    if (!addressDraft.address.trim()) e.address = "Address is required";
    if (!addressDraft.city.trim()) e.city = "City is required";
    if (!addressDraft.pinNo.trim()) e.pinNo = "PIN No is required";
    setAddressErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveAddress = () => {
    if (!validateAddressDraft()) return;

    if (addressModalMode === "add") {
      // Add new address
      setForm((prev) => ({ ...prev, addresses: [...prev.addresses, { ...addressDraft, id: Date.now() }] }));
    } else if (addressModalMode === "edit") {
      // Update existing address
      setForm((prev) => ({
        ...prev,
        addresses: prev.addresses.map((a) => (a.id === addressDraft.id ? addressDraft : a)),
      }));
    }

    setAddressModal(false);
  };

  const confirmDeleteAddress = () => {
    if (deleteConfirmId !== null) {
      setForm((prev) => ({ ...prev, addresses: prev.addresses.filter((a) => a.id !== deleteConfirmId) }));
      setDeleteConfirmId(null);
    }
  };

  const removeAddress = (id: number) => {
    setForm((prev) => ({ ...prev, addresses: prev.addresses.filter((a) => a.id !== id) }));
  };

  const openCOAModal = () => {
    setCOADraft(emptyCOA());
    setCOAErrors({});
    setCOAModalMode("add");
    setCOAModal(true);
  };

  const openEditCOAModal = (coa: COARow) => {
    setCOADraft({ ...coa });
    setCOAErrors({});
    setCOAModalMode("edit");
    setCOAModal(true);
  };

  const handleCOADraftChange = (field: keyof COARow, value: string) => {
    setCOADraft((prev) => ({ ...prev, [field]: value }));
    if (coaErrors[field]) setCOAErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateCOADraft = () => {
    const e: Partial<Record<keyof COARow, string>> = {};
    if (!coaDraft.lineNo.trim()) e.lineNo = "Line No is required";
    if (!coaDraft.customerCOA.trim()) e.customerCOA = "Customer COA is required";
    if (!coaDraft.paymentMode.trim()) e.paymentMode = "Payment Mode is required";
    setCOAErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveCOA = () => {
    if (!validateCOADraft()) return;
    if (coaModalMode === "add") {
      setForm((prev) => ({ ...prev, coas: [...prev.coas, { ...coaDraft, id: Date.now() }] }));
    } else {
      setForm((prev) => ({
        ...prev,
        coas: prev.coas.map((c) => (c.id === coaDraft.id ? coaDraft : c)),
      }));
    }
    setCOAModal(false);
  };

  const confirmDeleteCOA = () => {
    if (deleteCOAConfirmId !== null) {
      setForm((prev) => ({ ...prev, coas: prev.coas.filter((c) => c.id !== deleteCOAConfirmId) }));
      setDeleteCOAConfirmId(null);
    }
  };

  const addDocument = () => {
    setForm((prev) => ({
      ...prev,
      documents: [...prev.documents, { id: Date.now(), documentType: "", documentFile: "", remarks: "" }],
    }));
  };

  const removeDocument = (id: number) => {
    setForm((prev) => ({ ...prev, documents: prev.documents.filter((d) => d.id !== id) }));
  };

  const updateDocument = (id: number, field: keyof DocumentRow, value: string) => {
    setForm((prev) => ({
      ...prev,
      documents: prev.documents.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
    }));
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

      {/* Tabs Section */}
      <div className="material-card material-elevation-1">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("address")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "address" ? "bg-primary text-black border-b-2 border-primary" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Address
          </button>
          <button
            onClick={() => setActiveTab("coa")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "coa" ? "bg-primary text-black border-b-2 border-primary" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            COA
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "documents" ? "bg-primary text-black border-b-2 border-primary" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Documents
          </button>
        </div>

        {/* Address Tab */}
        {activeTab === "address" && (
          <div className="p-0">
            {/* Blue header bar */}
            <div className="flex items-center justify-between bg-[#1a9fd4] px-4 py-2">
              <span className="text-white font-medium text-sm">Address</span>
              <Button onClick={openAddressModal} size="sm" className="bg-white text-[#1a9fd4] hover:bg-gray-100 text-xs font-medium h-7 px-3">
                <Plus className="w-3 h-3 mr-1" /> Add Address
              </Button>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Type</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Address</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Phone No</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Fax No</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Mobile No</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Email ID</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">City</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Country</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Contact Person</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Person Designation</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {form.addresses.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-3 py-6 text-center text-muted-foreground text-sm">
                        No addresses added yet.
                      </td>
                    </tr>
                  ) : (
                    form.addresses.map((addr) => (
                      <tr key={addr.id} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2">{addr.addressType || "—"}</td>
                        <td className="px-3 py-2 max-w-[150px] truncate">{addr.address || "—"}</td>
                        <td className="px-3 py-2">{addr.phoneNo || "—"}</td>
                        <td className="px-3 py-2">{addr.faxNo || "—"}</td>
                        <td className="px-3 py-2">{addr.mobileNo || "—"}</td>
                        <td className="px-3 py-2">{addr.emailId || "—"}</td>
                        <td className="px-3 py-2">{addr.city || "—"}</td>
                        <td className="px-3 py-2">{addr.country || "—"}</td>
                        <td className="px-3 py-2">{addr.contactPerson || "—"}</td>
                        <td className="px-3 py-2">{addr.personDesignation || "—"}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openViewAddressModal(addr)}
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                              title="View Address"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditAddressModal(addr)}
                              className="text-green-500 hover:text-green-700 transition-colors"
                              title="Edit Address"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(addr.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete Address"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COA Tab */}
        {activeTab === "coa" && (
          <div className="p-0">
            {/* Blue header bar */}
            <div className="flex items-center justify-between bg-[#1a9fd4] px-4 py-2">
              <span className="text-white font-medium text-sm">COA</span>
              <Button onClick={openCOAModal} size="sm" className="bg-white text-[#1a9fd4] hover:bg-gray-100 text-xs font-medium h-7 px-3">
                <Plus className="w-3 h-3 mr-1" /> Add COA
              </Button>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-3 py-2 text-left font-medium text-gray-600 w-10">#</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Customer COA</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Payment Mode</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Credit Approver</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">O/S Collector</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Currency</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Approved Credit Period</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Approved Credit Amount</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Alert Credit Days</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Alert Credit Amount</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Alert To Email</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Alert CC Email</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Alert BCC Email</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Notes</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {form.coas.length === 0 ? (
                    <tr>
                      <td colSpan={15} className="px-3 py-6 text-center text-muted-foreground text-sm">
                        No COA records added yet.
                      </td>
                    </tr>
                  ) : (
                    form.coas.map((coa, idx) => (
                      <tr key={coa.id} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-500">{idx + 1}</td>
                        <td className="px-3 py-2">{coa.customerCOA || "—"}</td>
                        <td className="px-3 py-2">{coa.paymentMode || "—"}</td>
                        <td className="px-3 py-2">{coa.creditApprover || "—"}</td>
                        <td className="px-3 py-2">{coa.osCollector || "—"}</td>
                        <td className="px-3 py-2">{coa.currency || "—"}</td>
                        <td className="px-3 py-2">{coa.approvedCreditPeriod || "—"}</td>
                        <td className="px-3 py-2">{coa.approvedCreditAmount || "—"}</td>
                        <td className="px-3 py-2">{coa.alertCreditDays || "—"}</td>
                        <td className="px-3 py-2">{coa.alertCreditAmount || "—"}</td>
                        <td className="px-3 py-2">{coa.alertToEmail || "—"}</td>
                        <td className="px-3 py-2">{coa.alertCCEmail || "—"}</td>
                        <td className="px-3 py-2">{coa.alertBCCEmail || "—"}</td>
                        <td className="px-3 py-2 max-w-[120px] truncate">{coa.notes || "—"}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => setViewingCOA(coa)} className="text-blue-500 hover:text-blue-700 transition-colors" title="View COA">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => openEditCOAModal(coa)} className="text-green-500 hover:text-green-700 transition-colors" title="Edit COA">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteCOAConfirmId(coa.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Delete COA">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Documents</h3>
              <Button onClick={addDocument} size="sm" className="material-button text-black">
                <Plus className="w-4 h-4 mr-1" /> Add Document
              </Button>
            </div>
            {form.documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No documents added yet. Click "Add Document" to add one.</p>
            ) : (
              <div className="space-y-4">
                {form.documents.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Document Entry</h4>
                      <Button onClick={() => removeDocument(doc.id)} size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-medium">Document Type</label>
                        <select
                          value={doc.documentType}
                          onChange={(e) => updateDocument(doc.id, "documentType", e.target.value)}
                          className="w-full px-2 py-1.5 border rounded text-sm bg-white"
                        >
                          {DOCUMENT_TYPES.map((t) => (
                            <option key={t} value={t === "--Select--" ? "" : t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium">Document File</label>
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) updateDocument(doc.id, "documentFile", file.name);
                          }}
                          className="w-full px-2 py-1.5 border rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium">Remarks</label>
                        <input
                          value={doc.remarks}
                          onChange={(e) => updateDocument(doc.id, "remarks", e.target.value)}
                          className="w-full px-2 py-1.5 border rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
      {/* Address Modal */}
      {addressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-[#1a9fd4] px-4 py-3 rounded-t-lg">
              <h2 className="text-white font-semibold text-base">
                {addressModalMode === "add" ? "Add Customer Address" : "Edit Customer Address"}
              </h2>
              <button onClick={() => setAddressModal(false)} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-5 space-y-4 flex-1">
              {/* Row 1: Address Type | Position */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Address Type</label>
                  <select
                    value={addressDraft.addressType}
                    onChange={(e) => handleAddressDraftChange("addressType", e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm"
                  >
                    {ADDRESS_TYPES.map((t) => <option key={t} value={t === "--Select--" ? "" : t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Position</label>
                  <select
                    value={addressDraft.position}
                    onChange={(e) => handleAddressDraftChange("position", e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm"
                  >
                    {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Address textarea */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Address <span className="text-red-500">*</span></label>
                <textarea
                  value={addressDraft.address}
                  onChange={(e) => handleAddressDraftChange("address", e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded text-sm resize-y ${addressErrors.address ? "border-red-400" : "border-input"}`}
                />
                {addressErrors.address && <p className="text-xs text-red-500">{addressErrors.address}</p>}
              </div>

              {/* Row: City | PAN No */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">City <span className="text-red-500">*</span></label>
                  <input
                    value={addressDraft.city}
                    onChange={(e) => handleAddressDraftChange("city", e.target.value)}
                    className={`w-full px-3 py-2 border rounded text-sm ${addressErrors.city ? "border-red-400" : "border-input"}`}
                  />
                  {addressErrors.city && <p className="text-xs text-red-500">{addressErrors.city}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">PAN No</label>
                  <input
                    value={addressDraft.panNo}
                    onChange={(e) => handleAddressDraftChange("panNo", e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                </div>
              </div>

              {/* Row: PIN No | GSTIN No */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">PIN No <span className="text-red-500">*</span></label>
                  <input
                    value={addressDraft.pinNo}
                    onChange={(e) => handleAddressDraftChange("pinNo", e.target.value)}
                    className={`w-full px-3 py-2 border rounded text-sm ${addressErrors.pinNo ? "border-red-400" : "border-input"}`}
                  />
                  {addressErrors.pinNo && <p className="text-xs text-red-500">{addressErrors.pinNo}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">GSTIN NO# <span className="text-red-500">*</span></label>
                  <input
                    value={addressDraft.gstinNo}
                    onChange={(e) => handleAddressDraftChange("gstinNo", e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                </div>
              </div>

              {/* GST notice */}
              <p className="text-xs text-red-500">Please Select Corresponding GST State. For Foreign Countries Select Other Country (96).</p>

              {/* Row: Phone No | GST State Code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Phone No</label>
                  <input
                    value={addressDraft.phoneNo}
                    onChange={(e) => handleAddressDraftChange("phoneNo", e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">GST State Code <span className="text-red-500">*</span></label>
                  <select
                    value={addressDraft.gstStateCode}
                    onChange={(e) => handleAddressDraftChange("gstStateCode", e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm"
                  >
                    {GST_STATE_CODES.map((g) => <option key={g} value={g === "--Select--" ? "" : g}>{g}</option>)}
                  </select>
                </div>
              </div>

              {/* SEZ Zone toggle */}
              <div className="space-y-1">
                <label className="text-sm font-medium">SEZ Zone</label>
                <div className="flex border rounded overflow-hidden w-48">
                  <button
                    type="button"
                    onClick={() => handleAddressDraftChange("sezZone", "No")}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      addressDraft.sezZone === "No" ? "bg-gray-300 text-gray-800" : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddressDraftChange("sezZone", "Yes")}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      addressDraft.sezZone === "Yes" ? "bg-[#1a9fd4] text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Yes
                  </button>
                </div>
              </div>

              {/* Row: Fax No | State */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Fax No</label>
                  <input value={addressDraft.faxNo} onChange={(e) => handleAddressDraftChange("faxNo", e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">State</label>
                  <input value={addressDraft.state} onChange={(e) => handleAddressDraftChange("state", e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
                </div>
              </div>

              {/* Row: Mobile No | Email ID */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Mobile No</label>
                  <input value={addressDraft.mobileNo} onChange={(e) => handleAddressDraftChange("mobileNo", e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Email ID</label>
                  <input value={addressDraft.emailId} onChange={(e) => handleAddressDraftChange("emailId", e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
                </div>
              </div>

              {/* Row: Country | Contact Person */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Country</label>
                  <select value={addressDraft.country} onChange={(e) => handleAddressDraftChange("country", e.target.value)} className="w-full px-3 py-2 border rounded text-sm">
                    {COUNTRIES.map((c) => <option key={c} value={c === "--Select--" ? "" : c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Contact Person</label>
                  <input value={addressDraft.contactPerson} onChange={(e) => handleAddressDraftChange("contactPerson", e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
                </div>
              </div>

              {/* Row: Person Designation | Department */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Person Designation</label>
                  <input value={addressDraft.personDesignation} onChange={(e) => handleAddressDraftChange("personDesignation", e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Department</label>
                  <input value={addressDraft.department} onChange={(e) => handleAddressDraftChange("department", e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
                </div>
              </div>

              {/* Row: TAX Registration Type | WhatsApp */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">TAX Registration Type</label>
                  <input value={addressDraft.taxRegistrationType} onChange={(e) => handleAddressDraftChange("taxRegistrationType", e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">WhatsApp</label>
                  <input value={addressDraft.whatsApp} onChange={(e) => handleAddressDraftChange("whatsApp", e.target.value)} className="w-full px-3 py-2 border rounded text-sm" />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  value={addressDraft.notes}
                  onChange={(e) => handleAddressDraftChange("notes", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded text-sm resize-y"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t bg-gray-50 rounded-b-lg">
              <Button variant="outline" onClick={() => setAddressModal(false)}>Cancel</Button>
              <Button className="bg-[#1a9fd4] text-white hover:bg-[#1589b8]" onClick={saveAddress}>
                {addressModalMode === "add" ? "Create" : "Update"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* View Address Modal */}
      {viewingAddress && (
        <AddressViewModal address={viewingAddress} onClose={() => setViewingAddress(null)} />
      )}

      {/* Delete Address Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
            <div className="flex items-center justify-between bg-[#1a9fd4] px-4 py-3 rounded-t-lg">
              <h2 className="text-white font-semibold text-base">Confirm Delete</h2>
              <button onClick={() => setDeleteConfirmId(null)} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700">Are you sure you want to delete this address? This action cannot be undone.</p>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-lg">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
              <Button className="bg-red-500 text-white hover:bg-red-600" onClick={confirmDeleteAddress}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* COA Add/Edit Modal */}
      {coaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between bg-[#1a9fd4] px-4 py-3 rounded-t-lg">
              <h2 className="text-white font-semibold text-base">CUSTOMER COA</h2>
              <button onClick={() => setCOAModal(false)} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Body */}
            <div className="overflow-y-auto p-5 space-y-4 flex-1 max-h-[75vh]">
              {/* Line No | Customer COA */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium"><span className="text-red-500 mr-0.5">*</span>Line No</label>
                  <input type="number" value={coaDraft.lineNo} onChange={(e) => handleCOADraftChange("lineNo", e.target.value)} className={`w-full px-3 py-2 border rounded text-sm text-right ${coaErrors.lineNo ? "border-red-400" : "border-input"}`} />
                  {coaErrors.lineNo && <p className="text-xs text-red-500">{coaErrors.lineNo}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium"><span className="text-red-500 mr-0.5">*</span>Customer COA</label>
                  <select value={coaDraft.customerCOA} onChange={(e) => handleCOADraftChange("customerCOA", e.target.value)} className={`w-full px-3 py-2 border rounded text-sm ${coaErrors.customerCOA ? "border-red-400" : "border-input"}`}>
                    <option value="">--Select--</option>
                    <option value="Sundry Debtors">Sundry Debtors</option>
                    <option value="Trade Receivables">Trade Receivables</option>
                    <option value="Accounts Receivable">Accounts Receivable</option>
                  </select>
                  {coaErrors.customerCOA && <p className="text-xs text-red-500">{coaErrors.customerCOA}</p>}
                </div>
              </div>
              {/* Currency | Payment Mode */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Currency</label>
                  <div className="relative">
                    <select value={coaDraft.currency} onChange={(e) => handleCOADraftChange("currency", e.target.value)} className="w-full px-3 py-2 border border-input rounded text-sm">
                      {CURRENCIES.map((c) => <option key={c} value={c === "--Select--" ? "" : c}>{c}</option>)}
                    </select>
                    {coaDraft.currency && (
                      <button type="button" onClick={() => handleCOADraftChange("currency", "")} className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">×</button>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium"><span className="text-red-500 mr-0.5">*</span>Payment Mode</label>
                  <select value={coaDraft.paymentMode} onChange={(e) => handleCOADraftChange("paymentMode", e.target.value)} className={`w-full px-3 py-2 border rounded text-sm ${coaErrors.paymentMode ? "border-red-400" : "border-input"}`}>
                    {PAYMENT_MODES.map((m) => <option key={m} value={m === "--Select--" ? "" : m}>{m}</option>)}
                  </select>
                  {coaErrors.paymentMode && <p className="text-xs text-red-500">{coaErrors.paymentMode}</p>}
                </div>
              </div>
              {/* Credit Approver | O/S Collector */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Credit Approver</label>
                  <input value={coaDraft.creditApprover} onChange={(e) => handleCOADraftChange("creditApprover", e.target.value)} className="w-full px-3 py-2 border border-input rounded text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">O/S Collector</label>
                  <input value={coaDraft.osCollector} onChange={(e) => handleCOADraftChange("osCollector", e.target.value)} className="w-full px-3 py-2 border border-input rounded text-sm" />
                </div>
              </div>
              {/* Approved Credit Period | Approved Credit Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Approved Credit Period</label>
                  <input value={coaDraft.approvedCreditPeriod} onChange={(e) => handleCOADraftChange("approvedCreditPeriod", e.target.value)} className="w-full px-3 py-2 border border-input rounded text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Approved Credit Amount</label>
                  <input value={coaDraft.approvedCreditAmount} onChange={(e) => handleCOADraftChange("approvedCreditAmount", e.target.value)} className="w-full px-3 py-2 border border-input rounded text-sm" />
                </div>
              </div>
              {/* Alert Credit Days | Alert Credit Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Alert Credit Days</label>
                  <input value={coaDraft.alertCreditDays} onChange={(e) => handleCOADraftChange("alertCreditDays", e.target.value)} className="w-full px-3 py-2 border border-input rounded text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Alert Credit Amount</label>
                  <input value={coaDraft.alertCreditAmount} onChange={(e) => handleCOADraftChange("alertCreditAmount", e.target.value)} className="w-full px-3 py-2 border border-input rounded text-sm" />
                </div>
              </div>
              {/* Alert To Email */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Alert To Email</label>
                <input type="email" value={coaDraft.alertToEmail} onChange={(e) => handleCOADraftChange("alertToEmail", e.target.value)} className="w-full px-3 py-2 border border-input rounded text-sm" />
              </div>
              {/* Alert CC Email | Alert BCC Email */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Alert CC Email</label>
                  <input type="email" value={coaDraft.alertCCEmail} onChange={(e) => handleCOADraftChange("alertCCEmail", e.target.value)} className="w-full px-3 py-2 border border-input rounded text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Alert BCC Email</label>
                  <input type="email" value={coaDraft.alertBCCEmail} onChange={(e) => handleCOADraftChange("alertBCCEmail", e.target.value)} className="w-full px-3 py-2 border border-input rounded text-sm" />
                </div>
              </div>
              {/* Notes */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Notes</label>
                <textarea value={coaDraft.notes} onChange={(e) => handleCOADraftChange("notes", e.target.value)} rows={3} className="w-full px-3 py-2 border border-input rounded text-sm resize-y" />
              </div>
            </div>
            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t bg-gray-50 rounded-b-lg">
              <Button variant="outline" onClick={() => setCOAModal(false)}>Cancel</Button>
              <Button className="bg-[#1a9fd4] text-white hover:bg-[#1589b8]" onClick={saveCOA}>
                {coaModalMode === "add" ? "Create" : "Update"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View COA Modal */}
      {viewingCOA && (
        <COAViewModal coa={viewingCOA} onClose={() => setViewingCOA(null)} />
      )}

      {/* Delete COA Confirmation Modal */}
      {deleteCOAConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
            <div className="flex items-center justify-between bg-[#1a9fd4] px-4 py-3 rounded-t-lg">
              <h2 className="text-white font-semibold text-base">Confirm Delete</h2>
              <button onClick={() => setDeleteCOAConfirmId(null)} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700">Are you sure you want to delete this COA record? This action cannot be undone.</p>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-lg">
              <Button variant="outline" onClick={() => setDeleteCOAConfirmId(null)}>Cancel</Button>
              <Button className="bg-red-500 text-white hover:bg-red-600" onClick={confirmDeleteCOA}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewCustomer;
