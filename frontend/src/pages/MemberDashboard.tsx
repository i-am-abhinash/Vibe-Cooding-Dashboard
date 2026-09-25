import { useEffect, useState } from 'react';
import { Play, Send, GitPullRequest } from 'lucide-react';
import api from '../api';
import AppShell from '../components/layout/AppShell';
import { CinematicSurface, StatusIndicator } from '../components/ui/Shared';

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

  if (!data) return <AppShell><div className="animate-pulse h-64 material-glass rounded-3xl" /></AppShell>;

  const { member, cycle } = data;
  const projects = member.projects || [];
  const slots = [0,1,2,3].map(i => projects[i] || null);

  return (
    <AppShell cycle={cycle}>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 preserve-3d">
        
        {/* PROJECT SPINE (LEFT) */}
        <div className="xl:col-span-8 flex flex-col gap-10 preserve-3d relative">
          <div className="absolute left-6 top-8 bottom-8 w-[1px] bg-cinematic-text/5 -z-10" />
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-cinematic-muted font-bold pl-16">Project Continuum</h2>
          
          {slots.map((p: any, i) => (
            <div key={i} className="flex relative items-start group preserve-3d">
              {/* Spine Node */}
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center relative mt-4">
                <div className={`w-3 h-3 rounded-full ${p ? 'bg-cinematic-blue shadow-[0_0_15px_rgba(91,140,255,0.8)]' : 'bg-cinematic-surface-2 border border-cinematic-text/20'}`} />
              </div>
              
              <div className="flex-1 pl-6 preserve-3d w-full max-w-[800px]">
                {p ? (
                  <CinematicSurface material="acrylic" className="transform hover:translate-z-10 hover:translate-x-2 transition-transform duration-500 p-8 w-full">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-light tracking-wide text-cinematic-text mb-2">{p.name}</h3>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-cinematic-muted bg-cinematic-bg px-2 py-1 rounded border border-cinematic-text/5">{p.domain}</span>
                      </div>
                      <StatusIndicator status={p.status} type="label" />
                    </div>
                    <p className="text-sm font-light text-cinematic-text-2 mb-8 leading-relaxed">{p.expectedOutcome}</p>
                    
                    <div className="flex gap-4">
                      {p.status === 'idea_approved' && (
                        <button onClick={() => startProject(p.id)} className="text-[10px] uppercase tracking-[0.2em] font-bold text-cinematic-bg bg-cinematic-blue hover:bg-cinematic-blue/90 px-6 py-3 rounded transition-colors flex items-center shadow-[0_0_20px_rgba(91,140,255,0.4)]">
                          <Play size={12} className="mr-2" /> Initialize Build
                        </button>
                      )}
                      {p.status === 'in_progress' && (
                        <form onSubmit={(e) => submitProject(e, p.id)} className="flex w-full gap-4 max-w-lg">
                          <input name="githubUrl" type="url" placeholder="GitHub Repository URL" required className="flex-1 bg-cinematic-surface-2 border border-cinematic-text/10 focus:border-cinematic-blue rounded px-4 py-3 text-sm outline-none text-cinematic-text transition-colors" />
                          <button className="text-[10px] uppercase tracking-[0.2em] font-bold text-cinematic-bg bg-cinematic-blue hover:bg-cinematic-blue/90 px-6 py-3 rounded transition-colors flex items-center whitespace-nowrap shadow-[0_0_15px_rgba(91,140,255,0.3)]">
                            <Send size={12} className="mr-2" /> Transmit
                          </button>
                        </form>
                      )}
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" className="inline-flex items-center text-xs text-cinematic-muted hover:text-cinematic-text transition-colors border border-cinematic-text/10 hover:border-cinematic-text/30 px-4 py-2.5 rounded bg-cinematic-bg">
                          <GitPullRequest size={14} className="mr-2 opacity-50" /> Trace Source
                        </a>
                      )}
                    </div>
                  </CinematicSurface>
                ) : (
                  <CinematicSurface className="opacity-40 hover:opacity-100 transition-opacity duration-500 p-8 w-full max-w-[800px]">
                    <form onSubmit={createIdea} className="space-y-6">
                      <div className="flex justify-between items-center mb-2 border-b border-cinematic-text/5 pb-4">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-cinematic-muted font-bold">Unallocated Buffer</span>
                      </div>
                      <div className="flex gap-6">
                        <input name="name" placeholder="Designation" required className="flex-1 bg-cinematic-surface-2 border border-cinematic-text/5 focus:border-cinematic-blue/50 rounded px-4 py-3 text-sm outline-none text-cinematic-text transition-colors" />
                        <input name="domain" placeholder="Vector / Stack" required className="w-1/3 bg-cinematic-surface-2 border border-cinematic-text/5 focus:border-cinematic-blue/50 rounded px-4 py-3 text-sm outline-none text-cinematic-text transition-colors" />
                      </div>
                      <textarea name="expectedOutcome" placeholder="Expected Parameters & Outcome" rows={2} required className="w-full bg-cinematic-surface-2 border border-cinematic-text/5 focus:border-cinematic-blue/50 rounded px-4 py-3 text-sm outline-none text-cinematic-text resize-none transition-colors" />
                      <button className="w-full text-[10px] uppercase tracking-[0.2em] font-bold text-cinematic-muted hover:text-cinematic-text border border-cinematic-text/10 hover:border-cinematic-text/30 bg-cinematic-surface-2 px-4 py-3 rounded transition-colors">
                        Draft Proposition
                      </button>
                    </form>
                  </CinematicSurface>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* GROUP MISSION (RIGHT) */}
        <div className="xl:col-span-4 preserve-3d">
           <h2 className="text-[10px] uppercase tracking-[0.2em] text-cinematic-muted font-bold mb-8">Group Mission Control</h2>
           <CinematicSurface material="crystal" className="relative overflow-hidden transform hover:translate-z-10 transition-transform duration-500">
             
             {member.groupContributions.length > 0 ? member.groupContributions.map((c: any) => (
               <div key={c.id}>
                 <StatusIndicator status={c.status} type="label" />
                 <h3 className="text-3xl font-extralight tracking-wide mt-6 mb-8 text-cinematic-text">{c.task}</h3>
                 
                 {c.githubUrl ? (
                   <div>
                     <p className="text-[9px] uppercase tracking-[0.2em] text-cinematic-success font-bold mb-3">Payload Delivered</p>
                     <a href={c.githubUrl} target="_blank" className="inline-flex items-center text-xs text-cinematic-text-2 hover:text-cinematic-text transition-colors border border-cinematic-text/10 px-4 py-3 rounded bg-cinematic-surface-2 w-full truncate">
                       <GitPullRequest size={14} className="mr-3 flex-shrink-0 opacity-50" /> {c.githubUrl}
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
                      <input name="githubUrl" type="url" placeholder="PR Payload URL" required className="w-full bg-cinematic-surface-2 border border-cinematic-text/10 focus:border-cinematic-blue/50 rounded px-4 py-3 text-sm outline-none text-cinematic-text mb-4 transition-colors" />
                      <button className="w-full text-[10px] uppercase tracking-[0.2em] font-bold text-cinematic-blue border border-cinematic-blue/30 hover:bg-cinematic-blue/10 px-4 py-3 rounded transition-colors flex items-center justify-center">
                        Execute Commit
                      </button>
                    </form>
                 )}
               </div>
             )) : <p className="text-sm font-light text-cinematic-muted">No mission parameters assigned.</p>}
           </CinematicSurface>
        </div>
      </div>
    </AppShell>
  );
}
