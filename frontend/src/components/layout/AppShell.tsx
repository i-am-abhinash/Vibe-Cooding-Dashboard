import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, LayoutDashboard, Users, FolderKanban, UsersRound, FileCheck, TrendingUp, FileText, Settings, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AppShellProps {
  children: React.ReactNode;
  cycle?: any;
}

export default function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isTeamLead = ['team_lead', 'co_lead'].includes(user?.role);
  
  // Subtle parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const navItems = isTeamLead ? [
    { name: 'Overview', path: '/team', icon: <LayoutDashboard size={20} /> },
    { name: 'Members', path: '/team/members', icon: <Users size={20} /> },
    { name: 'Projects', path: '/team/projects', icon: <FolderKanban size={20} /> },
    { name: 'Group', path: '/team/group', icon: <UsersRound size={20} /> },
    { name: 'Reviews', path: '/team/reviews', icon: <FileCheck size={20} /> },
    { name: 'Growth', path: '/team/growth', icon: <TrendingUp size={20} /> },
    { name: 'Reports', path: '/team/reports', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/team/settings', icon: <Settings size={20} /> },
  ] : [
    { name: 'Workspace', path: '/member', icon: <LayoutDashboard size={20} /> },
  ];

  return (
    <div className="w-screen h-screen overflow-hidden bg-brand-bg-1 font-sans">
      <div 
        className="exact-container"
        style={{ transform: `translate(${mousePos.x * -2}px, ${mousePos.y * -2}px)` }}
      >
        
        {/* Exact Floating Sidebar Pill */}
        <aside 
          className="absolute left-[13px] top-[12px] bottom-[23px] w-[130px] rounded-[34px] flex flex-col items-center py-10 z-50 transition-transform duration-100 ease-out overflow-hidden"
          style={{ 
            transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)`,
            background: 'rgba(12, 16, 28, 0.45)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 192, 255, 0.2)',
            boxShadow: 'inset 0 0 20px rgba(139, 92, 246, 0.1), inset 1px 1px 2px rgba(255, 255, 255, 0.15), 0 20px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Subtle reflection overlay moving with mouse */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: `radial-gradient(circle 200px at ${50 + mousePos.x * 50}% ${50 + mousePos.y * 50}%, rgba(255,255,255,0.1) 0%, transparent 100%)`
            }}
          />

          {/* Logo Area */}
          <div className="flex flex-col items-center gap-1 mb-12 relative z-10">
            <span className="font-extrabold text-2xl leading-none text-white tracking-wide" style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>VIBE</span>
            <span className="text-[10px] text-brand-blue-1 tracking-[0.25em] font-bold">CODING</span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 w-full flex flex-col gap-6 items-center relative z-10">
            {navItems.map(item => {
              const isActive = location.pathname === item.path || (item.path !== '/team' && location.pathname.startsWith(item.path));
              
              if (isActive) {
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className="flex flex-col items-center gap-2 group relative z-10 w-full"
                    style={{ transform: 'translateZ(10px)' }}
                  >
                    {/* Active circular glowing glass control */}
                    <div className="relative w-[55px] h-[55px] rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                      style={{
                        background: 'rgba(77, 163, 255, 0.15)',
                        border: '1px solid rgba(77, 163, 255, 0.5)',
                        boxShadow: '0 0 30px rgba(77, 163, 255, 0.4), inset 0 0 15px rgba(77, 163, 255, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)'
                      }}
                    >
                      <div className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                        {item.icon}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-white tracking-wide drop-shadow-[0_0_5px_rgba(77,163,255,0.8)]">{item.name}</span>
                  </button>
                )
              }

              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-2 group w-full transition-all duration-300 hover:-translate-y-[1px] hover:scale-[1.02]"
                >
                  <div className="text-brand-text-muted/70 group-hover:text-brand-blue-2 transition-colors duration-300 drop-shadow-[0_0_0_rgba(0,0,0,0)] group-hover:drop-shadow-[0_0_8px_rgba(77,163,255,0.6)]">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-bold text-brand-text-muted/60 group-hover:text-white transition-colors duration-300 tracking-wide">{item.name}</span>
                </button>
              )
            })}
          </nav>

          {/* Bottom Orb */}
          <div className="mt-auto mb-2 relative group cursor-pointer z-10">
            {/* Environmental glow from bottom */}
            <div className="absolute -inset-6 bg-brand-blue/10 blur-[20px] rounded-full -z-10" />
            
            <div className="relative w-[50px] h-[50px] rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(139, 192, 255, 0.8) 0%, rgba(77, 163, 255, 0.2) 60%, rgba(14, 18, 30, 0.9) 100%)',
                boxShadow: '0 0 25px rgba(77, 163, 255, 0.5), inset -2px -2px 6px rgba(0,0,0,0.5), inset 2px 2px 6px rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <Globe size={22} className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
            </div>
          </div>
        </aside>

        {/* Top Header */}
        <header 
          className="absolute left-[140px] right-[24px] top-[24px] h-[64px] flex items-center justify-between z-40 transition-transform duration-100 ease-out"
          style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)` }}
        >
          {/* Greeting */}
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-xl border border-white/20">
               👋
             </div>
             <div className="flex flex-col justify-center">
               <h1 className="font-bold text-2xl tracking-tight text-white m-0 leading-tight">Good Evening, Team Lead</h1>
               <p className="text-brand-text-muted text-sm font-medium m-0 leading-tight">Here's what's happening with your team today.</p>
             </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-4 text-brand-text-muted" />
              <input 
                type="text" 
                placeholder="Search members, projects, or anything..."
                className="w-[320px] glass-panel rounded-full py-3 pl-12 pr-20 text-sm text-white placeholder:text-brand-text-muted outline-none transition-colors border-white/10 focus:border-brand-blue/50"
              />
              <div className="absolute right-4 flex gap-1">
                <span className="text-[10px] font-bold text-brand-text-muted bg-white/10 px-2 py-0.5 rounded">Ctrl</span>
                <span className="text-[10px] font-bold text-brand-text-muted bg-white/10 px-2 py-0.5 rounded">K</span>
              </div>
            </div>

            <button className="relative w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors">
              <Bell size={20} className="text-white" />
              <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-brand-orange rounded-full shadow-[0_0_10px_var(--brand-orange)]" />
            </button>

            <div className="flex items-center gap-3 cursor-pointer glass-panel py-1.5 pl-1.5 pr-4 rounded-full border border-white/10 hover:border-white/20 transition-colors">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-brand-bg-2 border-2 border-brand-blue/50 flex items-center justify-center">
                {/* Assuming user avatar is an image, we use a placeholder or initials if missing. The reference uses a real photo, we'll use a photo placeholder */}
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Lead'}`} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <ChevronDown size={16} className="text-brand-text-muted" />
            </div>
          </div>
        </header>

        {/* MAIN CONTENT CANVAS */}
        <main 
          className="absolute left-[140px] right-[24px] top-[104px] bottom-[24px] z-10 transition-transform duration-100 ease-out"
          style={{ transform: `translate(${mousePos.x * 3}px, ${mousePos.y * 3}px)` }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
