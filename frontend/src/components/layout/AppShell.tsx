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
    { name: 'Workspace', path: '/team', icon: <LayoutDashboard size={18} /> },
    { name: 'Members', path: '/team', icon: <Users size={18} /> },
    { name: 'Analytics', path: '/team', icon: <Activity size={18} /> },
  ] : [
    { name: 'Workspace', path: '/member', icon: <LayoutDashboard size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-cinematic-bg text-cinematic-text overflow-hidden preserve-3d relative">
      <div className="cinematic-atmosphere" />

      {/* Thin Floating Navigation Rail */}
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-8 preserve-3d pointer-events-none md:flex hidden">
        {/* Rail Line */}
        <div className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cinematic-blue/20 to-transparent -z-10" />
        
        {/* Core Node */}
        <div className="w-12 h-12 rounded-full material-crystal flex items-center justify-center mb-4 pointer-events-auto shadow-[0_0_20px_rgba(91,140,255,0.2)]">
          <span className="text-cinematic-blue font-light tracking-widest text-xs">VC</span>
        </div>

        {navNodes.map((node) => {
          const isActive = location.pathname === node.path;
          return (
            <motion.button
              key={node.name}
              onClick={() => navigate(node.path)}
              whileHover={{ z: 20, scale: 1.1 }}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full pointer-events-auto transition-all preserve-3d group
                ${isActive ? 'bg-cinematic-blue/10 text-cinematic-blue border border-cinematic-blue/30 shadow-[0_0_15px_rgba(91,140,255,0.3)]' : 'bg-transparent text-cinematic-text-2 hover:text-cinematic-text'}
              `}
            >
              {node.icon}
              <div className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                <div className="w-4 h-[1px] bg-cinematic-blue/50 mr-3" />
                <div className="material-acrylic px-4 py-2 text-xs tracking-widest uppercase whitespace-nowrap rounded">
                  {node.name}
                </div>
              </div>
            </motion.button>
          )
        })}
      </nav>

      {/* Top Header */}
      <header className="fixed top-8 left-32 right-12 z-50 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-xl font-light tracking-[0.2em] text-cinematic-text">VIBE<span className="text-cinematic-blue">CODING</span></h1>
        </div>
        <div className="flex items-center gap-8 pointer-events-auto">
          {cycle && (
            <div className="text-right">
              <div className="text-xs tracking-[0.15em] uppercase text-cinematic-text">{cycle.month} 2026</div>
              <div className="text-[9px] tracking-widest uppercase text-cinematic-blue">Cycle Phase Active</div>
            </div>
          )}
          <div className="flex items-center gap-4 material-acrylic px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-cinematic-blue shadow-[0_0_10px_rgba(91,140,255,0.8)] animate-pulse" />
            <span className="text-xs font-light tracking-widest">{user?.name}</span>
            <button onClick={handleLogout} className="text-cinematic-muted hover:text-cinematic-danger transition-colors ml-2">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Spatial Canvas */}
      <main className="pt-32 pl-8 md:pl-40 pr-12 pb-12 min-h-screen preserve-3d">
        <motion.div
          initial={{ opacity: 0, z: -50 }}
          animate={{ opacity: 1, z: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[1600px] mx-auto w-full preserve-3d"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
