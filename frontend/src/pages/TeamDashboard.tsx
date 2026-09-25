import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, Users, FolderKanban, CheckCircle2, Box, AlertTriangle, FileCheck, CircleUserRound } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';
import AppShell from '../components/layout/AppShell';
import { TeamProgressOrb } from '../components/ui/TeamProgressOrb';

const activityData = [
  { name: 'Mon', value: 12 },
  { name: 'Tue', value: 18 },
  { name: 'Wed', value: 14 },
  { name: 'Thu', value: 32 },
  { name: 'Fri', value: 24 },
  { name: 'Sat', value: 10 },
  { name: 'Sun', value: 8 },
];

export default function TeamDashboard() {
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/team-dashboard').then(res => setData(res.data)).catch(console.error);
  }, []);

  if (!data) return <AppShell><div className="animate-pulse h-64 glass-card" /></AppShell>;

  const { members, pendingReviews } = data;
  let totalProjects = members.length * 4;
  let completedProjects = 0;
  
  members.forEach((m: any) => {
    completedProjects += m.projects.filter((p:any) => p.status === 'completed' || p.status === 'verified').length;
  });

  const progressPct = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  return (
    <AppShell>
      <div className="flex gap-8 items-start relative">
        
        {/* CENTER COLUMN (Fluid) */}
        <div className="flex-1 flex flex-col gap-8">
          
          {/* Date Strip */}
          <div className="flex items-center gap-4 glass-card py-2 px-4 w-fit">
            <div className="flex items-center gap-2 font-bold text-sm bg-white/10 px-3 py-1.5 rounded-xl cursor-pointer">
              SEP 2026 <ChevronDown size={14} />
            </div>
            <div className="w-[1px] h-6 bg-white/20 mx-2" />
            <div className="flex gap-2">
              {['Mon 15', 'Tue 16', 'Wed 17', 'Thu 18', 'Fri 19', 'Sat 20', 'Sun 21'].map((day, i) => {
                const [d, n] = day.split(' ');
                const isToday = i === 3;
                return (
                  <div key={day} className={`flex flex-col items-center justify-center w-12 h-14 rounded-2xl cursor-pointer transition-colors
                    ${isToday ? 'bg-brand-blue glow-blue shadow-[0_4px_15px_rgba(77,163,255,0.4)]' : 'hover:bg-white/10 text-brand-text-muted'}
                  `}>
                    <span className={`text-[10px] font-bold ${isToday ? 'text-white/80' : ''}`}>{d}</span>
                    <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-white'}`}>{n}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Hero Orb & Stat Cards Area */}
          <div className="relative h-[400px] flex items-center justify-center mt-4">
            <TeamProgressOrb percent={progressPct} />

            {/* Floating Stat Card: Top Left */}
            <div className="absolute top-4 left-4 glass-card p-5 w-64 transform transition-transform hover:-translate-y-1 hover:glow-blue">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                  <Users size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold leading-none">{members.length}</div>
                  <div className="text-xs text-brand-text-muted font-bold">Team Members</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {members.slice(0,4).map((m:any) => (
                    <div key={m.id} className="w-8 h-8 rounded-full border-2 border-[#121621] bg-brand-bg-2 flex items-center justify-center text-[10px] font-bold text-white z-10">
                      {m.name.substring(0,2).toUpperCase()}
                    </div>
                  ))}
                </div>
                <div className="text-brand-text-muted cursor-pointer hover:text-white"><ChevronRight size={16} /></div>
              </div>
            </div>

            {/* Floating Stat Card: Top Right */}
            <div className="absolute top-4 right-4 glass-card p-5 w-56 transform transition-transform hover:-translate-y-1 hover:glow-violet">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-brand-violet/20 flex items-center justify-center text-brand-violet">
                  <FolderKanban size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold leading-none">{totalProjects}</div>
                  <div className="text-xs text-brand-text-muted font-bold">Total Projects</div>
                </div>
              </div>
            </div>

            {/* Floating Stat Card: Bottom Left */}
            <div className="absolute bottom-4 left-4 glass-card p-5 w-56 transform transition-transform hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(46,212,122,0.4)]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center text-brand-green">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold leading-none">91%</div>
                  <div className="text-xs text-brand-text-muted font-bold">Attendance</div>
                </div>
              </div>
            </div>

            {/* Floating Stat Card: Bottom Right */}
            <div className="absolute bottom-4 right-4 glass-card p-5 w-56 transform transition-transform hover:-translate-y-1 hover:glow-blue">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                  <Box size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold leading-none">76%</div>
                  <div className="text-xs text-brand-text-muted font-bold">Group Project</div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members Strip */}
          <div className="glass-card p-6 mt-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Team Members</h3>
              <div className="text-brand-text-muted hover:text-white cursor-pointer"><ChevronRight size={18} /></div>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-2">
              {members.map((m:any) => {
                const verified = m.projects.filter((p:any) => p.status === 'completed' || p.status === 'verified').length;
                const pct = (verified / 4) * 100;
                return (
                  <div key={m.id} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => navigate(`/team/member/${m.id}`)}>
                    <div className={`w-14 h-14 rounded-full border-[3px] flex items-center justify-center font-bold text-lg transition-transform group-hover:scale-110 bg-brand-bg-2
                      ${pct === 100 ? 'border-brand-green glow-blue shadow-[0_0_15px_rgba(46,212,122,0.4)]' : 'border-brand-blue/50'}
                    `}>
                      {m.name.substring(0,2).toUpperCase()}
                    </div>
                    <div className="text-sm font-semibold whitespace-nowrap">{m.name.split(' ')[0]}</div>
                    <div className={`text-xs font-bold ${pct === 100 ? 'text-brand-green' : 'text-brand-text-muted'}`}>{pct}%</div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (Fixed) */}
        <div className="w-[430px] flex-shrink-0 flex flex-col gap-6">
          
          {/* Card 1: Project Timeline */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Project Timeline</h3>
              <a href="#" className="text-xs font-bold text-brand-blue hover:text-white transition-colors">View All &rarr;</a>
            </div>
            
            <div className="h-24 w-full bg-gradient-to-r from-brand-blue/20 to-brand-violet/20 rounded-xl mb-6 relative overflow-hidden flex items-center">
              <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none">
                <path d="M0,50 Q100,10 200,50 T400,50 L400,100 L0,100 Z" fill="url(#waveGrad)" opacity="0.8" />
                <defs>
                  <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--brand-blue)" />
                    <stop offset="100%" stopColor="var(--brand-violet)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute left-[70%] top-0 bottom-0 w-[2px] bg-white glow-blue" />
              <div className="absolute left-[70%] top-2 -translate-x-1/2 bg-brand-blue px-2 py-0.5 rounded-full text-[9px] font-bold">TODAY</div>
            </div>

            <div className="flex justify-between items-center">
              {[ {label:'Ideation', count:'4/4', status:'done'}, {label:'Development', count:'3/4', status:'progress'}, {label:'Submission', count:'2/4', status:'pending'}, {label:'Review', count:'1/4', status:'none'} ].map(stage => (
                <div key={stage.label} className="flex flex-col items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center
                    ${stage.status==='done' ? 'bg-brand-green text-brand-bg-1' : stage.status==='progress' ? 'bg-brand-blue text-brand-bg-1' : stage.status==='pending' ? 'bg-white/20 text-white' : 'border-2 border-white/20'}
                  `}>
                    {stage.status==='done' ? <CheckCircle2 size={14}/> : stage.status==='progress' ? <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-brand-bg-1 ml-1" /> : null}
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-bold text-white">{stage.label}</div>
                    <div className="text-[9px] font-bold text-brand-text-muted">{stage.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Team Activity */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-lg">Team Activity</h3>
                <div className="bg-brand-green/20 text-brand-green px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center"><div className="w-1.5 h-1.5 bg-brand-green rounded-full mr-1 animate-pulse"/>Live</div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-brand-text-muted cursor-pointer hover:text-white">This Week <ChevronDown size={14}/></div>
            </div>
            
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand-blue)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--brand-violet)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--brand-text-muted)', fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--brand-text-muted)', fontWeight: 'bold' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(20,24,35,0.8)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="value" stroke="var(--brand-blue)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 3: Attention Zone */}
          <div className="glass-card-danger p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-brand-red">
                <AlertTriangle size={20} />
                <h3 className="font-bold text-lg">Attention Zone</h3>
              </div>
              <a href="#" className="text-xs font-bold text-brand-red hover:text-white transition-colors">View All &rarr;</a>
            </div>
            <p className="text-sm text-brand-red font-semibold mb-4">{pendingReviews} items need your attention</p>
            
            <div className="space-y-3">
              {[
                { title: 'Project 04 / Repository not found', sub: 'Missing evidence', icon: <FolderKanban size={16} className="text-brand-red" />, bg: 'bg-brand-red/20', sev: 'High', sevColor: 'text-brand-red bg-brand-red/10' },
                { title: 'Rahul / Modification overdue', sub: 'Project verification', icon: <CircleUserRound size={16} className="text-brand-orange" />, bg: 'bg-brand-orange/20', sev: 'Medium', sevColor: 'text-brand-orange bg-brand-orange/10' },
                { title: 'Group Project / Pending PRs', sub: 'Code review', icon: <FileCheck size={16} className="text-brand-blue" />, bg: 'bg-brand-blue/20', sev: 'Low', sevColor: 'text-brand-blue bg-brand-blue/10' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg}`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{item.title}</div>
                      <div className="text-[10px] font-bold text-brand-text-muted">{item.sub}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.sevColor}`}>{item.sev}</div>
                    <ChevronRight size={14} className="text-brand-text-muted group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
