import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import { GlassCard, Badge, PageHeader } from '../components/ui/Core';
import api from '../api';
import { Search, ChevronRight } from 'lucide-react';

export default function MembersList() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/members')
      .then(res => {
        setMembers(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to load members');
        setLoading(false);
      });
  }, []);

  const filteredMembers = members.filter(m => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.email.toLowerCase().includes(search.toLowerCase())) return false;
    
    if (filter === 'Active') return m.participation?.active;
    if (filter === 'Inactive') return !m.participation?.active;
    if (filter === 'Needs Attention') return m.openModifications > 0 || m.growth?.status === 'Needs Attention';
    return true;
  });

  return (
    <AppShell>
      <PageHeader title="Team Members" subtitle="Manage and review individual progress">
        <div className="flex items-center gap-2 bg-cinematic-surface-2/30 border border-white/5 rounded-lg p-1">
          {['All', 'Active', 'Inactive', 'Needs Attention'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${filter === f ? 'bg-cinematic-blue/20 text-brand-blue-2' : 'text-cinematic-text/50 hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cinematic-text/30" />
          <input 
            type="text" 
            placeholder="Search members..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-cinematic-surface-2/50 border border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cinematic-blue/50 transition-colors w-64"
          />
        </div>
      </PageHeader>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1,2,3].map(i => <div key={i} className="h-24 material-glass rounded-2xl animate-pulse" />)}
        </div>
      ) : error ? (
        <div className="p-4 bg-brand-red/10 border border-brand-red/20 text-brand-red rounded-lg">{error}</div>
      ) : filteredMembers.length === 0 ? (
        <div className="p-12 text-center text-cinematic-muted">No team members found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMembers.map(m => (
            <GlassCard 
              key={m.id} 
              className="!p-4 cursor-pointer hover:border-cinematic-blue/30 transition-all duration-300"
              onClick={() => navigate(`/team/member/${m.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-cinematic-surface-2 border border-white/10 flex items-center justify-center overflow-hidden">
                    {m.profileImage ? (
                      <img src={m.profileImage} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-cinematic-blue uppercase">{m.name.substring(0, 2)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{m.name}</h3>
                    <div className="text-xs text-cinematic-muted tracking-wide flex items-center gap-2">
                      {m.email} <span className="w-1 h-1 rounded-full bg-white/20" /> {m.registrationNumber || 'No ID'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-cinematic-muted mb-1">Projects</span>
                    <div className="flex items-center gap-1">
                      <span className="text-white font-bold">{m.growth?.individualProjectsCompleted || 0}</span>
                      <span className="text-cinematic-muted">/ 4</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-cinematic-muted mb-1">Group</span>
                    <Badge variant={m.participation?.active ? 'success' : 'danger'}>
                      {m.participation?.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-cinematic-muted mb-1">Status</span>
                    {m.openModifications > 0 ? (
                      <Badge variant="warning">{m.openModifications} Mods</Badge>
                    ) : (
                      <Badge variant="info">On Track</Badge>
                    )}
                  </div>

                  <ChevronRight className="text-cinematic-text/20 group-hover:text-white transition-colors" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </AppShell>
  );
}
