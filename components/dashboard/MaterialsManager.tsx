'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, Button, Input, Select, TableWrap, Th, Td, Alert, formatCurrency } from './Shared';

interface Material {
  id: string;
  project_id: string;
  item_name: string;
  est_qty: number;
  actual_qty: number;
  unit_cost: number;
  total_cost: number;
  projects?: { client_name: string };
}

export default function MaterialsManager() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [projects, setProjects] = useState<{ id: string; client_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form State
  const [projectId, setProjectId] = useState('');
  const [itemName, setItemName] = useState('');
  const [estQty, setEstQty] = useState<number | string>('');
  const [actualQty, setActualQty] = useState<number | string>('');
  const [unitCost, setUnitCost] = useState<number | string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [matRes, projRes] = await Promise.all([
      supabase.from('materials').select('*, projects(client_name)').order('created_at', { ascending: false }),
      supabase.from('projects').select('id, client_name').order('client_name')
    ]);
    
    if (matRes.error) setError(matRes.error.message);
    else setMaterials(matRes.data as unknown as Material[]);

    if (projRes.data) setProjects(projRes.data);
    setLoading(false);
  };

  const resetForm = () => {
    setProjectId('');
    setItemName('');
    setEstQty('');
    setActualQty('');
    setUnitCost('');
    setIsEditing(false);
    setEditId(null);
    setError('');
    setSuccess('');
  };

  const handleEdit = (m: Material) => {
    setIsEditing(true);
    setEditId(m.id);
    setProjectId(m.project_id);
    setItemName(m.item_name);
    setEstQty(m.est_qty);
    setActualQty(m.actual_qty);
    setUnitCost(m.unit_cost);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this material log?')) return;
    setError('');
    const { error } = await supabase.from('materials').delete().eq('id', id);
    if (error) setError(error.message);
    else {
      setSuccess('Material deleted.');
      fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      project_id: projectId,
      item_name: itemName,
      est_qty: Number(estQty) || 0,
      actual_qty: Number(actualQty) || 0,
      unit_cost: Number(unitCost) || 0,
      // total_cost is generated, do not include
    };

    if (isEditing && editId) {
      const { error } = await supabase.from('materials').update(payload).eq('id', editId);
      if (error) setError(error.message);
      else {
        setSuccess('Material updated.');
        resetForm();
        fetchData();
      }
    } else {
      const { error } = await supabase.from('materials').insert([payload]);
      if (error) setError(error.message);
      else {
        setSuccess('Material logged.');
        resetForm();
        fetchData();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Materials Log</h2>
        <p className="text-gray-600 mt-1">Track estimated vs actual material usage per project.</p>
      </div>

      {error && <Alert message={error} />}
      {success && <Alert message={success} type="success" />}

      <Card className="p-6 bg-gray-50/50">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{isEditing ? 'Edit Material' : 'Log Material'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <Select 
                label="Project" 
                id="projectId" 
                value={projectId} 
                onChange={(e) => setProjectId(e.target.value)}
                options={projects.map(p => ({ label: p.client_name, value: p.id }))}
                required
              />
            </div>
            <div className="md:col-span-3">
              <Input label="Item Name" id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
            </div>
            <Input label="Estimated Qty" id="estQty" type="number" step="0.01" value={estQty} onChange={(e) => setEstQty(e.target.value)} />
            <Input label="Actual Qty" id="actualQty" type="number" step="0.01" value={actualQty} onChange={(e) => setActualQty(e.target.value)} />
            <Input label="Unit Cost ($)" id="unitCost" type="number" step="0.01" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit">{isEditing ? 'Update Material' : 'Log Material'}</Button>
            {isEditing && <Button variant="default" onClick={resetForm}>Cancel</Button>}
          </div>
        </form>
      </Card>

      {loading ? (
        <div className="text-gray-500">Loading materials...</div>
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Project</Th>
              <Th>Item</Th>
              <Th>Est. Qty</Th>
              <Th>Actual Qty</Th>
              <Th>Unit Cost</Th>
              <Th>Total Cost</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {materials.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <Td className="font-medium text-gray-900">{m.projects?.client_name || 'Unknown'}</Td>
                <Td>{m.item_name}</Td>
                <Td className="font-mono tabular-nums">{m.est_qty}</Td>
                <Td className="font-mono tabular-nums">
                  <span className={m.actual_qty > m.est_qty && m.est_qty > 0 ? 'text-red-600 font-bold' : ''}>
                    {m.actual_qty}
                  </span>
                </Td>
                <Td className="font-mono tabular-nums">{formatCurrency(m.unit_cost)}</Td>
                <Td className="font-mono tabular-nums font-medium">{formatCurrency(m.total_cost)}</Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(m)} className="text-[#1677ff] hover:text-[#0958d9] text-sm font-medium">Edit</button>
                    <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                  </div>
                </Td>
              </tr>
            ))}
            {materials.length === 0 && (
              <tr>
                <Td className="text-center text-gray-500 py-8">No materials logged.</Td>
              </tr>
            )}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}