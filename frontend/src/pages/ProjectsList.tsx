import { useEffect, useState } from 'react';

import AppShell from '../components/layout/AppShell';
import { GlassCard, Badge, PageHeader } from '../components/ui/Core';
import api from '../api';
import { Search } from 'lucide-react';

export default function ProjectsList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.get('/projects')
      .then(res => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to load projects');
        setLoading(false);
      });
  }, []);

  const filtered = projects.filter(p => {
    if (search && !p.name?.toLowerCase().includes(search.toLowerCase()) && !p.memberName?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter !== 'All' && p.currentStatus !== filter) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'COMPLETED') return <Badge variant="success">Completed</Badge>;
    if (status === 'MODIFICATION_REQUESTED') return <Badge variant="danger">Modification</Badge>;
    if (status === 'VERIFICATION' || status === 'FINAL_VERIFICATION') return <Badge variant="warning">Verifying</Badge>;
    return <Badge variant="info">{status.replace(/_/g, ' ')}</Badge>;
  };

  const statuses = ['All', 'IDEA', 'DEVELOPMENT', 'GITHUB_SUBMISSION', 'VERIFICATION', 'MODIFICATION_REQUESTED', 'COMPLETED'];

  return (
    <AppShell>
      <PageHeader title="Individual Projects" subtitle="Track all individual project lifecycles across the team">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cinematic-text/30" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-cinematic-surface-2/50 border border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cinematic-blue/50 transition-colors w-64"
          />
        </div>
      </PageHeader>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {statuses.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${filter === f ? 'bg-cinematic-blue/20 text-brand-blue-2 border border-brand-blue-2/30' : 'bg-cinematic-surface-2/30 text-cinematic-text/50 border border-white/5 hover:text-white'}`}
          >
            {f.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-20 material-glass rounded-2xl animate-pulse" />)}
        </div>
      ) : error ? (
        <div className="p-4 bg-brand-red/10 border border-brand-red/20 text-brand-red rounded-lg">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-cinematic-muted material-glass rounded-3xl">No projects found for the selected criteria.</div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map(p => (
            <GlassCard key={p.id} className="!p-4 hover:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold">{p.name || 'Untitled Project'}</h3>
                  <p className="text-xs text-cinematic-muted">{p.memberName} • {p.domain || 'Unspecified Domain'}</p>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-32 bg-cinematic-surface-2 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-cinematic-blue h-full rounded-full transition-all duration-1000" style={{ width: `${p.progressPercentage || 0}%` }} />
                  </div>
                  {getStatusBadge(p.currentStatus)}
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-cinematic-blue hover:underline">
                      Repository
                    </a>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </AppShell>
  );
}
