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
          className="absolute left-[16px] top-[16px] bottom-[16px] w-[100px] glass-panel rounded-[32px] flex flex-col items-center py-8 z-50 transition-transform duration-100 ease-out"
          style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)` }}
        >
          {/* Logo Area */}
          <div className="flex flex-col items-center gap-2 mb-10">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-brand-blue font-light tracking-wide text-sm">
              <span className="font-bold text-lg leading-none">VIBE</span>
            </div>
            <div className="text-[9px] text-brand-text-muted tracking-[0.2em] font-bold">CODING</div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 w-full flex flex-col gap-4 items-center">
            {navItems.map(item => {
              const isActive = location.pathname === item.path || (item.path !== '/team' && location.pathname.startsWith(item.path));
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-1.5 w-[80px] py-2 rounded-2xl transition-all duration-300
                    ${isActive ? 'bg-gradient-to-b from-brand-blue/20 to-transparent border border-brand-blue/30 glow-blue text-white' : 'text-brand-text-muted hover:text-white'}
                  `}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-brand-blue text-white shadow-[0_0_15px_rgba(77,163,255,0.6)]' : 'bg-transparent'}`}>
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-brand-text-muted'}`}>{item.name}</span>
                </button>
              )
            })}
          </nav>

          {/* Bottom Globe Indicator */}
          <div className="mt-auto">
            <div className="w-14 h-14 rounded-full bg-brand-bg-1 border border-brand-blue/30 flex items-center justify-center glow-blue">
              <Globe size={24} className="text-brand-blue/80" />
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
