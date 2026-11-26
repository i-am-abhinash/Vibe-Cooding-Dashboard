import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, LayoutDashboard, Users, FolderKanban, UsersRound, FileCheck, TrendingUp, FileText, Settings, Globe, LogOut, Box, Menu, X } from 'lucide-react';
import api from '../../api';

interface AppShellProps { children: ReactNode; cycle?: any }
export default function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const lead = ['team_lead', 'co_lead', 'admin'].includes(user?.role);
  const prefix = lead ? '/team' : '/member';
  const items = [
    { name: 'Overview', path: prefix, Icon: LayoutDashboard },
    ...(lead ? [{name:'Members',path:'/team/members',Icon:Users}] : []),
    { name: 'Projects', path: prefix+'/projects', Icon: FolderKanban },
    { name: 'Group', path: prefix+'/group', Icon: UsersRound },
    ...(lead ? [{name:'Reviews',path:'/team/reviews',Icon:FileCheck}] : []),
    { name: 'Growth', path: prefix+'/growth', Icon: TrendingUp },
    { name: 'Reports', path: prefix+'/reports', Icon: FileText },
    { name: 'Settings', path: prefix+(lead?'/settings':'/profile'), Icon: Settings }
  ];
  const [query,setQuery] = useState('');
  const [searchOpen,setSearchOpen] = useState(false);
  const [profileOpen,setProfileOpen] = useState(false);
  const [mobileOpen,setMobileOpen] = useState(false);
  const [records,setRecords] = useState<{name:string,path:string,detail:string}[]>([]);
  const searchRef=useRef<HTMLInputElement>(null);
  useEffect(()=>{
    function key(e:KeyboardEvent){if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();searchRef.current?.focus();setSearchOpen(true);}if(e.key==='Escape'){setSearchOpen(false);setProfileOpen(false);setMobileOpen(false);}}
    window.addEventListener('keydown',key);
    return ()=>window.removeEventListener('keydown',key);
  },[]);
  useEffect(()=>{
    if(!searchOpen) return;
    let active=true;
    Promise.allSettled([api.get('/projects'), ...(lead?[api.get('/members')]:[])]).then(results=>{
      if(!active)return;
      const next:{name:string,path:string,detail:string}[]=[];
      const projects=results[0];
      if(projects?.status==='fulfilled'&&Array.isArray(projects.value.data))projects.value.data.forEach((p:any)=>next.push({name:p.name||p.title||'Project',path:prefix+'/projects',detail:'Project'}));
      const members=results[1];
      if(members?.status==='fulfilled'&&Array.isArray(members.value.data))members.value.data.forEach((m:any)=>next.push({name:m.name||'Member',path:'/team/member/'+m.id,detail:'Member'}));
      setRecords(next);
    });
    return ()=>{active=false;};
  },[searchOpen,lead,prefix]);
  const go=(path:string)=>{navigate(path);setMobileOpen(false);setSearchOpen(false);setProfileOpen(false);setQuery('');};
  const matches=[...items.map(i=>({name:i.name,path:i.path,detail:'Page'})),...records].filter(i=>i.name.toLowerCase().includes(query.toLowerCase())).slice(0,8);
  const hour=new Date().getHours();
  const greeting=hour<12?'Good Morning':hour<18?'Good Afternoon':'Good Evening';
  const role= user?.role==='team_lead'?'Team Lead':user?.role==='co_lead'?'Co-Lead':user?.role==='admin'?'Admin':user?.name||'Member';
  const initials=(user?.name||role).split(' ').map((s:string)=>s[0]).slice(0,2).join('').toUpperCase();
  return <div className="vibe-shell viewport">
    <button className="vibe-mobile-toggle glass-panel" aria-label="Toggle navigation" onClick={()=>setMobileOpen(!mobileOpen)}>{mobileOpen?<X/>:<Menu/>}</button>
    <aside className={'vibe-sidebar '+(mobileOpen?'is-open':'')}>
      <button className="vibe-brand" onClick={()=>go(prefix)} aria-label="Vibe Coding home"><strong>VIBE</strong><span>CODING</span></button>
      <nav className="vibe-nav" aria-label="Main navigation">{items.map(({name,path,Icon})=>{
        const active=pathname===path||(path==='/team/members'&&pathname.startsWith('/team/member/'));
        return <button key={path} onClick={()=>go(path)} aria-current={active?'page':undefined} className={'vibe-nav-item '+(active?'is-active':'')}><span className="vibe-nav-icon"><Icon size={23} strokeWidth={1.7}/></span><span>{name}</span></button>;
      })}</nav>
      <button className="vibe-mini-orb" aria-label="Return to overview" onClick={()=>go(prefix)}><Globe size={30}/></button>
    </aside>
    <main className="vibe-main">
      <header className="vibe-header">
        <div className="vibe-greeting"><div className="vibe-header-mark"><Box size={22}/></div><div><h1>{greeting}, {role} <span aria-hidden="true">👋</span></h1><p>{lead?"Here's what's happening with your team today.":"Here's your project workspace today."}</p></div></div>
        <div className="vibe-header-actions">
          <div className="vibe-search-wrap"><form className="vibe-search glass-panel" onSubmit={e=>{e.preventDefault();if(matches[0])go(matches[0].path);}}><Search size={18}/><input ref={searchRef} value={query} aria-label="Search members, projects and pages" placeholder="Search members, projects, or anything..." onFocus={()=>setSearchOpen(true)} onChange={e=>setQuery(e.target.value)}/><kbd>Ctrl</kbd><kbd>K</kbd></form>
          {searchOpen&&<div className="vibe-popover glass-panel" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget)&&e.relatedTarget!==searchRef.current)setSearchOpen(false);}}>{matches.length?matches.map((m,i)=><button key={m.path+i} onClick={()=>go(m.path)}><span>{m.name}</span><small>{m.detail}</small></button>):<p>No results</p>}<button onClick={()=>setSearchOpen(false)}>Close search</button></div>}</div>
          <button className="vibe-round-button glass-panel" aria-label={lead?'Open review inbox':'Open group workspace'} onClick={()=>go(lead?'/team/reviews':'/member/group')}><Bell size={21}/></button>
          <div className="vibe-profile-wrap"><button className="vibe-profile glass-panel" aria-label="Account menu" aria-expanded={profileOpen} onClick={()=>setProfileOpen(!profileOpen)}><span className="vibe-avatar">{initials}</span><ChevronDown size={16}/></button>
          {profileOpen&&<div className="vibe-popover glass-panel"><p>{user?.name||role}</p><button onClick={()=>go(prefix+(lead?'/settings':'/profile'))}><Settings size={16}/> Profile & settings</button><button onClick={()=>{localStorage.removeItem('user');localStorage.removeItem('token');navigate('/login',{replace:true});}}><LogOut size={16}/> Sign out</button></div>}</div>
        </div>
      </header>
      <div className={'vibe-content '+(pathname==='/team'?'vibe-overview-content':'vibe-inner-content')}>{children}</div>
    </main>
  </div>;
}
