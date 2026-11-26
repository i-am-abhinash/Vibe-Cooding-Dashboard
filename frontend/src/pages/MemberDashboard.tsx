import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, GitPullRequest, Send, ArrowRight, Users, Activity, CheckCircle2, Target, Box } from 'lucide-react';
import api from '../api';
import AppShell from '../components/layout/AppShell';
import { GlassCard, PageHeader, Badge } from '../components/ui/Core';

export default function MemberDashboard(){
 const navigate=useNavigate();
 const [data,setData]=useState<any>(null);
 const [group,setGroup]=useState<any>(null);
 const [error,setError]=useState('');
 const [busy,setBusy]=useState('');
 const load=async()=>{try{const [d,g]=await Promise.allSettled([api.get('/my-dashboard'),api.get('/group')]);if(d.status==='rejected')throw d.reason;setData(d.value.data);if(g.status==='fulfilled')setGroup(g.value.data);}catch(e:any){setError(e.response?.data?.error||'Unable to load your workspace.');}};
 useEffect(()=>{void load();},[]);
 const action=async(id:string,endpoint:string,payload:any)=>{setBusy(id);setError('');try{await api.post(endpoint,payload);await load();}catch(e:any){setError(e.response?.data?.error||'Unable to save your changes.');}finally{setBusy('');}};
 const handleIdea=(e:FormEvent<HTMLFormElement>,id:string)=>{e.preventDefault();const f=new FormData(e.currentTarget);void action(id,'/projects/'+id+'/idea',{name:f.get('name'),domain:f.get('domain'),description:f.get('description'),expectedOutcome:f.get('description')});};
 const handleSubmit=(e:FormEvent<HTMLFormElement>,id:string)=>{e.preventDefault();const f=new FormData(e.currentTarget);void action(id,'/projects/'+id+'/submit',{githubUrl:f.get('githubUrl'),reportUrl:f.get('reportUrl')||''});};
 const handleContribution=(e:FormEvent<HTMLFormElement>,id:string)=>{e.preventDefault();const f=new FormData(e.currentTarget);void action(id,'/group/contributions/'+id+'/submit',{githubUrl:f.get('githubUrl'),branch:f.get('branch')});};
 if(!data)return <AppShell><div className="vibe-state glass-panel" role="status">{error||'Loading your workspace…'}{error&&<button onClick={()=>void load()}>Retry</button>}</div></AppShell>;
 const d=data.dashboard||{},growth=d.growth||{},profile=d.profile||{};
 const projects:any[]=d.projects||[];
 const contributions:any[]=group?.contributions||[];
 const input='w-full px-3 py-3 rounded-xl border border-white/15 text-sm bg-black/20';
 const submit='vibe-action';
 const metrics=[{Icon:Target,label:'Project progress',value:(growth.individualProjectProgress||0)+'%'},{Icon:CheckCircle2,label:'Projects completed',value:(growth.individualProjectsCompleted||0)+' / 4'},{Icon:Activity,label:'Attendance',value:(d.attendance?.percentage||0)+'%'},{Icon:Users,label:'Group contributions',value:growth.groupContribution||0}];
 return <AppShell cycle={data.cycle}>
  <PageHeader title="Member Workspace" subtitle="Your monthly development cycle, contributions and progress"/>
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">{metrics.map(({Icon,label,value})=><GlassCard key={label} className="!p-4"><div className="flex items-center gap-3"><span className="vibe-float-icon"><Icon size={22}/></span><div><div className="text-2xl font-bold text-white">{value}</div><p className="text-xs text-cinematic-muted">{label}</p></div></div></GlassCard>)}</div>
  {error&&<div role="alert" className="glass-panel-danger p-4 rounded-xl mb-4 text-cinematic-danger">{error}</div>}
  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
   <section className="xl:col-span-8 min-w-0">
    <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">Project Continuum</h2><button className="vibe-panel-link" onClick={()=>navigate('/member/projects')}>All projects <ArrowRight size={15}/></button></div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{Array.from({length:Math.max(4,projects.length)},(_,i)=>{const p=projects[i];const state=String(p?.currentStatus||p?.status||'').toUpperCase();const pct=Math.max(0,Math.min(100,Number(p?.evaluation?.percentage??p?.progressPercentage??0)));return <GlassCard key={p?.id||i} className="gap-4"><div className="flex items-center justify-between gap-2"><span className="vibe-float-icon"><FolderKanban size={22}/></span><Badge variant={state==='COMPLETED'?'success':state==='MODIFICATION_REQUESTED'?'warning':'info'}>{p?state.replaceAll('_',' '):'UNASSIGNED'}</Badge></div><div><h3 className="text-lg font-semibold text-white">{p?.name||p?.title||'Project '+(i+1)}</h3><p className="text-sm text-cinematic-muted mt-1">{p?.domain||'Individual project slot'}</p></div>
    {p?<><div><div className="flex justify-between text-xs text-cinematic-muted mb-2"><span>Completion</span><span>{pct}%</span></div><div className="vibe-progress"><span style={{width:pct+'%'}}/></div></div><p className="text-sm text-cinematic-text-2">{p.expectedOutcome||p.description||'No project description yet.'}</p>
    {state==='IDEA'&&<form className="space-y-3" onSubmit={e=>handleIdea(e,p.id)}><input name="name" aria-label="Project name" defaultValue={p.name||''} placeholder="Project name" className={input} required/><input name="domain" aria-label="Project domain" defaultValue={p.domain||''} placeholder="Domain / technology" className={input} required/><textarea name="description" aria-label="Expected outcome" defaultValue={p.description||p.expectedOutcome||''} placeholder="Expected outcome" className={input} required/><button className={submit} disabled={busy===p.id}><Send size={15}/> Submit idea</button></form>}
    {['DEVELOPMENT','DOCUMENTATION','MODIFICATION_REQUESTED','IN_PROGRESS'].includes(state)&&<form className="space-y-3" onSubmit={e=>handleSubmit(e,p.id)}><input name="githubUrl" type="url" aria-label="GitHub repository" placeholder="GitHub repository URL" className={input} defaultValue={p.githubUrl||''} required/><input name="reportUrl" type="url" aria-label="Report URL" placeholder="Report URL (optional)" className={input}/><button className={submit} disabled={busy===p.id}><Send size={15}/> Submit project</button></form>}
    {p.githubUrl&&<a className="vibe-panel-link mt-auto" href={p.githubUrl} target="_blank" rel="noreferrer"><GitPullRequest size={15}/> View repository <ArrowRight size={13}/></a>}</>:<p className="text-sm text-cinematic-muted">No project record has been allocated to this slot. Contact your team lead.</p>}
    </GlassCard>;})}</div>
   </section>
   <aside className="xl:col-span-4 space-y-5 min-w-0">
     <GlassCard className="gap-4"><div className="flex items-center gap-3"><span className="vibe-float-icon purple"><Box size={23}/></span><div><h2 className="text-lg font-semibold">Group Mission</h2><p className="text-xs text-cinematic-muted">{group?.project?.name||'Current group project'}</p></div></div>
       {contributions.length?contributions.map(c=><div className="vibe-task-card" key={c.id}><Badge variant="info">{String(c.status||'assigned').replaceAll('_',' ')}</Badge><h3 className="font-semibold mt-2 mb-2">{c.task||c.title||'Contribution'}</h3>{c.description&&<p className="text-xs text-cinematic-muted mb-3">{c.description}</p>}{c.githubUrl?<a className="vibe-panel-link" href={c.githubUrl} target="_blank" rel="noreferrer">View submitted contribution <ArrowRight size={14}/></a>:<form className="space-y-3" onSubmit={e=>handleContribution(e,c.id)}><input name="githubUrl" type="url" aria-label="Pull request URL" className={input} placeholder="Pull request URL" required/><input name="branch" aria-label="Branch" className={input} placeholder="Branch name" required/><button className={submit} disabled={busy===c.id}><GitPullRequest size={15}/> Submit contribution</button></form>}</div>):<p className="text-sm text-cinematic-muted">No group contributions assigned yet.</p>}
       <button className="vibe-panel-link" onClick={()=>navigate('/member/group')}>Open group workspace <ArrowRight size={15}/></button>
     </GlassCard>
     <GlassCard className="gap-3"><h2 className="text-lg font-semibold">Growth indicators</h2><p className="text-sm text-cinematic-muted">{profile.name||'Member'} · {growth.status||'In progress'}</p>{(growth.growthIndicators||[]).map((s:string,i:number)=><p className="text-sm text-cinematic-success" key={i}>✓ {s}</p>)}{(growth.blockers||[]).map((s:string,i:number)=><p className="text-sm text-cinematic-warning" key={i}>• {s}</p>)}<button className="vibe-panel-link" onClick={()=>navigate('/member/growth')}>View growth <ArrowRight size={15}/></button></GlassCard>
   </aside>
  </div>
 </AppShell>;
}
