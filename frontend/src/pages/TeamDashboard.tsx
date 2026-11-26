import { useEffect, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Users, FolderKanban, AlertTriangle, Check, Play, Circle, Box, GitPullRequest, UserRound, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';
import AppShell from '../components/layout/AppShell';

const cap=(n:any)=>Math.max(0,Math.min(100,Math.round(Number(n)||0)));
const initials=(name:string)=>name.split(' ').filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
const glow=['#5cb9ff','#a36dff','#80d4ff','#796bff','#c08dff','#38ecf4','#ffac64'];
const states=['IDEA','PLANNING','DEVELOPMENT','DOCUMENTATION','GITHUB_SUBMISSION','VERIFICATION','MODIFICATION_REQUESTED','RESUBMISSION','FINAL_VERIFICATION','COMPLETED'];

function OrbArt(){
  return <svg className="vibe-orb-art" viewBox="0 0 800 560" role="presentation" aria-hidden="true">
    <defs>
      <radialGradient id="orbHalo"><stop stopColor="#526dff" stopOpacity=".34"/><stop offset=".64" stopColor="#5466ff" stopOpacity=".09"/><stop offset="1" stopColor="#2640b7" stopOpacity="0"/></radialGradient>
      <radialGradient id="orbGlass" cx=".34" cy=".27" r=".78"><stop stopColor="#8caeff" stopOpacity=".5"/><stop offset=".22" stopColor="#4c61cf" stopOpacity=".33"/><stop offset=".48" stopColor="#050b29" stopOpacity=".94"/><stop offset=".69" stopColor="#091229"/><stop offset=".85" stopColor="#494caa"/><stop offset=".94" stopColor="#b4a5ff"/><stop offset="1" stopColor="#596cdb"/></radialGradient>
      <linearGradient id="orbRim" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fbf4ff"/><stop offset=".25" stopColor="#b1d4ff"/><stop offset=".48" stopColor="#6467c0"/><stop offset=".72" stopColor="#4d66db"/><stop offset=".9" stopColor="#f9c6ff"/><stop offset="1" stopColor="#a8daff"/></linearGradient>
      <linearGradient id="orbRibbonA" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e4b5ff"/><stop offset=".36" stopColor="#5b73ff"/><stop offset=".75" stopColor="#39e4ff"/><stop offset="1" stopColor="#bca0ff"/></linearGradient>
      <linearGradient id="orbRibbonB" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#21d8ff"/><stop offset=".35" stopColor="#5b74fc"/><stop offset=".72" stopColor="#bf75fb"/><stop offset="1" stopColor="#ffd7fa"/></linearGradient>
      <radialGradient id="orbInner"><stop stopColor="#050919"/><stop offset=".72" stopColor="#090d26"/><stop offset="1" stopColor="#111b4f" stopOpacity=".15"/></radialGradient>
      <linearGradient id="orbPlatform" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#7e92bc"/><stop offset=".28" stopColor="#293951"/><stop offset=".55" stopColor="#101a2d"/><stop offset="1" stopColor="#06080e"/></linearGradient>
      <linearGradient id="orbMetal"><stop stopColor="#171d35"/><stop offset=".48" stopColor="#7887b7"/><stop offset=".7" stopColor="#25304c"/><stop offset="1" stopColor="#151a2b"/></linearGradient>
      <radialGradient id="orbNode" cx=".3" cy=".2" r=".8"><stop stopColor="#fff"/><stop offset=".18" stopColor="#adf7ff"/><stop offset=".56" stopColor="#1cb5ff"/><stop offset="1" stopColor="#1451d1"/></radialGradient>
      <radialGradient id="orbNodeV" cx=".3" cy=".2" r=".8"><stop stopColor="#fff"/><stop offset=".3" stopColor="#e8beff"/><stop offset=".7" stopColor="#9d5eff"/><stop offset="1" stopColor="#4022c4"/></radialGradient>
      <radialGradient id="orbNodeO" cx=".3" cy=".2" r=".8"><stop stopColor="#fff"/><stop offset=".3" stopColor="#ffdf9b"/><stop offset=".7" stopColor="#ff9b3e"/><stop offset="1" stopColor="#b04b0e"/></radialGradient>
      <filter id="orbGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="orbBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12"/></filter>
      <clipPath id="orbClip"><circle cx="400" cy="235" r="169"/></clipPath>
    </defs>
    <ellipse cx="400" cy="267" rx="330" ry="264" fill="url(#orbHalo)"/>
    <ellipse cx="400" cy="506" rx="278" ry="44" fill="#000" opacity=".8" filter="url(#orbBlur)"/>
    <ellipse cx="400" cy="480" rx="260" ry="60" fill="#396dff" opacity=".13" filter="url(#orbBlur)"/>
    <path d="M151 457 Q400 403 649 457 L676 503 Q400 572 124 503Z" fill="url(#orbPlatform)" stroke="#607394" strokeOpacity=".56"/>
    <ellipse cx="400" cy="457" rx="249" ry="62" fill="url(#orbMetal)" stroke="#778bb5"/>
    <ellipse cx="400" cy="457" rx="218" ry="48" fill="#151c2f" stroke="#adb8d6" strokeOpacity=".55"/>
    <ellipse cx="400" cy="453" rx="187" ry="42" fill="#111626" stroke="#ff883b" strokeWidth="5" filter="url(#orbGlow)"/>
    <ellipse cx="400" cy="453" rx="165" ry="32" fill="none" stroke="#ffc385" strokeWidth="1.5"/>
    {Array.from({length:15},(_,i)=>{const a=Math.PI*i/14;const x=400+Math.cos(a)*237;const y=464+Math.sin(a)*44;return <g key={i} transform={'translate('+x+' '+y+')'}><path d="M-8 3 L-11 20 M0 4 L-2 22 M8 3 L7 20" stroke="#0a0f1b" strokeWidth="5"/>{i%3===1&&<path d="M0 5 L-2 17" stroke="#679aff" strokeWidth="2" filter="url(#orbGlow)"/>}</g>;})}
    <ellipse cx="400" cy="445" rx="83" ry="23" fill="#182644" stroke="#8ca6e7"/>
    <path d="M330 420 V441 Q400 462 470 441 V420" fill="url(#orbPlatform)" stroke="#b3b4ff"/>
    <ellipse cx="400" cy="421" rx="70" ry="19" fill="#5438b6" stroke="#d1baff" strokeWidth="2" filter="url(#orbGlow)"/>
    <ellipse cx="400" cy="420" rx="53" ry="12" fill="#9e81ff55" stroke="#e9cfff"/>
    <path d="M363 416 L337 377 M437 416 L463 377" stroke="#bba3ff" strokeWidth="2" opacity=".42" filter="url(#orbGlow)"/>
    <g fill="none"><ellipse cx="400" cy="235" rx="282" ry="88" transform="rotate(-12 400 235)" stroke="#b2c5ff" opacity=".7"/><ellipse cx="400" cy="235" rx="270" ry="94" transform="rotate(24 400 235)" stroke="#aa91ff" opacity=".65"/><circle cx="400" cy="235" r="188" stroke="#6b97ff" opacity=".53"/><circle cx="400" cy="235" r="197" stroke="#c7a6ff" opacity=".35"/></g>
    <circle cx="400" cy="235" r="173" fill="#586dff" opacity=".3" filter="url(#orbBlur)"/>
    <circle cx="400" cy="235" r="170" fill="url(#orbGlass)" stroke="url(#orbRim)" strokeWidth="3"/>
    <g clipPath="url(#orbClip)">
      <ellipse cx="400" cy="247" rx="142" ry="143" fill="url(#orbInner)"/>
      <path d="M267 249 C232 145 338 72 445 86 C341 102 312 149 290 200 C281 219 282 243 267 249Z" fill="url(#orbRibbonA)" opacity=".92"/>
      <path d="M274 225 C252 200 283 135 335 124 C365 119 359 143 328 169 C309 191 289 217 274 225Z" fill="#9eebff" opacity=".63"/>
      <path d="M520 122 C593 185 565 320 484 376 C523 303 523 259 513 208 C507 169 485 152 520 122Z" fill="url(#orbRibbonB)" opacity=".8"/>
      <path d="M269 272 C282 318 338 347 401 357 C449 368 468 386 453 400 C361 412 271 358 252 302 C246 279 252 262 269 272Z" fill="url(#orbRibbonB)" opacity=".91"/>
      <path d="M290 292 C302 341 375 377 436 380" fill="none" stroke="#7fcaff" strokeWidth="13" opacity=".4" filter="url(#orbGlow)"/>
      <ellipse cx="382" cy="223" rx="158" ry="161" fill="none" stroke="#e0dcff" strokeWidth="2" opacity=".36" transform="rotate(-25 382 223)"/>
      <path d="M257 158 C300 70 452 44 526 125" fill="none" stroke="#fff" strokeWidth="8" opacity=".54" strokeLinecap="round" filter="url(#orbGlow)"/>
      <path d="M294 353 C363 417 478 413 529 337" fill="none" stroke="#ffd9ff" strokeWidth="4" opacity=".65" filter="url(#orbGlow)"/>
      {Array.from({length:44},(_,i)=>{const x=250+(i*73%300),y=82+(i*97%300);return <circle key={i} cx={x} cy={y} r={i%7===0?1.8:.75} fill="#c4d9ff" opacity={.16+(i%5)*.12}/>;})}
    </g>
    <circle cx="400" cy="235" r="166" fill="none" stroke="#d1ceff" strokeOpacity=".54"/>
    <path d="M127 258 C158 343 384 355 598 294 C658 276 686 249 676 227" fill="none" stroke="#e7dfff" strokeWidth="2.1" filter="url(#orbGlow)"/>
    <path d="M175 179 C95 228 147 313 280 344 C449 392 641 357 648 295" fill="none" stroke="#a987ff" strokeWidth="1.5" filter="url(#orbGlow)"/>
    <path d="M243 143 C292 65 454 24 559 91" stroke="#e2ebff" strokeWidth="1.1" fill="none" opacity=".8"/>
    {[{x:400,y:58,r:15,f:'orbNode'},{x:195,y:177,r:10,f:'orbNodeO'},{x:661,y:229,r:12,f:'orbNode'},{x:134,y:278,r:13,f:'orbNodeV'},{x:608,y:171,r:6,f:'orbNodeV'},{x:615,y:327,r:5,f:'orbNodeV'}].map(n=><g key={n.x} filter="url(#orbGlow)"><circle cx={n.x} cy={n.y} r={n.r} fill={'url(#'+n.f+')'} stroke="#e8f5ff" strokeWidth="1.4"/><circle cx={n.x-n.r*.25} cy={n.y-n.r*.35} r={n.r*.22} fill="white"/></g>)}
  </svg>;
}

function TimelineWave(){
 return <svg className="vibe-wave" viewBox="0 0 440 125" preserveAspectRatio="none" aria-hidden="true">
 <defs><linearGradient id="timelineWave" x1="0" y1="0" x2="1" y2=".2"><stop stopColor="#1276ff"/><stop offset=".42" stopColor="#52d3ff"/><stop offset=".7" stopColor="#b075ff"/><stop offset="1" stopColor="#ffac78"/></linearGradient><linearGradient id="timelineFill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#846bff" stopOpacity=".55"/><stop offset="1" stopColor="#4766ef" stopOpacity=".02"/></linearGradient><filter id="timelineGlow" x="-20%" y="-100%" width="140%" height="300%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
 <path d="M0 106 C42 74 54 90 83 70 S123 33 151 53 S197 96 222 68 S266 49 284 69 S316 97 340 46 S379 15 399 46 S423 76 440 54 L440 125 H0Z" fill="url(#timelineFill)" stroke="url(#timelineWave)" strokeOpacity=".7"/>
 {Array.from({length:6},(_,i)=><path key={i} d={'M0 '+(111+i*2)+' C42 '+(80+i*5)+' 54 '+(98+i*3)+' 83 '+(70+i*6)+' S123 '+(38+i*8)+' 151 '+(56+i*7)+' S197 '+(96+i*2)+' 222 '+(71+i*5)+' S266 '+(54+i*7)+' 284 '+(75+i*5)+' S316 '+(99+i*3)+' 340 '+(50+i*9)+' S379 '+(19+i*12)+' 399 '+(50+i*9)+' S423 '+(81+i*4)+' 440 '+(59+i*9)} fill="none" stroke="#a3b6ff" strokeOpacity=".14"/>)}
 <path d="M0 123 Q36 99 55 100 T115 80 T181 58 T244 61 T303 94 T374 79 T440 65" stroke="url(#timelineWave)" strokeWidth="2" fill="none" filter="url(#timelineGlow)"/>
 {[{x:55,y:100},{x:115,y:80},{x:181,y:58},{x:244,y:61},{x:303,y:94},{x:374,y:79}].map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={i===2?6:4} fill={i<3?'#41c9ff':i===4?'#ffac8e':'#b98bff'} stroke="#fff" strokeWidth="1.3" filter="url(#timelineGlow)"/>)}
 </svg>;
}

