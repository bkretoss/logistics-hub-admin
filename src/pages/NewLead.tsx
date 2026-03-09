import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const NewLead = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer: '',
    target: '',
    leadSource: '',
    date: new Date().toISOString().split('T')[0],
    leadOwner: '',
    company: 'Relay Logistics (Private Limited)',
    salesTeam: '',
    shipmentType: '',
    transportMode: '',
    originPort: '',
    targetDate: '',
    businessService: '',
    destinationPort: '',
    expectedAnnualRevenue: '',
    expectedAnnualVolume: '',
    natureOfBusiness: '',
    companyTurnover: '',
    remarks: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zip: '',
    contactPerson: '',
    email: '',
    telephoneNo: '',
    mobileNo: '',
    designation: '',
    department: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/sales/opportunity/new');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/sales/leads')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">New Lead</h1>
          <p className="text-muted-foreground text-sm mt-1">Create a new lead entry</p>
        </div>
      </div>

      {/* Status Buttons */}
      <div className="flex items-center gap-3">
        <Button className="bg-primary text-white">Change Status</Button>
        <div className="flex items-center gap-2 ml-auto">
          <div className="px-4 py-2 bg-primary text-white font-medium rounded-lg">Unverified</div>
          <div className="px-4 py-2 bg-muted text-muted-foreground font-medium rounded-lg">Qualified</div>
          <div className="px-4 py-2 bg-muted text-muted-foreground font-medium rounded-lg">Disqualified</div>
          <div className="px-4 py-2 bg-muted text-muted-foreground font-medium rounded-lg">Open</div>
          <div className="px-4 py-2 bg-muted text-muted-foreground font-medium rounded-lg">Active</div>
          <div className="px-4 py-2 bg-muted text-muted-foreground font-medium rounded-lg">Closed</div>
          <div className="px-4 py-2 bg-muted text-muted-foreground font-medium rounded-lg">Future Prospect</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="material-card material-elevation-1 p-6 space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customer" className="text-sm font-semibold">Customer <span className="text-destructive">*</span></Label>
              <Input id="customer" name="customer" value={formData.customer} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold">Date</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target" className="text-sm font-semibold">Target</Label>
              <Input id="target" name="target" value={formData.target} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadOwner" className="text-sm font-semibold">Lead Owner</Label>
              <Input id="leadOwner" name="leadOwner" value={formData.leadOwner} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadSource" className="text-sm font-semibold">Lead Source</Label>
              <Input id="leadSource" name="leadSource" value={formData.leadSource} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-semibold">Company</Label>
              <Input id="company" name="company" value={formData.company} onChange={handleChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="salesTeam" className="text-sm font-semibold">Sales Team</Label>
              <Input id="salesTeam" name="salesTeam" value={formData.salesTeam} onChange={handleChange} />
            </div>
          </div>

          {/* Business Lead */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Business Lead</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="shipmentType" className="text-sm font-semibold">Shipment Type</Label>
                <Input id="shipmentType" name="shipmentType" value={formData.shipmentType} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetDate" className="text-sm font-semibold">Target Date</Label>
                <Input id="targetDate" name="targetDate" type="date" value={formData.targetDate} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transportMode" className="text-sm font-semibold">Transport Mode</Label>
                <Input id="transportMode" name="transportMode" value={formData.transportMode} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessService" className="text-sm font-semibold">Business Service</Label>
                <Input id="businessService" name="businessService" value={formData.businessService} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originPort" className="text-sm font-semibold">Origin Port</Label>
                <Input id="originPort" name="originPort" value={formData.originPort} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinationPort" className="text-sm font-semibold">Destination Port</Label>
                <Input id="destinationPort" name="destinationPort" value={formData.destinationPort} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedAnnualRevenue" className="text-sm font-semibold">Expected Annual Revenue</Label>
                <div className="flex gap-2">
                  <select className="w-20 px-3 py-2 border border-input rounded-lg">
                    <option>USD</option>
                    <option>INR</option>
                  </select>
                  <Input id="expectedAnnualRevenue" name="expectedAnnualRevenue" value={formData.expectedAnnualRevenue} onChange={handleChange} className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedAnnualVolume" className="text-sm font-semibold">Expected Annual Volume Commodity</Label>
                <Input id="expectedAnnualVolume" name="expectedAnnualVolume" value={formData.expectedAnnualVolume} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Revenue & Volume */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Revenue & Volume</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="natureOfBusiness" className="text-sm font-semibold">Nature Of Business</Label>
                <Textarea id="natureOfBusiness" name="natureOfBusiness" value={formData.natureOfBusiness} onChange={handleChange} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyTurnover" className="text-sm font-semibold">Company Turnover</Label>
                <div className="flex gap-2">
                  <select className="w-20 px-3 py-2 border border-input rounded-lg">
                    <option>USD</option>
                    <option>INR</option>
                  </select>
                  <Input id="companyTurnover" name="companyTurnover" value={formData.companyTurnover} onChange={handleChange} className="flex-1" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="remarks" className="text-sm font-semibold">Remarks</Label>
                <Textarea id="remarks" name="remarks" value={formData.remarks} onChange={handleChange} rows={3} />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-sm font-semibold">Address</Label>
                <Textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson" className="text-sm font-semibold">Contact Person</Label>
                <Input id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-semibold">State</Label>
                <Input id="state" name="state" value={formData.state} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephoneNo" className="text-sm font-semibold">Telephone No</Label>
                <Input id="telephoneNo" name="telephoneNo" value={formData.telephoneNo} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-semibold">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNo" className="text-sm font-semibold">Mobile No</Label>
                <Input id="mobileNo" name="mobileNo" value={formData.mobileNo} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip" className="text-sm font-semibold">ZIP</Label>
                <Input id="zip" name="zip" value={formData.zip} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation" className="text-sm font-semibold">Designation</Label>
                <Input id="designation" name="designation" value={formData.designation} onChange={handleChange} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="department" className="text-sm font-semibold">Department</Label>
                <Input id="department" name="department" value={formData.department} onChange={handleChange} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes" className="text-sm font-semibold">Notes</Label>
                <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={4} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/sales/leads')}>Cancel</Button>
            <Button type="submit" className="material-button">Save Lead</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewLead;
