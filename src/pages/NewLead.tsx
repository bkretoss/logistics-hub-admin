import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createLeadApi } from '@/services/api';

const NewLead = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer: '',
    target: '',
    lead_source: '',
    date: new Date().toISOString().split('T')[0],
    lead_owner: '',
    company: 'Relay Logistics (Private Limited)',
    sales_team: '',
    shipment_type: '',
    transport_mode: '',
    origin_port: '',
    target_date: '',
    business_service: '',
    destination_port: '',
    expected_annual_revenue: '',
    expected_annual_revenue_currency: 'USD',
    expected_annual_volume_commodity: '',
    nature_of_business: '',
    company_turnover: '',
    company_turnover_currency: 'USD',
    remarks: '',
    address: '',
    state: '',
    city: '',
    zip: '',
    contact_person: '',
    email: '',
    telephone_no: '',
    mobile_no: '',
    designation: '',
    department: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer.trim()) { setError('Customer is required.'); return; }
    setLoading(true);
    setError('');
    try {
      await createLeadApi({
        ...formData,
        expected_annual_revenue: formData.expected_annual_revenue ? Number(formData.expected_annual_revenue) : undefined,
        company_turnover: formData.company_turnover ? Number(formData.company_turnover) : undefined,
      });
      setSuccess(true);
      setTimeout(() => { navigate('/sales/leads'); window.scrollTo(0, 0); }, 1500);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to create lead. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
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
        <Button className="bg-primary text-black">Change Status</Button>
        <div className="flex items-center gap-2 ml-auto">
          <div className="px-4 py-2 bg-primary text-black font-medium rounded-lg">Unverified</div>
          <div className="px-4 py-2 bg-muted text-black font-medium rounded-lg">Qualified</div>
          <div className="px-4 py-2 bg-muted text-black font-medium rounded-lg">Disqualified</div>
          <div className="px-4 py-2 bg-muted text-black font-medium rounded-lg">Open</div>
          <div className="px-4 py-2 bg-muted text-black font-medium rounded-lg">Active</div>
          <div className="px-4 py-2 bg-muted text-black font-medium rounded-lg">Closed</div>
          <div className="px-4 py-2 bg-muted text-black font-medium rounded-lg">Future Prospect</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="material-card material-elevation-1 p-6 space-y-8">

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" /> Lead created successfully! Redirecting...
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customer" className="text-sm font-semibold">Customer <span className="text-destructive">*</span></Label>
              <Input id="customer" name="customer" value={formData.customer} onChange={handleChange} placeholder="Enter customer name" required />
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
              <Label htmlFor="lead_owner" className="text-sm font-semibold">Lead Owner</Label>
              <Input id="lead_owner" name="lead_owner" value={formData.lead_owner} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead_source" className="text-sm font-semibold">Lead Source</Label>
              <Input id="lead_source" name="lead_source" value={formData.lead_source} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-semibold">Company</Label>
              <Input id="company" name="company" value={formData.company} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sales_team" className="text-sm font-semibold">Sales Team</Label>
              <select id="sales_team" name="sales_team" value={formData.sales_team} onChange={handleChange} className="w-full px-3 py-2 border border-input rounded-lg">
                <option value="">Select</option>
                <option value="Team A">Team A</option>
                <option value="Team B">Team B</option>
                <option value="North America">North America</option>
              </select>
            </div>
          </div>

          {/* Business Lead */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Business Lead</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="shipment_type" className="text-sm font-semibold">Shipment Type</Label>
                <Input id="shipment_type" name="shipment_type" value={formData.shipment_type} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_date" className="text-sm font-semibold">Target Date</Label>
                <Input id="target_date" name="target_date" type="date" value={formData.target_date} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transport_mode" className="text-sm font-semibold">Transport Mode</Label>
                <Input id="transport_mode" name="transport_mode" value={formData.transport_mode} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_service" className="text-sm font-semibold">Business Service</Label>
                <Input id="business_service" name="business_service" value={formData.business_service} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin_port" className="text-sm font-semibold">Origin Port</Label>
                <Input id="origin_port" name="origin_port" value={formData.origin_port} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination_port" className="text-sm font-semibold">Destination Port</Label>
                <Input id="destination_port" name="destination_port" value={formData.destination_port} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected_annual_revenue" className="text-sm font-semibold">Expected Annual Revenue</Label>
                <div className="flex gap-2">
                  <select name="expected_annual_revenue_currency" value={formData.expected_annual_revenue_currency} onChange={handleChange} className="w-20 px-3 py-2 border border-input rounded-lg">
                    <option>USD</option>
                    <option>INR</option>
                  </select>
                  <Input id="expected_annual_revenue" name="expected_annual_revenue" value={formData.expected_annual_revenue} onChange={handleChange} className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected_annual_volume_commodity" className="text-sm font-semibold">Expected Annual Volume Commodity</Label>
                <Input id="expected_annual_volume_commodity" name="expected_annual_volume_commodity" value={formData.expected_annual_volume_commodity} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Revenue & Volume */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Revenue & Volume</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company_turnover" className="text-sm font-semibold">Company Turnover</Label>
                <div className="flex gap-2">
                  <select name="company_turnover_currency" value={formData.company_turnover_currency} onChange={handleChange} className="w-20 px-3 py-2 border border-input rounded-lg">
                    <option>USD</option>
                    <option>INR</option>
                  </select>
                  <Input id="company_turnover" name="company_turnover" value={formData.company_turnover} onChange={handleChange} className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nature_of_business" className="text-sm font-semibold">Nature Of Business</Label>
                <Textarea id="nature_of_business" name="nature_of_business" value={formData.nature_of_business} onChange={handleChange} rows={3} />
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contact_person" className="text-sm font-semibold">Contact Person</Label>
                <Input id="contact_person" name="contact_person" value={formData.contact_person} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone_no" className="text-sm font-semibold">Telephone No</Label>
                <Input id="telephone_no" name="telephone_no" value={formData.telephone_no} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile_no" className="text-sm font-semibold">Mobile No</Label>
                <Input id="mobile_no" name="mobile_no" value={formData.mobile_no} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-semibold">State</Label>
                <Input id="state" name="state" value={formData.state} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-semibold">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip" className="text-sm font-semibold">ZIP</Label>
                <Input id="zip" name="zip" value={formData.zip} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation" className="text-sm font-semibold">Designation</Label>
                <Input id="designation" name="designation" value={formData.designation} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-semibold">Department</Label>
                <Input id="department" name="department" value={formData.department} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-semibold">Address</Label>
                <Textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={2} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes" className="text-sm font-semibold">Notes</Label>
                <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={2} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" className="bg-red-400 text-black hover:bg-red-350" onClick={() => navigate('/sales/leads')} disabled={loading}>Cancel</Button>
            <Button type="submit" className="material-button text-black" disabled={loading}>{loading ? 'Saving...' : 'Save Lead'}</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewLead;
