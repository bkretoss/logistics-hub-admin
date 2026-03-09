import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const NewQuote = () => {
  const navigate = useNavigate();
  const [showAllIncl, setShowAllIncl] = useState(false);
  const [activeTab, setActiveTab] = useState("terms");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/sales/quotes");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/sales/quotes")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        {/* <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">New Quotation</h1>
          <p className="text-muted-foreground text-sm mt-1">Create a new quote</p>
        </div> */}
        <div className="py-4">
          <p className="text-sm text-muted-foreground">Quotation Number</p>
          <h2 className="text-2xl font-bold text-foreground">New Quotation</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="material-card material-elevation-1 p-6 space-y-8">
          {/* Header Actions */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3"></div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">0 Documents</span>
              </div>
              <Button type="button" variant="outline" className="gap-2">
                <span>Customer Preview</span>
              </Button>
            </div>
          </div>

          {/* <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Quotation Number</p>
            <h2 className="text-2xl font-bold text-foreground">New Quotation</h2>
          </div> */}

          {/* Customer Section */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Customer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customer" className="text-sm font-semibold">
                  Customer <span className="text-destructive">*</span>
                </Label>
                <select id="customer" className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  <option>Customer 1</option>
                  <option>Customer 2</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-semibold">
                  Date
                </Label>
                <Input id="date" type="date" defaultValue="2026-03-09" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-semibold">
                  Address
                </Label>
                <select id="address" className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quoteExpiryDate" className="text-sm font-semibold">
                  Quote Expiry Date
                </Label>
                <Input id="quoteExpiryDate" type="date" defaultValue="2026-04-08" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quoteApprover" className="text-sm font-semibold">
                  Quote Approver <span className="text-destructive">*</span>
                </Label>
                <select id="quoteApprover" className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  <option>Approver 1</option>
                  <option>Approver 2</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salesAgent" className="text-sm font-semibold">
                  Sales Agent <span className="text-destructive">*</span>
                </Label>
                <select id="salesAgent" className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  <option>Agent 1</option>
                  <option>Agent 2</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Courier Shipment</Label>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="courierShipment" className="w-4 h-4" />
                  <Label htmlFor="courierShipment" className="text-sm font-normal cursor-pointer">
                    Enable
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-semibold">
                  Company
                </Label>
                <select id="company" className="w-full px-3 py-2 border border-input rounded-lg">
                  <option>Relay Logistics Private Limited</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Multi Carrier Quote</Label>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="multiCarrier" className="w-4 h-4" />
                  <Label htmlFor="multiCarrier" className="text-sm font-normal cursor-pointer">
                    Enable
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salesTeam" className="text-sm font-semibold">
                  Sales Team <span className="text-destructive">*</span>
                </Label>
                <select id="salesTeam" className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  <option>Team A</option>
                  <option>Team B</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Quote For</Label>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="quoteFor" value="Shipment" defaultChecked />
                    <span className="text-sm">Shipment</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="quoteFor" value="Service Job" />
                    <span className="text-sm">Service Job</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Shipment Count</Label>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="shipmentCount" value="Single" defaultChecked />
                    <span className="text-sm">Single</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="shipmentCount" value="Multiple" />
                    <span className="text-sm">Multiple</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Mode of Shipment */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Mode of Shipment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="transportMode" className="text-sm font-semibold">
                  Transport Mode <span className="text-destructive">*</span>
                </Label>
                <select id="transportMode" className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  <option>Air</option>
                  <option>Sea</option>
                  <option>Road</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipmentType" className="text-sm font-semibold">
                  Shipment Type <span className="text-destructive">*</span>
                </Label>
                <select id="shipmentType" className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  <option>FCL</option>
                  <option>LCL</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargoType" className="text-sm font-semibold">
                  Cargo Type <span className="text-destructive">*</span>
                </Label>
                <select id="cargoType" className="w-full px-3 py-2 border border-input rounded-lg">
                  <option value="">Select</option>
                  <option>General</option>
                  <option>Hazardous</option>
                </select>
              </div>
            </div>
          </div>

          {/* Shipper & Consignee */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-bold text-primary mb-4">Shipper</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Shipper</Label>
                  <select className="w-full px-3 py-2 border border-input rounded-lg"><option value="">Select</option></select>
                </div>
                <div className="space-y-2">
                  <Label>Shipper Address</Label>
                  <select className="w-full px-3 py-2 border border-input rounded-lg"><option value="">Select</option></select>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary mb-4">Consignee</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Consignee</Label>
                  <select className="w-full px-3 py-2 border border-input rounded-lg"><option value="">Select</option></select>
                </div>
                <div className="space-y-2">
                  <Label>Consignee Address</Label>
                  <select className="w-full px-3 py-2 border border-input rounded-lg"><option value="">Select</option></select>
                </div>
              </div>
            </div>
          </div>

          {/* General Information */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">General Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2"><Label>Service Mode</Label><select className="w-full px-3 py-2 border border-input rounded-lg"><option value="">Select</option></select></div>
              <div className="space-y-2"><Label>Reference Number</Label><Input /></div>
              <div className="space-y-2"><Label>Estimated Pickup</Label><select className="w-full px-3 py-2 border border-input rounded-lg"><option value="">Select</option></select></div>
              <div className="space-y-2"><Label>Expected Delivery</Label><select className="w-full px-3 py-2 border border-input rounded-lg"><option value="">Select</option></select></div>
              <div className="space-y-2"><Label>Origin Country</Label><select className="w-full px-3 py-2 border border-input rounded-lg"><option value="">Select</option></select></div>
              <div className="space-y-2"><Label>Destination Country</Label><select className="w-full px-3 py-2 border border-input rounded-lg"><option value="">Select</option></select></div>
              <div className="space-y-2"><Label>Transit Time</Label><Input placeholder="Transit Time taken to reach destination" /></div>
              <div className="space-y-2"><Label>Incoterms</Label><select className="w-full px-3 py-2 border border-input rounded-lg"><option value="">Select</option></select></div>
            </div>
          </div>

          {/* Additional Info */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Additional Info</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2"><Label>Additional Services</Label><select className="w-full px-3 py-2 border border-input rounded-lg"><option value="">Select</option></select></div>
              <div className="space-y-2"><Label>Free Day</Label><Input /></div>
            </div>
          </div>

          {/* Agent & CoLoader */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-bold text-primary mb-4">Agent</h2>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Agent</Label><select className="w-full px-3 py-2 border border-input rounded-lg"><option value="">Select</option></select></div>
                <div className="space-y-2"><Label>Agent Address</Label><select className="w-full px-3 py-2 border border-input rounded-lg"><option value="">Select</option></select></div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary mb-4">CoLoader</h2>
              <div className="space-y-4">
                <div className="space-y-2"><Label>CoLoader</Label><select className="w-full px-3 py-2 border border-input rounded-lg"><option value="">Select</option></select></div>
                <div className="space-y-2"><Label>CoLoader Address</Label><select className="w-full px-3 py-2 border border-input rounded-lg"><option value="">Select</option></select></div>
              </div>
            </div>
          </div>

          {/* HAZ Details */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">HAZ Details</h2>
            <div className="space-y-2"><Label>HAZ?</Label><div className="pt-2"><input type="checkbox" className="w-4 h-4 rounded" /></div></div>
          </div>

          {/* Monetary Details */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Monetary Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Goods Value</Label>
                <div className="flex gap-2">
                  <Input placeholder="0.00" className="flex-1" />
                  <select className="px-3 py-2 border border-input rounded-lg w-32"><option>INR</option></select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Insurance Value</Label>
                <div className="flex gap-2">
                  <Input placeholder="0.00" className="flex-1" />
                  <select className="px-3 py-2 border border-input rounded-lg w-32"><option>INR</option></select>
                </div>
              </div>
            </div>
          </div>

          {/* Declared Weight & Volume */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Declared Weight & Volume</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Packs</Label>
                <div className="flex gap-2">
                  <Input placeholder="0" className="flex-1" />
                  <select className="px-3 py-2 border border-input rounded-lg w-32"><option value="">Select</option></select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Volumetric Weight</Label>
                <div className="flex gap-2">
                  <Input placeholder="0.00" className="flex-1" />
                  <select className="px-3 py-2 border border-input rounded-lg w-32"><option>kg</option></select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Gross Weight</Label>
                <div className="flex gap-2">
                  <Input placeholder="0.00" className="flex-1" />
                  <select className="px-3 py-2 border border-input rounded-lg w-32"><option>kg</option></select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Chargeable</Label>
                <Input placeholder="0.00 kg" disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Net Weight</Label>
                <div className="flex gap-2">
                  <Input placeholder="0.00" className="flex-1" />
                  <select className="px-3 py-2 border border-input rounded-lg w-32"><option>kg</option></select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Volume</Label>
                <div className="flex gap-2">
                  <Input placeholder="0.00" className="flex-1" />
                  <select className="px-3 py-2 border border-input rounded-lg w-32"><option>m³</option></select>
                </div>
              </div>
            </div>
          </div>

          {/* Packages */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Packages</h2>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold">Container Type</th>
                    <th className="text-left p-3 text-sm font-semibold">Count</th>
                    <th className="text-left p-3 text-sm font-semibold">Commodity</th>
                    <th className="text-left p-3 text-sm font-semibold">TEU</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-3" colspan="4">
                      <p className="text-sm text-muted-foreground text-center py-4">No packages added</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Charges */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Charges</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="showAllIncl" className="w-4 h-4" checked={showAllIncl} onChange={(e) => setShowAllIncl(e.target.checked)} />
                <Label htmlFor="showAllIncl" className="text-sm font-normal cursor-pointer">Show All Incl. in Single line</Label>
              </div>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      {!showAllIncl && <th className="text-left p-3 text-sm font-semibold">Include</th>}
                      <th className="text-left p-3 text-sm font-semibold">Charge Type</th>
                      <th className="text-left p-3 text-sm font-semibold">Charge Description</th>
                      <th className="text-left p-3 text-sm font-semibold">Weight UoM</th>
                      <th className="text-left p-3 text-sm font-semibold">Measurement Basis</th>
                      <th className="text-left p-3 text-sm font-semibold">Container Type</th>
                      <th className="text-left p-3 text-sm font-semibold">No of Units</th>
                      <th className="text-left p-3 text-sm font-semibold">Cost Rate per Unit</th>
                      <th className="text-left p-3 text-sm font-semibold">Sell Rate per Unit</th>
                      <th className="text-left p-3 text-sm font-semibold">Charge Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="p-3" colspan={showAllIncl ? "9" : "10"}>
                        <p className="text-sm text-muted-foreground text-center py-4">No charges added</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Charges Summary */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Charges Summary</h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Estimated Total Cost</span>
                <span className="text-sm text-destructive">₹ 0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Estimated Total Revenue</span>
                <span className="text-sm" style={{color: '#10b981'}}>₹ 0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Estimated Profit</span>
                <span className="text-sm">₹ 0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Estimated Margin Percent</span>
                <span className="text-sm" style={{color: '#3b82f6'}}>0.00 %</span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions / Remarks */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Charges Summary</h2>
            <div className="border-b border-border mb-4">
              <div className="flex gap-6">
                <button type="button" onClick={() => setActiveTab("terms")} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "terms" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Terms & Conditions</button>
                <button type="button" onClick={() => setActiveTab("remarks")} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "remarks" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Remarks</button>
              </div>
            </div>
            <div className="space-y-4">
              {activeTab === "terms" && (
                <>
                  <div className="space-y-2">
                    <Label>Template</Label>
                    <select className="w-full px-3 py-2 border border-input rounded-lg"><option value="">Select</option></select>
                  </div>
                  <div className="space-y-2">
                    <Label>Terms and conditions</Label>
                    <textarea className="w-full px-3 py-2 border border-input rounded-lg min-h-[100px]" placeholder="Enter terms and conditions"></textarea>
                  </div>
                </>
              )}
              {activeTab === "remarks" && (
                <div className="space-y-2">
                  <Label>Remarks</Label>
                  <textarea className="w-full px-3 py-2 border border-input rounded-lg min-h-[100px]" placeholder="Enter remarks"></textarea>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/sales/quotes")}>
              Cancel
            </Button>
            <Button type="submit" className="material-button">
              Save Quote
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewQuote;
