import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, GitPullRequest } from 'lucide-react';
import api from '../api';
import AppShell from '../components/layout/AppShell';
import { GlassCard, StatusBadge } from '../components/ui/Shared';

export default function MemberDetail() {
  const { id } = useParams();
  const [member, setMember] = useState<any>(null);
  const [riskReasons, setRiskReasons] = useState<string[]>([]);

  useEffect(() => {
    api.get(`/members/${id}`).then(res => setMember(res.data)).catch(console.error);
    api.get(`/members/${id}/risk`).then(res => setRiskReasons(res.data.riskReasons)).catch(console.error);
  }, [id]);

  const verifyIdea = async (projectId: string, status: string) => {
    await api.post(`/projects/${projectId}/review-idea`, { status, comments: '' });
    window.location.reload();
  };

  const verifyProject = async (projectId: string, action: string) => {
    await api.post(`/projects/${projectId}/verify`, { action, comments: 'Verified by Lead' });
    window.location.reload();
  };

  if (!member) {
    return (
      <AppShell title="Loading">
        <div className="animate-pulse space-y-8"><div className="h-40 bg-surface-elevated/50 rounded-3xl" /></div>
      </AppShell>
    );
  }

  const complete = member.projects.filter((p:any) => p.status === 'completed' || p.status === 'verified').length;
  const att = member.attendance.length ? Math.round((member.attendance.filter((a:any) => a.status === 'present').length / member.attendance.length) * 100) : 100;

  return (
    <AppShell title={`${member.name} Profile`}>
      <div className="mb-6">
        <Link to="/team" className="inline-flex items-center text-text-muted hover:text-primary transition-colors text-sm font-semibold tracking-wider uppercase">
          <ArrowLeft size={16} className="mr-2" /> Back to Command Center
        </Link>
      </div>

      {/* MEMBER HERO */}
      <div className="glass-panel rounded-3xl p-8 mb-8 flex items-start justify-between relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-glow rounded-full blur-[80px] pointer-events-none" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-full bg-surface-elevated border-2 border-primary flex items-center justify-center text-3xl font-bold text-primary shadow-[0_0_20px_var(--color-primary-glow)]">
            {member.name.substring(0,2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold">{member.name}</h1>
              <span className="px-2 py-1 bg-surface-elevated border border-border rounded text-[10px] tracking-widest uppercase text-text-muted">Vibe Member</span>
            </div>
            <div className="flex gap-6 mt-4">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-text-muted mb-1">Projects</span>
                <span className="font-bold text-lg">{complete}/4</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-text-muted mb-1">Group Status</span>
                <StatusBadge status={member.groupContributions[0]?.status || 'None'} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-text-muted mb-1">Attendance</span>
                <span className={`font-bold text-lg ${att < 80 ? 'text-danger' : 'text-success'}`}>{att}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ATTENTION REQUIRED */}
      {riskReasons.length > 0 && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8">
          <div className="glass-panel border-danger/30 bg-danger/5 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-danger" />
            <h3 className="text-danger font-bold flex items-center mb-3 tracking-wider uppercase text-sm"><AlertTriangle size={18} className="mr-2" /> Attention Required</h3>
            <ul className="space-y-2">
              {riskReasons.map((r, i) => (
                <li key={i} className="text-sm flex items-center text-danger/80">
                  <span className="w-1.5 h-1.5 bg-danger rounded-full mr-2" /> {r}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* INDIVIDUAL PROJECTS */}
      <h3 className="text-xl font-bold mb-6 flex items-center mt-12"><span className="w-2 h-6 bg-primary rounded-full mr-3" /> Individual Projects</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {member.projects.map((p: any) => (
          <GlassCard key={p.id} className="relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-lg mb-1">{p.name || 'Untitled Project'}</h4>
                <div className="flex gap-2 text-xs text-text-muted">
                  <span className="bg-surface-elevated px-2 py-0.5 rounded">{p.domain}</span>
                </div>
              </div>
              <StatusBadge status={p.status} />
            </div>
            
            <p className="text-sm text-text-muted mb-6">Outcome: {p.expectedOutcome}</p>
            
            {p.githubUrl && (
              <div className="flex gap-3 mb-6">
                <a href={p.githubUrl} target="_blank" className="flex items-center text-sm text-text-muted hover:text-white transition-colors bg-surface-elevated px-3 py-1.5 rounded-lg border border-border">
                  <GitPullRequest size={16} className="mr-2" /> Repository
                </a>
              </div>
            )}

            <div className="border-t border-border/50 pt-4 mt-auto">
              {p.ideaStatus === 'submitted' && (
                <div className="flex gap-3">
                  <button onClick={() => verifyIdea(p.id, 'idea_approved')} className="flex-1 bg-success/20 hover:bg-success/30 text-success border border-success/30 px-3 py-2 rounded-xl text-sm font-bold transition-all">Approve Idea</button>
                  <button onClick={() => verifyIdea(p.id, 'changes_requested')} className="flex-1 bg-danger/20 hover:bg-danger/30 text-danger border border-danger/30 px-3 py-2 rounded-xl text-sm font-bold transition-all">Reject</button>
                </div>
              )}
              {p.status === 'pending_verification' && (
                <div className="flex gap-3">
                  <button onClick={() => verifyProject(p.id, 'verify')} className="flex-1 bg-success/20 hover:bg-success/30 text-success border border-success/30 px-3 py-2 rounded-xl text-sm font-bold transition-all">Verify Project</button>
                  <button onClick={() => verifyProject(p.id, 'request_modification')} className="flex-1 bg-warning/20 hover:bg-warning/30 text-warning border border-warning/30 px-3 py-2 rounded-xl text-sm font-bold transition-all">Request Mod</button>
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* GROUP CONTRIBUTION */}
      <h3 className="text-xl font-bold mb-6 flex items-center"><span className="w-2 h-6 bg-secondary rounded-full mr-3" /> Group Contribution</h3>
      {member.groupContributions.map((c: any) => (
        <GlassCard key={c.id} className="mb-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-widest text-text-muted font-bold mb-1">Assigned Task</p>
              <p className="font-bold text-lg mb-4">{c.task}</p>
              {c.githubUrl && (
                <a href={c.githubUrl} target="_blank" className="inline-flex items-center text-sm text-text-muted hover:text-white transition-colors bg-surface-elevated px-3 py-1.5 rounded-lg border border-border">
                  <GitPullRequest size={16} className="mr-2" /> View PR / Contribution
                </a>
              )}
            </div>
            <StatusBadge status={c.status} />
          </div>
        </GlassCard>
      ))}
    </AppShell>
  );
}
