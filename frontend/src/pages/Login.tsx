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
      setError(err.response?.data?.error || 'Authentication rejected');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-flux-bg text-flux-text flex items-center justify-center overflow-hidden preserve-3d">
      <div className="flux-grid" />
      <div className="flux-ambient" />

      <motion.div 
        initial={{ opacity: 0, z: -100, rotateX: 10 }}
        animate={{ opacity: 1, z: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275] }}
        className="relative z-10 w-full max-w-sm p-10 flux-panel rounded-2xl border-t border-t-flux-accent/30 shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-flux-accent/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(200,255,61,0.15)]">
            <div className="w-8 h-8 rounded-full bg-flux-accent/20 blur-md absolute" />
            <div className="w-10 h-10 rounded-full border border-flux-accent/50 flex items-center justify-center bg-flux-surface z-10">
              <span className="text-flux-accent font-bold text-xs tracking-tighter">VC</span>
            </div>
          </div>
          <h1 className="text-2xl font-light tracking-[0.2em] text-flux-text mb-2">VIBE FLUX</h1>
          <p className="text-[9px] text-flux-muted tracking-widest uppercase">System Authentication</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded bg-flux-danger/10 border border-flux-danger/30 text-flux-danger text-xs text-center font-bold tracking-widest uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-flux-muted font-bold">Identity Vector</label>
            <input 
              type="email" 
              className="w-full bg-flux-surface-2 border border-flux-text/10 focus:border-flux-accent rounded px-4 py-3 outline-none transition-colors placeholder:text-flux-text/20 text-sm"
              placeholder="lead@demo.com"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-flux-muted font-bold">Security Key</label>
            <input 
              type="password" 
              className="w-full bg-flux-surface-2 border border-flux-text/10 focus:border-flux-accent rounded px-4 py-3 outline-none transition-colors placeholder:text-flux-text/20 text-sm"
              placeholder="••••••••"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button 
            disabled={loading}
            className="w-full mt-8 bg-flux-accent hover:bg-flux-accent/90 text-flux-bg font-bold tracking-widest uppercase text-xs py-4 rounded transition-colors shadow-[0_0_20px_rgba(200,255,61,0.2)] hover:shadow-[0_0_30px_rgba(200,255,61,0.4)]"
          >
            {loading ? 'Initiating...' : 'Establish Uplink'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
