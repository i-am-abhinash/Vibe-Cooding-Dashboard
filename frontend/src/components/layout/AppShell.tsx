import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FolderKanban, UsersRound, FileCheck, TrendingUp, FileText, Settings, Search, Bell, ChevronDown, Hexagon, Globe } from 'lucide-react';

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

  const navItems = isTeamLead ? [
    { name: 'Overview', path: '/team', icon: <LayoutDashboard size={18} /> },
    { name: 'Members', path: '/team/members', icon: <Users size={18} /> },
    { name: 'Projects', path: '/team/projects', icon: <FolderKanban size={18} /> },
    { name: 'Group', path: '/team/group', icon: <UsersRound size={18} /> },
    { name: 'Reviews', path: '/team/reviews', icon: <FileCheck size={18} /> },
    { name: 'Growth', path: '/team/growth', icon: <TrendingUp size={18} /> },
    { name: 'Reports', path: '/team/reports', icon: <FileText size={18} /> },
    { name: 'Settings', path: '/team/settings', icon: <Settings size={18} /> },
  ] : [
    { name: 'Workspace', path: '/member', icon: <LayoutDashboard size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-brand-bg-1 text-white overflow-hidden relative flex">
      <div className="terrain-bg" />
      <div className="terrain-glow" />

      {/* LEFT SIDEBAR */}
      <aside className="fixed left-0 top-0 bottom-0 w-[230px] glass-card rounded-r-[32px] rounded-l-none z-40 flex flex-col pt-8 pb-8">
        <div className="px-8 flex items-center gap-3 mb-12">
          <div className="w-8 h-8 rounded bg-brand-blue/20 border border-brand-blue/50 flex items-center justify-center glow-blue text-brand-blue">
            <Hexagon size={16} fill="currentColor" />
          </div>
          <div>
            <div className="font-bold text-lg leading-tight tracking-wide">VIBE</div>
            <div className="text-[9px] text-brand-text-muted tracking-[0.2em] font-semibold">CODING</div>
          </div>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-2">
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/team' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 w-full text-left
                  ${isActive ? 'bg-brand-blue/20 text-white' : 'text-brand-text-muted hover:text-white hover:bg-white/5'}
                `}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isActive ? 'bg-brand-blue glow-blue text-white' : 'text-current'}`}>
                  {item.icon}
                </div>
                <span className={`font-semibold text-sm ${isActive ? 'tracking-wide' : ''}`}>{item.name}</span>
              </button>
            )
          })}
        </nav>

        <div className="px-8 mt-auto flex justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-blue to-brand-violet p-[1px] glow-violet">
            <div className="w-full h-full rounded-full bg-brand-bg-2 flex items-center justify-center relative overflow-hidden">
              <Globe size={24} className="text-brand-violet opacity-80" />
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 ml-[230px] flex flex-col min-h-screen relative z-10">
        
        {/* TOP BAR */}
        <header className="h-24 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex gap-4 items-center">
             <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-xl">
               👋
             </div>
             <div>
               <h1 className="font-bold text-lg">Good Evening, {user?.name || 'Team Lead'}</h1>
               <p className="text-brand-text-muted text-sm">Here's what's happening with your team today.</p>
             </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-4 text-brand-text-muted" />
              <input 
                type="text" 
                placeholder="Search members, projects, or anything..."
                className="w-72 bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-16 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-blue/50 transition-colors backdrop-blur-md"
              />
              <div className="absolute right-4 text-[10px] font-bold text-brand-text-muted bg-white/10 px-2 py-0.5 rounded">Ctrl K</div>
            </div>

            <button className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Bell size={18} className="text-white" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-brand-red rounded-full shadow-[0_0_8px_var(--brand-red)]" />
            </button>

            <div className="flex items-center gap-2 cursor-pointer p-1 pr-3 rounded-full hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-full border-2 border-brand-blue overflow-hidden bg-brand-bg-2 flex items-center justify-center font-bold text-brand-blue text-sm">
                {user?.name?.substring(0,2).toUpperCase()}
              </div>
              <ChevronDown size={14} className="text-brand-text-muted" />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-8 pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
