import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      if (['team_lead', 'co_lead'].includes(res.data.user.role)) {
        navigate('/team');
      } else {
        navigate('/member');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex items-center justify-center overflow-hidden">
      <div className="bg-grid"></div>
      <div className="bg-glow"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-10 glass-panel rounded-3xl"
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-br from-primary to-secondary mb-2">
            VIBE CODING
          </h1>
          <p className="text-text-muted text-sm tracking-widest uppercase">Team Dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-text-muted font-semibold ml-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-surface-elevated/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 outline-none transition-all placeholder:text-border"
              placeholder="lead@demo.com"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-text-muted font-semibold ml-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-surface-elevated/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 outline-none transition-all placeholder:text-border"
              placeholder="••••••••"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button 
            disabled={loading}
            className="w-full relative group overflow-hidden rounded-xl p-[1px] mt-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-surface px-4 py-3 rounded-xl flex items-center justify-center transition-all group-hover:bg-opacity-0">
              <span className="font-semibold tracking-wide group-hover:text-white transition-colors">
                {loading ? 'AUTHENTICATING...' : 'ACCESS WORKSPACE'}
              </span>
            </div>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