export default function TeamDashboard(){
 const navigate=useNavigate();
 const [data,setData]=useState<any>(null);
 const [projects,setProjects]=useState<any[]>([]);
 const [group,setGroup]=useState<any>(null);
 const [error,setError]=useState('');
 const [period,setPeriod]=useState(0);
 const [range,setRange]=useState(7);
 const [showAll,setShowAll]=useState(false);
 const load=async()=>{setError('');try{const response=await api.get('/team-dashboard');if(response.data?.error)throw new Error(response.data.error);setData(response.data);const [p,g]=await Promise.allSettled([api.get('/projects'),api.get('/group')]);if(p.status==='fulfilled'&&Array.isArray(p.value.data))setProjects(p.value.data);if(g.status==='fulfilled')setGroup(g.value.data);}catch(e:any){setError(e.response?.data?.error||e.message||'Could not load dashboard');}};
 useEffect(()=>{void load();},[]);
 if(error||!data)return <AppShell><div className="vibe-state glass-panel" role={error?'alert':'status'}>{error?<><h2>Dashboard unavailable</h2><p>{error}</p><button onClick={()=>void load()}>Retry connection</button></>:<p>Loading your team dashboard…</p>}</div></AppShell>;
 const d=data.dashboard||{};
 const members:any[]=Array.isArray(d.membersDetails)?d.membersDetails:[];
 const alerts:any[]=Array.isArray(d.attentionItems)?d.attentionItems:[];
 const progress=cap(d.groupProjectProgress);
 const groupProgress=group?.project?.progressPercentage??(group?Math.round((cap(d.groupRequirementSatisfaction)+cap(d.groupFunctionalityPassRate))/2):null);
 const now=new Date();
 const monday=new Date(now);monday.setHours(0,0,0,0);monday.setDate(now.getDate()-((now.getDay()+6)%7)+period*7);
 const dates=Array.from({length:7},(_,i)=>{const date=new Date(monday);date.setDate(monday.getDate()+i);return date;});
 const month=dates[3].toLocaleDateString('en-US',{month:'short',year:'numeric'}).toUpperCase();
 const activity=Array.from({length:range},(_,i)=>{const date=new Date(now);date.setDate(now.getDate()-(range-1-i));return {name:date.toLocaleDateString('en-US',range===7?{weekday:'short'}:{month:'short',day:'numeric'}),value:(d.recentActivity||[]).filter((a:any)=>new Date(a.timestamp||a.createdAt).toDateString()===date.toDateString()).length};});
 const stages=[{label:'Ideation',index:1},{label:'Development',index:2},{label:'Submission',index:4},{label:'Review',index:5}];
 const metrics=[{label:'Team Members',value:d.teamMemberCount??members.length,Icon:Users,path:'/team/members',color:'',foot:'members'},{label:'Total Projects',value:d.individualProjectsExpected??projects.length,Icon:FolderKanban,path:'/team/projects',color:'gold',foot:'projects'},{label:'Attendance',value:cap(d.teamAttendance)+'%',Icon:Activity,path:'/team/members',color:'',foot:'attendance'},{label:'Group Project',value:groupProgress===null?'—':cap(groupProgress)+'%',Icon:Box,path:'/team/group',color:'purple',foot:'group'}];
 return <AppShell cycle={data.cycle}>
  <div className="vibe-overview">
   <section className="vibe-centre" aria-label="Team progress overview">
    <div className="vibe-calendar glass-panel">
      <button className="vibe-month" title="Next week" onClick={()=>setPeriod(period>=4?0:period+1)}>{month}<ChevronRight size={16}/></button>
      {dates.map(date=><button title={date.toLocaleDateString()} key={date.toISOString()} className={'vibe-date '+(date.toDateString()===now.toDateString()?'today':'')} onClick={()=>setPeriod(0)}><span>{date.toLocaleDateString('en-US',{weekday:'short'})}</span><b>{date.getDate()}</b></button>)}
    </div>
    <div className="vibe-orb-zone">
      <OrbArt/>
      <div className="vibe-orb-label"><span>TEAM PROGRESS</span><strong>{progress}<small style={{fontSize:'.55em',color:'inherit'}}>%</small></strong><small>Current monthly cycle</small></div>
      {metrics.map(({label,value,Icon,path,color,foot})=><button key={label} className="vibe-float glass-panel" onClick={()=>navigate(path)}><div className="vibe-float-row"><span className={'vibe-float-icon '+color}><Icon size={26}/></span><div><strong>{value}</strong><small>{label}</small></div></div><div className="vibe-float-foot">{foot==='members'?<>{members.slice(0,4).map(m=><span className="vibe-mini-avatar" key={m.id}>{initials(m.name||'Member')}</span>)}<ChevronRight size={16}/></>:<svg width="39" height="18" viewBox="0 0 39 18" aria-hidden="true">{[5,9,7,13,11,17].map((h,i)=><rect key={i} x={i*6+1} y={18-h} width="4" height={h} rx="1" fill="#69d6ff"/>)}</svg>}</div></button>)}
    </div>
    <div className="vibe-members">
      <button className="vibe-section-link" onClick={()=>navigate('/team/members')}>Team Members <ChevronRight size={18}/></button>
      {members.length?<div className="vibe-member-row">{members.map((m,i)=>{const pct=cap(m.growth?.individualProjectProgress);const name=m.name||'Member';return <button key={m.id} onClick={()=>navigate('/team/member/'+m.id)} title={name+' · '+pct+'%'} className="vibe-member" style={{'--member-glow':glow[i%glow.length]} as CSSProperties}><span className="vibe-pedestal"><span className="vibe-member-avatar">{m.avatarUrl||m.photoURL?<img src={m.avatarUrl||m.photoURL} alt={name}/>:initials(name)}</span></span><strong>{name}</strong><small className={pct===100?'complete':''}>{pct}%</small></button>;})}</div>:<p className="vibe-empty">No team members in this cycle.</p>}
    </div>
   </section>
   <aside className="vibe-right" aria-label="Project timeline, activity and alerts">
     <section className="vibe-panel vibe-timeline">
       <div className="vibe-panel-head"><h2>Project Timeline</h2><button className="vibe-panel-link" onClick={()=>navigate('/team/projects')}>View All <ArrowRight size={14}/></button></div>
       <TimelineWave/>
       <div className="vibe-stages">{stages.map((s,i)=>{const count=projects.filter(p=>states.indexOf(p.currentStatus||p.status)>=s.index).length;const done=projects.length>0&&count===projects.length;return <button key={s.label} className="vibe-stage" onClick={()=>navigate('/team/projects')}><i className={done?'done':count>0?'active':''}>{done?<Check size={15}/>:count>0?<Play size={12}/>:<Circle size={10}/>}</i><span>{s.label}</span><small>{count}/{projects.length}</small></button>;})}</div>
     </section>
     <section className="vibe-panel vibe-activity">
       <div className="vibe-panel-head"><div className="flex items-center gap-2"><h2>Team Activity</h2><span className="vibe-live">● Recent</span></div><select className="glass-panel rounded-xl px-2 py-1 text-xs text-white" value={range} aria-label="Activity date range" onChange={e=>setRange(Number(e.target.value))}><option value={7}>Last 7 days</option><option value={14}>Last 14 days</option></select></div>
       <div className="vibe-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={activity} margin={{top:8,right:5,left:-20,bottom:0}}><defs><linearGradient id="activityStroke" x1="0" x2="1"><stop stopColor="#33d4ff"/><stop offset="1" stopColor="#b05cff"/></linearGradient><linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#458fff" stopOpacity=".75"/><stop offset=".55" stopColor="#6851f7" stopOpacity=".37"/><stop offset="1" stopColor="#3f50cb" stopOpacity=".02"/></linearGradient></defs><CartesianGrid stroke="#89a7e31a" vertical={false}/><XAxis dataKey="name" stroke="#b6c5e8" tickLine={false} axisLine={false} tick={{fontSize:10}}/><YAxis stroke="#b6c5e8" tickLine={false} axisLine={false} allowDecimals={false} tick={{fontSize:10}}/><Tooltip contentStyle={{background:'#0e192e',border:'1px solid #7fa4e55c',borderRadius:12,color:'#edf4ff'}}/><Area type="monotone" dataKey="value" name="Recent activity records" stroke="url(#activityStroke)" strokeWidth={2.5} fill="url(#activityFill)" activeDot={{r:5,stroke:'#f3fbff',fill:'#41c4ff'}}/></AreaChart></ResponsiveContainer></div>
       <p className="text-[10px] text-cinematic-muted mt-1">Based on recent activity records returned by the API.</p>
     </section>
     <section className="vibe-panel vibe-attention">
       <div className="vibe-panel-head"><div className="vibe-alert-head"><AlertTriangle size={28}/><div><h2>Attention Zone</h2><p>{alerts.length} items need your attention</p></div></div><button className="vibe-panel-link" onClick={()=>setShowAll(!showAll)}>{showAll?'Show Less':'View All'} <ArrowRight size={14}/></button></div>
       <div className="vibe-alert-list">{alerts.length?alerts.slice(0,showAll?alerts.length:3).map((a,i)=>{const severity=String(a.severity||'low').toLowerCase();const Icon=a.type==='INACTIVE_MEMBER'?UserRound:a.type==='REQUIREMENT_FAILED'||a.type==='TEST_FAILED'?GitPullRequest:FolderKanban;return <button key={(a.projectId||a.memberId||'alert')+i} className="vibe-alert" title={a.description||a.reason||a.title} onClick={()=>navigate(a.type==='INACTIVE_MEMBER'&&a.memberId?'/team/member/'+a.memberId:'/team/reviews')}><span className="vibe-alert-icon"><Icon size={21}/></span><span className="vibe-alert-copy"><strong>{a.title||'Attention required'}</strong><small>{a.description||a.reason||'Review details'}</small></span><span className={'vibe-severity '+severity}>{severity}</span><ChevronRight size={15}/></button>;}):<div className="vibe-empty"><Check className="inline mr-2" size={15}/>No open attention items.</div>}</div>
       {alerts.length>3&&!showAll&&<button className="vibe-panel-link mt-3" onClick={()=>setShowAll(true)}>Show {alerts.length-3} more <ChevronRight size={14}/></button>}
     </section>
   </aside>
  </div>
 </AppShell>;
}
