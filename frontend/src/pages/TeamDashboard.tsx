import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import api from '../api';
import AppShell from '../components/layout/AppShell';
import { FluxSurface } from '../components/ui/Shared';

export default function TeamDashboard() {
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/team-dashboard').then(res => setData(res.data)).catch(console.error);
  }, []);

  if (!data) return <AppShell><div className="animate-pulse h-64 flux-panel rounded-3xl" /></AppShell>;

  const { members, cycle, pendingReviews } = data;
  let totalProjects = members.length * 4;
  let completedProjects = 0;
  
  members.forEach((m: any) => {
    completedProjects += m.projects.filter((p:any) => p.status === 'completed' || p.status === 'verified').length;
  });

  const progressPct = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  return (
    <AppShell cycle={cycle}>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 preserve-3d">
        
        {/* CENTERPIECE: TEAM CORE */}
        <div className="xl:col-span-8 relative h-[600px] flex items-center justify-center preserve-3d">
          {/* Central 3D Object Approximation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none preserve-3d">
            <motion.div 
              animate={{ rotateX: [60, 60], rotateZ: [0, 360] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="w-[500px] h-[500px] rounded-full border border-flux-accent/10 absolute preserve-3d"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Outer Orbit Nodes (Members) */}
              {members.map((m: any, i: number) => {
                const angle = (i / members.length) * 360;
                return (
                  <div key={m.id} className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 preserve-3d" style={{ transform: `rotateZ(${angle}deg) translateX(250px) rotateZ(-${angle}deg) rotateX(-60deg)` }}>
                    <motion.div 
                      whileHover={{ scale: 1.5 }}
                      onClick={() => navigate(`/team/member/${m.id}`)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto border transition-colors shadow-[0_0_15px_currentColor]
                        ${m.attendance.filter((a:any)=>a.status==='absent').length > 2 ? 'bg-flux-danger/20 border-flux-danger text-flux-danger' : 'bg-flux-accent/20 border-flux-accent text-flux-accent'}
                      `}
                      title={m.name}
                    >
                      <span className="text-[8px] font-bold">{m.name.substring(0,1)}</span>
                    </motion.div>
                  </div>
                )
              })}
            </motion.div>
            
            <motion.div 
              animate={{ rotateX: [60, 60], rotateZ: [360, 0] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="w-[350px] h-[350px] rounded-full border border-flux-accent-warm/20 absolute preserve-3d"
            />
            
            <div className="w-[200px] h-[200px] rounded-full bg-flux-bg/50 backdrop-blur-md border border-flux-accent/30 absolute flex flex-col items-center justify-center shadow-[0_0_50px_rgba(200,255,61,0.1)]">
              <span className="text-4xl font-light text-flux-accent">{progressPct}%</span>
              <span className="text-[10px] uppercase tracking-widest text-flux-muted font-bold mt-2">Team Flow</span>
            </div>
          </div>
        </div>

        {/* RIGHT METRICS & ATTENTION */}
        <div className="xl:col-span-4 flex flex-col gap-6 preserve-3d">
          <FluxSurface className="transform hover:translate-z-10 transition-transform">
            <h3 className="text-xs uppercase tracking-widest text-flux-muted font-bold mb-4">Milestones</h3>
            <div className="flex justify-between items-end mb-6">
              <div>
                <div className="text-3xl font-light text-flux-text mb-1">{completedProjects} <span className="text-xl text-flux-muted">/ {totalProjects}</span></div>
                <div className="text-[10px] uppercase tracking-widest text-flux-muted">Projects Verified</div>
              </div>
            </div>
            
            <div className="h-2 bg-flux-surface-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-flux-accent shadow-[0_0_10px_var(--color-flux-accent)]" 
              />
            </div>
          </FluxSurface>

          <FluxSurface className="flex-1 transform hover:translate-z-10 transition-transform border-t-2 border-t-flux-danger/50 bg-flux-surface/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-flux-danger/10 blur-[50px] rounded-full -z-10" />
            <h3 className="text-xs uppercase tracking-widest text-flux-danger font-bold mb-6 flex items-center">
              <AlertCircle size={14} className="mr-2" /> Attention Zone
            </h3>
            
            <div className="space-y-4">
              {pendingReviews > 0 ? (
                <div className="p-3 bg-flux-surface-2 rounded-lg border border-flux-warning/20">
                  <div className="text-flux-warning font-bold mb-1">{pendingReviews} Pending Reviews</div>
                  <div className="text-xs text-flux-muted">Projects or modifications require your verification.</div>
                </div>
              ) : (
                <div className="text-xs text-flux-muted">No pending reviews.</div>
              )}

              {/* Find members with high absence as a risk example */}
              {members.filter((m:any) => m.attendance.filter((a:any)=>a.status==='absent').length > 2).map((m:any) => (
                <div key={m.id} className="p-3 bg-flux-surface-2 rounded-lg border border-flux-danger/20 cursor-pointer hover:border-flux-danger/50" onClick={() => navigate(`/team/member/${m.id}`)}>
                  <div className="text-flux-danger font-bold mb-1 flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-flux-danger mr-2 shadow-[0_0_5px_currentColor]" /> {m.name}</div>
                  <div className="text-xs text-flux-muted">Attendance below threshold.</div>
                </div>
              ))}
            </div>
          </FluxSurface>
        </div>
      </div>
    </AppShell>
  );
}
