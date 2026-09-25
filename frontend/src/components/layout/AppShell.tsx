import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, LogOut, BarChart } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
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

  const navItems = user?.role === 'member' ? [
    { name: 'Dashboard', path: '/member', icon: <LayoutDashboard size={20} /> },
  ] : [
    { name: 'Dashboard', path: '/team', icon: <LayoutDashboard size={20} /> },
    { name: 'Members', path: '/team', icon: <Users size={20} /> },
    { name: 'Analytics', path: '/team', icon: <BarChart size={20} /> },
  ];

  // Calculate days for phase indicator
  const today = new Date();
  let phaseText = 'CYCLE PENDING';
  let phaseProgress = 0;
  
  if (cycle) {
    const startInd = new Date(cycle.individualStartDate);
    const endInd = new Date(cycle.individualEndDate);
    const endGroup = new Date(cycle.groupEndDate);
    
    if (today <= endInd) {
      phaseText = 'INDIVIDUAL PHASE';
      const total = endInd.getTime() - startInd.getTime();
      const passed = today.getTime() - startInd.getTime();
      phaseProgress = Math.max(0, Math.min(100, (passed / total) * 100));
    } else {
      phaseText = 'GROUP PHASE';
      const total = endGroup.getTime() - endInd.getTime();
      const passed = today.getTime() - endInd.getTime();
      phaseProgress = Math.max(0, Math.min(100, (passed / total) * 100));
    }
  }

  return (
    <div className="min-h-screen bg-background text-text-primary overflow-hidden depth-layer">
      {/* Background Effects */}
      <div className="bg-grid"></div>
      <div className="bg-glow"></div>

      {/* Floating Top Header */}
      <header className="fixed top-0 left-0 right-0 h-20 z-50 px-8 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-6 glass-panel px-6 py-3 rounded-full pointer-events-auto">
          <div className="font-bold text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            VIBE CODING
          </div>
          {cycle && (
            <div className="flex flex-col border-l border-border pl-6">
              <span className="text-[10px] uppercase tracking-widest text-text-muted">{phaseText}</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm font-semibold">{cycle.month}/{cycle.year} Cycle</span>
                <div className="w-32 h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${phaseProgress}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 glass-panel px-4 py-2 rounded-full pointer-events-auto">
          <div className="flex flex-col items-end mr-2">
            <span className="text-sm font-bold">{user?.name}</span>
            <span className="text-[10px] uppercase text-text-muted">{user?.role?.replace('_', ' ')}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center font-bold text-primary">
            {user?.name?.substring(0,2).toUpperCase()}
          </div>
          <button onClick={handleLogout} className="p-2 hover:text-danger transition-colors ml-2">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Floating Dock Navigation */}
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-40 glass-panel rounded-2xl py-6 px-3 flex flex-col gap-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <button 
              key={item.name}
              onClick={() => navigate(item.path)}
              className="relative p-3 rounded-xl transition-all duration-300 group outline-none"
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNav" 
                  className="absolute inset-0 bg-primary/20 rounded-xl border border-primary/50 shadow-[0_0_15px_var(--color-primary-glow)]"
                />
              )}
              <div className={`relative z-10 transition-colors ${isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'}`}>
                {item.icon}
              </div>
              
              {/* Tooltip */}
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 glass-panel rounded-lg text-sm font-medium opacity-0 -translate-x-4 pointer-events-none transition-all group-hover:opacity-100 group-hover:translate-x-0">
                {item.name}
              </div>
            </button>
          )
        })}
      </nav>

      {/* Main Content Area */}
      <main className="pt-28 pl-32 pr-8 pb-12 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-[1400px] mx-auto w-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
