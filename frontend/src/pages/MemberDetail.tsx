import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, GitPullRequest } from 'lucide-react';
import api from '../api';
import AppShell from '../components/layout/AppShell';
import { FluxSurface, StatusIndicator } from '../components/ui/Shared';

export default function MemberDetail() {
  const { id } = useParams();
  const [member, setMember] = useState<any>(null);

  useEffect(() => {
    api.get(`/members/${id}`).then(res => setMember(res.data)).catch(console.error);
  }, [id]);

  const verifyIdea = async (projectId: string, status: string) => {
    await api.post(`/projects/${projectId}/review-idea`, { status, comments: '' });
    window.location.reload();
  };

  const verifyProject = async (projectId: string, action: string) => {
    await api.post(`/projects/${projectId}/verify`, { action, comments: 'Verified by Lead' });
    window.location.reload();
  };

  if (!member) return <AppShell><div className="animate-pulse h-64 flux-panel rounded-3xl" /></AppShell>;

  const complete = member.projects.filter((p:any) => p.status === 'completed' || p.status === 'verified').length;

  return (
    <AppShell>
      <div className="mb-6">
        <Link to="/team" className="inline-flex items-center text-flux-muted hover:text-flux-accent transition-colors text-[10px] font-bold tracking-widest uppercase">
          <ArrowLeft size={14} className="mr-2" /> Return to Core
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 preserve-3d">
        {/* CENTER MEMBER NODE */}
        <div className="xl:col-span-4 flex flex-col items-center justify-center py-12 preserve-3d">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-48 h-48 rounded-full border border-flux-accent/30 flex items-center justify-center relative mb-8 shadow-[0_0_50px_rgba(200,255,61,0.1)]"
          >
            <div className="absolute inset-0 rounded-full border border-flux-accent/10 scale-[1.2]" />
            <div className="absolute inset-0 rounded-full border border-flux-accent/5 scale-[1.4]" />
            <div className="w-32 h-32 rounded-full bg-flux-surface-2 flex items-center justify-center text-4xl font-light text-flux-accent z-10 border border-flux-accent/50">
              {member.name.substring(0,2).toUpperCase()}
            </div>
          </motion.div>
          
          <h1 className="text-3xl font-light mb-2">{member.name}</h1>
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-widest text-flux-muted font-bold px-3 py-1 border border-flux-text/10 rounded-full">Member Node</span>
            <span className="text-[10px] uppercase tracking-widest text-flux-muted font-bold px-3 py-1 border border-flux-text/10 rounded-full">{complete}/4 Flow</span>
          </div>
        </div>

        {/* PROJECT SPINE */}
        <div className="xl:col-span-8 flex flex-col gap-6 preserve-3d">
          <h3 className="text-[10px] uppercase tracking-widest text-flux-muted font-bold pl-6 border-l border-flux-accent/30">Project Continuum</h3>
          
          <div className="space-y-4">
            {member.projects.map((p: any, i: number) => (
              <FluxSurface key={p.id} className="flex flex-col relative group transform transition-all hover:translate-x-2">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-flux-accent/20 group-hover:bg-flux-accent transition-colors rounded-l-xl" />
                
                <div className="flex justify-between items-start mb-4 pl-4">
                  <div>
                    <h4 className="font-bold text-lg text-flux-text mb-1">{p.name || `Project 0${i+1}`}</h4>
                    <span className="text-[10px] uppercase tracking-widest text-flux-muted">{p.domain}</span>
                  </div>
                  <StatusIndicator status={p.status} type="label" />
                </div>

                <div className="pl-4">
                  <p className="text-sm text-flux-muted mb-4">{p.expectedOutcome}</p>
                  
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" className="inline-flex items-center text-xs text-flux-muted hover:text-flux-text transition-colors border border-flux-text/20 px-3 py-1.5 rounded bg-flux-surface-2 mb-4">
                      <GitPullRequest size={14} className="mr-2" /> Source
                    </a>
                  )}

                  <div className="flex gap-4">
                    {p.ideaStatus === 'submitted' && (
                      <>
                        <button onClick={() => verifyIdea(p.id, 'idea_approved')} className="text-[10px] uppercase tracking-widest font-bold text-flux-success hover:text-flux-bg hover:bg-flux-success border border-flux-success px-4 py-2 rounded transition-colors">Approve Logic</button>
                        <button onClick={() => verifyIdea(p.id, 'changes_requested')} className="text-[10px] uppercase tracking-widest font-bold text-flux-danger hover:text-flux-bg hover:bg-flux-danger border border-flux-danger px-4 py-2 rounded transition-colors">Reject</button>
                      </>
                    )}
                    {p.status === 'pending_verification' && (
                      <>
                        <button onClick={() => verifyProject(p.id, 'verify')} className="text-[10px] uppercase tracking-widest font-bold text-flux-success hover:text-flux-bg hover:bg-flux-success border border-flux-success px-4 py-2 rounded transition-colors">Verify Build</button>
                        <button onClick={() => verifyProject(p.id, 'request_modification')} className="text-[10px] uppercase tracking-widest font-bold text-flux-warning hover:text-flux-bg hover:bg-flux-warning border border-flux-warning px-4 py-2 rounded transition-colors">Mod Request</button>
                      </>
                    )}
                  </div>
                </div>
              </FluxSurface>
            ))}
          </div>

          <h3 className="text-[10px] uppercase tracking-widest text-flux-muted font-bold pl-6 border-l border-flux-accent-warm/30 mt-8">Mission Contribution</h3>
          {member.groupContributions.map((c: any) => (
            <FluxSurface key={c.id} className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-flux-accent-warm/20 rounded-l-xl" />
              <div className="pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg">{c.task}</h4>
                  <StatusIndicator status={c.status} type="label" />
                </div>
                {c.githubUrl && (
                  <a href={c.githubUrl} target="_blank" className="inline-flex items-center text-xs text-flux-muted hover:text-flux-text transition-colors border border-flux-text/20 px-3 py-1.5 rounded bg-flux-surface-2 mt-2">
                    <GitPullRequest size={14} className="mr-2" /> PR Trace
                  </a>
                )}
              </div>
            </FluxSurface>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
