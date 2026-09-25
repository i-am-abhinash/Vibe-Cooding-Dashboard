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
    <div className="min-h-screen bg-cinematic-bg text-cinematic-text flex items-center justify-center overflow-hidden preserve-3d relative">
      <div className="cinematic-atmosphere" />
      <div className="absolute w-[800px] h-[800px] rounded-full border border-cinematic-blue/5 scale-[1.5] -z-10" />
      <div className="absolute w-[600px] h-[600px] rounded-full border border-cinematic-blue/10 scale-[1.2] -z-10" />

      <motion.div 
        initial={{ opacity: 0, z: -150, scale: 0.95 }}
        animate={{ opacity: 1, z: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm p-12 material-glass rounded-2xl"
      >
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-8 rounded-full material-crystal flex items-center justify-center shadow-[0_0_30px_rgba(91,140,255,0.2)]">
            <span className="text-cinematic-blue font-light tracking-widest text-xs">VC</span>
          </div>
          <h1 className="text-2xl font-light tracking-[0.3em] text-cinematic-text mb-2">VIBE<span className="text-cinematic-blue">CODING</span></h1>
          <p className="text-[9px] text-cinematic-muted tracking-[0.2em] uppercase">Operations Terminal</p>
        </div>

        {error && (
          <div className="mb-8 p-3 rounded bg-cinematic-danger/10 border border-cinematic-danger/20 text-cinematic-danger text-[10px] text-center font-bold tracking-[0.1em] uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[9px] uppercase tracking-[0.2em] text-cinematic-muted font-bold ml-1">Identity Vector</label>
            <input 
              type="email" 
              className="w-full bg-cinematic-surface-2/50 border border-cinematic-text/10 focus:border-cinematic-blue/50 rounded px-4 py-3 outline-none transition-colors placeholder:text-cinematic-text/20 text-sm font-light"
              placeholder="lead@demo.com"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[9px] uppercase tracking-[0.2em] text-cinematic-muted font-bold ml-1">Security Key</label>
            <input 
              type="password" 
              className="w-full bg-cinematic-surface-2/50 border border-cinematic-text/10 focus:border-cinematic-blue/50 rounded px-4 py-3 outline-none transition-colors placeholder:text-cinematic-text/20 text-sm font-light"
              placeholder="••••••••"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button 
            disabled={loading}
            className="w-full mt-10 bg-cinematic-blue/10 hover:bg-cinematic-blue/20 border border-cinematic-blue/30 text-cinematic-blue font-bold tracking-[0.2em] uppercase text-[10px] py-4 rounded transition-all shadow-[0_0_20px_rgba(91,140,255,0.1)] hover:shadow-[0_0_30px_rgba(91,140,255,0.2)]"
          >
            {loading ? 'Authenticating...' : 'Establish Uplink'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
