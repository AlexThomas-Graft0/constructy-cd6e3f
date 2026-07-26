'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, Button, Input, Select, TableWrap, Th, Td, Alert } from './Shared';

interface User {
  id: string;
  email: string;
  role: string;
  name: string | null;
}

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Manager');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setUsers(data || []);
    setLoading(false);
  };

  const resetForm = () => {
    setEmail('');
    setName('');
    setRole('Manager');
    setIsEditing(false);
    setEditId(null);
    setError('');
    setSuccess('');
  };

  const handleEdit = (u: User) => {
    setIsEditing(true);
    setEditId(u.id);
    setEmail(u.email);
    setName(u.name || '');
    setRole(u.role);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this user from the system?')) return;
    setError('');
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) setError(error.message);
    else {
      setSuccess('User removed.');
      fetchUsers();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      email,
      name,
      role,
    };

    if (isEditing && editId) {
      const { error } = await supabase.from('users').update(payload).eq('id', editId);
      if (error) setError(error.message);
      else {
        setSuccess('User updated.');
        resetForm();
        fetchUsers();
      }
    } else {
      // NOTE: In a real app, you'd invite them via Supabase Auth first to get a real UUID.
      // For this spec, we just insert into the public.users table as requested by CRUD rules.
      const { error } = await supabase.from('users').insert([payload]);
      if (error) setError(error.message);
      else {
        setSuccess('User added.');
        resetForm();
        fetchUsers();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Team Settings</h2>
        <p className="text-gray-600 mt-1">Manage system access and roles.</p>
      </div>

      {error && <Alert message={error} />}
      {success && <Alert message={success} type="success" />}

      <Card className="p-6 bg-gray-50/50">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{isEditing ? 'Edit User' : 'Add Team Member'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Full Name" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email Address" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Select 
              label="Role" 
              id="role" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              options={[
                { label: 'Manager', value: 'Manager' },
                { label: 'Admin', value: 'Admin' },
              ]}
              required
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit">{isEditing ? 'Update User' : 'Add User'}</Button>
            {isEditing && <Button variant="default" onClick={resetForm}>Cancel</Button>}
          </div>
        </form>
      </Card>

      {loading ? (
        <div className="text-gray-500">Loading users...</div>
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <Td className="font-medium text-gray-900">{u.name || '-'}</Td>
                <Td>{u.email}</Td>
                <Td>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                    ${u.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                    {u.role}
                  </span>
                </Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(u)} className="text-[#1677ff] hover:text-[#0958d9] text-sm font-medium">Edit</button>
                    <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                  </div>
                </Td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <Td className="text-center text-gray-500 py-8">No users found.</Td>
              </tr>
            )}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}