import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import AppShell from '../components/layout/AppShell';
import { CinematicSurface } from '../components/ui/Shared';

export default function TeamDashboard() {
  const [data, setData] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/team-dashboard').then(res => setData(res.data)).catch(console.error);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!data) return <AppShell><div className="animate-pulse h-64 material-glass rounded-3xl" /></AppShell>;

  const { members, cycle, pendingReviews } = data;
  let totalProjects = members.length * 4;
  let completedProjects = 0;
  
  members.forEach((m: any) => {
    completedProjects += m.projects.filter((p:any) => p.status === 'completed' || p.status === 'verified').length;
  });

  const progressPct = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  return (
    <AppShell cycle={cycle}>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 preserve-3d">
        
        {/* CENTERPIECE: LAYERED 3D STRUCTURE */}
        <div className="xl:col-span-7 relative h-[700px] flex items-center justify-center preserve-3d">
          
          <motion.div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none preserve-3d"
            animate={{ rotateX: mousePosition.y * -0.5, rotateY: mousePosition.x * 0.5 }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Outer Glow */}
            <div className="absolute w-[600px] h-[600px] bg-cinematic-blue/5 rounded-full blur-[100px] -z-10" />
            
            {/* Layer 1: Outer Wireframe Ring */}
            <motion.div 
              animate={{ rotateZ: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              className="absolute w-[500px] h-[500px] rounded-full border border-cinematic-blue/10 preserve-3d"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Member Nodes in Orbit */}
              {members.map((m: any, i: number) => {
                const angle = (i / members.length) * 360;
                return (
                  <div key={m.id} className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 preserve-3d" style={{ transform: `rotateZ(${angle}deg) translateX(250px) rotateZ(-${angle}deg)` }}>
                    <motion.div 
                      whileHover={{ scale: 1.2, z: 20 }}
                      onClick={() => navigate(`/team/member/${m.id}`)}
                      className="w-10 h-10 rounded-full material-crystal flex items-center justify-center cursor-pointer pointer-events-auto shadow-[0_0_20px_rgba(91,140,255,0.2)] transition-colors hover:bg-cinematic-blue/20"
                      title={m.name}
                    >
                      <span className="text-[10px] font-light text-cinematic-text tracking-widest">{m.name.substring(0,2).toUpperCase()}</span>
                    </motion.div>
                  </div>
                )
              })}
            </motion.div>

            {/* Layer 2: Inner Progress Ring */}
            <motion.div 
              animate={{ rotateZ: -360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              className="absolute w-[350px] h-[350px] rounded-full border border-cinematic-violet/10 border-t-cinematic-violet/40 preserve-3d"
            />
            
            {/* Core Surface */}
            <div className="absolute w-[220px] h-[220px] rounded-full material-glass border-cinematic-blue/30 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(91,140,255,0.15)] preserve-3d transform translate-z-10">
              <span className="text-5xl font-extralight text-cinematic-text mb-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{progressPct}%</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-cinematic-blue font-bold">Team Output</span>
            </div>
          </motion.div>

        </div>

        {/* METRICS & SURFACES */}
        <div className="xl:col-span-5 flex flex-col justify-center gap-8 preserve-3d">
          
          <CinematicSurface className="transform hover:translate-z-10 transition-transform duration-500 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-cinematic-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-cinematic-text-2 font-light mb-6">Milestones Achieved</h3>
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-5xl font-light text-cinematic-text">{completedProjects}</span>
              <span className="text-sm tracking-widest text-cinematic-muted">/ {totalProjects} PROJECTS</span>
            </div>
            <div className="h-[2px] bg-cinematic-surface-2 w-full mt-4">
              <motion.div 
                initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-cinematic-blue shadow-[0_0_10px_var(--accent-blue)]" 
              />
            </div>
          </CinematicSurface>

          <CinematicSurface material="acrylic" className="transform hover:translate-z-10 transition-transform duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cinematic-warning/10 blur-[50px] rounded-full -z-10" />
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-cinematic-warning font-bold mb-6 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-cinematic-warning shadow-[0_0_10px_currentColor] mr-3 animate-pulse" />
              Attention Required
            </h3>
            
            <div className="space-y-4">
              {pendingReviews > 0 ? (
                <div className="group cursor-pointer">
                  <div className="flex justify-between items-center border-b border-cinematic-text/5 pb-3">
                    <span className="text-sm text-cinematic-text font-light">{pendingReviews} Reviews Pending</span>
                    <span className="text-[10px] uppercase tracking-widest text-cinematic-warning opacity-0 group-hover:opacity-100 transition-opacity">Action →</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs font-light text-cinematic-muted">No pending reviews.</div>
              )}

              {members.filter((m:any) => m.attendance.filter((a:any)=>a.status==='absent').length > 2).map((m:any) => (
                <div key={m.id} className="group cursor-pointer" onClick={() => navigate(`/team/member/${m.id}`)}>
                   <div className="flex justify-between items-center border-b border-cinematic-text/5 pb-3">
                    <span className="text-sm text-cinematic-text font-light">{m.name}</span>
                    <span className="text-[10px] uppercase tracking-widest text-cinematic-danger">Attendance Risk</span>
                  </div>
                </div>
              ))}
            </div>
          </CinematicSurface>

          <div className="flex gap-8 px-4 mt-4">
             <div>
               <div className="text-2xl font-light text-cinematic-text mb-1">{members.length}</div>
               <div className="text-[9px] uppercase tracking-[0.1em] text-cinematic-muted">Active Operatives</div>
             </div>
             <div>
               <div className="text-2xl font-light text-cinematic-text mb-1">76%</div>
               <div className="text-[9px] uppercase tracking-[0.1em] text-cinematic-muted">Group Contribution</div>
             </div>
          </div>
          
        </div>
      </div>
    </AppShell>
  );
}
