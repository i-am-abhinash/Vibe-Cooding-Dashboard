import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import { GlassCard, Badge, PageHeader } from '../components/ui/Core';
import api from '../api';
import { Check, AlertTriangle } from 'lucide-react';

export default function ReviewsInbox() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    api.get('/reviews')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(console.error);
  };

  const handleProjectAction = async (id: string, action: string) => {
    try {
      await api.post(`/projects/${id}/review`, { action, comments: 'Reviewed from queue' });
      fetchReviews();
    } catch(e) {
      alert('Error updating project');
    }
  };

  if (loading) return <AppShell><div className="animate-pulse h-96 material-glass rounded-3xl" /></AppShell>;

  const { pendingIdeas, pendingVerifications, pendingModifications, pendingRequirements } = data;
  
  const total = pendingIdeas.length + pendingVerifications.length + pendingModifications.length + pendingRequirements.length;

  return (
    <AppShell>
      <PageHeader title="Review Action Queue" subtitle={`${total} items require your attention`} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Ideas */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-cinematic-muted uppercase tracking-widest border-b border-white/5 pb-2">Pending Ideas ({pendingIdeas.length})</h2>
          {pendingIdeas.map((p: any) => (
            <GlassCard key={p.id} className="!p-4 border-l-2 border-l-brand-blue-2">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-white font-bold">{p.name || 'Untitled Idea'}</div>
                  <div className="text-xs text-cinematic-muted">{p.memberName}</div>
                </div>
              </div>
              <p className="text-xs text-cinematic-text/70 mb-4">{p.description || 'No description provided.'}</p>
              <div className="flex gap-2 mt-auto">
                <button onClick={() => handleProjectAction(p.id, 'APPROVE')} className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold hover:bg-green-500/30">Approve</button>
                <button onClick={() => handleProjectAction(p.id, 'REQUIRE_MODIFICATION')} className="px-3 py-1 bg-brand-red/20 text-brand-red rounded text-xs font-bold hover:bg-brand-red/30">Request Changes</button>
              </div>
            </GlassCard>
          ))}
          {pendingIdeas.length === 0 && <div className="text-xs text-cinematic-muted italic">No pending ideas.</div>}
        </div>

        {/* Verifications */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-cinematic-muted uppercase tracking-widest border-b border-white/5 pb-2">Pending Verifications ({pendingVerifications.length})</h2>
          {pendingVerifications.map((p: any) => (
            <GlassCard key={p.id} className="!p-4 border-l-2 border-l-green-400">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-white font-bold">{p.name}</div>
                  <div className="text-xs text-cinematic-muted">{p.memberName}</div>
                </div>
                <Badge variant="warning">Awaiting Final Check</Badge>
              </div>
              <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-cinematic-blue hover:underline mb-4 block">View Repository</a>
              <div className="flex gap-2">
                <button onClick={() => handleProjectAction(p.id, 'VERIFY')} className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold hover:bg-green-500/30 flex items-center gap-1"><Check size={14}/> Verify Pass</button>
                <button onClick={() => handleProjectAction(p.id, 'REQUIRE_MODIFICATION')} className="px-3 py-1 bg-brand-red/20 text-brand-red rounded text-xs font-bold hover:bg-brand-red/30 flex items-center gap-1"><AlertTriangle size={14}/> Fail & Require Mod</button>
              </div>
            </GlassCard>
          ))}
          {pendingVerifications.length === 0 && <div className="text-xs text-cinematic-muted italic">No pending verifications.</div>}
        </div>

        {/* Modifications */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-cinematic-muted uppercase tracking-widest border-b border-white/5 pb-2">Open Modifications ({pendingModifications.length})</h2>
          {pendingModifications.map((m: any) => (
            <div key={m.id} className="p-4 bg-brand-red/5 border border-brand-red/10 rounded-xl">
              <div className="flex justify-between items-start mb-1">
                <div className="text-brand-red font-bold text-sm">Action Required by {m.memberName}</div>
                <Badge variant="danger">{m.severity}</Badge>
              </div>
              <p className="text-xs text-cinematic-text/70">{m.issue}</p>
            </div>
          ))}
          {pendingModifications.length === 0 && <div className="text-xs text-cinematic-muted italic">No open modifications.</div>}
        </div>

      </div>
    </AppShell>
  );
}
