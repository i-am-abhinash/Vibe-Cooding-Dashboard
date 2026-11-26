import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, LockKeyhole, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import api from '../api';

export default function Login(){
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [visible,setVisible]=useState(false);
 const [error,setError]=useState('');
 const [loading,setLoading]=useState(false);
 const navigate=useNavigate();
 const login=async(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();setError('');setLoading(true);try{const res=await api.post('/login',{email,password});localStorage.setItem('token',res.data.token);localStorage.setItem('user',JSON.stringify(res.data.user));navigate(['team_lead','co_lead','admin'].includes(res.data.user.role)?'/team':'/member',{replace:true});}catch(e:any){setError(e.response?.data?.error||'Unable to sign in. Check your connection and credentials.');}finally{setLoading(false);}};
 return <div className="vibe-login">
  <div className="vibe-login-orb" aria-hidden="true"><div/><div/><div/></div>
  <section className="vibe-login-card material-glass">
    <div className="vibe-login-brand"><span className="vibe-mini-orb"><Code2 size={32}/></span><div><strong>VIBE</strong><small>CODING</small></div></div>
    <p className="text-xs uppercase tracking-widest text-cinematic-blue mb-3">Team operations</p>
    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome back</h1><p className="text-sm text-cinematic-muted mb-7">Sign in to your development command centre.</p>
    {error&&<div role="alert" className="glass-panel-danger p-3 rounded-xl mb-4 text-sm text-cinematic-danger">{error}</div>}
    <form onSubmit={login} className="space-y-5">
      <label className="vibe-field"><span>Email address</span><div><Mail size={18}/><input type="email" autoComplete="username" placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)} required/></div></label>
      <label className="vibe-field"><span>Password</span><div><LockKeyhole size={18}/><input type={visible?'text':'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" onClick={()=>setVisible(!visible)} aria-label={visible?'Hide password':'Show password'}>{visible?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
      <button disabled={loading} className="vibe-action w-full justify-center !py-4">{loading?'Signing in…':'Enter workspace'}<ArrowRight size={17}/></button>
    </form>
  </section>
 </div>;
}
