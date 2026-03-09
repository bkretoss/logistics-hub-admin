import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, Search, Eye, Pencil, Trash2, ArrowLeft, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

interface ProspectData {
  id: number;
  contactName: string;
  address: string;
  state: string;
  city: string;
  zip: string;
  designation: string;
  telephoneNo: string;
  email: string;
  mobile: string;
  contactPerson: string;
  department: string;
  company: string;
}

const initialProspects: ProspectData[] = [
  { id: 1, contactName: 'Rahul Sharma', address: '12 MG Road', state: 'Maharashtra', city: 'Mumbai', zip: '400001', designation: 'Manager', telephoneNo: '022-12345678', email: 'rahul@example.com', mobile: '9876543210', contactPerson: 'Rahul Sharma', department: 'Logistics', company: 'Relay Logistics Private Limited' },
  { id: 2, contactName: 'Priya Patel', address: '45 Brigade Road', state: 'Karnataka', city: 'Bangalore', zip: '560001', designation: 'Director', telephoneNo: '080-87654321', email: 'priya@example.com', mobile: '9123456780', contactPerson: 'Priya Patel', department: 'Operations', company: 'Relay Logistics Private Limited' },
  { id: 3, contactName: 'Amit Kumar', address: '78 Connaught Place', state: 'Uttar Pradesh', city: 'Delhi', zip: '110001', designation: 'CEO', telephoneNo: '011-11223344', email: 'amit@example.com', mobile: '9988776655', contactPerson: 'Amit Kumar', department: 'Management', company: 'Relay Logistics Private Limited' },
];

const emptyForm = {
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
};

const Prospect: React.FC = () => {
  const { toast } = useToast();
  const [view, setView] = useState<'list' | 'form'>('list');
  const [prospects, setProspects] = useState<ProspectData[]>(initialProspects);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setView('form');
  };

  const handleEdit = (prospect: ProspectData) => {
    setEditingId(prospect.id);
    setForm({
      contactName: prospect.contactName,
      address: prospect.address,
      state: prospect.state,
      city: prospect.city,
      zip: prospect.zip,
      designation: prospect.designation,
      telephoneNo: prospect.telephoneNo,
      email: prospect.email,
      mobile: prospect.mobile,
      contactPerson: prospect.contactPerson,
      department: prospect.department,
      company: prospect.company,
    });
    setView('form');
  };

  const handleDelete = (id: number) => {
    setProspects(prev => prev.filter(p => p.id !== id));
    toast({ title: 'Deleted', description: 'Prospect has been removed.' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.contactName.trim()) {
      toast({ title: 'Validation Error', description: 'Contact Name is required.', variant: 'destructive' });
      return;
    }

    if (editingId !== null) {
      setProspects(prev => prev.map(p => p.id === editingId ? { ...p, ...form } : p));
      toast({ title: 'Updated', description: `Prospect "${form.contactName}" updated.` });
    } else {
      const newId = prospects.length > 0 ? Math.max(...prospects.map(p => p.id)) + 1 : 1;
      setProspects(prev => [...prev, { id: newId, ...form }]);
      toast({ title: 'Saved', description: `Prospect "${form.contactName}" added.` });
    }

    setForm(emptyForm);
    setEditingId(null);
    setView('list');
  };

  const filtered = prospects.filter(p =>
    p.contactName.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase()) ||
    p.company.toLowerCase().includes(search.toLowerCase())
  );

  if (view === 'form') {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setView('list')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {editingId ? 'Edit Prospect' : 'Add Prospect'}
              </h1>
              <p className="text-muted-foreground text-sm">
                {editingId ? 'Update prospect details' : 'Fill in the details to create a new prospect'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setView('list')} className="gap-2">
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button type="submit" form="prospect-form" className="gap-2">
              <UserPlus className="w-4 h-4" />
              {editingId ? 'Update Prospect' : 'Save Prospect'}
            </Button>
          </div>
        </div>

        <Card className="material-shadow-1">
          <CardContent className="p-6">
            <form id="prospect-form" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-5">
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

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="address" className="text-primary font-medium">Address</Label>
                    <Input id="address" value={form.address} onChange={e => handleChange('address', e.target.value)} className="mt-1.5" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="font-medium text-muted-foreground">State</Label>
                      <Select value={form.state} onValueChange={v => handleChange('state', v)}>
                        <SelectTrigger className="mt-1.5"><SelectValue placeholder="State" /></SelectTrigger>
                        <SelectContent>
                          {indianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="font-medium text-muted-foreground">City</Label>
                      <Input placeholder="City" value={form.city} onChange={e => handleChange('city', e.target.value)} className="mt-1.5" />
                    </div>
                    <div>
                      <Label className="font-medium text-muted-foreground">ZIP</Label>
                      <Input placeholder="ZIP" value={form.zip} onChange={e => handleChange('zip', e.target.value)} className="mt-1.5" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="designation" className="font-medium">Designation</Label>
                    <Input id="designation" value={form.designation} onChange={e => handleChange('designation', e.target.value)} className="mt-1.5" />
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label className="font-medium">Telephone No</Label>
                    <Input value={form.telephoneNo} onChange={e => handleChange('telephoneNo', e.target.value)} className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="font-medium">Email</Label>
                    <Input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="font-medium">Mobile</Label>
                    <Input value={form.mobile} onChange={e => handleChange('mobile', e.target.value)} className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="font-medium">Contact Person</Label>
                    <Input value={form.contactPerson} onChange={e => handleChange('contactPerson', e.target.value)} className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="font-medium">Department</Label>
                    <Input value={form.department} onChange={e => handleChange('department', e.target.value)} className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="font-medium">Company</Label>
                    <Select value={form.company} onValueChange={v => handleChange('company', v)}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select company" /></SelectTrigger>
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
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Prospect</h1>
          <p className="text-muted-foreground text-sm">Manage prospective clients</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Add Prospect
        </Button>
      </div>

      <Card className="material-shadow-1">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search prospects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <span className="text-sm text-muted-foreground">{filtered.length} prospect(s)</span>
          </div>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Contact Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Mobile</TableHead>
                  <TableHead className="font-semibold">City</TableHead>
                  <TableHead className="font-semibold">Company</TableHead>
                  <TableHead className="font-semibold">Designation</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      No prospects found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p, idx) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell className="font-medium">{p.contactName}</TableCell>
                      <TableCell>{p.email}</TableCell>
                      <TableCell>{p.mobile}</TableCell>
                      <TableCell>{p.city}</TableCell>
                      <TableCell className="text-xs">{p.company}</TableCell>
                      <TableCell>{p.designation}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="View">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(p)} title="Edit">
                            <Pencil className="w-4 h-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(p.id)} title="Delete">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Prospect;
