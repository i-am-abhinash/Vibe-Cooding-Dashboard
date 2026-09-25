import { useEffect, useState } from 'react';
import { Plus, Check, Play, Send, GitPullRequest } from 'lucide-react';
import api from '../api';
import AppShell from '../components/layout/AppShell';
import { GlassCard, StatusBadge } from '../components/ui/Shared';

export default function MemberDashboard() {
  const [data, setData] = useState<any>(null);

  const fetchDashboard = () => api.get('/my-dashboard').then(res => setData(res.data)).catch(console.error);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const createIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as any;
    await api.post('/projects/idea', {
      name: target.name.value,
      domain: target.domain.value,
      expectedOutcome: target.expectedOutcome.value,
      cycleId: data.cycle.id
    });
    fetchDashboard();
  };

  const startProject = async (id: string) => {
    await api.post(`/projects/${id}/start`);
    fetchDashboard();
  };

  const submitProject = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    const target = e.target as any;
    try {
      await api.post(`/projects/${id}/submit`, { githubUrl: target.githubUrl.value });
      fetchDashboard();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error submitting project');
    }
  };

  if (!data) return <AppShell title="Loading"><div className="animate-pulse h-64 bg-surface-elevated/50 rounded-3xl" /></AppShell>;

  const { member, cycle } = data;
  const projects = member.projects || [];
  const slots = [0,1,2,3].map(i => projects[i] || null);

  return (
    <AppShell title="My Workspace" cycle={cycle}>
      <h2 className="text-2xl font-bold mb-6 flex items-center"><span className="w-2 h-6 bg-primary rounded-full mr-3" /> Individual Projects</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {slots.map((p: any, i) => (
          <GlassCard key={i} className="flex flex-col h-[380px] relative group overflow-hidden">
            {p ? (
              <>
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -z-10" />
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-text-muted tracking-widest">SLOT 0{i+1}</span>
                  <StatusBadge status={p.status} />
                </div>
                
                <h3 className="font-bold text-lg mb-2 leading-tight">{p.name}</h3>
                <div className="flex gap-2 mb-4">
                  <span className="text-[10px] uppercase tracking-widest bg-surface-elevated px-2 py-1 rounded text-text-muted border border-border">{p.domain}</span>
                </div>
                
                <p className="text-sm text-text-muted mb-auto line-clamp-3">{p.expectedOutcome}</p>

                <div className="mt-6 border-t border-border/50 pt-4">
                  {p.status === 'idea_approved' && (
                    <button onClick={() => startProject(p.id)} className="w-full flex items-center justify-center bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 py-2.5 rounded-xl transition-all font-bold text-sm">
                      <Play size={16} className="mr-2" /> Start Development
                    </button>
                  )}

                  {p.status === 'in_progress' && (
                    <form onSubmit={(e) => submitProject(e, p.id)} className="space-y-3">
                      <input name="githubUrl" type="url" placeholder="GitHub URL (Required)" required className="w-full bg-surface-elevated/50 border border-border focus:border-primary rounded-xl px-3 py-2 text-sm outline-none transition-all placeholder:text-border" />
                      <button type="submit" className="w-full flex items-center justify-center bg-success/20 hover:bg-success/30 text-success border border-success/30 py-2.5 rounded-xl transition-all font-bold text-sm">
                        <Send size={16} className="mr-2" /> Submit for Verification
                      </button>
                    </form>
                  )}
                  
                  {['pending_verification', 'verified', 'completed'].includes(p.status) && (
                     <div className="flex justify-center">
                        <a href={p.githubUrl} target="_blank" className="text-xs font-bold text-text-muted hover:text-white transition-colors flex items-center uppercase tracking-widest bg-surface-elevated px-4 py-2 rounded-lg border border-border">
                          <GitPullRequest size={14} className="mr-2" /> View Repository
                        </a>
                     </div>
                  )}
                </div>
              </>
            ) : (
              <form onSubmit={createIdea} className="flex flex-col h-full opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xs font-bold text-text-muted tracking-widest">SLOT 0{i+1}</span>
                  <span className="text-[10px] font-bold text-border uppercase tracking-widest border border-border px-2 py-0.5 rounded-full">EMPTY</span>
                </div>
                
                <div className="space-y-3 mb-auto">
                  <input name="name" placeholder="Project Name" required className="w-full bg-surface-elevated/30 border border-border focus:border-primary rounded-xl px-3 py-2 text-sm outline-none transition-all" />
                  <input name="domain" placeholder="Domain (e.g. Backend)" required className="w-full bg-surface-elevated/30 border border-border focus:border-primary rounded-xl px-3 py-2 text-sm outline-none transition-all" />
                  <textarea name="expectedOutcome" placeholder="Expected Outcome" rows={3} required className="w-full bg-surface-elevated/30 border border-border focus:border-primary rounded-xl px-3 py-2 text-sm outline-none transition-all resize-none" />
                </div>
                
                <button type="submit" className="w-full mt-4 flex items-center justify-center bg-surface-elevated border border-border hover:border-primary hover:text-primary py-2.5 rounded-xl transition-all font-bold text-sm text-text-muted">
                  <Plus size={16} className="mr-2" /> Submit Idea
                </button>
              </form>
            )}
          </GlassCard>
        ))}
      </div>
      
      <h2 className="text-2xl font-bold mb-6 flex items-center"><span className="w-2 h-6 bg-secondary rounded-full mr-3" /> Group Contribution</h2>
      <GlassCard className="max-w-3xl border-secondary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] -z-10" />
        
        {member.groupContributions.length > 0 ? member.groupContributions.map((c: any) => (
          <div key={c.id} className="flex flex-col md:flex-row gap-8">
             <div className="flex-1">
               <p className="text-xs uppercase tracking-widest text-text-muted font-bold mb-2">Assigned Task</p>
               <h3 className="text-2xl font-bold mb-4">{c.task}</h3>
               <div className="inline-block mb-6"><StatusBadge status={c.status} /></div>
             </div>
             
             <div className="flex-1 md:border-l md:border-border md:pl-8">
               {c.githubUrl ? (
                 <div>
                   <p className="text-xs uppercase tracking-widest text-success font-bold mb-2">Contribution Submitted</p>
                   <a href={c.githubUrl} target="_blank" className="inline-flex items-center text-sm font-bold bg-surface-elevated px-4 py-3 rounded-xl border border-border hover:border-primary transition-all">
                     <GitPullRequest size={18} className="mr-3 text-text-muted" /> {c.githubUrl}
                   </a>
                 </div>
               ) : c.status === 'assigned' && (
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const target = e.target as any;
                    try {
                      await api.post(`/group-contributions/${c.id}/submit`, { githubUrl: target.githubUrl.value });
                      fetchDashboard();
                    } catch (err: any) { alert(err.response?.data?.error); }
                  }}>
                    <p className="text-xs uppercase tracking-widest text-text-muted font-bold mb-3">Submit Contribution</p>
                    <input name="githubUrl" type="url" placeholder="GitHub PR / Branch URL" required className="w-full bg-surface-elevated/50 border border-border focus:border-secondary rounded-xl px-4 py-3 outline-none transition-all mb-3" />
                    <button className="w-full flex items-center justify-center bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 py-3 rounded-xl transition-all font-bold text-sm">
                      <Check size={18} className="mr-2" /> Submit PR
                    </button>
                  </form>
               )}
             </div>
          </div>
        )) : <p className="text-text-muted">No group task assigned yet.</p>}
      </GlassCard>
    </AppShell>
  );
}
