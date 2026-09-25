import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitPullRequest, ChevronLeft } from 'lucide-react';
import api from '../api';
import AppShell from '../components/layout/AppShell';
import { CinematicSurface, StatusIndicator } from '../components/ui/Shared';

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

  if (!member) return <AppShell><div className="animate-pulse h-64 material-glass rounded-3xl" /></AppShell>;

  const complete = member.projects.filter((p:any) => p.status === 'completed' || p.status === 'verified').length;
  
  // Define project timeline stages
  const getStageIdx = (status: string) => {
    if (['idea_submitted'].includes(status)) return 0;
    if (['idea_approved', 'in_progress'].includes(status)) return 1;
    if (['pending_verification', 'changes_requested'].includes(status)) return 2;
    if (['verified', 'completed'].includes(status)) return 3;
    return -1;
  };

  return (
    <AppShell>
      <div className="mb-12">
        <Link to="/team" className="inline-flex items-center text-cinematic-muted hover:text-cinematic-text transition-colors text-[10px] tracking-[0.2em] uppercase font-light">
          <ChevronLeft size={14} className="mr-2" /> Back to Overview
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 preserve-3d">
        {/* CENTER MEMBER NODE */}
        <div className="xl:col-span-4 flex flex-col justify-start preserve-3d">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-40 h-40 rounded-full material-crystal flex items-center justify-center relative mb-8 shadow-[0_0_40px_rgba(91,140,255,0.15)]"
          >
            <div className="absolute inset-0 rounded-full border border-cinematic-blue/20 scale-[1.3]" />
            <div className="w-full h-full rounded-full border border-cinematic-blue/40 flex items-center justify-center text-4xl font-extralight text-cinematic-text z-10 bg-cinematic-surface/50 backdrop-blur-md">
              {member.name.substring(0,2).toUpperCase()}
            </div>
          </motion.div>
          
          <h1 className="text-4xl font-extralight text-cinematic-text mb-2 tracking-wide">{member.name}</h1>
          <div className="text-[10px] uppercase tracking-[0.2em] text-cinematic-muted font-bold mb-8">Vibe Operative</div>
          
          <div className="space-y-6 border-l border-cinematic-text/10 pl-6">
             <div>
               <div className="text-2xl font-light text-cinematic-text mb-1">{complete} <span className="text-sm text-cinematic-muted">/ 4</span></div>
               <div className="text-[9px] uppercase tracking-widest text-cinematic-muted">Flow Complete</div>
             </div>
             <div>
               <div className="text-lg font-light text-cinematic-success mb-1">Active</div>
               <div className="text-[9px] uppercase tracking-widest text-cinematic-muted">Group Status</div>
             </div>
          </div>
        </div>

        {/* PROJECT TIMELINES */}
        <div className="xl:col-span-8 flex flex-col gap-10 preserve-3d">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-cinematic-muted font-bold mb-2">Project Continuum</h3>
          
          <div className="space-y-6">
            {member.projects.map((p: any, i: number) => {
              const currentStage = getStageIdx(p.status);
              return (
                <CinematicSurface key={p.id} material="acrylic" className="relative group transition-all hover:translate-z-10 p-6">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h4 className="font-light text-xl text-cinematic-text mb-1 tracking-wide">{p.name || `Project 0${i+1}`}</h4>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-cinematic-muted bg-cinematic-bg px-2 py-1 rounded">{p.domain}</span>
                    </div>
                    <StatusIndicator status={p.status} type="label" />
                  </div>

                  {/* Physical Timeline Representation */}
                  <div className="relative h-[2px] bg-cinematic-surface-2 mb-8 flex justify-between items-center w-full">
                    <div className="absolute left-0 top-0 bottom-0 bg-cinematic-blue/50 transition-all duration-1000" style={{ width: `${Math.max(0, currentStage * 33.33)}%` }} />
                    
                    {['Idea', 'Build', 'Review', 'Verified'].map((stage, idx) => (
                      <div key={idx} className="relative flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full border-2 bg-cinematic-bg z-10 transition-colors duration-500
                          ${idx <= currentStage ? 'border-cinematic-blue shadow-[0_0_10px_rgba(91,140,255,0.8)]' : 'border-cinematic-surface-2'}
                        `} />
                        <span className={`absolute top-6 text-[9px] uppercase tracking-widest whitespace-nowrap
                          ${idx <= currentStage ? 'text-cinematic-text' : 'text-cinematic-muted'}
                        `}>{stage}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6">
                    <p className="text-sm text-cinematic-text-2 font-light mb-6 line-clamp-2">{p.expectedOutcome}</p>
                    
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" className="inline-flex items-center text-xs text-cinematic-muted hover:text-cinematic-text transition-colors border border-cinematic-text/10 px-4 py-2 rounded bg-cinematic-bg mb-6 group-hover:border-cinematic-text/30">
                        <GitPullRequest size={14} className="mr-2 opacity-50" /> Access Source
                      </a>
                    )}

                    <div className="flex gap-4">
                      {p.ideaStatus === 'submitted' && (
                        <>
                          <button onClick={() => verifyIdea(p.id, 'idea_approved')} className="text-[9px] uppercase tracking-[0.2em] font-bold text-cinematic-success border border-cinematic-success/30 hover:bg-cinematic-success/10 px-6 py-2.5 rounded transition-colors">Approve Idea</button>
                          <button onClick={() => verifyIdea(p.id, 'changes_requested')} className="text-[9px] uppercase tracking-[0.2em] font-bold text-cinematic-danger border border-cinematic-danger/30 hover:bg-cinematic-danger/10 px-6 py-2.5 rounded transition-colors">Reject</button>
                        </>
                      )}
                      {p.status === 'pending_verification' && (
                        <>
                          <button onClick={() => verifyProject(p.id, 'verify')} className="text-[9px] uppercase tracking-[0.2em] font-bold text-cinematic-success border border-cinematic-success/30 hover:bg-cinematic-success/10 px-6 py-2.5 rounded transition-colors shadow-[0_0_15px_rgba(73,216,154,0.1)]">Verify Build</button>
                          <button onClick={() => verifyProject(p.id, 'request_modification')} className="text-[9px] uppercase tracking-[0.2em] font-bold text-cinematic-warning border border-cinematic-warning/30 hover:bg-cinematic-warning/10 px-6 py-2.5 rounded transition-colors">Mod Request</button>
                        </>
                      )}
                    </div>
                  </div>
                </CinematicSurface>
              )
            })}
          </div>

          <h3 className="text-[10px] uppercase tracking-[0.2em] text-cinematic-muted font-bold mt-12 mb-6">Group Mission Trace</h3>
          {member.groupContributions.map((c: any) => (
            <CinematicSurface key={c.id} material="acrylic" className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-light text-lg text-cinematic-text tracking-wide">{c.task}</h4>
                <StatusIndicator status={c.status} type="label" />
              </div>
              {c.githubUrl && (
                <a href={c.githubUrl} target="_blank" className="inline-flex items-center text-xs text-cinematic-muted hover:text-cinematic-text transition-colors border border-cinematic-text/10 px-4 py-2 rounded bg-cinematic-bg mt-4">
                  <GitPullRequest size={14} className="mr-2 opacity-50" /> PR Trace Link
                </a>
              )}
            </CinematicSurface>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
