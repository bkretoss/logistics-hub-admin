import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const NewProspect = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    contactName: '',
    email: '',
    phone: '',
    location: '',
    leadScore: '',
    status: 'New',
    value: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    designation: '',
    department: '',
    mobile: '',
    website: '',
    industry: '',
    employees: '',
    revenue: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/sales/leads/new');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/sales/prospect')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">New Prospect</h1>
          <p className="text-muted-foreground text-sm mt-1">Create a new prospect entry</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="material-card material-elevation-1 p-6 space-y-8">
          {/* Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-semibold">Company Name <span className="text-destructive">*</span></Label>
              <Input id="company" name="company" value={formData.company} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName" className="text-sm font-semibold">Contact Name <span className="text-destructive">*</span></Label>
              <Input id="contactName" name="contactName" value={formData.contactName} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">Email <span className="text-destructive">*</span></Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-sm font-semibold">Mobile</Label>
              <Input id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-semibold">Location</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation" className="text-sm font-semibold">Designation</Label>
              <Input id="designation" name="designation" value={formData.designation} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-semibold">Department</Label>
              <Input id="department" name="department" value={formData.department} onChange={handleChange} />
            </div>
          </div>

          {/* Business Details */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Business Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-semibold">Website</Label>
                <Input id="website" name="website" value={formData.website} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-sm font-semibold">Industry</Label>
                <Input id="industry" name="industry" value={formData.industry} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employees" className="text-sm font-semibold">Number of Employees</Label>
                <Input id="employees" name="employees" value={formData.employees} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="revenue" className="text-sm font-semibold">Annual Revenue</Label>
                <div className="flex gap-2">
                  <select className="w-20 px-3 py-2 border border-input rounded-lg">
                    <option>USD</option>
                    <option>INR</option>
                  </select>
                  <Input id="revenue" name="revenue" value={formData.revenue} onChange={handleChange} className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="leadScore" className="text-sm font-semibold">Lead Score</Label>
                <Input id="leadScore" name="leadScore" type="number" value={formData.leadScore} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value" className="text-sm font-semibold">Estimated Value</Label>
                <div className="flex gap-2">
                  <select className="w-20 px-3 py-2 border border-input rounded-lg">
                    <option>USD</option>
                    <option>INR</option>
                  </select>
                  <Input id="value" name="value" value={formData.value} onChange={handleChange} className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold">Status</Label>
                <select 
                  id="status" 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal">Proposal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Address Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street" className="text-sm font-semibold">Street Address</Label>
                <Textarea id="street" name="street" value={formData.street} onChange={handleChange} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-semibold">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-semibold">State</Label>
                <Input id="state" name="state" value={formData.state} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip" className="text-sm font-semibold">ZIP Code</Label>
                <Input id="zip" name="zip" value={formData.zip} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-semibold">Country</Label>
                <Input id="country" name="country" value={formData.country} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Additional Information</h2>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-semibold">Notes</Label>
              <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={4} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/sales/prospect')}>Cancel</Button>
            <Button type="submit" className="material-button">Save Prospect</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewProspect;
