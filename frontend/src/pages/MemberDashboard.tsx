import { useEffect, useState } from 'react';
import { Play, Send, GitPullRequest } from 'lucide-react';
import api from '../api';
import AppShell from '../components/layout/AppShell';
import { FluxSurface, StatusIndicator } from '../components/ui/Shared';

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
      alert(err.response?.data?.error);
    }
  };

  if (!data) return <AppShell><div className="animate-pulse h-64 flux-panel rounded-3xl" /></AppShell>;

  const { member, cycle } = data;
  const projects = member.projects || [];
  const slots = [0,1,2,3].map(i => projects[i] || null);

  return (
    <AppShell cycle={cycle}>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 preserve-3d">
        
        {/* PROJECT SPINE (LEFT) */}
        <div className="xl:col-span-8 flex flex-col gap-8 preserve-3d relative">
          <div className="absolute left-6 top-8 bottom-8 w-[1px] bg-flux-text/10 -z-10" />
          <h2 className="text-[10px] uppercase tracking-widest text-flux-muted font-bold pl-12">Project Continuum</h2>
          
          {slots.map((p: any, i) => (
            <div key={i} className="flex relative items-start group">
              {/* Spine Node */}
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center relative mt-2">
                <div className={`w-3 h-3 rounded-full ${p ? 'bg-flux-accent shadow-[0_0_10px_var(--color-flux-accent)]' : 'bg-flux-surface-2 border border-flux-text/20'}`} />
              </div>
              
              <div className="flex-1 pl-4 preserve-3d">
                {p ? (
                  <FluxSurface className="transform hover:translate-x-2 hover:translate-z-10 transition-transform">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{p.name}</h3>
                        <span className="text-[10px] uppercase tracking-widest text-flux-muted border border-flux-text/10 px-2 py-0.5 rounded">{p.domain}</span>
                      </div>
                      <StatusIndicator status={p.status} type="label" />
                    </div>
                    <p className="text-sm text-flux-muted mb-6">{p.expectedOutcome}</p>
                    
                    <div className="flex gap-4">
                      {p.status === 'idea_approved' && (
                        <button onClick={() => startProject(p.id)} className="text-[10px] uppercase tracking-widest font-bold text-flux-bg bg-flux-accent hover:bg-flux-accent/90 px-4 py-2 rounded transition-colors flex items-center">
                          <Play size={12} className="mr-2" /> Initialize
                        </button>
                      )}
                      {p.status === 'in_progress' && (
                        <form onSubmit={(e) => submitProject(e, p.id)} className="flex w-full gap-4">
                          <input name="githubUrl" type="url" placeholder="Source URL" required className="flex-1 bg-flux-surface-2 border border-flux-text/10 focus:border-flux-accent rounded px-3 py-2 text-sm outline-none text-flux-text" />
                          <button className="text-[10px] uppercase tracking-widest font-bold text-flux-bg bg-flux-accent hover:bg-flux-accent/90 px-4 py-2 rounded transition-colors flex items-center whitespace-nowrap">
                            <Send size={12} className="mr-2" /> Transmit
                          </button>
                        </form>
                      )}
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" className="inline-flex items-center text-xs text-flux-muted hover:text-flux-text transition-colors border border-flux-text/20 px-3 py-2 rounded bg-flux-surface-2">
                          <GitPullRequest size={14} className="mr-2" /> Trace Source
                        </a>
                      )}
                    </div>
                  </FluxSurface>
                ) : (
                  <FluxSurface className="opacity-50 hover:opacity-100 transition-opacity">
                    <form onSubmit={createIdea} className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] uppercase tracking-widest text-flux-muted font-bold">Unallocated Slot</span>
                      </div>
                      <div className="flex gap-4">
                        <input name="name" placeholder="Designation" required className="flex-1 bg-flux-surface-2 border border-flux-text/10 focus:border-flux-accent rounded px-3 py-2 text-sm outline-none text-flux-text" />
                        <input name="domain" placeholder="Vector" required className="flex-1 bg-flux-surface-2 border border-flux-text/10 focus:border-flux-accent rounded px-3 py-2 text-sm outline-none text-flux-text" />
                      </div>
                      <textarea name="expectedOutcome" placeholder="Expected Parameters" rows={2} required className="w-full bg-flux-surface-2 border border-flux-text/10 focus:border-flux-accent rounded px-3 py-2 text-sm outline-none text-flux-text resize-none" />
                      <button className="w-full text-[10px] uppercase tracking-widest font-bold text-flux-muted hover:text-flux-accent border border-flux-text/20 hover:border-flux-accent px-4 py-2 rounded transition-colors">
                        Draft Proposition
                      </button>
                    </form>
                  </FluxSurface>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* GROUP MISSION (RIGHT) */}
        <div className="xl:col-span-4 preserve-3d">
           <h2 className="text-[10px] uppercase tracking-widest text-flux-muted font-bold mb-8">Group Mission Control</h2>
           <FluxSurface className="border-t-2 border-t-flux-accent-warm/50 relative overflow-hidden transform hover:translate-z-10 transition-transform">
             <div className="absolute top-0 right-0 w-32 h-32 bg-flux-accent-warm/10 blur-[50px] rounded-full -z-10" />
             
             {member.groupContributions.length > 0 ? member.groupContributions.map((c: any) => (
               <div key={c.id}>
                 <StatusIndicator status={c.status} type="label" />
                 <h3 className="text-2xl font-light mt-4 mb-6">{c.task}</h3>
                 
                 {c.githubUrl ? (
                   <div>
                     <p className="text-[10px] uppercase tracking-widest text-flux-success font-bold mb-2">Payload Delivered</p>
                     <a href={c.githubUrl} target="_blank" className="inline-flex items-center text-xs text-flux-text transition-colors border border-flux-text/20 px-3 py-2 rounded bg-flux-surface-2 w-full truncate">
                       <GitPullRequest size={14} className="mr-2 flex-shrink-0" /> {c.githubUrl}
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
                      <input name="githubUrl" type="url" placeholder="PR Payload URL" required className="w-full bg-flux-surface-2 border border-flux-text/10 focus:border-flux-accent-warm rounded px-3 py-2 text-sm outline-none text-flux-text mb-4" />
                      <button className="w-full text-[10px] uppercase tracking-widest font-bold text-flux-bg bg-flux-accent-warm hover:bg-flux-accent-warm/90 px-4 py-2 rounded transition-colors flex items-center justify-center">
                        Execute Commit
                      </button>
                    </form>
                 )}
               </div>
             )) : <p className="text-sm text-flux-muted">No mission parameters assigned.</p>}
           </FluxSurface>
        </div>
      </div>
    </AppShell>
  );
}
