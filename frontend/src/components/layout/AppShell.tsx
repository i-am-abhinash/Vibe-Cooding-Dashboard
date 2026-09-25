import { useNavigate, useLocation } from 'react-router-dom';

import { Search, Bell, ChevronDown, LayoutDashboard, Users, FolderKanban, UsersRound, FileCheck, TrendingUp, FileText, Settings, Globe } from 'lucide-react';

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
    <div className="viewport font-sans bg-brand-bg-1" style={{ width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex' }}>
      
      {/* SVG Filter for Glass Refraction */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <filter id="glass-refraction">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* LEFT SIDEBAR REGION - Responsive fixed width */}
      <div className="w-[105px] xl:w-[115px] h-full py-4 pl-4 pr-2 flex-shrink-0 relative z-[100]">
        <aside 
          className="w-full h-full rounded-[34px] flex flex-col items-center py-8 relative"
          
        >
          {/* LAYER 1 & 2: Glass Body, Blur, and Refraction */}
          <div 
            className="absolute inset-0 rounded-[34px] z-[0]"
            style={{
              background: 'rgba(8, 15, 32, 0.35)', // Dark transparent glass body
              backdropFilter: 'blur(20px) url(#glass-refraction)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.7)', // Soft dark depth shadow separating it from environment
            }}
          />

          {/* LAYER 3: Glass Thickness & Inner Highlight */}
          <div 
            className="absolute inset-[1px] rounded-[33px] z-[10] pointer-events-none"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.05)', // Extremely thin inner surface
              boxShadow: 'inset 0 0 20px rgba(139, 92, 246, 0.1), inset 1px 1px 3px rgba(255, 255, 255, 0.15)', // Light trapped inside
            }}
          />

          {/* LAYER 4, 5 & 6: Edge Reflection, Specular Highlights & Environment Color */}
          <div 
            className="absolute inset-0 rounded-[34px] z-[10] pointer-events-none overflow-hidden"
            style={{
              // Edge reflection interacting with light
              borderTop: '1.5px solid rgba(255, 255, 255, 0.4)',
              borderLeft: '1px solid rgba(77, 163, 255, 0.3)',
              borderRight: '1px solid rgba(139, 92, 246, 0.15)',
              borderBottom: '1px solid rgba(20, 30, 50, 0.4)',
              // Depth gradient and subtle environment reflection
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 25%, rgba(139,92,246,0.03) 75%, rgba(77,163,255,0.08) 100%)',
            }}
          >
            {/* Specular curved reflection on the surface */}
            <div 
              className="absolute top-0 left-[15%] w-[40%] h-[30%] opacity-40 rounded-full"
              style={{
                background: 'radial-gradient(ellipse at top left, rgba(255,255,255,0.2) 0%, transparent 70%)',
                transform: 'rotate(-25deg) scaleY(2)',
                filter: 'blur(4px)'
              }}
            />
          </div>

          {/* Logo Area */}
          <div className="flex flex-col items-center gap-1 mb-10 relative z-[20]" style={{ transform: 'translateZ(1px)' }}>
            <span className="font-extrabold text-xl leading-none text-white tracking-wide drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]">VIBE</span>
            <span className="text-[10px] text-brand-blue-1 tracking-[0.25em] font-bold drop-shadow-[0_0_8px_rgba(77,163,255,0.5)]">CODING</span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 w-full flex flex-col gap-5 items-center relative z-[20]">
            {navItems.map(item => {
              const isActive = location.pathname === item.path || (item.path !== '/team' && location.pathname.startsWith(item.path));
              
              if (isActive) {
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className="flex flex-col items-center gap-2 group relative z-[20] w-full"
                  >
                    {/* Active circular glowing physical glass control */}
                    <div className="relative w-[46px] h-[46px] rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                      style={{
                        background: 'rgba(20, 30, 50, 0.4)',
                        backdropFilter: 'blur(8px)',
                        // Rim light
                        borderTop: '1.5px solid rgba(255, 255, 255, 0.6)',
                        borderBottom: '1px solid rgba(77, 163, 255, 0.2)',
                        // Inner blue light and slight shadow depth
                        boxShadow: '0 8px 16px rgba(0,0,0,0.5), inset 0 0 20px rgba(77, 163, 255, 0.6), inset 0 -4px 12px rgba(77, 163, 255, 0.4)'
                      }}
                    >
                      {/* Internal spherical specular highlight */}
                      <div className="absolute top-[2px] left-[15%] w-[70%] h-[35%] rounded-t-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                      
                      <div className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] relative z-[20]">
                        {item.icon}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-white tracking-wide drop-shadow-[0_2px_8px_rgba(77,163,255,0.8)]">{item.name}</span>
                  </button>
                )
              }

              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-2 group w-full transition-all duration-300 hover:-translate-y-[1px] hover:scale-[1.02]"
                >
                  <div className="text-brand-text-muted/60 group-hover:text-brand-blue-2 transition-colors duration-300 group-hover:drop-shadow-[0_0_8px_rgba(77,163,255,0.6)]">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-bold text-brand-text-muted/50 group-hover:text-white transition-colors duration-300 tracking-wide">{item.name}</span>
                </button>
              )
            })}
          </nav>

          {/* Bottom Orb */}
          <div className="mt-auto mb-2 relative group cursor-pointer z-[10]">
            {/* Environmental glow from bottom */}
            <div className="absolute -inset-8 bg-brand-blue/15 blur-[25px] rounded-full z-[10]" />
            
            <div className="relative w-[42px] h-[42px] rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
              style={{
                background: 'radial-gradient(circle at 35% 35%, rgba(139, 192, 255, 0.9) 0%, rgba(77, 163, 255, 0.3) 50%, rgba(10, 15, 25, 0.9) 100%)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.6), 0 0 30px rgba(77, 163, 255, 0.4), inset -3px -3px 8px rgba(0,0,0,0.6), inset 2px 2px 8px rgba(255,255,255,0.5)',
                borderTop: '1px solid rgba(255,255,255,0.4)',
                borderBottom: '1px solid rgba(77,163,255,0.2)'
              }}
            >
              <Globe size={22} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
            </div>
          </div>
        </aside>
      </div>

      {/* MAIN REGION - Flexible width */}
      <main className="flex-1 h-full flex flex-col relative z-[10] overflow-hidden pr-6 py-4">
        
        {/* Top Header */}
        <header className="flex-shrink-0 h-[64px] flex items-center justify-between z-[40] mb-6">
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
          <div className="flex-1 relative min-h-0 w-full overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
