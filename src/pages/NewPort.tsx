import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getMasterPortApi, createMasterPortApi, updateMasterPortApi } from '@/services/api';

interface Terminal {
  name: string;
  code: string;
  description: string;
  status: number;
}

const emptyTerminal = (): Terminal => ({ name: '', code: '', description: '', status: 1 });

const emptyForm = { name: '', code: '', description: '', status: 1 };

const NewPort = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm]           = useState(emptyForm);
  const [terminals, setTerminals] = useState<Terminal[]>([emptyTerminal()]);
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [saving, setSaving]       = useState(false);
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    getMasterPortApi(Number(id))
      .then(res => {
        const data = res.data?.data ?? res.data;
        setForm({ name: data.name, code: data.code, description: data.description ?? '', status: data.status });
        setTerminals(
          data.terminals?.length
            ? data.terminals.map((t: any) => ({ name: t.name, code: t.code, description: t.description ?? '', status: t.status }))
            : [emptyTerminal()]
        );
      })
      .catch(() => toast({ title: 'Error', description: 'Failed to load port.', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [id]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Port Name is required.';
    if (!form.code.trim()) e.code = 'Port Code is required.';
    terminals.forEach((t, i) => {
      if (!t.name.trim()) e[`t_name_${i}`] = 'Terminal Name is required.';
      if (!t.code.trim()) e[`t_code_${i}`] = 'Terminal Code is required.';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form, terminals };
      if (isEdit) {
        await updateMasterPortApi(Number(id), payload);
        toast({ title: 'Success', description: 'Port updated successfully.', variant: 'success' });
      } else {
        await createMasterPortApi(payload);
        toast({ title: 'Success', description: 'Port created successfully.', variant: 'success' });
      }
      navigate('/master/port');
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.message ?? 'Failed to save port.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const updateTerminal = (i: number, field: keyof Terminal, value: string | number) => {
    setTerminals(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
    setErrors(prev => { const e = { ...prev }; delete e[`t_${field}_${i}`]; return e; });
  };

  const addTerminal   = () => setTerminals(prev => [...prev, emptyTerminal()]);
  const removeTerminal = (i: number) => setTerminals(prev => prev.filter((_, idx) => idx !== i));

  if (loading) return <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/master/port')} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{isEdit ? 'Edit Port' : 'Add Port'}</h1>
          <p className="text-muted-foreground text-sm mt-1">{isEdit ? 'Update port details' : 'Create a new port'}</p>
        </div>
      </div>

      {/* Port Details */}
      <div className="material-card material-elevation-1 p-6 space-y-4">
        <h2 className="text-base font-semibold text-foreground border-b border-border pb-2">Port Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-semibold mb-1 block">
              <span className="text-destructive mr-1">*</span>Port Name
            </Label>
            <input
              type="text"
              value={form.name}
              onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(p => { const e = { ...p }; delete e.name; return e; }); }}
              placeholder="Enter port name"
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background ${errors.name ? 'border-destructive' : 'border-input'}`}
            />
            {errors.name && <p className="text-xs text-destructive mt-1">⚠ {errors.name}</p>}
          </div>

          <div>
            <Label className="text-sm font-semibold mb-1 block">
              <span className="text-destructive mr-1">*</span>Port Code
            </Label>
            <input
              type="text"
              value={form.code}
              onChange={e => { setForm(f => ({ ...f, code: e.target.value })); setErrors(p => { const e = { ...p }; delete e.code; return e; }); }}
              placeholder="Enter port code"
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background ${errors.code ? 'border-destructive' : 'border-input'}`}
            />
            {errors.code && <p className="text-xs text-destructive mt-1">⚠ {errors.code}</p>}
          </div>

          <div className="sm:col-span-2">
            <Label className="text-sm font-semibold mb-1 block">Description</Label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Enter description (optional)"
              rows={2}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background resize-none"
            />
          </div>

          <div>
            <Label className="text-sm font-semibold mb-1 block">Status</Label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background"
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Terminals */}
      <div className="material-card material-elevation-1 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold text-foreground">Terminals</h2>
          <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addTerminal}>
            <Plus className="w-4 h-4" /> Add Row
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2 text-left text-xs font-semibold text-muted-foreground w-8">#</th>
                <th className="p-2 text-left text-xs font-semibold text-muted-foreground">
                  <span className="text-destructive mr-1">*</span>Name
                </th>
                <th className="p-2 text-left text-xs font-semibold text-muted-foreground">
                  <span className="text-destructive mr-1">*</span>Code
                </th>
                <th className="p-2 text-left text-xs font-semibold text-muted-foreground">Description</th>
                <th className="p-2 text-left text-xs font-semibold text-muted-foreground">Status</th>
                <th className="p-2 text-center text-xs font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {terminals.map((t, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="p-2 text-muted-foreground">{i + 1}</td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={t.name}
                      onChange={e => updateTerminal(i, 'name', e.target.value)}
                      placeholder="Terminal name"
                      className={`w-full px-2 py-1.5 border rounded-lg text-sm bg-background ${errors[`t_name_${i}`] ? 'border-destructive' : 'border-input'}`}
                    />
                    {errors[`t_name_${i}`] && <p className="text-xs text-destructive mt-0.5">⚠ {errors[`t_name_${i}`]}</p>}
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={t.code}
                      onChange={e => updateTerminal(i, 'code', e.target.value)}
                      placeholder="Code"
                      className={`w-full px-2 py-1.5 border rounded-lg text-sm bg-background ${errors[`t_code_${i}`] ? 'border-destructive' : 'border-input'}`}
                    />
                    {errors[`t_code_${i}`] && <p className="text-xs text-destructive mt-0.5">⚠ {errors[`t_code_${i}`]}</p>}
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={t.description}
                      onChange={e => updateTerminal(i, 'description', e.target.value)}
                      placeholder="Description"
                      className="w-full px-2 py-1.5 border border-input rounded-lg text-sm bg-background"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={t.status}
                      onChange={e => updateTerminal(i, 'status', Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-input rounded-lg text-sm bg-background"
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeTerminal(i)}
                      disabled={terminals.length === 1}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/master/port')}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving} className="text-black">
          {saving ? 'Saving...' : isEdit ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default NewPort;
