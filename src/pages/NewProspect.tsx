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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact Name is required';
    } else if (formData.contactName.trim().length < 3) {
      newErrors.contactName = 'Contact Name must be at least 3 characters';
    } else if (formData.contactName.length > 50) {
      newErrors.contactName = 'Contact Name must not exceed 50 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    } else if (formData.email.length > 50) {
      newErrors.email = 'Email must not exceed 50 characters';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telephone No is required';
    } else if (!/^[+]?[0-9\s()\-]+$/.test(formData.phone)) {
      newErrors.phone = 'Telephone No must contain only numbers, +, (), -, and spaces';
    } else if (formData.phone.length < 8 || formData.phone.length > 20) {
      newErrors.phone = 'Telephone No must be between 8 and 20 characters';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile is required';
    } else if (!/^[+]?[0-9\s()\-]+$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile must contain only numbers, +, (), -, and spaces';
    } else if (formData.mobile.length < 10 || formData.mobile.length > 20) {
      newErrors.mobile = 'Mobile must be between 10 and 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      navigate('/sales/leads/new', { 
        state: { 
          prospectCompany: formData.company || 'Relay Logistics Private Limited',
          prospectContactName: formData.contactName 
        } 
      });
      window.scrollTo(0, 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Real-time validation for Contact Name
    if (name === 'contactName') {
      if (value.length > 50) {
        setErrors({ ...errors, contactName: 'Contact Name must not exceed 50 characters' });
      } else if (value.trim().length > 0 && value.trim().length < 3) {
        setErrors({ ...errors, contactName: 'Contact Name must be at least 3 characters' });
      } else if (errors.contactName) {
        setErrors({ ...errors, contactName: '' });
      }
    } else if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
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
          {/* Contact Name */}
          <div className="space-y-2 w-1/3">
            <Label htmlFor="contactName" className="text-sm font-semibold">Contact Name <span className="text-red-500">*</span></Label>
            <Input id="contactName" name="contactName" value={formData.contactName} onChange={handleChange} placeholder="e.g. Brandom Freeman" className={errors.contactName ? 'border-red-500' : ''} maxLength={50} />
            {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
          </div>

          {/* Main Form Grid */}
          <div className="grid grid-cols-1 gap-x-12 gap-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-sm font-semibold">Address</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input name="street" value={formData.street} onChange={handleChange} placeholder="Street..." />
                  <Input name="street2" onChange={handleChange} placeholder="Street 2..." />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <select name="country" value={formData.country} onChange={handleChange} className="px-3 py-2 border border-input rounded-lg">
                    <option value="">Country</option>
                    <option>United States</option>
                    <option>India</option>
                  </select>
                  <select name="state" value={formData.state} onChange={handleChange} className="px-3 py-2 border border-input rounded-lg">
                    <option value="">State</option>
                  </select>
                  <select name="city" value={formData.city} onChange={handleChange} className="px-3 py-2 border border-input rounded-lg">
                    <option value="">City</option>
                  </select>
                  <Input name="zip" value={formData.zip} onChange={handleChange} placeholder="ZIP" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="designation" className="text-sm font-semibold">Designation</Label>
                  <Input id="designation" name="designation" value={formData.designation} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold">Telephone No <span className="text-red-500">*</span></Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className={errors.phone ? 'border-red-500' : ''} onKeyPress={(e) => { if (!/[0-9+()\s\-]/.test(e.key)) e.preventDefault(); }} maxLength={20} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">Email <span className="text-red-500">*</span></Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={errors.email ? 'border-red-500' : ''} maxLength={50} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-sm font-semibold">Mobile <span className="text-red-500">*</span></Label>
                  <Input id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} className={errors.mobile ? 'border-red-500' : ''} onKeyPress={(e) => { if (!/[0-9+()\s\-]/.test(e.key)) e.preventDefault(); }} maxLength={20} />
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson" className="text-sm font-semibold">Contact Person</Label>
                  <Input id="contactPerson" name="contactPerson" onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-semibold">Department</Label>
                  <Input id="department" name="department" value={formData.department} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-semibold">Company</Label>
                  <Input id="company" name="company" value={formData.company} onChange={handleChange} defaultValue="Relay Logistics Private Limited" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" className="bg-red-400 text-black hover:bg-red-350" onClick={() => navigate('/sales/prospect')}>Cancel</Button>
            <Button type="submit" className="material-button text-black">Save Prospect</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewProspect;
