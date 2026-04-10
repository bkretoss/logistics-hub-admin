import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getBranchApi } from '@/services/api';
import type { Branch } from './BranchMasterList';

const Field = ({ label, value, span }: { label: string; value?: string; span?: boolean }) => (
  <div className={`flex items-center gap-4${span ? ' md:col-span-2' : ''}`}>
    <Label className="text-sm font-semibold w-44 shrink-0 text-muted-foreground">{label}</Label>
    <div className="flex-1 px-3 py-2 border border-input rounded-lg text-sm bg-muted/40 text-foreground min-h-[38px]">
      {value || <span className="text-muted-foreground">—</span>}
    </div>
  </div>
);

const ViewBranch = () => {
  const navigate    = useNavigate();
  const { id }      = useParams<{ id: string }>();
  const { toast }   = useToast();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getBranchApi(Number(id))
      .then(res => setBranch(res.data.data ?? res.data))
      .catch(() => toast({ title: 'Error', description: 'Failed to load branch', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  if (!branch) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/admin/branch-master')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Branch Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/branch-master')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">View Branch</h1>
          <p className="text-muted-foreground text-sm mt-1">{branch.name} — {branch.branch_code}</p>
        </div>
        <Button className="gap-2 material-button material-elevation-2 text-black"
          onClick={() => navigate(`/admin/branch-master/edit/${branch.id}`)}>
          <Pencil className="w-4 h-4" /> Edit
        </Button>
      </div>

      <div className="material-card material-elevation-1 overflow-hidden">
        <div className="bg-[#4CAF50] px-6 py-3">
          <h2 className="text-base font-bold text-white">Info</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
            <Field label="Branch Code"   value={branch.branch_code} />
            <Field label="Name"          value={branch.name} />
            <Field label="Position"      value={branch.position} />
            <Field label="Currency"      value={branch.currency} />
            <Field label="Billing State" value={branch.billing_state} />
            <Field label="GSTIN No#"     value={branch.gstin_no} />
            <div className="flex items-start gap-4 md:col-span-2">
              <Label className="text-sm font-semibold w-44 shrink-0 pt-2 text-muted-foreground">Description</Label>
              <div className="flex-1 px-3 py-2 border border-input rounded-lg text-sm bg-muted/40 text-foreground min-h-[80px] whitespace-pre-wrap">
                {branch.description || <span className="text-muted-foreground">—</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="material-card material-elevation-1 overflow-hidden">
        <div className="bg-[#90A4AE] px-6 py-3">
          <h2 className="text-base font-bold text-white">Branch Address</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
            <Field label="Address"  value={branch.address} />
            <Field label="City"     value={branch.city} />
            <Field label="State"    value={branch.state} />
            <Field label="Zip Code" value={branch.zip_code} />
            <Field label="Country"  value={branch.country} />
            <Field label="Phone"    value={branch.phone} />
            <Field label="Mobile"   value={branch.mobile} />
            <Field label="Email"    value={branch.email} />
            <Field label="Website"  value={branch.website} span />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pb-4">
        <Button variant="outline" onClick={() => navigate('/admin/branch-master')}>Back to List</Button>
      </div>

    </div>
  );
};

export default ViewBranch;
