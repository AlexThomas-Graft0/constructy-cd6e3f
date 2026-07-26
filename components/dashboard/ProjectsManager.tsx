'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, Button, Input, Select, TableWrap, Th, Td, Alert, formatCurrency } from './Shared';

interface Project {
  id: string;
  client_name: string;
  status: string;
  billed_amount: number;
  est_hours: number;
  est_materials_cost: number;
  start_date: string | null;
  end_date: string | null;
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [status, setStatus] = useState('Draft');
  const [billedAmount, setBilledAmount] = useState<number | string>('');
  const [estHours, setEstHours] = useState<number | string>('');
  const [estMaterialsCost, setEstMaterialsCost] = useState<number | string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setProjects(data || []);
    setLoading(false);
  };

  const resetForm = () => {
    setClientName('');
    setStatus('Draft');
    setBilledAmount('');
    setEstHours('');
    setEstMaterialsCost('');
    setStartDate('');
    setEndDate('');
    setIsEditing(false);
    setEditId(null);
    setError('');
    setSuccess('');
  };

  const handleEdit = (p: Project) => {
    setIsEditing(true);
    setEditId(p.id);
    setClientName(p.client_name);
    setStatus(p.status);
    setBilledAmount(p.billed_amount);
    setEstHours(p.est_hours);
    setEstMaterialsCost(p.est_materials_cost);
    setStartDate(p.start_date || '');
    setEndDate(p.end_date || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project? All associated logs will be deleted.')) return;
    setError('');
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) setError(error.message);
    else {
      setSuccess('Project deleted successfully.');
      fetchProjects();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      client_name: clientName,
      status,
      billed_amount: Number(billedAmount) || 0,
      est_hours: Number(estHours) || 0,
      est_materials_cost: Number(estMaterialsCost) || 0,
      start_date: startDate || null,
      end_date: endDate || null,
    };

    if (isEditing && editId) {
      const { error } = await supabase.from('projects').update(payload).eq('id', editId);
      if (error) setError(error.message);
      else {
        setSuccess('Project updated successfully.');
        resetForm();
        fetchProjects();
      }
    } else {
      const { error } = await supabase.from('projects').insert([payload]);
      if (error) setError(error.message);
      else {
        setSuccess('Project created successfully.');
        resetForm();
        fetchProjects();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Projects Directory</h2>
        <p className="text-gray-600 mt-1">Manage project details, estimates, and status.</p>
      </div>

      {error && <Alert message={error} />}
      {success && <Alert message={success} type="success" />}

      <Card className="p-6 bg-gray-50/50">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{isEditing ? 'Edit Project' : 'New Project'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Client / Project Name" id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
            <Select 
              label="Status" 
              id="status" 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { label: 'Draft', value: 'Draft' },
                { label: 'Active', value: 'Active' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Cancelled', value: 'Cancelled' },
              ]}
              required
            />
            <Input label="Billed Amount ($)" id="billedAmount" type="number" step="0.01" value={billedAmount} onChange={(e) => setBilledAmount(e.target.value)} />
            <Input label="Estimated Hours" id="estHours" type="number" step="0.5" value={estHours} onChange={(e) => setEstHours(e.target.value)} />
            <Input label="Est. Materials Cost ($)" id="estMaterialsCost" type="number" step="0.01" value={estMaterialsCost} onChange={(e) => setEstMaterialsCost(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Input label="Start Date" id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <Input label="End Date" id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit">{isEditing ? 'Update Project' : 'Create Project'}</Button>
            {isEditing && <Button variant="default" onClick={resetForm}>Cancel</Button>}
          </div>
        </form>
      </Card>

      {loading ? (
        <div className="text-gray-500">Loading projects...</div>
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Client</Th>
              <Th>Status</Th>
              <Th>Billed</Th>
              <Th>Est. Hours</Th>
              <Th>Est. Materials</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <Td className="font-medium text-gray-900">{p.client_name}</Td>
                <Td>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${p.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      p.status === 'Draft' ? 'bg-gray-100 text-gray-800' : 
                      p.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                    {p.status}
                  </span>
                </Td>
                <Td className="font-mono tabular-nums">{formatCurrency(p.billed_amount)}</Td>
                <Td className="font-mono tabular-nums">{p.est_hours}</Td>
                <Td className="font-mono tabular-nums">{formatCurrency(p.est_materials_cost)}</Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(p)} className="text-[#1677ff] hover:text-[#0958d9] text-sm font-medium">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                  </div>
                </Td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <Td className="text-center text-gray-500 py-8" /* colSpan=6 not typed in Td, using wrapper approach or just letting it flow */>
                  No projects found.
                </Td>
              </tr>
            )}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}