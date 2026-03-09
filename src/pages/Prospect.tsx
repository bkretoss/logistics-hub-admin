import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const Prospect: React.FC = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    contactName: '',
    address: '',
    state: '',
    city: '',
    zip: '',
    designation: '',
    telephoneNo: '',
    email: '',
    mobile: '',
    contactPerson: '',
    department: '',
    company: 'Relay Logistics Private Limited',
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.contactName.trim()) {
      toast({ title: 'Validation Error', description: 'Contact Name is required.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Prospect Saved', description: `Prospect "${form.contactName}" has been saved.` });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Prospect</h1>
          <p className="text-muted-foreground text-sm">Add and manage prospective clients</p>
        </div>
        <Button type="submit" form="prospect-form" className="gap-2">
          <UserPlus className="w-4 h-4" />
          Save Prospect
        </Button>
      </div>

      <Card className="material-shadow-1">
        <CardContent className="p-6">
          <form id="prospect-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-5">
              {/* Contact Name - spans full width on left column visually */}
              <div className="lg:col-span-2">
                <Label htmlFor="contactName" className="text-destructive font-medium">
                  Contact Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactName"
                  placeholder="e.g. Brandon Freeman"
                  value={form.contactName}
                  onChange={e => handleChange('contactName', e.target.value)}
                  className="mt-1.5"
                />
              </div>

              {/* Left Column */}
              <div className="space-y-5">
                <div>
                  <Label htmlFor="address" className="text-primary font-medium">Address</Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={e => handleChange('address', e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="state" className="font-medium text-muted-foreground">State</Label>
                    <Select value={form.state} onValueChange={v => handleChange('state', v)}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="city" className="font-medium text-muted-foreground">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={form.city}
                      onChange={e => handleChange('city', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip" className="font-medium text-muted-foreground">ZIP</Label>
                    <Input
                      id="zip"
                      placeholder="ZIP"
                      value={form.zip}
                      onChange={e => handleChange('zip', e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="designation" className="font-medium">Designation</Label>
                  <Input
                    id="designation"
                    value={form.designation}
                    onChange={e => handleChange('designation', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                <div>
                  <Label htmlFor="telephoneNo" className="font-medium">Telephone No</Label>
                  <Input
                    id="telephoneNo"
                    value={form.telephoneNo}
                    onChange={e => handleChange('telephoneNo', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="mobile" className="font-medium">Mobile</Label>
                  <Input
                    id="mobile"
                    value={form.mobile}
                    onChange={e => handleChange('mobile', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson" className="font-medium">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={form.contactPerson}
                    onChange={e => handleChange('contactPerson', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="department" className="font-medium">Department</Label>
                  <Input
                    id="department"
                    value={form.department}
                    onChange={e => handleChange('department', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="font-medium">Company</Label>
                  <Select value={form.company} onValueChange={v => handleChange('company', v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Relay Logistics Private Limited">Relay Logistics Private Limited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Prospect;
