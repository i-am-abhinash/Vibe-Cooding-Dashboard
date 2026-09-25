import { useEffect, useState } from 'react';
import { ChevronRight, ChevronDown, Users, FolderKanban, AlertTriangle, FileCheck, CircleUserRound } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import api from '../api';
import AppShell from '../components/layout/AppShell';
import { TeamScene } from '../components/ui/TeamScene';

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
  
  useEffect(() => {
    api.get('/team-dashboard').then(res => setData(res.data)).catch(console.error);
  }, []);

  if (!data) return <AppShell><div className="w-full h-full" /></AppShell>;

  const { members, pendingReviews } = data;
  let totalProjects = members.length * 4;
  let completedProjects = 0;
  
  members.forEach((m: any) => {
    completedProjects += m.projects.filter((p:any) => p.status === 'completed' || p.status === 'verified').length;
  });

  const progressPct = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  return (
    <AppShell>
      <div className="relative w-full h-full">
        
        {/* === DATE STRIP (Top Left) === */}
        <div className="absolute top-0 left-0 flex items-center glass-panel rounded-2xl overflow-hidden h-[64px]">
          <div className="flex items-center justify-between px-6 h-full cursor-pointer hover:bg-white/5 transition-colors border-r border-white/10 w-[140px]">
            <span className="font-bold text-lg">SEP 2026</span>
            <ChevronRight size={16} className="text-brand-text-muted" />
          </div>
          <div className="flex h-full">
            {['Mon 15', 'Tue 16', 'Wed 17', 'Thu 18', 'Fri 19', 'Sat 20', 'Sun 21'].map((day, i) => {
              const [d, n] = day.split(' ');
              const isToday = i === 3;
              return (
                <div key={day} className={`flex flex-col items-center justify-center w-[64px] h-full cursor-pointer transition-colors
                  ${isToday ? 'bg-gradient-to-b from-brand-blue-1/80 to-brand-violet-1/80 border-b-2 border-white glow-blue' : 'hover:bg-white/5'}
                `}>
                  <span className={`text-[11px] font-bold ${isToday ? 'text-white' : 'text-brand-text-muted'}`}>{d}</span>
                  <span className={`text-base font-bold ${isToday ? 'text-white' : 'text-white'}`}>{n}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* === CENTRAL 3D SCENE === */}
        {/* We place it in the center-left area */}
        <div className="absolute top-[80px] left-[50px] w-[700px] h-[700px]">
          <TeamScene progress={progressPct} />
        </div>

        {/* === FOUR FLOATING PANELS AROUND CENTER === */}
        
        {/* 1. Team Members Panel */}
        <div className="absolute top-[120px] left-[0px] w-[220px] h-[100px] glass-panel rounded-[24px] p-4 flex flex-col justify-center shadow-[0_0_20px_rgba(77,163,255,0.2)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-brand-blue/20 flex items-center justify-center text-brand-blue">
              <Users size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold leading-none">{members.length}</div>
              <div className="text-[11px] font-bold text-white tracking-wide">Team Members</div>
            </div>
          </div>
          <div className="absolute bottom-[-16px] left-[20px] glass-panel rounded-full p-1 flex items-center border border-white/20">
            <div className="flex -space-x-2">
              {members.slice(0,4).map((m:any) => (
                <div key={m.id} className="w-6 h-6 rounded-full border border-[#121621] bg-brand-bg-2 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} alt="avatar" />
                </div>
              ))}
            </div>
            <div className="w-6 h-6 ml-2 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 cursor-pointer">
              <ChevronRight size={12} />
            </div>
          </div>
        </div>

        {/* 2. Total Projects Panel */}
        <div className="absolute top-[80px] left-[550px] w-[200px] h-[100px] glass-panel rounded-[24px] p-4 flex flex-col justify-center shadow-[0_0_20px_rgba(139,92,246,0.2)]">
           <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-brand-gold/20 flex items-center justify-center text-brand-gold">
              <FolderKanban size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold leading-none">{totalProjects}</div>
              <div className="text-[11px] font-bold text-white tracking-wide">Total Projects</div>
            </div>
          </div>
          <div className="absolute bottom-3 right-4 flex items-end gap-1 h-4">
            {[3,7,4,8,5].map((v, i) => <div key={i} className="w-1 bg-brand-blue" style={{ height: `${v*10}%` }} />)}
          </div>
        </div>

        {/* 3. Attendance Panel */}
        <div className="absolute top-[480px] left-[-20px] w-[200px] h-[100px] glass-panel rounded-[24px] p-4 flex flex-col justify-center shadow-[0_0_20px_rgba(77,163,255,0.2)] border border-brand-blue/30">
           <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-[3px] border-brand-blue/30 flex items-center justify-center relative">
              <div className="absolute inset-0 border-[3px] border-brand-blue rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 91%, 0 91%)' }} />
            </div>
            <div>
              <div className="text-3xl font-bold leading-none text-white">91%</div>
              <div className="text-[11px] font-bold text-white tracking-wide">Attendance</div>
            </div>
          </div>
          <div className="absolute bottom-3 right-4 flex items-end gap-1 h-4">
            {[4,6,3,7,9].map((v, i) => <div key={i} className="w-1 bg-brand-blue" style={{ height: `${v*10}%` }} />)}
          </div>
        </div>

        {/* 4. Group Project Panel */}
        <div className="absolute top-[520px] left-[520px] w-[200px] h-[100px] glass-panel rounded-[24px] p-4 flex flex-col justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-brand-violet/40">
           <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-white to-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              {/* Cube illusion */}
              <div className="w-6 h-6 border-[2px] border-brand-bg-1 bg-white" />
            </div>
            <div>
              <div className="text-3xl font-bold leading-none text-white">76%</div>
              <div className="text-[11px] font-bold text-white tracking-wide">Group Project</div>
            </div>
          </div>
          <div className="absolute bottom-3 right-4 flex items-end gap-1 h-4">
            {[5,3,8,4,7].map((v, i) => <div key={i} className="w-1 bg-brand-blue" style={{ height: `${v*10}%` }} />)}
          </div>
        </div>


        {/* === RIGHT SIDE PANELS === */}
        <div className="absolute top-0 right-0 w-[420px] flex flex-col gap-6 h-[800px]">
          
          {/* Project Timeline Panel */}
          <div className="glass-panel p-6 rounded-[24px] h-[220px] flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">Project Timeline</h3>
              <div className="text-[10px] font-bold text-brand-text-muted hover:text-white cursor-pointer flex items-center gap-1">View All <ChevronRight size={12}/></div>
            </div>
            
            <div className="flex-1 relative mt-2">
              <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none" className="drop-shadow-[0_0_15px_rgba(77,163,255,0.3)]">
                  <defs>
                    <linearGradient id="timelineArea1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4DA3FF" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0"/>
                    </linearGradient>
                    <linearGradient id="timelineArea2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#1E1A33" stopOpacity="0.0"/>
                    </linearGradient>
                    <linearGradient id="timelineLine1" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4DA3FF" stopOpacity="0.8"/>
                      <stop offset="50%" stopColor="#8B5CF6" stopOpacity="1"/>
                      <stop offset="100%" stopColor="#4DA3FF" stopOpacity="0.8"/>
                    </linearGradient>
                  </defs>
                  {/* Background subtle mountain layer */}
                  <path d="M0,80 Q50,60 100,75 T220,50 T330,70 T400,60 L400,100 L0,100 Z" fill="url(#timelineArea2)" opacity="0.6" />
                  
                  {/* Foreground dynamic wave */}
                  <path d="M0,60 Q80,20 150,50 T280,30 T400,45 L400,100 L0,100 Z" fill="url(#timelineArea1)" opacity="0.8" />
                  <path d="M0,60 Q80,20 150,50 T280,30 T400,45" fill="none" stroke="url(#timelineLine1)" strokeWidth="2.5" />
                  
                  {/* Today vertical line */}
                  <line x1="280" y1="10" x2="280" y2="100" stroke="#4DA3FF" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                  {/* Glowing points */}
                  <circle cx="150" cy="50" r="4" fill="#8B5CF6" stroke="#fff" strokeWidth="1.5" className="drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                  <circle cx="280" cy="30" r="5" fill="#4DA3FF" stroke="#fff" strokeWidth="2" className="drop-shadow-[0_0_10px_rgba(77,163,255,1)]" />
                </svg>
              {/* Nodes and Labels */}
              <div className="absolute inset-0 flex justify-between items-end pb-2 px-4">
                {[
                  {l:'Ideation', c:'4/4', s:'done', col:'text-brand-green', bg:'bg-brand-green'},
                  {l:'Development', c:'3/4', s:'active', col:'text-brand-blue', bg:'bg-brand-blue', tag:'Today'},
                  {l:'Submission', c:'2/4', s:'pending', col:'text-white', bg:'bg-white'},
                  {l:'Review', c:'1/4', s:'none', col:'text-brand-text-muted', bg:'bg-brand-bg-1 border-2 border-brand-text-muted'}
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 relative">
                    {item.tag && (
                      <div className="absolute -top-14 bg-brand-violet-1 text-white text-[9px] font-bold px-2 py-0.5 rounded-full glow-violet">
                        {item.tag}
                      </div>
                    )}
                    {item.tag && <div className="absolute -top-10 h-10 w-[1px] bg-white border-l border-dashed" />}
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.bg} shadow-[0_0_10px_currentColor] ${item.col}`}>
                      {item.s === 'done' && <svg className="w-2 h-2 text-brand-bg-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                      {item.s === 'active' && <div className="w-1.5 h-1.5 bg-brand-bg-1 rounded-full" />}
                    </div>
                    <div className="text-center">
                      <div className={`text-[11px] font-bold ${item.s === 'none' ? 'text-brand-text-muted' : 'text-white'}`}>{item.l}</div>
                      <div className="text-[10px] font-bold text-brand-text-muted">{item.c}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Activity Panel */}
          <div className="glass-panel p-6 rounded-[24px] h-[260px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-lg">Team Activity</h3>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green text-[10px] font-bold border border-brand-green/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse shadow-[0_0_5px_var(--brand-green)]" /> Live
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white/10">
                This Week <ChevronDown size={14} className="text-brand-text-muted" />
              </div>
            </div>
            <div className="flex-1 w-full relative">
              {/* Graph tooltip simulation for Thu */}
              <div className="absolute top-[10%] left-[60%] -translate-x-1/2 bg-white/10 border border-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg flex flex-col items-center z-10">
                <span className="text-[10px] font-bold text-white">32 contributions</span>
                <span className="text-[9px] font-bold text-brand-text-muted">Thu, Sep 18</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="actArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4DA3FF" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8B93A7', fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8B93A7', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="value" stroke="#4DA3FF" strokeWidth={3} fillOpacity={1} fill="url(#actArea)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attention Zone Panel */}
          <div className="glass-panel p-6 rounded-[24px] flex-1 overflow-hidden relative">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 text-brand-red">
                <div className="w-8 h-8 rounded-full bg-brand-red/20 flex items-center justify-center border border-brand-red/30 glow-red">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Attention Zone</h3>
                  <div className="text-[10px] font-bold text-brand-text-muted">{pendingReviews} items need your attention</div>
                </div>
              </div>
              <div className="text-[10px] font-bold text-white hover:text-brand-red cursor-pointer flex items-center gap-1">View All <ChevronRight size={12}/></div>
            </div>
            
            <div className="space-y-3">
              {[
                { title: 'Project 04', sub: 'Repository not found', icon: <FolderKanban size={16}/>, bg: 'bg-brand-red/20 text-brand-red', badge: 'High', bColor: 'bg-brand-red/20 text-brand-red border border-brand-red/30' },
                { title: 'Rahul', sub: 'Project modification overdue', icon: <CircleUserRound size={16}/>, bg: 'bg-brand-orange/20 text-brand-orange', badge: 'Medium', bColor: 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30' },
                { title: 'Group Project', sub: '2 pending PR reviews', icon: <FileCheck size={16}/>, bg: 'bg-brand-blue/20 text-brand-blue', badge: 'Low', bColor: 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-[16px] bg-black/20 border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] hover:bg-white/5 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${item.bg}`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-white">{item.title}</div>
                      <div className="text-[11px] font-medium text-brand-text-muted">{item.sub}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`text-[10px] font-bold px-3 py-1 rounded-full ${item.bColor}`}>{item.badge}</div>
                    <ChevronRight size={16} className="text-brand-text-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === BOTTOM: TEAM MEMBERS STRIP === */}
        <div className="absolute bottom-0 left-[0px] w-[900px] h-[160px] flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80">
            <h3 className="text-xl font-bold text-white">Team Members</h3>
            <ChevronRight size={18} className="text-white" />
          </div>
          
          <div className="flex justify-between items-end w-full pb-4 px-4">
            {members.slice(0, 7).map((m:any, i:number) => {
              const verified = m.projects.filter((p:any) => p.status === 'completed' || p.status === 'verified').length;
              const pct = Math.round((verified / 4) * 100) || 50;
              // Add slight vertical staggering like the reference
              const translateY = i % 2 === 0 ? 'translate-y-0' : 'translate-y-[-10px]';
              return (
                <div key={m.id} className={`flex flex-col items-center gap-2 cursor-pointer group ${translateY}`}>
                  {/* Glowing Platform avatar */}
                  <div className="relative w-[70px] h-[70px]">
                    {/* Perspective base */}
                    <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[80px] h-[30px] rounded-[50%] border-2 border-brand-blue/30 bg-gradient-to-b from-brand-blue/20 to-transparent glow-blue" style={{ transform: 'rotateX(60deg)' }} />
                    <div className={`absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-[60px] h-[20px] rounded-[50%] border border-brand-blue bg-brand-blue shadow-[0_0_20px_var(--brand-blue)] opacity-50`} style={{ transform: 'rotateX(60deg)' }} />
                    
                    {/* Avatar Circle */}
                    <div className="absolute inset-0 rounded-full border-[2px] border-brand-blue/50 bg-brand-bg-1 overflow-hidden z-10 transition-transform group-hover:scale-110 group-hover:border-brand-blue group-hover:glow-blue">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} alt={m.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="text-[12px] font-bold text-white mt-1">{m.name.split(' ')[0]}</div>
                  <div className={`text-[11px] font-bold ${pct === 100 ? 'text-brand-green' : 'text-brand-blue'}`}>{pct}%</div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
