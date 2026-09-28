import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import { GlassCard, Badge, PageHeader } from '../components/ui/Core';
import api from '../api';
import { ChevronLeft, GitPullRequest, Calendar, TrendingUp } from 'lucide-react';

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/members/${id}`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to load member');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <AppShell><div className="animate-pulse h-96 material-glass rounded-3xl" /></AppShell>;
  if (error || !data) return <AppShell><div className="p-4 bg-brand-red/10 text-brand-red rounded-lg">{error}</div></AppShell>;

  const { profile, projects, groupContribution, growth, attendance, modifications } = data;
  
  // Ensure we have exactly 4 slots
  const projectSlots = [0, 1, 2, 3].map(i => projects[i] || null);

  const presentDays = attendance.filter((a:any) => a.status === 'present').length;
  const attendancePct = attendance.length > 0 ? Math.round((presentDays / attendance.length) * 100) : 0;

  return (
    <AppShell>
      <div className="mb-6">
        <button onClick={() => navigate('/team/members')} className="flex items-center gap-1 text-cinematic-muted hover:text-white transition-colors text-sm">
          <ChevronLeft size={16} /> Back to Members
        </button>
      </div>
      
      <PageHeader title={profile.name} subtitle={`${profile.email} • ${profile.registrationNumber || 'No ID'}`}>
        <Badge variant={groupContribution?.active ? 'success' : 'danger'}>
          {groupContribution?.active ? 'Active Contributor' : 'Inactive'}
        </Badge>
        <Badge variant={growth?.status === 'Needs Attention' ? 'danger' : 'info'}>
          {growth?.status}
        </Badge>
      </PageHeader>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: PROJECTS */}
        <div className="xl:col-span-8 space-y-6">
          <h2 className="text-lg font-bold text-white mb-4">Monthly Projects (4 Slots)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectSlots.map((p, i) => (
              <GlassCard key={i} className={!p ? 'border-dashed border-white/10 opacity-50' : ''}>
                {p ? (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-white">Project {i + 1}</div>
                      <Badge variant={p.currentStatus === 'COMPLETED' ? 'success' : p.currentStatus.includes('MODIFICATION') ? 'danger' : 'default'}>
                        {p.currentStatus.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <div className="text-sm text-cinematic-blue mb-1">{p.name || 'Untitled Idea'}</div>
                    <div className="text-xs text-cinematic-text/70 mb-4">{p.description || 'No description yet.'}</div>
                    
                    <div className="mt-auto space-y-2">
                      <div className="w-full bg-cinematic-surface-2 rounded-full h-1 overflow-hidden">
                        <div className="bg-brand-blue-2 h-full" style={{ width: `${p.progressPercentage || 0}%` }} />
                      </div>
                      {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-[10px] text-cinematic-blue hover:underline">GitHub Link</a>}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-6">
                    <div className="text-cinematic-muted text-sm font-bold">Slot {i + 1} Empty</div>
                    <div className="text-xs text-cinematic-text/30">No project submitted</div>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>

          <h2 className="text-lg font-bold text-white mt-8 mb-4">Group Project Contribution</h2>
          <GlassCard>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="font-bold text-white">Evidence Count: {groupContribution?.contributionCount || 0}</div>
                <div className="text-xs text-cinematic-muted">Commits, PRs, Reviews, Requirements</div>
              </div>
            </div>
            {groupContribution?.evidence?.map((ev: string, i: number) => (
              <div key={i} className="flex items-center gap-2 text-sm text-cinematic-text mb-2">
                <GitPullRequest size={14} className="text-brand-blue-2" /> {ev}
              </div>
            ))}
            {groupContribution?.missingEvidence?.map((ev: string, i: number) => (
              <div key={i} className="flex items-center gap-2 text-sm text-brand-red/80 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red" /> {ev}
              </div>
            ))}
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: STATS */}
        <div className="xl:col-span-4 space-y-6">
          <h2 className="text-lg font-bold text-white mb-4">Growth & Accountability</h2>
          
          <GlassCard className="!p-5">
            <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
              <TrendingUp className="text-cinematic-blue" size={20} />
              <div>
                <div className="text-sm font-bold text-white">Growth Model</div>
                <div className="text-xs text-cinematic-muted">Transparent Analysis</div>
              </div>
            </div>
            <ul className="space-y-3">
              {growth?.growthIndicators?.map((ind: string, i: number) => (
                <li key={i} className="text-xs text-cinematic-text flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">+</span> {ind}
                </li>
              ))}
              {growth?.blockers?.map((blk: string, i: number) => (
                <li key={i} className="text-xs text-cinematic-text flex items-start gap-2">
                  <span className="text-brand-red mt-0.5">-</span> {blk}
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="!p-5">
            <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
              <Calendar className="text-purple-400" size={20} />
              <div>
                <div className="text-sm font-bold text-white">Attendance</div>
                <div className="text-xs text-cinematic-muted">{presentDays} / {attendance.length} Days</div>
              </div>
              <div className="ml-auto text-xl font-bold text-white">{attendancePct}%</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {attendance.slice(-14).map((a: any, i: number) => (
                <div key={i} className={`h-6 rounded ${a.status === 'present' ? 'bg-green-500/20 border border-green-500/30' : 'bg-brand-red/20 border border-brand-red/30'}`} title={a.date} />
              ))}
            </div>
          </GlassCard>

          <GlassCard className="!p-5">
            <h3 className="text-sm font-bold text-white mb-3">Open Modifications</h3>
            {modifications.filter((m: any) => m.status === 'OPEN').length === 0 ? (
              <div className="text-xs text-cinematic-muted italic">No open modifications.</div>
            ) : (
              modifications.filter((m: any) => m.status === 'OPEN').map((m: any) => (
                <div key={m.id} className="p-3 bg-brand-red/10 border border-brand-red/20 rounded-lg mb-2">
                  <div className="text-[10px] font-bold text-brand-red mb-1 uppercase">{m.severity} Priority</div>
                  <div className="text-xs text-white">{m.issue}</div>
                </div>
              ))
            )}
          </GlassCard>

        </div>
      </div>
    </AppShell>
  );
}
