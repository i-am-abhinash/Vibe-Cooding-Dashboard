import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import { GlassCard, Badge, PageHeader } from '../components/ui/Core';
import api from '../api';
import { CheckCircle2, Circle, XCircle, AlertCircle, GitPullRequest } from 'lucide-react';

export default function GroupProjectView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/group')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to load group project');
        setLoading(false);
      });
  }, []);

  if (loading) return <AppShell><div className="animate-pulse h-96 material-glass rounded-3xl" /></AppShell>;
  if (error) return <AppShell><div className="p-4 bg-brand-red/10 text-brand-red rounded-lg">{error}</div></AppShell>;
  if (!data?.project) return <AppShell><div className="p-12 text-center text-cinematic-muted">No active group project found.</div></AppShell>;

  const { project, requirements, tests, contributions, requirementEvaluation, functionalityEvaluation } = data;

  return (
    <AppShell>
      <PageHeader title={project.name || 'Group Project'} subtitle={project.description || 'Core collaborative team initiative'} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <GlassCard className="flex flex-col items-center justify-center p-6 text-center">
          <div className="text-4xl font-bold text-white mb-2">{requirementEvaluation.requirementSatisfactionPercentage}%</div>
          <div className="text-[10px] uppercase tracking-widest text-cinematic-muted font-bold">Req. Satisfaction</div>
          <div className="text-xs text-cinematic-text/50 mt-1">{requirementEvaluation.requirementsVerified} / {requirementEvaluation.requirementsTotal} Verified</div>
        </GlassCard>
        
        <GlassCard className="flex flex-col items-center justify-center p-6 text-center">
          <div className="text-4xl font-bold text-white mb-2">{functionalityEvaluation.functionalityPassRate}%</div>
          <div className="text-[10px] uppercase tracking-widest text-cinematic-muted font-bold">Functionality Pass Rate</div>
          <div className="text-xs text-cinematic-text/50 mt-1">{functionalityEvaluation.passedTests} / {functionalityEvaluation.totalTests} Passing</div>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center p-6 text-center">
          <div className="text-4xl font-bold text-white mb-2">{contributions.length}</div>
          <div className="text-[10px] uppercase tracking-widest text-cinematic-muted font-bold">Total Contributions</div>
          <div className="text-xs text-cinematic-text/50 mt-1">Across active team members</div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Requirements */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-cinematic-blue" />
            Requirement Checklist
          </h2>
          {requirements.map((req: any) => (
            <div key={req.id} className="flex items-start gap-3 p-4 rounded-xl bg-cinematic-surface-2/20 border border-white/5">
              {req.status === 'VERIFIED' ? (
                <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" />
              ) : req.status === 'FAILED' ? (
                <XCircle size={18} className="text-brand-red shrink-0 mt-0.5" />
              ) : (
                <Circle size={18} className="text-cinematic-muted shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm text-white mb-1">{req.title}</p>
                <p className="text-xs text-cinematic-muted">{req.description}</p>
              </div>
              <div className="ml-auto">
                <Badge variant={req.status === 'VERIFIED' ? 'success' : req.status === 'FAILED' ? 'danger' : 'default'}>
                  {req.status.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Functionality Tests */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-brand-red" />
            Functionality Verification
          </h2>
          {tests.map((test: any) => (
            <div key={test.id} className="flex items-start gap-3 p-4 rounded-xl bg-cinematic-surface-2/20 border border-white/5">
              {test.status === 'PASS' ? (
                <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle size={18} className="text-brand-red shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm text-white mb-1 font-bold">{test.feature}</p>
                <p className="text-xs text-cinematic-muted italic">{test.notes || 'No notes provided'}</p>
              </div>
              <div className="ml-auto">
                <Badge variant={test.status === 'PASS' ? 'success' : 'danger'}>
                  {test.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Member Contributions */}
        <div className="xl:col-span-2 space-y-4 mt-4">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <GitPullRequest size={20} className="text-purple-400" />
            Member Contributions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contributions.map((c: any) => (
              <GlassCard key={c.id} className="!p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm font-bold text-white">{c.memberName}</div>
                  <Badge variant={c.status === 'completed' ? 'success' : 'default'}>{c.status.replace(/_/g, ' ')}</Badge>
                </div>
                <p className="text-xs text-cinematic-text mb-3">{c.task}</p>
                {c.pullRequests?.map((pr: any) => (
                  <a key={pr.id} href={pr.prUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[11px] text-cinematic-blue hover:underline bg-cinematic-surface-2/50 px-2 py-1 rounded inline-flex mb-1">
                    <GitPullRequest size={12} /> {pr.prUrl} ({pr.status})
                  </a>
                ))}
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
