import { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import { GlassCard, PageHeader } from '../components/ui/Core';
import api from '../api';
import { Download, FileSpreadsheet, Users, FolderKanban } from 'lucide-react';

export default function ReportsExport(){
 const member=JSON.parse(localStorage.getItem('user')||'null')?.role==='member';
 const [busy,setBusy]=useState('');
 const [message,setMessage]=useState('');
 const [failed,setFailed]=useState(false);
 const downloadCSV=async(type:string)=>{
  setBusy(type);setFailed(false);setMessage('');
  try{
   const r=await api.get(type==='members'?'/members':'/projects');
   const data=Array.isArray(r.data)?r.data:[];
   const rows=data.map(x=>type==='members'?{Name:x.name,Attendance:x.growth?.attendance,Progress:x.growth?.individualProjectProgress,Completed:x.growth?.individualProjectsCompleted,Participation:x.participation?.participationPercentage,OpenModifications:x.openModifications,Status:x.growth?.status}:{Name:x.name||x.title,Domain:x.domain,Member:x.memberName,Status:x.currentStatus||x.status,Progress:x.progressPercentage,Deadline:x.deadline,Repository:x.githubUrl});
   if(!rows.length){setMessage('No records available to export.');return;}
   const headers=Object.keys(rows[0]);
   const escape=(value:any)=>{let s=String(value??'');if(/^[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
   const csv=[headers.map(escape).join(','),...rows.map(row=>headers.map(h=>escape((row as any)[h])).join(','))].join('\r\n');
   const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));
   const a=document.createElement('a');a.href=url;a.download=type+'_export_'+new Date().toISOString().slice(0,10)+'.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
   setMessage('CSV report prepared.');
  }catch(e:any){setFailed(true);setMessage(e.response?.data?.error||'Unable to generate report.');}finally{setBusy('');}
 };
 const options=[...(!member?[{id:'members',Icon:Users,title:'Member Progress Report',desc:'Export attendance, project progress, participation, status and open modifications.'}]:[]),{id:'projects',Icon:FolderKanban,title:'Projects Pipeline Report',desc:'Export project names, domains, current status, deadlines and GitHub repository links.'}];
 return <AppShell><PageHeader title="Reports & Data Export" subtitle="Download operational reports for the current development cycle"/>
 {message&&<div role="status" className={(failed?'glass-panel-danger':'glass-panel')+' p-4 rounded-xl mb-5'}>{message}</div>}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{options.map(({id,Icon,title,desc})=><GlassCard key={id} className="!p-7 gap-5"><div className="flex justify-between items-center"><span className={'vibe-float-icon '+(id==='projects'?'purple':'')}><Icon size={26}/></span><span className="vibe-live">CSV format</span></div><div><h2 className="text-xl font-bold mb-2">{title}</h2><p className="text-sm text-cinematic-muted leading-relaxed">{desc}</p></div><div className="vibe-task-card flex items-center gap-3"><FileSpreadsheet size={24} className="text-cinematic-success"/><div className="text-sm"><strong>Spreadsheet-compatible</strong><p className="text-xs text-cinematic-muted">Current records · comma-separated values</p></div></div><button className="vibe-action self-start" disabled={!!busy} onClick={()=>void downloadCSV(id)}><Download size={17}/>{busy===id?'Preparing…':'Download CSV'}</button></GlassCard>)}</div>
 </AppShell>;
}
