import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import api from '../api';
import AppShell from '../components/layout/AppShell';
import { GlassCard, StatusBadge } from '../components/ui/Shared';

export default function TeamDashboard() {
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/team-dashboard').then(res => setData(res.data)).catch(console.error);
  }, []);

  if (!data) {
    return (
      <AppShell title="Loading">
        <div className="animate-pulse space-y-8">
           <div className="h-64 bg-surface-elevated/50 rounded-3xl" />
           <div className="grid grid-cols-4 gap-6"><div className="h-32 bg-surface-elevated/50 rounded-2xl" /><div className="h-32 bg-surface-elevated/50 rounded-2xl" /></div>
        </div>
      </AppShell>
    );
  }

  const { members, cycle, pendingReviews } = data;
  
  // Calculate metrics
  let totalProjects = members.length * 4;
  let completedProjects = 0;
  let membersAt4 = 0;
  let totalAttendance = 0;
  let attendanceCount = 0;

  members.forEach((m: any) => {
    const complete = m.projects.filter((p:any) => p.status === 'completed' || p.status === 'verified').length;
    completedProjects += complete;
    if (complete === 4) membersAt4++;
    
    if (m.attendance.length > 0) {
      totalAttendance += m.attendance.filter((a:any) => a.status === 'present').length;
      attendanceCount += m.attendance.length;
    }
  });

  const attendancePct = attendanceCount > 0 ? Math.round((totalAttendance / attendanceCount) * 100) : 100;

  return (
    <AppShell title="Team Dashboard" cycle={cycle}>
      {/* HERO SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative mb-12 rounded-3xl overflow-hidden glass-panel border-primary/20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <div className="relative p-10 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2">Team Progress</h2>
            <p className="text-text-muted text-lg">Active Cycle • {cycle?.month}/{cycle?.year}</p>
          </div>
          
          <div className="flex gap-12">
            <div className="text-center">
              <div className="text-5xl font-light text-primary mb-1">{completedProjects} <span className="text-2xl text-text-muted">/ {totalProjects}</span></div>
              <div className="text-xs font-bold tracking-widest uppercase text-text-muted">Projects Done</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-light text-success mb-1">{membersAt4} <span className="text-2xl text-text-muted">/ {members.length}</span></div>
              <div className="text-xs font-bold tracking-widest uppercase text-text-muted">Members at 4/4</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-light text-secondary mb-1">{attendancePct}%</div>
              <div className="text-xs font-bold tracking-widest uppercase text-text-muted">Attendance</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <GlassCard hoverEffect>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary"><Users size={24} /></div>
            <span className="text-xs font-bold text-success flex items-center"><TrendingUp size={14} className="mr-1"/> Active</span>
          </div>
          <div className="text-3xl font-bold mb-1">{members.length} Members</div>
          <div className="text-sm text-text-muted">Currently deployed on projects</div>
        </GlassCard>

        <GlassCard hoverEffect>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-warning/10 text-warning"><Clock size={24} /></div>
            {pendingReviews > 0 && <span className="text-xs font-bold text-warning flex items-center animate-pulse">Action Needed</span>}
          </div>
          <div className="text-3xl font-bold mb-1">{pendingReviews} Pending</div>
          <div className="text-sm text-text-muted">Reviews & Verifications awaiting action</div>
        </GlassCard>

        <GlassCard hoverEffect>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-secondary/10 text-secondary"><CheckCircle size={24} /></div>
          </div>
          <div className="text-3xl font-bold mb-1">Group Sync</div>
          <div className="text-sm text-text-muted">Check group project workspace</div>
        </GlassCard>
      </div>

      {/* COMMAND CENTER TABLE */}
      <h3 className="text-xl font-bold mb-6 flex items-center"><span className="w-2 h-6 bg-primary rounded-full mr-3" /> Member Command Center</h3>
      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-elevated/30">
              <th className="py-4 px-6 text-xs font-bold tracking-widest uppercase text-text-muted">Member</th>
              <th className="py-4 px-6 text-xs font-bold tracking-widest uppercase text-text-muted">Individual</th>
              <th className="py-4 px-6 text-xs font-bold tracking-widest uppercase text-text-muted">Group Status</th>
              <th className="py-4 px-6 text-xs font-bold tracking-widest uppercase text-text-muted">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m: any) => {
              const complete = m.projects.filter((p:any) => p.status === 'completed' || p.status === 'verified').length;
              const att = m.attendance.length ? Math.round((m.attendance.filter((a:any) => a.status === 'present').length / m.attendance.length) * 100) : 100;
              
              return (
                <tr 
                  key={m.id} 
                  className="border-b border-border/50 hover:bg-surface-elevated/50 transition-colors cursor-pointer group" 
                  onClick={() => navigate(`/team/member/${m.id}`)}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-elevated border border-border flex items-center justify-center font-bold text-xs group-hover:border-primary transition-colors">
                        {m.name.substring(0,2).toUpperCase()}
                      </div>
                      <span className="font-semibold">{m.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{complete}/4</span>
                      <div className="flex gap-1">
                        {[0,1,2,3].map(i => (
                          <div key={i} className={`w-2 h-6 rounded-sm ${i < complete ? 'bg-success' : 'bg-surface-elevated border border-border'}`} />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={m.groupContributions[0]?.status || 'not_assigned'} />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className={att < 80 ? 'text-danger font-bold' : 'text-success font-bold'}>{att}%</span>
                      {att < 80 && <AlertTriangle size={14} className="text-danger" />}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
