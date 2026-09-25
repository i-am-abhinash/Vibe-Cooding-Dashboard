import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Activity, LogOut } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  cycle?: any;
}

export default function AppShell({ children, cycle }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isTeamLead = ['team_lead', 'co_lead'].includes(user?.role);
  
  const navNodes = isTeamLead ? [
    { name: 'Dashboard', path: '/team', icon: <LayoutDashboard size={18} />, angle: -45 },
    { name: 'Members', path: '/team', icon: <Users size={18} />, angle: 0 },
    { name: 'Growth', path: '/team', icon: <Activity size={18} />, angle: 45 },
  ] : [
    { name: 'Workspace', path: '/member', icon: <LayoutDashboard size={18} />, angle: 0 },
  ];

  return (
    <div className="min-h-screen bg-flux-bg text-flux-text overflow-hidden preserve-3d relative">
      <div className="flux-grid" />
      <div className="flux-ambient" />

      {/* Orbital Navigation */}
      <nav className="fixed left-12 top-1/2 -translate-y-1/2 z-50 w-64 h-64 preserve-3d hidden md:block pointer-events-none">
        {/* Vibe Core */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
          <motion.div 
            animate={{ rotateZ: 360 }} 
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border border-flux-accent/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(200,255,61,0.15)]"
          >
            <div className="w-8 h-8 rounded-full bg-flux-accent/20 blur-sm absolute" />
            <div className="w-10 h-10 rounded-full border border-flux-accent/50 flex items-center justify-center bg-flux-surface z-10">
              <span className="text-flux-accent font-bold text-xs tracking-tighter">VC</span>
            </div>
          </motion.div>
          <div className="mt-4 text-[10px] uppercase tracking-widest text-flux-muted font-bold">Vibe Core</div>
        </div>

        {/* Orbit Nodes */}
        {navNodes.map((node) => {
          const isActive = location.pathname === node.path;
          // Calculate orbital positions based on angle
          const rad = (node.angle * Math.PI) / 180;
          const radius = 100;
          const x = Math.cos(rad) * radius + 32; // Offset by Core size
          const y = Math.sin(rad) * radius;

          return (
            <motion.button
              key={node.name}
              onClick={() => navigate(node.path)}
              initial={{ x: 32, y: 0, opacity: 0 }}
              animate={{ x, y, opacity: 1 }}
              whileHover={{ scale: 1.1, z: 20 }}
              className={`absolute top-1/2 left-0 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full border pointer-events-auto transition-colors preserve-3d group
                ${isActive ? 'bg-flux-accent text-flux-bg border-flux-accent shadow-[0_0_20px_rgba(200,255,61,0.4)]' : 'bg-flux-surface-2 text-flux-text border-flux-accent/20 hover:border-flux-accent/50'}
              `}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {node.icon}
              <div className="absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity text-xs tracking-widest uppercase whitespace-nowrap pointer-events-none">
                {node.name}
              </div>
              {/* Connection Line */}
              <svg className="absolute top-1/2 right-full w-24 h-[1px] pointer-events-none -z-10 opacity-20 group-hover:opacity-60 transition-opacity">
                <line x1="0" y1="0" x2="100%" y2="0" stroke="var(--flux-accent)" strokeWidth="1" />
              </svg>
            </motion.button>
          )
        })}
      </nav>

      {/* Top Utility */}
      <header className="fixed top-8 right-12 z-50 flex items-center gap-6 pointer-events-none">
        <div className="flux-panel px-6 py-2 rounded-full flex items-center gap-4 pointer-events-auto">
          {cycle && (
            <div className="flex items-center gap-3 pr-4 border-r border-flux-text/10">
              <span className="w-2 h-2 rounded-full bg-flux-accent animate-pulse" />
              <span className="text-[10px] tracking-widest uppercase font-bold text-flux-muted">Cycle {cycle.month}/{cycle.year}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-bold">{user?.name}</div>
              <div className="text-[9px] uppercase tracking-widest text-flux-muted">{user?.role?.replace('_', ' ')}</div>
            </div>
            <button onClick={handleLogout} className="text-flux-muted hover:text-flux-danger transition-colors ml-2">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Spatial Canvas */}
      <main className="pt-24 pl-8 md:pl-64 pr-8 pb-12 min-h-screen preserve-3d">
        <motion.div
          initial={{ opacity: 0, z: -100 }}
          animate={{ opacity: 1, z: 0 }}
          transition={{ duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] }}
          className="max-w-[1600px] mx-auto w-full preserve-3d"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
