'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, Button, Input, Select, TableWrap, Th, Td, Alert, formatCurrency } from './Shared';

interface Labor {
  id: string;
  project_id: string;
  worker_or_role: string;
  hours_worked: number;
  hourly_rate: number;
  resulting_cost: number;
  date_logged: string | null;
  projects?: { client_name: string };
}

export default function LaborManager() {
  const [laborLogs, setLaborLogs] = useState<Labor[]>([]);
  const [projects, setProjects] = useState<{ id: string; client_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [projectId, setProjectId] = useState('');
  const [workerOrRole, setWorkerOrRole] = useState('');
  const [hoursWorked, setHoursWorked] = useState<number | string>('');
  const [hourlyRate, setHourlyRate] = useState<number | string>('');
  const [dateLogged, setDateLogged] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [labRes, projRes] = await Promise.all([
      supabase.from('labor').select('*, projects(client_name)').order('date_logged', { ascending: false }),
      supabase.from('projects').select('id, client_name').order('client_name')
    ]);
    
    if (labRes.error) setError(labRes.error.message);
    else setLaborLogs(labRes.data as unknown as Labor[]);

    if (projRes.data) setProjects(projRes.data);
    setLoading(false);
  };

  const resetForm = () => {
    setProjectId('');
    setWorkerOrRole('');
    setHoursWorked('');
    setHourlyRate('');
    setDateLogged('');
    setIsEditing(false);
    setEditId(null);
    setError('');
    setSuccess('');
  };

  const handleEdit = (l: Labor) => {
    setIsEditing(true);
    setEditId(l.id);
    setProjectId(l.project_id);
    setWorkerOrRole(l.worker_or_role);
    setHoursWorked(l.hours_worked);
    setHourlyRate(l.hourly_rate);
    setDateLogged(l.date_logged || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this labor log?')) return;
    setError('');
    const { error } = await supabase.from('labor').delete().eq('id', id);
    if (error) setError(error.message);
    else {
      setSuccess('Labor log deleted.');
      fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      project_id: projectId,
      worker_or_role: workerOrRole,
      hours_worked: Number(hoursWorked) || 0,
      hourly_rate: Number(hourlyRate) || 0,
      date_logged: dateLogged || null,
    };

    if (isEditing && editId) {
      const { error } = await supabase.from('labor').update(payload).eq('id', editId);
      if (error) setError(error.message);
      else {
        setSuccess('Labor log updated.');
        resetForm();
        fetchData();
      }
    } else {
      const { error } = await supabase.from('labor').insert([payload]);
      if (error) setError(error.message);
      else {
        setSuccess('Labor logged.');
        resetForm();
        fetchData();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Labor Log</h2>
        <p className="text-gray-600 mt-1">Record daily hours and calculate labor costs.</p>
      </div>

      {error && <Alert message={error} />}
      {success && <Alert message={success} type="success" />}

      <Card className="p-6 bg-gray-50/50">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{isEditing ? 'Edit Labor Log' : 'Log Hours'}</h3>
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
            <Input label="Worker Name or Role" id="workerOrRole" value={workerOrRole} onChange={(e) => setWorkerOrRole(e.target.value)} required />
            <Input label="Hours Worked" id="hoursWorked" type="number" step="0.25" value={hoursWorked} onChange={(e) => setHoursWorked(e.target.value)} required />
            <Input label="Hourly Rate ($)" id="hourlyRate" type="number" step="0.01" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} required />
            <Input label="Date Logged" id="dateLogged" type="date" value={dateLogged} onChange={(e) => setDateLogged(e.target.value)} required />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit">{isEditing ? 'Update Log' : 'Log Hours'}</Button>
            {isEditing && <Button variant="default" onClick={resetForm}>Cancel</Button>}
          </div>
        </form>
      </Card>

      {loading ? (
        <div className="text-gray-500">Loading labor logs...</div>
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Project</Th>
              <Th>Worker / Role</Th>
              <Th>Hours</Th>
              <Th>Rate</Th>
              <Th>Cost</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {laborLogs.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <Td>{l.date_logged}</Td>
                <Td className="font-medium text-gray-900">{l.projects?.client_name || 'Unknown'}</Td>
                <Td>{l.worker_or_role}</Td>
                <Td className="font-mono tabular-nums">{l.hours_worked}</Td>
                <Td className="font-mono tabular-nums">{formatCurrency(l.hourly_rate)}</Td>
                <Td className="font-mono tabular-nums font-medium">{formatCurrency(l.resulting_cost)}</Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(l)} className="text-[#1677ff] hover:text-[#0958d9] text-sm font-medium">Edit</button>
                    <button onClick={() => handleDelete(l.id)} className="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                  </div>
                </Td>
              </tr>
            ))}
            {laborLogs.length === 0 && (
              <tr>
                <Td className="text-center text-gray-500 py-8">No labor logged.</Td>
              </tr>
            )}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}