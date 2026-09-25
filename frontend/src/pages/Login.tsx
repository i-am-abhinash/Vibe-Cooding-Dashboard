import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      if (['team_lead', 'co_lead'].includes(res.data.user.role)) {
        navigate('/team');
      } else {
        navigate('/member');
      }
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6">Vibe Coding Team</h2>
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full border p-2 rounded mb-4" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full border p-2 rounded mb-6" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
}
