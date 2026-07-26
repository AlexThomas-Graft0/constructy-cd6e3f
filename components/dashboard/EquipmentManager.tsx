'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, Button, Input, Select, TableWrap, Th, Td, Alert, formatCurrency } from './Shared';

interface Equipment {
  id: string;
  project_id: string;
  item_name: string;
  cost_type: string;
  total_cost: number;
  projects?: { client_name: string };
}

export default function EquipmentManager() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [projects, setProjects] = useState<{ id: string; client_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [projectId, setProjectId] = useState('');
  const [itemName, setItemName] = useState('');
  const [costType, setCostType] = useState('Hire');
  const [totalCost, setTotalCost] = useState<number | string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [eqRes, projRes] = await Promise.all([
      supabase.from('equipment').select('*, projects(client_name)').order('created_at', { ascending: false }),
      supabase.from('projects').select('id, client_name').order('client_name')
    ]);
    
    if (eqRes.error) setError(eqRes.error.message);
    else setEquipment(eqRes.data as unknown as Equipment[]);

    if (projRes.data) setProjects(projRes.data);
    setLoading(false);
  };

  const resetForm = () => {
    setProjectId('');
    setItemName('');
    setCostType('Hire');
    setTotalCost('');
    setIsEditing(false);
    setEditId(null);
    setError('');
    setSuccess('');
  };

  const handleEdit = (eq: Equipment) => {
    setIsEditing(true);
    setEditId(eq.id);
    setProjectId(eq.project_id);
    setItemName(eq.item_name);
    setCostType(eq.cost_type);
    setTotalCost(eq.total_cost);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this equipment record?')) return;
    setError('');
    const { error } = await supabase.from('equipment').delete().eq('id', id);
    if (error) setError(error.message);
    else {
      setSuccess('Equipment deleted.');
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
      cost_type: costType,
      total_cost: Number(totalCost) || 0,
    };

    if (isEditing && editId) {
      const { error } = await supabase.from('equipment').update(payload).eq('id', editId);
      if (error) setError(error.message);
      else {
        setSuccess('Equipment updated.');
        resetForm();
        fetchData();
      }
    } else {
      const { error } = await supabase.from('equipment').insert([payload]);
      if (error) setError(error.message);
      else {
        setSuccess('Equipment logged.');
        resetForm();
        fetchData();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Equipment & Tools Log</h2>
        <p className="text-gray-600 mt-1">Track tool purchases and machinery hire costs.</p>
      </div>

      {error && <Alert message={error} />}
      {success && <Alert message={success} type="success" />}

      <Card className="p-6 bg-gray-50/50">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{isEditing ? 'Edit Equipment' : 'Add Equipment'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Project" 
              id="projectId" 
              value={projectId} 
              onChange={(e) => setProjectId(e.target.value)}
              options={projects.map(p => ({ label: p.client_name, value: p.id }))}
              required
            />
            <Input label="Equipment / Tool Name" id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
            <Select 
              label="Cost Type" 
              id="costType" 
              value={costType} 
              onChange={(e) => setCostType(e.target.value)}
              options={[
                { label: 'Hire', value: 'Hire' },
                { label: 'Purchase', value: 'Purchase' },
              ]}
              required
            />
            <Input label="Total Cost ($)" id="totalCost" type="number" step="0.01" value={totalCost} onChange={(e) => setTotalCost(e.target.value)} required />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit">{isEditing ? 'Update Equipment' : 'Add Equipment'}</Button>
            {isEditing && <Button variant="default" onClick={resetForm}>Cancel</Button>}
          </div>
        </form>
      </Card>

      {loading ? (
        <div className="text-gray-500">Loading equipment...</div>
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Project</Th>
              <Th>Item Name</Th>
              <Th>Type</Th>
              <Th>Total Cost</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {equipment.map((eq) => (
              <tr key={eq.id} className="hover:bg-gray-50">
                <Td className="font-medium text-gray-900">{eq.projects?.client_name || 'Unknown'}</Td>
                <Td>{eq.item_name}</Td>
                <Td>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border
                    ${eq.cost_type === 'Hire' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                    {eq.cost_type}
                  </span>
                </Td>
                <Td className="font-mono tabular-nums font-medium">{formatCurrency(eq.total_cost)}</Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(eq)} className="text-[#1677ff] hover:text-[#0958d9] text-sm font-medium">Edit</button>
                    <button onClick={() => handleDelete(eq.id)} className="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                  </div>
                </Td>
              </tr>
            ))}
            {equipment.length === 0 && (
              <tr>
                <Td className="text-center text-gray-500 py-8">No equipment logged.</Td>
              </tr>
            )}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}