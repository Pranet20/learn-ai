'use client';
import { useState } from 'react';
import api from '@/lib/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const submit = async (e: any) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      window.location.href = '/dashboard';
    } catch { alert("Backend Connection Failed"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-lg w-96 border">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Create Account</h2>
        <input className="w-full p-2 mb-4 border rounded" placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} required />
        <input className="w-full p-2 mb-4 border rounded" placeholder="Email" type="email" onChange={e => setForm({...form, email: e.target.value})} required />
        <input className="w-full p-2 mb-4 border rounded" type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">Register</button>
      </form>
    </div>
  );
}